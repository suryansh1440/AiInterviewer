import express from 'express';
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRouter from './router/auth.router.js';
import aiRouter from './router/ai.router.js';
import interviewRouter from './router/interview.router.js'
import paymentRouter from './router/payment.router.js'
import { app, server } from './lib/socket.js';
import postRouter from './router/post.router.js';
import messageRouter from './router/message.router.js';
import contactRouter from "./router/contact.router.js";


dotenv.config()



const PORT = process.env.PORT;
app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true
}))
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));



app.use("/api/auth",authRouter)
app.use("/api/ai",aiRouter)
app.use("/api/interview",interviewRouter)
app.use("/api/payment",paymentRouter)
app.use("/api/post",postRouter)
app.use("/api/message",messageRouter)
app.use("/api/contact", contactRouter);



app.get("/",(req,res)=>{
    res.send("Hello World");
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();

});
