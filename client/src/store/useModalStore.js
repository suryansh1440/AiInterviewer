import { create } from "zustand";

export const useModalStore = create((set) => ({
    isOpenModal: false,
    setOpenModal: ()=>{set({isOpenModal:true})},
    setCloseModal: ()=>{set({isOpenModal:false})},
    
}))