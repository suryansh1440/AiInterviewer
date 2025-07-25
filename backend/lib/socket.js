import {Server} from "socket.io"
import http from "http"
import express from "express"
import { Socket } from "dgram";

const app = express()
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:[process.env.FRONTEND_URL]
    }
})

const userSocketMap = {}

export function getUserSocketId(userId){
    return userSocketMap[userId];
}

io.on("connection",(socket)=>{
    console.log("A user connected ",socket.id)

    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id


    socket.on("disconnect",()=>{
        console.log("A user disconnected ",socket.id)
        delete userSocketMap[userId]
    })
})

export {io,app,server};