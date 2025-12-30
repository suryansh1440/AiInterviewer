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
import { checkDBConnection } from './middleware/auth.middleware.js';



dotenv.config()



const PORT = process.env.PORT;
app.use(cookieParser());

app.use(cors({
    origin: [
        process.env.FRONTEND_URL, 
        "http://localhost:8081", 
        "https://aiinterviewer-k0xg.onrender.com"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie']
}))
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add database connection check for all API routes
app.use('/api', checkDBConnection);



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
    res.json({ 
        status: "healthy", 
        service: "aiinterviewer-backend",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
})

// Connect to database first, then start server
const startServer = async () => {
    try {
        console.log('Starting server...');
        console.log('Environment:', process.env.NODE_ENV);
        console.log('Port:', PORT);
        
        // Connect to MongoDB first
        await connectDB();
        
        // Start server after database connection
        server.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📡 Socket.IO server ready`);
            console.log(`🔗 Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Start server for Render
startServer();
