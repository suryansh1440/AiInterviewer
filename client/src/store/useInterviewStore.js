import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
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
        console.log('Starting custom interview...');
        set({isStartingInterview: true});
        const { user, socket } = useAuthStore.getState();
        const { interviewData } = get();
        
        if (!interviewData) {
            toast.error('No interview data available');
            set({isStartingInterview: false});
            return false;
        }
        
        if (!user) {
            toast.error('User not authenticated');
            set({isStartingInterview: false});
            return false;
        }

        if (!socket) {
            toast.error('Socket not connected');
            set({isStartingInterview: false});
            return false;
        }
        
        try {
            // Ensure questions is always an array
            const questionsArr = Array.isArray(questions) ? questions : [];
            
            // Get topic, subtopic, and level from interviewData or use defaults
            const topic = interviewData.topic || interviewData.interview?.topic || 'Technical Interview';
            const subTopic = interviewData.subTopic || interviewData.interview?.subTopic || 'General Questions';
            const level = interviewData.level || interviewData.interview?.level || 'medium';
            
            const interviewSessionData = {
                questions: questionsArr,
                leetcode: leetcode || 'N/A',
                resume: resume || 'N/A',
                github: github || 'N/A',
                name: name || user?.name || 'Candidate',
                topic: topic,
                subTopic: subTopic,
                level: level
            };

            // Step 1: Unsubscribe from any existing interview
            console.log('Unsubscribing from existing interview...');
            await get().unsubscribeFromInterview();
            
            // Step 2: Subscribe to interview events
            console.log('Subscribing to interview events...');
            await get().subscribeToInterview();
            
            // Step 3: Start the interview
            console.log('Starting interview...');
            const success = await get().startInterview();
            
            if (success) {
                set({ isStartingInterview: false });
                return true;
            } else {
                set({ isStartingInterview: false });
                return false;
            }

        } catch (error) {
            console.log('Custom interview start error', error);
            toast.error(error.message || "Something went wrong");
            set({isStartingInterview: false});
            return false;
        }
    },
    
    subscribeToInterview: async ()=>{
        const { socket, user } = useAuthStore.getState();
        if(!socket || !user){
            toast.error("Socket not connected");
            return false;
        }
        
        console.log('Subscribing to interview events...');
        
        // Reset messages and session
        set({messages:[]});
        set({currentInterviewSession:null});
        
        // Listen for interview responses
        socket.on("send-interview-response", (data) => {
            console.log("Interview response received:", data);
            set((state) => ({
                messages: [...state.messages, {
                    role: data.role,
                    content: data.content,
                    isInterviewEnd: data.isInterviewEnd,
                    type: data.type
                }]
            }));
        });

        // Listen for interview errors
        socket.on("interview-error", (data) => {
            console.error("Interview error:", data);
            toast.error(data.message || 'Interview error occurred');
            set({ 
                isInterviewActive: false,
                isStartingInterview: false
            });
        });

        // Listen for interview completion
        socket.on("interview-complete", (data) => {
            console.log("Interview completed:", data);
            set({ isInterviewActive: false });
            // Interview completed - feedback will be created manually when user ends interview
            // You can add additional logic here if needed
        });
        
        return true;
    },

    unsubscribeFromInterview: async ()=>{
        const { socket } = useAuthStore.getState();
        if(!socket){
            return false;
        }
        
        console.log('Unsubscribing from interview events...');
        
        socket.off("send-interview-response");
        socket.off("interview-error");
        socket.off("interview-complete");
        
        return true;
    },

    sendUserMessage: async (message)=>{
        const { socket, user } = useAuthStore.getState();
        if(!socket){
            toast.error("Socket not connected in sendUserMessage");
            return false;
        }
        
        console.log('Sending user message:', message);
        
        // Add user message to state
        set((state) => ({
            messages: [...state.messages, {
                role: 'candidate',
                content: message
            }]
        }));
        
        socket.emit("send-user-message", {
            userId: user._id,
            message: message
        });
        
        return true;
    },

    // Legacy method for compatibility
    sendUserResponse: async (message) => {
        return get().sendUserMessage(message);
    },

    startInterview: async ()=>{
        const { socket, user } = useAuthStore.getState();
        if(!socket){
            toast.error("Socket not connected in startInterview");
            return false;
        }
        
        console.log('Starting interview with data:', get().interviewData);
        
        set({isInterviewActive:true});
        set({messages:[]});
        set({currentInterviewSession:null});
        
        socket.emit("start-interview", {
            interviewData: get().interviewData,
            userId: user._id,
        });
        
        return true;
    },

    endInterview: async ()=>{
        const { socket } = useAuthStore.getState();
        if(!socket){
            toast.error("Socket not connected in endInterview");
            return false;
        }
        
        console.log('Ending interview...');
        
        socket.emit("end-interview");
        set({isInterviewActive:false});
        set({messages:[]});
        set({currentInterviewSession:null});
        set({interviewData:null});
        
        return true;
    },

    // Complete reset of interview state
    resetInterviewState: () => {
        console.log('Resetting interview state completely');
        const { socket } = useAuthStore.getState();
        if (socket) {
            get().unsubscribeFromInterview();
        }
        set({
            isInterviewActive: false,
            messages: [],
            interviewData: null,
            isStartingInterview: false,
            isCreatingFeedback: false,
            showInterview: null
        });
    },

    disconnectInterview: () => {
        console.log('Disconnecting interview...');
        const { socket } = useAuthStore.getState();
        if (socket) {
            get().unsubscribeFromInterview();
        }
        set({ 
            isInterviewActive: false,
            messages: [],
            interviewData: null,
            isStartingInterview: false,
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
                useAuthStore.getState().user=res.data.user;
            }
            return res.data.interview;
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to create feedback");
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