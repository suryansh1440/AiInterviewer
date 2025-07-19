import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useInterviewStore = create((set) => ({
    resumeData: null,

    readResume: async (url) => {
        try{
            const res = await axiosInstance.post("/ai/readPdf",{url});
            set({resumeData:res.data.text})
        }catch(error){
            toast.error(error.response.data.message);
        }
    },
}));