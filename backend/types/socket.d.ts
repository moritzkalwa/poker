import type { Server } from "socket.io"
import type { Socket } from "socket.io-client"

import type { EventNotification, RoomState } from "./room"
import type { CardWorth } from "../deck"

type Callback<A = void> = (x: A) => void

type BackendEmitterBase<A = void> = (x: A) => void

export interface Result {
  id: string,
  handWorth: CardWorth
}

export interface BackendEmits {
  notifiy: BackendEmitterBase<EventNotification>
  state: BackendEmitterBase<RoomState>
  folded: BackendEmitterBase<{ id }>
  newGame: BackendEmitterBase
  flop: BackendEmitterBase
  turn: BackendEmitterBase
  river: BackendEmitterBase
  announceWinner: BackendEmitterBase<Result>
}

interface RoomEmitBase {
  roomID: string
}
interface RoomEmitTime extends RoomEmitBase {
  currentTime: number
}

type FrontendEmitterBase<A = RoomEmitBase, C = void> = (x: RoomEmitBase & A, c: C) => void
type FrontendEmitterTime<A = RoomEmitTime, C = void> = (x: RoomEmitTime & A, c: C) => void

export type PlayerActions = 'bet' | 'call' | 'fold'

export interface FrontendEmits {
  getRooms: FrontendEmitterBase<{}, Callback<Array<RoomState>>>
  joinRoom: FrontendEmitterBase<{ name: string }, Callback<RoomState>>
  leaveRoom: FrontendEmitterBase
  playerAction: FrontendEmitterBase<{ action: PlayerActions, amount?: number}>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Tail<T extends any[]> = T extends [infer A, ...infer R] ? R : never

export type RoomEmit = <E extends keyof FrontendEmits>(
  event: E,
  arg?: Omit<Parameters<FrontendEmits[E]>[0], "roomID">,
  ...args: Tail<Parameters<FrontendEmits[E]>>
) => void

export type SocketFrontend = Socket<BackendEmits, FrontendEmits>
export type SocketBackend = Server<FrontendEmits, BackendEmits>