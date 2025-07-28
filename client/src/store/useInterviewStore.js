import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { interviewSocket } from '../lib/socket.js';
import { useAuthStore } from './useAuthStore';

export const useInterviewStore = create((set, get) => ({
    interviews: [],
    interviewData: null,
    resumeData: null,
    randomTopic:[],
    isGettingResume:false,
    isGettingRandomTopic: false,
    isGeneratingQuestion: false,
    isStartingInterview:false,
    isCreatingFeedback: false,
    showInterview: null,
    isGettingInterviews:false,
    isGettingLeetCodeAnalysis:false,
    
    // Custom interview state
    isInterviewActive: false,
    isListening: false,
    isSpeaking: false,
    messages: [],
    currentInterviewSession: null,

    setShowInterview: (id) => set({ showInterview: id }),
    
    setInterviewData: (data)=>{
        set({interviewData:data})
    },
    
    getRandomTopic: async(text)=>{
        set({isGettingRandomTopic:true})
        try{
            const res = await axiosInstance.post("/ai/getRandomTopic",{resumeText:text})
            set({randomTopic:res.data.topics}); // set the array
            return res.data.topics; // return the array
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isGettingRandomTopic:false})
        }
    },
    
    readResume: async (url) => {
        set({isGettingResume:true})
        try{
            const res = await axiosInstance.post("/ai/readPdf",{url});
            set({resumeData:res.data.text})
            return res.data.text;
        }catch(error){
            toast.error(error.response.data.message);
            return "No resume included";
        }finally{
            set({isGettingResume:false})
        }
    },
    
    getLeetCodeAnalysis: async (username) => {
        set({isGettingLeetCodeAnalysis:true})
        try{
            const res = await axiosInstance.post("/ai/getLeetCodeAnalysis",{username});
            return res.data.text;
        }catch(error){
            return "No LeetCode stats included";
        }finally{
            set({isGettingLeetCodeAnalysis:false})
        }
    },

    generateQuestion: async (interviewData)=>{
        set({isGeneratingQuestion:true})
        try{
            const res = await axiosInstance.post("/ai/generateQuestion",interviewData);
            set({interviewData:res.data.interview})
            return res.data.interview;
        }catch(error){
            toast.error(error.response.data.message);
            return null;
        }finally{
            set({isGeneratingQuestion:false})
        }
    },

    // Custom interview methods
    startCustomInterview: async (questions, leetcode, resume, github, name) => {
        set({isStartingInterview: true});
        const { interviewData } = get();
        const { user } = useAuthStore.getState();
        
        if (!interviewData) {
            throw new Error('No interview data set');
        }
        
        try {
            // Ensure questions is always an array
            const questionsArr = Array.isArray(questions) ? questions : [];
            
            const interviewSessionData = {
                questions: questionsArr,
                leetcode: leetcode || 'N/A',
                resume: resume || 'N/A',
                github: github || 'N/A',
                name: name || user?.name || 'Candidate',
                topic: interviewData.topic,
                subTopic: interviewData.subTopic,
                level: interviewData.level
            };

            // Connect to socket
            interviewSocket.connect(user._id);
            
            // Set up event handlers
            interviewSocket.onMessage((data) => {
                set((state) => ({
                    messages: [...state.messages, {
                        role: data.role,
                        content: data.content
                    }],
                    isSpeaking: true
                }));
            });

            interviewSocket.onError((error) => {
                console.error('Interview error:', error);
                toast.error(error.message || 'Interview error occurred');
            });

            interviewSocket.onComplete((data) => {
                set({ isInterviewActive: false });
                // Create feedback with conversation history
                get().createFeedback(interviewData._id, data.conversationHistory);
            });

            interviewSocket.onConnect(() => {
                // Start the interview
                interviewSocket.startInterview(interviewSessionData);
                set({ 
                    isInterviewActive: true,
                    isStartingInterview: false,
                    messages: []
                });
            });

            return true;
        } catch (error) {
            console.log('Custom interview start error', error);
            toast.error(error.message || "Something went wrong");
            return false;
        } finally {
            set({isStartingInterview: false});
        }
    },

    // Legacy Vapi method (kept for compatibility)
    handleCall: async (questions, leetcode, resume, github, name) => {
        return get().startCustomInterview(questions, leetcode, resume, github, name);
    },

    sendUserResponse: (userMessage) => {
        const { isInterviewActive } = get();
        if (!isInterviewActive) {
            toast.error('No active interview session');
            return;
        }

        // Add user message to state
        set((state) => ({
            messages: [...state.messages, {
                role: 'candidate',
                content: userMessage
            }]
        }));

        // Send to server
        interviewSocket.sendUserResponse(userMessage);
    },

    endInterview: () => {
        const { isInterviewActive } = get();
        if (isInterviewActive) {
            interviewSocket.endInterview();
            set({ 
                isInterviewActive: false,
                isListening: false,
                isSpeaking: false
            });
        }
    },

    disconnectInterview: () => {
        interviewSocket.disconnect();
        set({ 
            isInterviewActive: false,
            isListening: false,
            isSpeaking: false,
            messages: []
        });
    },

    createFeedback: async (interviewId, transcript) => {
        set({ isCreatingFeedback: true });
        try {
            const res = await axiosInstance.post("/ai/createFeedback", {
                interviewId,
                transcript
            });
            set({ interviewData: res.data.interview }); 
            set({showInterview:interviewId});
            set((state) => ({
                interviews: [
                    res.data.interview,
                    ...state.interviews.filter(i => i._id !== interviewId)
                ]
            }));
            // Update user in useAuthStore if user data is returned
            if (res.data.user) {
                useAuthStore.getState().set({ user: res.data.user });
            }
            return res.data.interview;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to create feedback");
            return null;
        } finally {
            set({ isCreatingFeedback: false });
        }
    },

    getInterviews: async () => {
        set({ isGettingInterviews: true });
        try {
            const res = await axiosInstance.get('/interview/getInterviews');
            set({ interviews: res.data.interviews });
            if(res.data.interviews.length >0){
                set({showInterview:res.data.interviews[0]._id})
            }
            return res.data.interviews;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch interviews');
            return [];
        } finally {
            set({ isGettingInterviews: false });
        }
    },

}));