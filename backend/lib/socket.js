import {Server} from "socket.io"
import http from "http"
import express from "express"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

const app = express()
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:[process.env.FRONTEND_URL]
    }
})

const userSocketMap = {}
const interviewSessions = {}

export function getUserSocketId(userId){
    return userSocketMap[userId];
}

// AI Interviewer System
const createAIInterviewer = (interviewData) => {
    const {
        questions,
        leetcode,
        resume,
        github,
        name,
        topic,
        subTopic,
        level
    } = interviewData;

    let currentQuestionIndex = 0;
    let conversationHistory = [];
    let isInterviewActive = true;

    const getNextQuestion = () => {
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            currentQuestionIndex++;
            return question;
        }
        return null;
    };

    const generateAIResponse = async (userMessage, conversationHistory) => {
        try {
            const context = `
Interview Context:
- Topic: ${topic}
- Subtopic: ${subTopic}
- Difficulty: ${level}
- Candidate Name: ${name}
- Resume: ${resume || 'N/A'}
- LeetCode Stats: ${leetcode || 'N/A'}
- GitHub Projects: ${github || 'N/A'}

Available Questions: ${JSON.stringify(questions)}

Conversation History:
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Current User Message: ${userMessage}

Instructions:
- You are a professional technical interviewer conducting a real-time voice interview
- Respond naturally and conversationally, as if you're having a real interview
- Ask follow-up questions based on the candidate's responses
- Provide constructive feedback when appropriate
- Keep responses concise (1-2 sentences) for voice interaction
- If the candidate has answered all questions, thank them and end the interview
- Be encouraging and professional throughout the conversation

Respond as the interviewer:`;

            const { text } = await generateText({
                model: google('gemini-2.0-flash-001'),
                prompt: context
            });

            return text.trim();
        } catch (error) {
            console.error('Error generating AI response:', error);
            return "I apologize, but I'm having trouble processing that. Could you please repeat your response?";
        }
    };

    const startInterview = () => {
        const firstQuestion = getNextQuestion();
        if (firstQuestion) {
            conversationHistory.push({
                role: 'interviewer',
                content: `Hello ${name}! Welcome to your ${topic} interview. Let's begin with our first question: ${firstQuestion}`
            });
            return conversationHistory[conversationHistory.length - 1];
        }
        return null;
    };

    const processUserResponse = async (userMessage) => {
        if (!isInterviewActive) {
            return {
                role: 'interviewer',
                content: "Thank you for your responses. The interview has concluded."
            };
        }

        // Add user message to history
        conversationHistory.push({
            role: 'candidate',
            content: userMessage
        });

        // Generate AI response
        const aiResponse = await generateAIResponse(userMessage, conversationHistory);
        
        // Add AI response to history
        conversationHistory.push({
            role: 'interviewer',
            content: aiResponse
        });

        // Check if we should end the interview
        if (currentQuestionIndex >= questions.length && 
            conversationHistory.length >= questions.length * 2) {
            isInterviewActive = false;
            const finalMessage = {
                role: 'interviewer',
                content: "Thank you for your responses. The interview has concluded. You've done well!"
            };
            conversationHistory.push(finalMessage);
            return finalMessage;
        }

        return conversationHistory[conversationHistory.length - 1];
    };

    return {
        startInterview,
        processUserResponse,
        getConversationHistory: () => conversationHistory,
        isActive: () => isInterviewActive
    };
};

io.on("connection",(socket)=>{
    console.log("A user connected ",socket.id)

    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id

    // Handle interview session start
    socket.on("start-interview", async (interviewData) => {
        try {
            console.log("Starting interview session for user:", userId);
            
            // Create AI interviewer instance
            const interviewer = createAIInterviewer(interviewData);
            interviewSessions[socket.id] = interviewer;

            // Start the interview
            const firstMessage = interviewer.startInterview();
            
            if (firstMessage) {
                socket.emit("interview-message", {
                    type: "interviewer",
                    content: firstMessage.content,
                    role: "interviewer"
                });
            }
        } catch (error) {
            console.error("Error starting interview:", error);
            socket.emit("interview-error", { message: "Failed to start interview" });
        }
    });

    // Handle user speech-to-text response
    socket.on("user-response", async (userMessage) => {
        try {
            const interviewer = interviewSessions[socket.id];
            if (!interviewer) {
                socket.emit("interview-error", { message: "No active interview session" });
                return;
            }

            // Process user response and get AI response
            const aiResponse = await interviewer.processUserResponse(userMessage);
            
            // Send AI response back to client
            socket.emit("interview-message", {
                type: "interviewer",
                content: aiResponse.content,
                role: "interviewer"
            });

            // If interview is finished, send completion signal
            if (!interviewer.isActive()) {
                socket.emit("interview-complete", {
                    conversationHistory: interviewer.getConversationHistory()
                });
            }
        } catch (error) {
            console.error("Error processing user response:", error);
            socket.emit("interview-error", { message: "Failed to process response" });
        }
    });

    // Handle interview end
    socket.on("end-interview", () => {
        const interviewer = interviewSessions[socket.id];
        if (interviewer) {
            const conversationHistory = interviewer.getConversationHistory();
            socket.emit("interview-complete", { conversationHistory });
            delete interviewSessions[socket.id];
        }
    });

    socket.on("disconnect",()=>{
        console.log("A user disconnected ",socket.id)
        delete userSocketMap[userId];
        delete interviewSessions[socket.id];
    })
})

export {io,app,server};