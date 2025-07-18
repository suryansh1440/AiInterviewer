import { create } from "zustand";
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios.js"


export const useAuthStore = create((set) => ({
  user: null,
  isLoggingIn:false,
  isSigningUp:false,
  isUpdatingProfile: false,
  isChangePassword: false,
  isCheckingAuth:false,


  
  checkAuth: async()=>{
    set({isCheckingAuth:true})
    try{
        const res = await axiosInstance.get("/auth/check");
        set({user:res.data})

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
    }catch(error){
      toast.error(error.response.data);
    }finally{
      set({isLoggingIn:false});
    }    
  },

  logout: async()=>{
    try{
      await axiosInstance.post("/auth/logout")
      set({user:null})
      toast.success("Logged out successfully")

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
  }
  

}));
