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

io.on('connection', async (socket) => { 
  let ip =  socket.client.conn.remoteAddress;
  let banned = await BanService.isBanned(ip);
     
  if(banned) {      
    console.log(`${chalk.red.bold("> [banned]")} ${chalk.bgRed.black.bold(' nsfw ')} ${chalk.red(`${socket.id} (${ip})`)}`)
    socket.emit("banned");
  }

  await ChatService.peerConnected({
    peer: socket.id,
    ip: ip,
    mode: socket.handshake.query.mode,
    interests: socket.handshake.query.interests,
    lang: socket.handshake.query.lang,
    simulated: socket.handshake.query.simulated || false
  })

  console.log(`${chalk.green.bold("> [connected]")} ${chalk.bgGreen.black.bold(` ${socket.handshake.query.mode} `)} ${chalk.green(`${socket.id} (${ip})`)}`)

  socket.on('report', async (data) => {
    if(!data.id) return;

    let peer = await ChatService.getPeer(data.id);
    let banned = await BanService.warn(peer.ip);

    console.log(`${chalk.yellow.bold("> [reported]")} ${chalk.bgYellow.black.bold(' nsfw ')} ${chalk.yellow(data.id)}`)
    
    if(!banned) return;

    console.log(`${chalk.red.bold("> [banned]")} ${chalk.bgRed.black.bold(' nsfw ')} ${chalk.red(`${data.id} (${peer.ip})`)}`)
    socket.emit("banned");

    await ChatService.peerDisconnected(socket.id)
  })
 
  socket.on('candidatesent', (data) => {
    socket.to(data.remoteId).emit("receivecandidate", data)
  })

  socket.on('offercreated', async (data) => {
    socket.to(data.remoteId).emit("receiveoffer", data);
    await ChatService.peerAvailable(data.id);
  })

  socket.on('answercreated', async (data) => {    
    await socket.to(data.remoteId).emit("receiveanswer", data)
    ChatService.peerUnavailable(data.id);
  })

  socket.on('answerreceived', async (data) => {
    await ChatService.peerUnavailable(data.id);
  })

  socket.on('connectionclosed', (data) => {
    socket.to(data.remoteId).emit('peerdisconnected')
  })

  socket.on('disconnect', async () => { 
    let ip = socket.handshake.headers['x-forwarded-for'];
    await ChatService.peerDisconnected(socket.id)
    console.log(`${chalk.blue.bold("> [disconnected]")} ${chalk.bgBlue.black.bold(" exit ")} ${chalk.blue(`${socket.id} (${ip})`)}`)
  });

  socket.on('peerupdated', async (data) => {
    await ChatService.updatePeer(socket.id, data)
  })
});