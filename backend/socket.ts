import *  as http from "http"
import *  as https from "https"
import { Server } from "socket.io"
import room from "./room"
import { readFileSync } from "fs"

import debug from "debug"
const log = debug("resync:server")

let origin = '*'

export default (port: number): Promise<void> => {
  return new Promise((res, rej) => {
    {
      let server
      const isDev = process.env.NODE_ENV === 'development'

      if (isDev) {
        server = http.createServer()
      } else {
        var options = {
          key: readFileSync('/etc/ssl/private/private.key.pem'),
          cert: readFileSync('/etc/ssl/certs/domain.cert.pem')
        }
        server = https.createServer(options)
      }

      const io = new Server(server, {
        cors: { origin },
      })

      io.on("connection", client => {
        log("client connected", client.id)
        client.on("disconnect", () => log("client disconnected", client.id))
      })

      room(io)

      server.listen(port).on("listening", res).on("error", rej)
    }
  })
}