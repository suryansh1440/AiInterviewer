import { create } from "zustand";
import {axiosInstance} from "../lib/axios";
import toast from "react-hot-toast";

export const useMessageStore = create((set,get) => ({
    messages: [],
    users: [],
    onlineUsers:[],
    selectedUser:null,
    isSendingMessage:false,
    isGettingMessage:false,
    isGettingUsers:false,

    setSelectedUser:(user) => {
        set({selectedUser:user})
    },  

    getMessages: async () => {
        set({isGettingMessage:true})
        try{
            const res = await axiosInstance.get("/message/getMessages");
            set({messages:res.data})
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isGettingMessage:false})
        }
    },
    getUsers: async () => {
        set({isGettingUsers:true})
        try{
            const res = await axiosInstance.get("/message/getUserForSidebar");
            set({users:res.data})
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isGettingUsers:false})
        }
    },
    sendMessage: async (message) => {
        set({isSendingMessage:true})
        try{
            const res = await axiosInstance.post("/message/sendMessage",message)
            set({messages:[...get().messages,res.data]})
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isSendingMessage:false})
        }


    }

}))