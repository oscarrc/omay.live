const dontenv = require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const router = require("./router");
const socket = { Server } = require("socket.io");

const PORT = process.env.PORT || 8080;
const BASE_URL = process.env.BASE_URL || "localhost";
const app = express();

const { ChatService } = require("./services")

app.use(bodyparser.urlencoded({extended: true}))
    .use(bodyparser.json())
    .use(cors())
    .use(router)

const server = app.listen(PORT, () => {
    console.log(`> [HTTP] Ready on ${BASE_URL}:${PORT}`)
})

const io = socket(server, {
    cors: {
      origin: "*",
      credentials: true
    },
});

if(io) console.log(`> [SOCKET] Ready on ${BASE_URL}:${PORT}`)

io.on('connection', (socket) => {   
  console.log(`${socket.handshake.address} connected in ${socket.handshake.query.mode} mode`);

  // ChatService.peerConnected({
  //   peer: socket.id,
  //   ip: socket.handshake.address,
  //   mode: socket.handshake.query.mode
  //   interests: socket.handshake.query.interests
  // })

  socket.on('disconnect', () => {
    console.log(`${socket.handshake.address} disconnected`);
    // ChatService.peerDisconnected({ peer: socket.id })
  });
});