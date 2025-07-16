import { create } from "zustand";

export const useModalStore = create((set) => ({
    isOpenLogin: false,
    setOpenLogin: ()=>{set({isOpenLogin:true})},
    setCloseLogin: ()=>{set({isOpenLogin:false})},
    
}))