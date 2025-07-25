import { Router } from "express";
import { createPost, getPosts, deletePost , addUpvote, addComment} from "../controller/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const router = Router();

router.get("/get",getPosts);
router.post("/create",protectRoute, createPost);
router.delete("/delete",protectRoute, deletePost);
router.post("/upvote",protectRoute, addUpvote);
router.post("/comment",protectRoute, addComment);

export default router;