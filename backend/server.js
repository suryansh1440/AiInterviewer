import express from 'express';
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRouter from './router/auth.router.js';
import aiRouter from './router/ai.router.js';
import interviewRouter from './router/interview.router.js'
import paymentRouter from './router/payment.router.js'

// Gemini setup
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

import http from 'http';
import { Server } from 'socket.io';

dotenv.config()

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
});

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

app.get("/",(req,res)=>{
    res.send("Hello World");
})

// Socket.IO interviewer logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('user_message', async (data) => {
        // data: { transcript, context: { questions, resume, leetcodeStats } }
        try {
            const prompt = `You are an AI interviewer.\nResume: ${data.context.resume}\nLeetCode stats: ${data.context.leetcodeStats}\nQuestions: ${Array.isArray(data.context.questions) ? data.context.questions.join(', ') : ''}\nCandidate just said: \"${data.transcript}\"\nRespond as a professional interviewer, ask follow-ups, or give feedback.`;
            const result = await genAI.generateContent(prompt);
            socket.emit('ai_message', { text: result.response.text() });
        } catch (err) {
            socket.emit('ai_message', { text: 'Sorry, there was an error generating a response.' });
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
