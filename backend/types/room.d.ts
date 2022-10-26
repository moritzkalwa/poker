import type { Socket as BackendSocket } from "socket.io"
import type { Card } from "../deck"

export interface Member {
  name: string
  playing: boolean
  client: BackendSocket
  cards?: [Card, Card]
}

export interface PublicMember extends Omit<Member, "client"> {
  id: string
  budget: number
  bet: number
}

export enum RoundState {
  Waiting = -1,
  Flop,
  Turn,
  River,
  Showdown
}

export interface RoomState {
  roomID: string
  members: Array<PublicMember>
  playingMemberId: string | undefined
  bigBlindId: string | undefined
  smallBlindId: string | undefined
  roundState: RoundState
  currentBet: number
  cards?: [Card, Card, Card, Card, Card]
}

export type NotifyEvents =
  | "join"
  | "leave"

export interface EventNotification {
  event: NotifyEvents
  id: string
  key: string
  name: string
  additional?: any
}