import { create } from "zustand";

export const useUsersStore = create((set) => ({
    AllUsers:[
        {
            _id: "u1",
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
            createdAt: "2024-01-15T10:23:00Z",
            level: 2, // Intermediate
            subscription: "starter"
        },
        {
            _id: "u2",
            name: "Bob Smith",
            email: "bob.smith@example.com",
            profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
            createdAt: "2023-12-10T14:45:00Z",
            level: 1, // Beginner
            subscription: "none"
        },
        {
            _id: "u3",
            name: "Clara Lee",
            email: "clara.lee@example.com",
            profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
            createdAt: "2024-02-20T09:10:00Z",
            level: 3, // Advanced
            subscription: "pro"
        },
        {
            _id: "u4",
            name: "David Kim",
            email: "david.kim@example.com",
            profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
            createdAt: "2024-03-05T16:30:00Z",
            level: 2, // Intermediate
            subscription: "starter"
        },
        {
            _id: "u5",
            name: "Eva Green",
            email: "eva.green@example.com",
            profilePic: "https://randomuser.me/api/portraits/women/5.jpg",
            createdAt: "2024-01-28T12:00:00Z",
            level: 1, // Beginner
            subscription: "none"
        },
        {
            _id: "u6",
            name: "Frank Miller",
            email: "frank.miller@example.com",
            profilePic: "https://randomuser.me/api/portraits/men/6.jpg",
            createdAt: "2024-04-01T08:15:00Z",
            level: 3, // Advanced
            subscription: "pro"
        }
    ],
    deleteUser: (_id) => set((state) => ({ AllUsers: state.AllUsers.filter(u => u._id !== _id) })),
}))