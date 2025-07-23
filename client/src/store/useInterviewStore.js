import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { vapi } from '../lib/vapi.sdk';
import { interviewer } from '../constant';
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
            return null;
        }finally{
            set({isGettingResume:false})
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

    handleCall: async (questions) => {
        set({isStartingInterview:true})
        const { interviewData } = get();
        if (!interviewData) {
            throw new Error('No interview data set');
        }
        try {
            let formattedQuestions = "";
            if (questions) {
                formattedQuestions = questions
                  .map((question) => `- ${question}`)
                  .join("\n");
            }
            await vapi.start(
                interviewer,
                {
                    variableValues: {
                        questions: formattedQuestions,
                    }
                }
            );
            return true;
        } catch (error) {
            console.log('Vapi start error', error);
            toast.error(error.response?.data?.message || "Something went wrong");
            return false;
        }finally{
            set({isStartingInterview:false})
        }
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
                useAuthStore.getState().setUser(res.data.user);
            }
            return res.data.interview;
        } catch (error) {
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