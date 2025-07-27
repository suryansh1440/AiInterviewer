import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";


export const usePostStore = create((set, get) => ({
    posts: [],
    isGettingPosts: false,
    isCreatingPost: false,
    isDeletingPost: false,
    isAddingUpvote: false,
    isAddingComment: false,
    postBuffer: [],




    setPosts: (posts) => { set({ posts }) },
    // storing post from socket 
    setPostBuffer: (postBuffer) => { set({ postBuffer }) },
    // empty post from buffer and adding to posts 
    emptyPostBuffer: () => {
        if (get().postBuffer.length > 0) {
            set({ posts: [...get().postBuffer, ...get().posts] });
            set({ postBuffer: [] });
        }
    },

    getPosts: async () => {
        set({ isGettingPosts: true });
        try {
            const res = await axiosInstance.get("/post/get");
            set({ posts: res.data });
        } catch (error) {
            toast.error("Failed to get posts");
        } finally {
            set({ isGettingPosts: false });
        }
    },

    createPost: async (post) => {
        set({ isCreatingPost: true });
        try {
            const res = await axiosInstance.post("/post/create", post);
            set({ posts: [res.data, ...get().posts] }); // Add new post to the beginning
            toast.success("Post created successfully");
        } catch (error) {
            toast.error("Failed to create post");
        } finally {
            set({ isCreatingPost: false });
        }
    },
    deletePost: async (postId) => {
        set({ isDeletingPost: true });
        try {
            await axiosInstance.delete("/post/delete", { data: { postId } });
            set({ posts: get().posts.filter((post) => post._id !== postId) });
            toast.success("Post deleted successfully");
        } catch (error) {
            toast.error("Failed to delete post");
        } finally {
            set({ isDeletingPost: false });
        }
    },
    addUpvote: async (postId) => {
        set({ isAddingUpvote: true });
        try {
            const res = await axiosInstance.post("/post/upvote", { postId });
            const updatedPost = res.data;
            set({ posts: get().posts.map((post) => post._id === postId ? updatedPost : post) });
        } catch (error) {

        } finally {
            set({ isAddingUpvote: false });
        }
    },
    addComment: async (data) => {
        set({ isAddingComment: true });
        try {
            const res = await axiosInstance.post("/post/comment", data);
            const updatedPost = res.data;
            set({ posts: get().posts.map((post) => post._id === data.postId ? updatedPost : post) });
        } catch (error) {
            
            toast.error("Failed to add comment");
        } finally {
            set({ isAddingComment: false });
        }
    },
    subscribeToPost: () => {
        const { user } = useAuthStore.getState();
        const socket = useAuthStore.getState().socket;
        if (!user || !socket) return;

        socket.on("postCreated", (post) => {
            set({ postBuffer: [post, ...get().postBuffer] });
        });
    },
    unsubscribeFromPost: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.off("postCreated");
    }


}))