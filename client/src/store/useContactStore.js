import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useContactStore = create((set) => ({
    isCreatingContact: false,
    createContact: async (contact) => {
        set({isCreatingContact: true});
        try{
            await axiosInstance.post("/contact/", contact);
            toast.success("Message sent successfully");
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isCreatingContact: false});
        }
    }
}))