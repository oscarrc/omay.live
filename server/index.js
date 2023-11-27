const dontenv = require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const router = require("./router");
const socket = { Server } = require("socket.io");
const mongoose = require("mongoose");

const { ChatService } = require("./services");

const PORT = process.env.PORT || 8080;
const BASE_URL = process.env.BASE_URL || "localhost";
const app = express(); 

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log(`> [DB] Connection ready`)
})

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

  ChatService.peerConnected({
    peer: socket.id,
    ip: socket.handshake.address,
    mode: socket.handshake.query.mode,
    interests: socket.handshake.query.interests
  })

  socket.on('candidatesent', (data) => {
    socket.to(data.remoteId).emit("receivecandidate", data)
  })

  socket.on('offercreated', (data) => {
    socket.to(data.remoteId).emit("receiveoffer", data);
    ChatService.peerAvailable(data.id);
  })

  socket.on('answercreated', (data) => {    
    socket.to(data.remoteId).emit("receiveanswer", data)
    ChatService.peerUnavailable(data.id);
  })

  socket.on('answerreceived', (data) => {
    ChatService.peerUnavailable(data.id);
  })

  socket.on('connectionclosed', (data) => {
    socket.to(data.remoteId).emit('peerdisconnected')
  })

  socket.on('disconnect', () => {
    console.log(`${socket.handshake.address} disconnected`);
    ChatService.peerDisconnected(socket.id)
  });
});