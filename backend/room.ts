import type { BroadcastOperator, Server, Socket } from "socket.io"
import type { NotifyEvents, RoomState, Member, EventNotification, PublicMember } from "./types/room"
import type { BackendEmits, SocketBackend } from "./types/socket"

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

class Room {
  readonly roomID: string
  private io: SocketBackend
  readonly broadcast: BroadcastOperator<BackendEmits, any>

  public members: Array<Member> = []
  public host: PublicMember | undefined

  constructor(roomID: string, io: Server) {
    console.log(`constructing room ${roomID}`)

    this.roomID = roomID
    this.io = io
    this.broadcast = this.io.to(roomID)
  }

  get state(): Promise<RoomState> {
    return (async () => {
      return {
        members: this.members.map(({ client: { id }, name }) => ({ id, name })),
        host: this.host,
        roomID: this.roomID
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
  removeMember = (id: string) => (this.members = this.members.filter(m => m.client.id !== id))

  async updateState() {
    this.broadcast.emit("state", await this.state)
  }

  join(client: Socket, name: string) {
    console.log('Member joined')
    this.members.push({ client, name })
    client.join(this.roomID)

    client.on("disconnect", () => this.leave(client))

    this.updateState()
    this.notify("join", client)
  }

  leave(client: Socket) {
    this.notify("leave", client)
    console.log('Member left')

    client.leave(this.roomID)
    this.removeMember(client.id)

    const memberAmount = Object.keys(this.members).length
    if (memberAmount <= 0) {
      console.log(`Deleted room ${this.roomID}`)
      delete rooms[this.roomID]
    }

    this.updateState()
  }

  becomeHost(client: Socket) {
    if(!this.host && this.getMember(client.id)) this.host = { id: client.id, name: this.getMember(client.id)?.name ?? ''}
    this.updateState()
  }

}

export default (io: SocketBackend): void => {
  const getRoom = (roomID: string) => {
    if (!rooms[roomID]) rooms[roomID] = new Room(roomID, io)
    return rooms[roomID]
  }

  io.on("connect", client => {
    console.log("client connected")

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
  })
}