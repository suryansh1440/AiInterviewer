import { create } from "zustand";

export const useAuthStore = create((set) => ({
    // user: null ,
   user: {
    name: "Suryansh Singh",
    email: "suryansh1440@gmail.com",
    role:"ADMIN",
    profilePic: "https://randomuser.me/api/portraits/men/75.jpg",
    createdAt: "01-01-25",
    lastLogin: "02-03-23",
    level: 1,
    interviewLeft:10,
    phone: "+91 3216549870",
    stats: {
      totalInterviews: 12,
      averageScore: "87%",
    }
  },

}))