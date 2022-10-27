import { createServer } from "http"
import { Server } from "socket.io"
import room from "./room"

import debug from "debug"
const log = debug("resync:server")

let origin = '*'

export default (port: number): Promise<void> => {
  return new Promise((res, rej) => {
    {
      const httpServer = createServer()
      const io = new Server(httpServer, {
        cors: { origin },
      })

      io.on("connection", client => {
        log("client connected", client.id)
        client.on("disconnect", () => log("client disconnected", client.id))
      })

      room(io)

      httpServer.listen(port).on("listening", res).on("error", rej)
    }
  })
}