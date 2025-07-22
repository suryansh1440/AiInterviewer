import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const usePaymentStore = create((set) => ({
    isCheckoutLoading: false,
    isFreeClaimed: false,

    claimFree: async ()=>{
        set({isCheckoutLoading:true});
        try{
            await axiosInstance.post("/payment/claimFree");
            toast.success("Free interview claimed successfully");
            set({isFreeClaimed:true});
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isCheckoutLoading:false});
        }
    },
    processPayment: async (data)=>{
        set({isCheckoutLoading:true});
        try{
            const res = await axiosInstance.post("/payment/process",data);
            return res.data;
        }catch(error){
            toast.error(error.response.data.message);
            return null;
        }finally{
            set({isCheckoutLoading:false});
        }
    },
    getKey: async ()=>{
        set({isCheckoutLoading:true});
        try{
            const res = await axiosInstance.get("/payment/getKey");
            return res.data;
        }catch(error){
            toast.error(error.response.data.message);
            return null;
        }finally{
            set({isCheckoutLoading:false});
        }
    }
}))