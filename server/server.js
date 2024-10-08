import { BanService, ChatService } from "./services/index.js";

import { Server as SocketIO } from "socket.io";
import bodyparser from "body-parser";
import chalk from 'chalk';
import cors from "cors";
import { createAdapter } from "@socket.io/mongo-adapter";
import express from "express";
import mongoose from "mongoose";
import { setupWorker } from "@socket.io/sticky";

// import { createAdapter } from "@socket.io/cluster-adapter";

const app = express(); 

const Db = (url, purge) => {
    return new Promise( async (resolve, reject) => {
        try{
            await mongoose.connect(url);
            if(purge){
                let exists = await mongoose.connection.db.listCollections({name: "peers"}).toArray();
                if(exists.length) mongoose.connection.db.dropCollection("peers");
            }
            resolve();
        }catch(e){
            reject(e)
        }
    })
}

const Server = (router) => {
    app.use(bodyparser.urlencoded({extended: true}))
        .use(bodyparser.json())
        .use(cors())
        .use(router)        
        .use('/tf', express.static('tf'))

    return app
}

const Socket = async (server, workerId) => { 
    const io = new SocketIO(server, {
        cors: {
          origin: "*",
          credentials: true
        },
    });

    /* Mongo adapter start */
    try {
        await mongoose.connection.createCollection("sockets", {
            capped: true,
            size: 1e6
        })    
    } catch (e) {
        // collection already exists
    }

    io.adapter(createAdapter(mongoose.connection.collection("sockets")));
    /* Mongo adapter end */

    // io.adapter(createAdapter());

    setupWorker(io);
    
    io.on('connection', async (socket) => {
        let ip =  socket.handshake.headers["true-client-ip"] || 
                socket.handshake.headers["x-forwarded-for"]?.split(",")[0] || 
                socket.client.conn.remoteAddress;
    
        let banned = await BanService.isBanned(ip);
        
        if(banned) {      
            console.log(`\t${chalk.red.bold(`> [banned] [${workerId}]`)} ${chalk.bgRed.black.bold(' nsfw ')} ${chalk.red(`${socket.id} (${ip})`)}`)
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
    
        console.log(`\t${chalk.green.bold(`> [connected] [${workerId}]`)} ${chalk.bgGreen.black.bold(` ${socket.handshake.query.mode} `)} ${chalk.green(`${socket.id} (${ip})`)}`)
    
        socket.on('report', async (data) => {
            if(!data.id) return;
        
            let peer = await ChatService.getPeer(data.id);
            let banned = await BanService.warn(peer.ip);
        
            console.log(`\t${chalk.yellow.bold(`> [reported] [${workerId}]`)} ${chalk.bgYellow.black.bold(' nsfw ')} ${chalk.yellow(data.id)}`)
            
            if(!banned) return;
        
            console.log(`\t${chalk.red.bold(`> [banned] [${workerId}]`)} ${chalk.bgRed.black.bold(' nsfw ')} ${chalk.red(`${data.id} (${peer.ip})`)}`)
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
            const peer = await ChatService.getPeer(data.id);

            if(peer.available) {
                await socket.to(data.remoteId).emit("receiveanswer", data)
                await ChatService.peerUnavailable(data.id);
            }else{
                await socket.to(data.remoteId).emit("peerunavailable");
            }
        })
    
        socket.on('answerreceived', async (data) => {
            await ChatService.peerUnavailable(data.id);
        })
    
        socket.on('connectionclosed', (data) => {
            socket.to(data.remoteId).emit('peerdisconnected')
        })
    
        socket.on('disconnect', async () => {     
            let ip =  socket.handshake.headers["true-client-ip"] || 
                        socket.handshake.headers["x-forwarded-for"]?.split(",")[0] || 
                        socket.client.conn.remoteAddress;
                        
            await ChatService.peerDisconnected(socket.id)
            console.log(`\t${chalk.blue.bold(`> [disconnected] [${workerId}]`)} ${chalk.bgBlue.black.bold(" exit ")} ${chalk.blue(`${socket.id} (${ip})`)}`)
        });
    
        socket.on('peerupdated', async (data) => {
            await ChatService.updatePeer(socket.id, data)
        })
  });
}

export {Db, Server, Socket};
