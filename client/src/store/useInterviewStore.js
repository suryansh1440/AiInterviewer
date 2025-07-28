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
        const { user } = useAuthStore.getState();
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

            // Connect to socket
            interviewSocket.connect(user._id);
            
            // Set up disconnect handler
            interviewSocket.onDisconnect(() => {
                console.log('Socket disconnected');
                set({ isInterviewActive: false });
            });
            
            // Set up event handlers
            interviewSocket.onMessage((data) => {
                // Log the full AI interviewer response object
                if (data.role === 'interviewer') {
                    console.log('AI Interviewer Response:', data);
                }
                set((state) => ({
                    messages: [...state.messages, {
                        role: data.role,
                        content: data.content,
                        isInterviewEnd: data.isInterviewEnd,
                        type: data.type
                    }]
                }));
            });

            interviewSocket.onError((error) => {
                console.error('Interview error:', error);
                toast.error(error.message || 'Interview error occurred');
                set({ 
                    isInterviewActive: false,
                    isStartingInterview: false
                });
            });

            interviewSocket.onComplete((data) => {
                set({ isInterviewActive: false });
                // Interview completed - feedback will be created manually when user ends interview
                console.log('Interview completed with conversation history:', data.conversationHistory);
                // Disconnect socket after completion
                interviewSocket.disconnect();
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
            set({isStartingInterview: false});
            return false;
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
            // Reset all interview-related state
            set({ 
                isInterviewActive: false,
                messages: [],
                interviewData: null,
                isStartingInterview: false,
            });
            // Ensure socket is disconnected after ending interview
            setTimeout(() => {
                interviewSocket.disconnect();
            }, 1000); // Small delay to ensure end-interview event is sent
        }
    },

    disconnectInterview: () => {
        interviewSocket.disconnect();
        // Reset all interview-related state
        set({ 
            isInterviewActive: false,
            messages: [],
            interviewData: null,
            isStartingInterview: false,
        });
    },

    // Complete reset of interview state
    resetInterviewState: () => {
        interviewSocket.forceCleanup();
        set({
            isInterviewActive: false,
            messages: [],
            interviewData: null,
            isStartingInterview: false,
            isCreatingFeedback: false,
            showInterview: null
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