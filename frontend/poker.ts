import type { Socket } from "socket.io-client"
import type { RoomState, } from "../backend/types/room"
import type { BackendEmits, SocketFrontend, RoomEmit } from "../backend/types/socket"

import type { Ref } from "vue"
import { ref, watch, computed } from "vue"


export type SocketOff = () => void

export default class Poker {
  private socket: SocketFrontend
  private roomEmit: RoomEmit
  private roomID: string
  private handlers: SocketOff[] = []

  state: Ref<RoomState>

  constructor(socket: Socket, roomID: string) {
    this.socket = socket
    this.roomID = roomID
    this.roomEmit = (event, arg, ...args) => {
      socket.emit(event, { roomID, ...arg }, ...args)
    }

    this.state = ref({
      members: [],
      host: undefined,
      roomID: this.roomID
    })

    this.handlers.push(
      this.onState(state => {
        this.state.value = state
        //console.log(state)
      }),
    )
    this.joinRoom('Moritz')
  }
  destroy = (): void => this.handlers.forEach(off => off())

  private eventHandler<E extends keyof BackendEmits>(event: E) {
    return (fn: BackendEmits[E]): SocketOff => {
      //@ts-expect-error no idea
      this.socket.on(event, fn)

      return () => {
        //@ts-expect-error no idea
        this.socket.off(event, fn)
      }
    }
  }

  joinRoom = async (name: string): Promise<void> => {
    const join = () => {
      console.log('hi')
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
}