import { create } from "zustand";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  user: null,
  
  // user: {
  //   _id: 4372894274162791,
  //   name: "Ankit",
  //   email: "suryansh1440@gmail.com",
  //   role: "ADMIN",
  //   profilePic: "https://randomuser.me/api/portraits/men/75.jpg",
  //   phone: "+91 3216549870",
  //   freeInterview:"claimed",
  //   subscription:"none",
  //   stats: {
  //     totalInterviews: 12,
  //     averageScore: "87%",
  //     level: 1,
  //     levelProgress:0,
  //   },
  //   interviewLeft:10,
  //   interviewLeftExpire:null,
  //   lastLogin: "02-03-25",
  //   createdAt: "01-01-25",
  //   updatedAt: "01-01-25",
  // },
  login : async(data)=>{
    toast.success("Logged in success")
  }
  

}));
