import type { Socket as BackendSocket } from "socket.io"

export interface Member {
  name: string
  client: BackendSocket
}

export interface PublicMember extends Omit<Member, "client"> {
  id: string
}

export interface RoomState {
  roomID: string
  members: Array<PublicMember>
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