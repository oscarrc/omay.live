import { BanService, ChatService } from "./services/index.js";

import bodyparser from "body-parser";
import chalk from 'chalk';
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import router from "./router.js";
import { Server as socket } from "socket.io";

const PORT = process.env.PORT || 8080;
const BASE_URL = process.env.BASE_URL || "localhost";
const app = express(); 

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log(`${chalk.green.bold("[DB]")} Connection ready`)
})

app.use(bodyparser.urlencoded({extended: true}))
    .use(bodyparser.json())
    .use(cors())
    .use(router)

const server = app.listen(PORT, () => {
    console.log(`${chalk.green.bold("[HTTP]")} Ready on ${BASE_URL}:${PORT}`)
})

const io = new socket(server, {
    cors: {
      origin: "*",
      credentials: true
    },
});

if(io) console.log(`${chalk.green.bold("[SOCKET]")} Ready on ${BASE_URL}:${PORT}`)

io.on('connection', (socket) => { 
  console.log(`${chalk.green.bold("> [connected]")} ${chalk.bgGreen.black.bold(` ${socket.handshake.query.mode} `)} ${chalk.green(`${socket.id} (${socket.handshake.address})`)}`)

  BanService.isBanned(socket.handshake.address).then( banned => {    
    if(banned) {      
      console.log(`${chalk.red.bold("> [banned]")} ${chalk.bgRed.black.bold(' nsfw ')} ${chalk.red(`${socket.id} (${socket.handshake.address})`)}`)
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
    console.log(`${chalk.yellow.bold("> [reported]")} ${chalk.bgYellow.black.bold(' nsfw ')} ${chalk.yellow(data.id)}`)

    ChatService.getPeer(data.id).then( (peer) => {
      BanService.warn(peer.ip).then( banned => {
        if(!banned) return 

        console.log(`${chalk.red.bold("> [banned]")} ${chalk.bgRed.black.bold(' nsfw ')} ${chalk.red(`${data.id} (${peer.ip})`)}`)
        socket.emit("banned");
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
    console.log(`${chalk.blue.bold("> [disconnected]")} ${chalk.bgBlue.black.bold(" exit ")} ${chalk.blue(`${socket.id} (${socket.handshake.address})`)}`)
    ChatService.peerDisconnected(socket.id)
  });

  socket.on('peerupdated', (data) => {
    ChatService.updatePeer(socket.id, data)
  })
});