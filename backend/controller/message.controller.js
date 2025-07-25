import Message from "../modals/message.modal.js";
import User from "../modals/user.modal.js";

export const getMessages = async (req,res) => {
    try {
        const messages = await Message.find({
            $or: [
                { senderId: req.user._id },
                { receiverId: req.user._id }
            ]
        }).populate("senderId receiverId")
        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json(error.message)
    }
}

export const sendMessage = async (req,res) => {
    try {
        const {receiverId,text,image} = req.body;
        const message = new Message({
            senderId: req.user._id,
            receiverId,
            text,
            image,
        })
        await message.save();
        // socket io implementation todo
        res.status(200).json(message)
    } catch (error) {
        res.status(500).json(error.message)
    }
}

export const getUserForSidebar = async (req,res) => {
    try {
        // Find all unique users that the current user has chatted with
        const messages = await Message.find({
            $or: [
                { senderId: req.user._id },
                { receiverId: req.user._id }
            ]
        });
        
        // Extract unique user IDs from messages
        const userIds = new Set();
        
        messages.forEach(message => {
            // If the current user is the sender, add the receiver
            if (message.senderId.toString() === req.user._id.toString()) {
                userIds.add(message.receiverId.toString());
            }
            // If the current user is the receiver, add the sender
            else if (message.receiverId.toString() === req.user._id.toString()) {
                userIds.add(message.senderId.toString());
            }
        });
        
        // Convert Set to Array for the query
        const userIdsArray = Array.from(userIds);
        
        // Find users by the extracted IDs
        const users = await User.find({
            _id: { $in: userIdsArray }
        }).select('-password');
        
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getUserForSidebar:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}