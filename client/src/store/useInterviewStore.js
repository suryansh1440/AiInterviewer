import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { vapi } from '../lib/vapi.sdk';

export const useInterviewStore = create((set, get) => ({
    interviewData: null,
    resumeData: null,
    randomTopic:[],
    isGettingResume:false,
    isGettingRandomTopic: false,
    isGeneratingQuestion: false,
    isStartingInterview:false,

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

    handleCall: async (user) => {
        set({isStartingInterview:true})
        const { interviewData } = get();
        if (!interviewData) {
            throw new Error('No interview data set');
        }
        try {
            await vapi.start(
                undefined,
                undefined,
                undefined,
                import.meta.env.VITE_PUBLIC_VAPI_WORKFLOW_ID,{
                variableValues: {
                    userid: user._id,
                    username: user.name,
                },
            });
            return true;
        } catch (error) {
            console.log('Vapi start error', error);
            toast.error(error.response?.data?.message || "Something went wrong");
            return false;
        }finally{
            set({isStartingInterview:false})
        }
    },

}));