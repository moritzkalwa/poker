import type { Socket } from "socket.io-client"
import type { RoundState, RoomState } from "../backend/types/room"
import type { BackendEmits, SocketFrontend, RoomEmit, PlayerActions, Result } from "../backend/types/socket"

import type { Ref } from "vue"
import { ref, watch, computed } from "vue"

export interface PokerHandlerEvents {
  newCards: () => void
  dispatchNewCards: () => void
  fold: (id: string) => void
  turn: () => void
  river: () => void
  announceWinner: (result: Result) => void
  playerAction: () => void
}

export class PokerHandler extends EventTarget {
  on<U extends keyof PokerHandlerEvents>(
    event: U, listener: PokerHandlerEvents[U]
  ): void {
    
    this.addEventListener(event, (e) => {
      const args = ((e as CustomEvent).detail as Array<Parameters<PokerHandlerEvents[U]>>)
      //@ts-ignore
      listener(...args)
    })
  }

  emit<U extends keyof PokerHandlerEvents>(
    event: U, ...args: Parameters<PokerHandlerEvents[U]>
  ): boolean {
    return this.dispatchEvent(new CustomEvent<Parameters<PokerHandlerEvents[U]>>(event, {detail: args}))
  }

  constructor() {
    super();
  }
}

export type SocketOff = () => void

export default class Poker {
  private socket: SocketFrontend
  private roomEmit: RoomEmit
  private roomID: string
  private handlers: SocketOff[] = []

  public pokerHandler: PokerHandler
  public selectedAmount: Ref<number> = ref(0)
  public budget: Ref<number> = ref(0)

  get ownId () {
    return this.socket.id
  }

  state: Ref<RoomState>

  constructor(socket: Socket, roomID: string) {
    this.socket = socket
    this.roomID = roomID
    this.roomEmit = (event, arg, ...args) => {
      socket.emit(event, { roomID, ...arg }, ...args)
    }
    this.pokerHandler = new PokerHandler();
    (document as any).pokerHandler = this.pokerHandler

    this.state = ref({
      members: [],
      host: undefined,
      roomID: this.roomID,
      roundState: -1,
      playingMemberId: undefined,
      currentBet: 0,
      bigBlindId: undefined,
      smallBlindId: undefined
    })

    this.handlers.push(
      this.onState(state => {
        this.budget.value = state.members.find((member) => member.id === this.socket.id)!.budget
        this.state.value = state
        console.log('pokerkarte', this.state.value.members.find((_m) => _m.id === this.ownId)?.cards)
      }),
      this.onFolded(({ id }) => {
        this.pokerHandler.emit("fold", id)
      }),
      this.onNewGame(() => {
        this.pokerHandler.emit("newCards")
      }),
      this.onTurn(() => {
        this.pokerHandler.emit("turn")
      }),
      this.onRiver(() => {
        this.pokerHandler.emit("river")
      }),
      this.onAnnounceWinner((result: Result) => {
        this.pokerHandler.emit("announceWinner",result)
      })
    )
  }
  destroy = (): void => this.handlers.forEach(off => off())

  private eventHandler<E extends keyof BackendEmits>(event: E) {
    return (fn: BackendEmits[E]): SocketOff => {
      this.socket.on(event, fn)

      return () => {
        this.socket.off(event, fn)
      }
    }
  }

  joinRoom = async (name: string): Promise<void> => {
    const join = () => {
      return new Promise<void>(res => {
        this.roomEmit("joinRoom", { name }, state => {
          this.state.value = state

          res()
        })
      })
    }

    const connect = () => {
      this.socket.off("connect", connect)
      join()
    }

    const disconnect = () => {
      this.socket.on("connect", connect)
    }

    this.socket.on("disconnect", disconnect)

    this.handlers.push(() => this.socket.off("disconnect", disconnect))
    this.handlers.push(() => this.roomEmit("leaveRoom"))
    
    await join()
  }
  onNotify = this.eventHandler("notifiy")
  onState = this.eventHandler("state")

  onFolded = this.eventHandler("folded")
  onNewGame = this.eventHandler("newGame")
  onTurn = this.eventHandler("turn")
  onRiver = this.eventHandler("river")
  onAnnounceWinner = this.eventHandler("announceWinner")

  playerAction = (action: PlayerActions) => {
    this.roomEmit('playerAction', { action, amount: this.selectedAmount.value })
    this.pokerHandler.emit('playerAction')
  }
}