import type { BroadcastOperator, Server, Socket } from "socket.io"
import type { NotifyEvents, RoomState, Member, EventNotification, PublicMember, RoundState } from "./types/room"
import type { BackendEmits, PlayerActions, SocketBackend } from "./types/socket"

import Deck from "./deck"
import type { Card, CardWorth } from "./deck"
import { getHandWorth } from "./deck"

import { customAlphabet } from "nanoid"
import { nolookalikesSafe } from "nanoid-dictionary"

const nanoid = customAlphabet(nolookalikesSafe, 6)

import debug from "debug"
const log = debug("poker:room")

const rooms: Record<string, Room> = {}
const getNewRandom = () => {
  let id = nanoid()
  while (rooms[id]) id = nanoid()

  return id
}

const roomInfo = () => {
  return {rooms: Object.keys(rooms).map((_roomID) => { 
    return { roomID: _roomID, memberCount: rooms[_roomID].members.length, roundState: rooms[_roomID].roundState}
  }) }
}

class Room {
  readonly roomID: string
  readonly io: SocketBackend
  readonly broadcast: BroadcastOperator<BackendEmits, any>

  public members: Array<Member> = []
  public host: PublicMember | undefined
  private roundStartTimeout: NodeJS.Timeout | undefined

  public roundState = -1
  private playingMemberId: string | undefined
  private bigBlindId: string | undefined
  private smallBlindId: string | undefined
  private lastBetId: string | undefined
  private currentBet = 0
  private pool = 0
  private playerBudget: Record<string, number> = {}
  private playerBets: Record<string, number> = {}
  private playerRoundBets: Record<string, number> = {}
  private playerCards: Partial<Record<string, [Card, Card]>> = {}

  private cards: [Card, Card, Card, Card, Card]
  private deck: Deck

  constructor(roomID: string, io: Server) {
    console.log(`constructing room ${roomID}`)

    this.roomID = roomID
    this.io = io
    this.broadcast = this.io.to(roomID)
  }

  get state(): Promise<RoomState> {
    return (async () => {
      return {
        members: this.members.map((member) => {
          return { 
            id: member.client.id, 
            name: member.name, 
            playing: member.playing,
            budget: this.playerBudget[member.client.id], 
            bet: this.playerBets[member.client.id],
            roundBet: this.playerRoundBets[member.client.id],
            cards: undefined
          }
        }),
        host: this.host,
        roomID: this.roomID,
        roundState: this.roundState,
        playingMemberId: this.playingMemberId,
        smallBlindId: this.smallBlindId,
        bigBlindId: this.bigBlindId,
        currentBet: this.currentBet,
        cards: undefined
      }
    })()
  }

  private notify(event: NotifyEvents, client: Socket, additional?: any) {
    const { id } = client
    let name = id

    const member = this.getMember(id)
    if (member) name = member.name

    const notification: EventNotification = {
      event,
      id,
      name,
      additional,
      key: nanoid(),
    }
    this.broadcast.emit("notifiy", notification)
  }

  getMember = (id: string) => this.members.find(m => m.client.id === id)
  getMemberIndex = (id: string) => this.members.findIndex(m => m.client.id === id)
  removeMember = (id: string) => (this.members = this.members.filter(m => m.client.id !== id))

  async updateState() {
    let cardsShown = 0
    if (this.roundState == 1) cardsShown = 3
    if (this.roundState == 2) cardsShown = 4
    if (this.roundState >= 3) cardsShown = 5
    for (let _member of this.members) {
      _member.client.emit("state", {
        members: this.members.map((member) => {
          return { 
            id: member.client.id, 
            name: member.name, 
            playing: member.playing,
            budget: this.playerBudget[member.client.id], 
            bet: this.playerBets[member.client.id],
            roundBet: this.playerRoundBets[member.client.id],
            cards: (_member.client.id === member.client.id) || (this.roundState === 4) ? this.playerCards[member.client.id] : undefined
          }
        }),
        host: this.host,
        roomID: this.roomID,
        roundState: this.roundState,
        playingMemberId: this.playingMemberId,
        smallBlindId: this.smallBlindId,
        bigBlindId: this.bigBlindId,
        currentBet: this.currentBet,
        cards: this.cards?.slice(0, cardsShown)
      })
    }
  }

