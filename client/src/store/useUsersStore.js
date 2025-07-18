import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useUsersStore = create((set) => ({
    AllUsers:[],
    isGettingAllUsers:false,


    getAllUsers: async ()=>{
        set({isGettingAllUsers:true});
        try{
            const res = await axiosInstance.post("/auth/get-users");
            set({AllUsers:res.data});

        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isGettingAllUsers:false})
        }

    },
    deleteUser: (_id) => set((state) => ({ AllUsers: state.AllUsers.filter(u => u._id !== _id) })),
}))