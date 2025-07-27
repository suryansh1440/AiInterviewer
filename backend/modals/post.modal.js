import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    profilePic: {
        type: String
    },
    name: {
        type: String
    },
    categories: [{ type: String }],
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.Mixed }], // Array of plain objects
}, { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
export default Post; 