  newGame = () => {
    console.log('new game')
    this.deck = new Deck()
    this.cards = [this.deck.newCard(), this.deck.newCard(), this.deck.newCard(), this.deck.newCard(), this.deck.newCard()]
    if(this.bigBlindId) {
      const bigBlindIndex = this.getMemberIndex(this.bigBlindId)
      this.bigBlindId = this.members[(bigBlindIndex + 1) % this.members.length].client.id
      this.smallBlindId = this.members[(bigBlindIndex) % this.members.length].client.id
      this.playingMemberId = this.bigBlindId
    } else {
      this.playingMemberId = this.members[0].client.id
      this.bigBlindId = this.playingMemberId
      const bigBlindIndex = this.getMemberIndex(this.bigBlindId)
      this.smallBlindId = this.members[this.members.length - bigBlindIndex - 1].client.id
    }
    this.lastBetId = this.playingMemberId
    this.roundState = 0
    this.currentBet = 50
    this.pool = 75
    this.members.forEach((member, index) => {
      this.members[index].playing = true
      this.playerCards[member.client.id] = [this.deck.newCard(), this.deck.newCard()]
      this.playerBets[member.client.id] = 0
      this.playerRoundBets[member.client.id] = 0
    })
    this.playerBets[this.bigBlindId] += 50
    this.playerRoundBets[this.bigBlindId] += 50
    this.playerBudget[this.bigBlindId] -= 50

    this.playerBets[this.smallBlindId] += 25
    this.playerRoundBets[this.smallBlindId] += 25
    this.playerBudget[this.smallBlindId] -= 25

    this.broadcast.emit("newGame")
    this.updateState()
  }

  join(client: Socket, name: string) {
    console.log('Member joined')
    this.playerBudget[client.id] = 1500
    this.playerBets[client.id] = 0
    this.playerRoundBets[client.id] = 0
    this.members.push({ client, name, playing: false })
    client.join(this.roomID)

    if (this.roundState === -1 && this.members.length > 1) {
      if (this.roundStartTimeout) {
        clearTimeout(this.roundStartTimeout)
      }
      setTimeout(() => {
        this.roundStartTimeout = undefined
        this.newGame()
      }, 10000)
    }

    client.on("disconnect", () => this.leave(client))

    this.io.emit('rooms', roomInfo())

    this.updateState()
    this.notify("join", client)
  }

  leave(client: Socket) {
    this.notify("leave", client)
    console.log('Member left')

    client.leave(this.roomID)
    this.getMember(client.id)!.playing = false
    this.removeMember(client.id)

    //todo: handle only one playing player left

    const memberAmount = Object.keys(this.members).length
    if (memberAmount <= 0) {
      console.log(`Deleted room ${this.roomID}`)
      delete rooms[this.roomID]
    }

    this.io.emit('rooms', roomInfo())

    this.updateState()
  }

