import { create } from "zustand";
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios.js"
import { useUsersStore } from './useUsersStore';
import { useInterviewStore } from './useInterviewStore';
import { io } from "socket.io-client";

export const useAuthStore = create((set,get) => ({
  user: null,
  isLoggingIn:false,
  isSigningUp:false,
  isUpdatingProfile: false,
  isChangePassword: false,
  isCheckingAuth:false,
  isDeletingAccount: false,
  socket : null,


  
  checkAuth: async()=>{
    set({isCheckingAuth:true})
    try{
        const res = await axiosInstance.get("/auth/check");
        set({user:res.data})

        get().connectSocket()

    }catch(error){
        console.log("Error in checkAuth",error)
        set({user:null})
    }finally{
        set({isCheckingAuth:false})
    }
},

  signup : async(data)=>{
    set({isSigningUp:true});
    try{
      const res = await axiosInstance.post("/auth/signup",data);
      set({user:res.data});
      toast.success("Account created Successfully");
      get().connectSocket()

    }catch(error){
      toast.error(error.response.data.message);
    }finally{
      set({isSigningUp:false})
    }
  },

  login : async(data)=>{
    set({isLoggingIn:true});
    try{
      const res = await axiosInstance.post("/auth/login",data);
      set({user:res.data});
      toast.success("Logged in successfully")
      get().connectSocket()
    }catch(error){
      toast.error(error.response.data.message);
    }finally{
      set({isLoggingIn:false});
    }    
  },

  googleLogin : async(credential)=>{
    set({isLoggingIn:true});
    try{
      const res = await axiosInstance.post("/auth/google-login", { credential });
      set({user:res.data});
      toast.success("Logged in with Google");
      get().connectSocket()
    }catch(error){
      toast.error(error.response?.data?.message || "Google login failed");
    }finally{
      set({isLoggingIn:false});
    }
  },

  logout: async()=>{
    try{
      await axiosInstance.post("/auth/logout")
      set({user:null})
      // Clear AllUsers
      useUsersStore.getState().AllUsers = [];
      // Clear interview-related data
      useInterviewStore.getState().interviews = [];
      useInterviewStore.getState().randomTopic = [];
      useInterviewStore.getState().interviewData = null;
      useInterviewStore.getState().resumeData = null;
      toast.success("Logged out successfully")
      get().disconnectSocket()
    }catch(error){
      toast.error(error.response.data.message)
    }
  },

  changePassword: async(data)=>{
    set({isChangePassword:true})
    try{
      await axiosInstance.put("/auth/changePassword",data);
      toast.success("Password changed successfully");

    }catch(error){
      toast.error(error.response.data.message)
    }finally{
      set({isChangePassword:false})
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ user: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  deleteAccount: async (data) => {
    set({ isDeletingAccount: true });
    try {
      await axiosInstance.post("/auth/delete-account",data);
      set({ user: null });
      toast.success("Account deleted successfully");
      get().disconnectSocket()
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      set({ isDeletingAccount: false });
    }
  },

  connectSocket: async()=>{
        const {user} = get();
        if(!user || get().socket?.connected) return;
        const socket = io(import.meta.env.VITE_BACKEND_URL,{
            query:{
                userId: user._id,
            }
        })
        socket.connect()
        set({socket})
  },
  disconnectSocket: async()=>{
    if(get().socket?.connected){
      get().socket.disconnect()
      set({socket:null})
    }
  }
  

}));
