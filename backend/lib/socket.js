import { Server } from "socket.io"
import http from "http"
import express from "express"
import OpenAI from "openai"
import { getApi } from "./getApi.js"

const app = express()
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL]
    }
})

const userSocketMap = {}
const interviewSessions = {}

// Add session timeout for memory management
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const sessionTimeouts = {};


io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    console.log(`User connected: ${userId}, Socket: ${socket.id}, Active sessions: ${Object.keys(interviewSessions).length}`);

    // Handle interview session start
    socket.on("start-interview", async (data) => {
        try {
            console.log(`Starting interview for user: ${userId}, Socket: ${socket.id}`);
            
            // Clean up any existing session for this socket
            if (interviewSessions[socket.id]) {
                console.log(`Cleaning up existing session for socket: ${socket.id}`);
                cleanupSession(socket.id);
            }
            
            // Validate required fields
            if (!data.interviewData.questions || !Array.isArray(data.interviewData.questions)) {
                console.error("Invalid interview data: questions array is required");
                socket.emit("interview-error", { message: "Invalid interview data: questions array is required" });
                return;
            }

            // Create AI interviewer instance
            const interviewer = createAIInterviewer(data.interviewData);
            interviewSessions[socket.id] = interviewer;
            setSessionTimeout(socket.id); // Set timeout for the session

            console.log(`Interview started for user: ${userId}, Socket: ${socket.id}, Active sessions: ${Object.keys(interviewSessions).length}`);

            // Start the interview
            const firstMessage = interviewer.startInterview();

            if (firstMessage) {
                socket.emit("send-interview-response", firstMessage);
            } else {
                console.error("Failed to start interview: no first message generated");
                socket.emit("interview-error", { message: "Failed to start interview" });
            }
        } catch (error) {
            console.error("Error starting interview:", error);
            socket.emit("interview-error", { message: "Failed to start interview" });
        }
    });

    // Handle user speech-to-text response
    socket.on("send-user-message", async (data) => {
        try {
            const interviewer = interviewSessions[socket.id];
            if (!interviewer) {
                socket.emit("interview-error", { message: "No active interview session" });
                return;
            }

            // Process user response and get AI response
            const aiResponse = await interviewer.processUserResponse(data.message);

            // Send AI response back to client
            socket.emit("send-interview-response", aiResponse);

            // If interview is finished, send completion signal
            if (!interviewer.isActive()) {
                socket.emit("interview-complete", {
                    conversationHistory: interviewer.getConversationHistory()
                });
                cleanupSession(socket.id); // Clean up session on completion
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
            cleanupSession(socket.id); // Clean up session on end
        }
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${userId}, Socket: ${socket.id}`);
        delete userSocketMap[userId];
        cleanupSession(socket.id); // Clean up session on disconnect
        console.log(`Active sessions after disconnect: ${Object.keys(interviewSessions).length}`);
    });
});

const cleanupSession = (socketId) => {
    if (interviewSessions[socketId]) {
        delete interviewSessions[socketId];
        if (sessionTimeouts[socketId]) {
            clearTimeout(sessionTimeouts[socketId]);
            delete sessionTimeouts[socketId];
        }
    }
};

const setSessionTimeout = (socketId) => {
    // Clear existing timeout
    if (sessionTimeouts[socketId]) {
        clearTimeout(sessionTimeouts[socketId]);
    }

    // Set new timeout
    sessionTimeouts[socketId] = setTimeout(() => {
        cleanupSession(socketId);
    }, SESSION_TIMEOUT);
};

export function getUserSocketId(userId) {
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

    // Clean up speech input to handle STT errors
    const cleanSpeechInput = (userMessage) => {
        if (!userMessage) return '';

        // Convert to lowercase and trim
        let cleaned = userMessage.toLowerCase().trim();

        // Common STT corrections
        const corrections = {
            'um': '',
            'uh': '',
            'like': '',
            'you know': '',
            'i mean': '',
            'sort of': '',
            'kind of': '',
            'basically': '',
            'actually': '',
            'literally': '',
            'obviously': '',
            'clearly': '',
            'definitely': '',
            'absolutely': '',
            'exactly': '',
            'right': '',
            'okay': '',
            'ok': '',
            'yeah': 'yes',
            'yep': 'yes',
            'nope': 'no',
            'nah': 'no'
        };

        // Apply corrections
        Object.entries(corrections).forEach(([word, replacement]) => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            cleaned = cleaned.replace(regex, replacement);
        });

        // Remove extra spaces
        cleaned = cleaned.replace(/\s+/g, ' ').trim();

        return cleaned;
    };

    const getNextQuestion = () => {
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            currentQuestionIndex++;
            return question;
        }
        return null;
    };

    const generateAIResponse = async (userMessage, conversationHistory, userDidNotRespond = false) => {
        try {
            const context = `
You are a professional technical interviewer conducting a real-time voice interview with a candidate. Your goal is to assess their technical skills, problem-solving abilities, and cultural fit for the role.

Interview Guidelines:
You have been given the full list of interview questions (see below). Do NOT advance to the next question automatically. Instead, always decide which question to ask next based on the full conversation history and the candidate's responses. If the user has not responded, politely encourage them to answer the current question or clarify if they need help. Only move to the next question if the candidate has answered the current one or if it makes sense contextually.

Full List of Interview Questions:
${JSON.stringify(questions)}

Candidate's Resume:
${resume || 'No resume included.'}

Candidate's LeetCode Stats:
${leetcode || 'No LeetCode stats included.'}

Candidate's GitHub Projects:
${github || 'No github projects included.'}

Context Integration:
- If resume is provided, reference specific experiences and technologies mentioned, and give feedback or ask follow-up questions based on those details.
- If LeetCode stats are available, acknowledge their problem-solving progress, incorporate their stats into your feedback, and ask about their approach to coding challenges.
- If GitHub projects are included, give feedback based on their code, architecture decisions, technologies used, and challenges faced. Ask specific, relevant questions about their projects and reference them directly in your feedback.
- If any data is missing, you'll see 'No resume included.', 'No LeetCode stats included.', or 'No github projects included.' - adapt your questions and feedback accordingly.

Technical Assessment Focus:
- Ask about specific technologies and frameworks mentioned in their projects
- Discuss architecture decisions and trade-offs they made
- Explore problem-solving approaches and debugging strategies
- Assess their understanding of best practices and code quality
- Ask about collaboration, version control, and development workflows

Engage naturally & react appropriately:
- Listen actively to responses and acknowledge them before moving forward
- Always briefly echo or paraphrase the candidate's main point or sentence before giving feedback or asking the next question (e.g., "That's a great approach to X," or "I see you used Y technology...")
- After each answer, provide a brief, precise, and encouraging feedback or comment (e.g., "Well explained!" or "That's a solid strategy.")
- Give feedback and follow-up questions that are personalized and relevant to the candidate's resume, projects, and LeetCode stats whenever possible.
- When responding to a candidate's answer, you may ask at most one follow-up question related to their response, and sometimes none. Never ask more than one follow-up question for any main question check the conversation that is there any follow-up asked by you or not.
- Keep the conversation flowing smoothly while maintaining control
- Reference their actual projects and experiences when asking questions

Be professional, yet warm and welcoming:
- Use official yet friendly language
- Keep responses concise, precise, and to the point (like in a real voice interview)
- Avoid robotic phrasing—sound natural and conversational
- Show genuine interest in their technical background

To sound more human and conversational, occasionally use natural filler words or interjections (such as "hmm", "oh", "let me think", "well", "you know", "so", etc.) at appropriate points in your responses, but do not overuse them. Use them sparingly and only where it feels natural, as a real interviewer might do.
- Occasionally use light, professional humor or encouragement (e.g., "That's a classic interview story!", "No worries, take your time.") when appropriate, but keep it subtle and professional.
- If the candidate seems nervous, unsure, or is struggling to answer, offer gentle reassurance (e.g., "It's okay to take a moment to think.", "Take your time, there's no rush.").

Answer the candidate's questions professionally:
- If asked about the role, company, or expectations, provide a clear and relevant answer
- If unsure, redirect the candidate to HR for more details
- Be honest about what you know and don't know

Conclude the interview properly:
- Thank the candidate for their time
- Inform them that the company will reach out soon with feedback
- End the conversation on a polite and positive note
- Your closing sentence should be warm, professional, and precise (e.g., "Thank you for your time today. We'll be in touch soon with feedback. Have a wonderful day!")

IMPORTANT VOICE INTERVIEW GUIDELINES:
- The user's speech may have grammar errors, spelling mistakes, or unclear words due to speech-to-text limitations
- Focus on the main intent and meaning of their response, not perfect grammar
- If their response is unclear, ask for clarification politely
- Keep your responses concise (1-2 sentences) for voice interaction
- Use simple, clear words that are easy for text-to-speech to pronounce
- Avoid complex technical jargon unless necessary
- Speak naturally and conversationally, as if having a real interview
- Use common words and avoid abbreviations or acronyms that might be mispronounced by TTS
- When mentioning technical terms, spell them out clearly (e.g., "A P I" instead of "API")
- Use natural pauses and flow in your speech
- Avoid rapid-fire technical terms - space them out for clarity

${userDidNotRespond ? 'NOTE: The user has not responded to the last question. Politely encourage them to answer or clarify if they need help.' : ''}

Conversation History:
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Current User Message: ${userMessage}

Only respond with your next interviewer message. Do not repeat or summarize the conversation history. Do not include previous candidate or interviewer messages in your response.

Respond as the interviewer. Remember to acknowledge the candidate's answer, echo their main idea, and provide brief, valuable feedback before moving to the next question or closing the interview. Be concise, precise, and human. Always personalize your feedback and questions based on the candidate's resume, projects, and LeetCode stats if available.
Also send the message in this format:
{
    "role": "interviewer",
    "content": "Your message here",
    "isInterviewEnd": true/false
}

If you think the interview is complete, set isInterviewEnd to true.`;

const apiKey = getApi();
if(!apiKey){
    console.log("No api key found")
    return {
        role: 'interviewer',
        content: "I apologize, but I'm having trouble processing that. Could you please repeat your response?",
        isInterviewEnd: false
    };
}

const client = new OpenAI({
    apiKey: apiKey
});

            try {
                const response = await client.chat.completions.create({
                    model: "gpt-4.1-nano",
                    messages: [
                        { role: "user", content: context }
                    ]
                });

                const text = response.choices[0]?.message?.content || '';
                const cleanedText = text.replace(/```json/g, '').replace(/```/g, '');

                const parsedResponse = JSON.parse(cleanedText);

                return parsedResponse;
            } catch (aiError) {
                console.log('Error generating AI response:', aiError.message);
                
                return {
                    role: 'interviewer',
                    content: "I apologize, but I'm having trouble processing that. Could you please repeat your response?",
                    isInterviewEnd: false
                };
            }
        } catch (error) {
            console.error('Error generating AI response:', error);
            return {
                role: 'interviewer',
                content: "I apologize, but I'm having trouble processing that. Could you please repeat your response?",
                isInterviewEnd: false
            };
        }
    };

    const startInterview = () => {
        if (questions.length === 0) {
            console.error('No questions available for interview');
            return null;
        }

        const firstQuestion = getNextQuestion();
        if (firstQuestion) {
            const candidateName = name || 'Candidate';
            const msg = {
                type: 'interviewer',
                role: 'interviewer',
                content: `Hello ${candidateName}! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience. Let's begin with our first question: ${firstQuestion}`,
                isInterviewEnd: false
            };
            conversationHistory.push(msg);
            return msg;
        }
        return null;
    };

    const processUserResponse = async (userMessage) => {
        let userDidNotRespond = false;
        let cleanedUserMessage = cleanSpeechInput(userMessage);

        // If the user did not respond (empty message)
        if (!userMessage || userMessage.trim() === "") {
            userDidNotRespond = true;
            cleanedUserMessage = "[NO RESPONSE]";
        }

        if (!isInterviewActive) {
            if (userDidNotRespond) {
                const endMsg = {
                    type: 'interviewer',
                    role: 'interviewer',
                    content: "The interview is now complete. Please click 'End Interview' to finish and receive your feedback.",
                    isInterviewEnd: true
                };
                conversationHistory.push(endMsg);
                return endMsg;
            }
            const endMsg = {
                type: 'interviewer',
                role: 'interviewer',
                content: "Thank you for your responses. The interview has concluded.",
                isInterviewEnd: true
            };
            conversationHistory.push(endMsg);
            return endMsg;
        }

        // Add user message to history
        conversationHistory.push({
            type: 'interviewer',
            role: 'candidate',
            content: cleanedUserMessage
        });

        // Generate AI response, passing userDidNotRespond flag
        const aiResponse = await generateAIResponse(cleanedUserMessage, conversationHistory, userDidNotRespond);

        // Add AI response to history (ensure correct format)
        conversationHistory.push({
            type: 'interviewer',
            role: 'interviewer',
            content: aiResponse.content,
            isInterviewEnd: aiResponse.isInterviewEnd
        });


        const aiResponseWithType = {
            ...aiResponse,
            type: 'interviewer'
        };
        return aiResponseWithType;
    };

    return {
        startInterview,
        processUserResponse,
        getConversationHistory: () => conversationHistory,
        isActive: () => isInterviewActive
    };
};




export { io, app, server };