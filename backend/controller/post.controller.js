import cloudinary from "../lib/cloudinary.js";
import Post from "../modals/post.modal.js";
import User from "../modals/user.modal.js";
import { io, getUserSocketId } from "../lib/socket.js";

export const createPost = async (req, res) => {
    try {
        const { caption, image, categories } = req.body;
        const userId = req.user._id;
        const profilePic = req.user.profilePic || "";
        const name = req.user.name || "";

        if (!caption || !categories || !Array.isArray(categories) || categories.length === 0) {
            return res.status(400).json({ message: "Caption and categories are required" });
        }

        let imageUrl = image;
        if (image && image.startsWith("data:")) {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                resource_type: "auto",
            });
            imageUrl = uploadResponse.secure_url;
        }

        const post = await Post.create({
            userId,
            caption,
            image: imageUrl,
            profilePic,
            name,
            categories,
            upvotes: [],
            comments: []
        });

        // Emit to all users except the creator, fallback to all if undefined
        const userSocketId = getUserSocketId(userId);
        if (userSocketId) {
            io.except(userSocketId).emit("postCreated", post);
        } else {
            io.emit("postCreated", post);
        }

        res.status(201).json(post);
    } catch (error) {
        console.log("error in createPost", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.log("error in getPosts", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deletePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const { postId } = req.body;
        const post = await Post.findById(postId);
        const user = await User.findById(userId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.userId.toString() !== userId.toString() && user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Unauthorized" });
        }
        await Post.findByIdAndDelete(postId);

        // Emit to all users except the creator, fallback to all if undefined
        const userSocketId = getUserSocketId(userId);
        if (userSocketId) {
            io.except(userSocketId).emit("postDeleted", postId);
        } else {
            io.emit("postDeleted", postId);
        }

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log("error in deletePost", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addUpvote = async (req, res) => {
    try {
        const userId = req.user._id;
        const { postId } = req.body;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.upvotes.includes(userId)) {
            return res.status(400).json({ message: "Already upvoted" });
        }
        post.upvotes.push(userId);
        await post.save();

        // Emit to all users, fallback to all if undefined
        io.emit("upvoteAdded", { postId, userId });

        res.status(200).json({ message: "Upvote added successfully" });
    } catch (error) {
        console.log("error in addUpvote", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const addComment = async (req, res) => {
    try {
        const userId = req.user._id;
        const { postId,text } = req.body;
        const user = await User.findById(userId);
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const comment = {
            userId,
            name: user.name,
            profilePic: user.profilePic,
            comment: text,
            createdAt: new Date()
        }
        post.comments.push(comment);
        await post.save();

        // Emit to all users, fallback to all if undefined
        io.emit("commentAdded", { postId, comment });
        res.status(200).json({ message: "Comment added successfully" });
    } catch (error) {
    }
}
