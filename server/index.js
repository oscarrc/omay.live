const dontenv = require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const router = require("./router");
const socket = { Server } = require("socket.io");
const mongoose = require("mongoose");

const { ChatService, BanService } = require("./services");

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
  console.log(`${socket.id} connected from ${socket.handshake.address} in ${socket.handshake.query.mode} mode`);

  BanService.isBanned(socket.handshake.address).then( banned => {    
    if(banned) {      
      console.log(`${socket.id} from network ${socket.handshake.address} is banned`)
      socket.emit("banned");
    }

    ChatService.peerConnected({
      peer: socket.id,
      ip: socket.handshake.address,
      mode: socket.handshake.query.mode,
      interests: socket.handshake.query.interests,
      lang: socket.handshake.query.lang,
      simulated: socket.handshake.query.simulated || false
    })
  });

  socket.on('report', (data) => {
    if(!data.id) return;
    console.log(`${data.id} reported`);

    ChatService.getPeer(data.id).then( (peer) => {
      BanService.warn(peer.ip).then( banned => {
        if(!banned) return 
        
        socket.to(peer.id).emit("banned");
        ChatService.peerDisconnected(socket.id)
      })
    });
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
    console.log(`${socket.id} was connected from ${socket.handshake.address} and now disconnected`);
    ChatService.peerDisconnected(socket.id)
  });

  socket.on('peerupdated', (data) => {
    ChatService.updatePeer(socket.id, data)
  })
});