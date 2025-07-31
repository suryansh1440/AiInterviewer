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
import apiRouter from "./router/api.router.js";


dotenv.config()



const PORT = process.env.PORT;
app.use(cookieParser());

app.use(cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:8081", "http://localhost:3000"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
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
app.use("/api/api", apiRouter);




app.get("/",(req,res)=>{
    res.send("AiInterviewer Backend is running!");
})

app.get("/health",(req,res)=>{
    res.json({ status: "healthy", service: "aiinterviewer-backend" });
})

app.get("/test-cookie",(req,res)=>{
    res.cookie("test", "test-value", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/"
    });
    res.json({ message: "Test cookie set", cookies: req.cookies });
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();

});
