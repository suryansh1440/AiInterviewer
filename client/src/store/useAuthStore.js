import { create } from "zustand";

export const useAuthStore = create((set) => ({
  //user: null,
  
  user: {
    _id: 4372894274162791,
    name: "Ankit",
    email: "suryansh1440@gmail.com",
    role: "ADMIN",
    profilePic: "https://randomuser.me/api/portraits/men/75.jpg",
    phone: "+91 3216549870",
    createdAt: "01-01-25",
    lastLogin: "02-03-25",
    level: 1,
    interviewLeft: 1,
    stats: {
      totalInterviews: 12,
      averageScore: "87%",
    },
  },
  

}));
