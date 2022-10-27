console.log("starting")

import server from "./socket"

let port = Number(process.env.PORT ?? 443)

server(port).then(() => console.log(`listening on ${port}`))