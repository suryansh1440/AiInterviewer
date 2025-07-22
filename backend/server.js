import express from 'express';
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRouter from './router/auth.router.js';
import aiRouter from './router/ai.router.js';
import interviewRouter from './router/interview.router.js'
import paymentRouter from './router/payment.router.js'


dotenv.config()

const app = express();

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
