import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useInterviewStore = create((set, get) => ({
    resumeData: null,
    messages:['whats your name?','My name is john Doe, nice to meet you'],
    randomTopic:[],
    isGettingResume:false,
    isGettingRandomTopic: false,


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

}));