  playerAction(client: Socket, action: PlayerActions, amount?: number) {
    console.log(client.id, action, amount)
    console.log('round state', this.roundState)
    if (client.id !== this.playingMemberId) return
    switch (action) {
      case 'bet':
        if (amount && amount + this.playerRoundBets[client.id] > this.currentBet && amount <= this.playerBudget[client.id]) {
          this.lastBetId = client.id
          this.playerBets[client.id] += amount
          this.playerRoundBets[client.id] += amount
          this.pool += amount
          this.playerBudget[client.id] -= amount
          this.currentBet = amount
        } else {
          this.playerBudget[client.id] = 0
        }
        break;
      case 'call':
        if (this.currentBet - this.playerRoundBets[client.id] <= this.playerBudget[client.id]) {
          console.log('info', this.currentBet, this.playerRoundBets[client.id])
          this.pool += this.currentBet - this.playerRoundBets[client.id]
          this.playerBets[client.id] += this.currentBet - this.playerRoundBets[client.id]
          this.playerBudget[client.id] -= this.currentBet - this.playerRoundBets[client.id]
          this.playerRoundBets[client.id] = this.currentBet 
        } else {
          this.pool += this.playerBudget[client.id]
          this.playerBets[client.id] += this.playerBudget[client.id]
          this.playerRoundBets[client.id] = this.currentBet
          this.playerBudget[client.id] = 0
        }
        break;
      case 'fold':
          this.getMember(client.id)!.playing = false
          this.broadcast.emit("folded", { id: client.id })
        break;
      default:
        this.playerBudget[client.id] = 0
        this.getMember(client.id)!.playing = false
        this.broadcast.emit("folded", { id: client.id })
        break
    }

    const playingMembers = this.members.filter((member) => member.playing)

    const newPlayerIndex = playingMembers.findIndex((member) => member.client.id === this.playingMemberId) + 1

    console.log('newPlayerIndex', newPlayerIndex)

    if(playingMembers.length === 1) {
      const winnerId = playingMembers[0].client.id
      this.playerBudget[winnerId] += this.pool

      this.newGame()

      return
    }

    console.log('pool ', this.pool)

    if(playingMembers[newPlayerIndex % playingMembers.length].client.id === this.lastBetId) {
      if (this.roundState === 3) {
        const results = playingMembers.map((member) => {
          return {id: member.client.id, handWorth: getHandWorth(this.cards, this.playerCards[member.client.id])}
        })

        console.log('---Results---')
        console.log(results)

        results.sort((a, b) => b.handWorth.major - a.handWorth.major)
        const majorResults = results.filter((result) => result.handWorth.major === results[0].handWorth.major)

        majorResults.sort((a, b) => b.handWorth.minor - a.handWorth.minor)
        const minorResults = results.filter((result) => result.handWorth.minor === majorResults[0].handWorth.minor)

        //todo: handle equal outcome and all in
        const winningResult = minorResults[0]

        console.log(this.pool)
        this.playerBudget[winningResult.id] += this.pool

        this.broadcast.emit("announceWinner", winningResult)

        this.roundState += 1

        setTimeout(this.newGame, 15*1000)
      } else {
        this.roundState += 1
        if ( this.roundState == 1) this.broadcast.emit("flop")
        if ( this.roundState == 2) this.broadcast.emit("turn")
        if ( this.roundState == 3) this.broadcast.emit("river")
        this.playingMemberId = this.lastBetId
        this.currentBet = 0
        playingMembers.forEach((member) => {
          this.playerRoundBets[member.client.id] = 0
        })
      }
    } else {
      this.playingMemberId = playingMembers[newPlayerIndex % playingMembers.length].client.id
    }

    console.log('round state after', this.roundState)
    this.updateState()
  }

}

export default (io: SocketBackend): void => {
  const getRoom = (roomID: string) => {
    if (!rooms[roomID]) {
      rooms[roomID] = new Room(roomID, io)
      rooms[roomID].io.emit('rooms', roomInfo())
    } 
    return rooms[roomID]
  }

  io.on("connect", client => {
    console.log("client connected")

    client.emit('rooms', roomInfo())

    client.on("getRooms", async ({}, reply) => {
      const roomStates = Object.keys(rooms).map(async (key) => {
        return rooms[key].state
      })

      reply(await Promise.all(roomStates))
    })

    client.on("joinRoom", async ({ roomID, name }, reply) => {
      const room = getRoom(roomID)
      room.join(client, name)

      reply(await room.state)
    })

    client.on("leaveRoom", ({ roomID }) => {
      getRoom(roomID).leave(client)
    })

    client.on("playerAction", ({ roomID, action, amount }) => {
      getRoom(roomID).playerAction(client, action, amount)
    })
  })
}