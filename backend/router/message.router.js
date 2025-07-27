import Router from 'express'
import { sendMessage, getMessages, getUserForSidebar } from '../controller/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = Router()

router.post("/sendMessage",protectRoute,sendMessage);
router.get("/getUserForSidebar",protectRoute,getUserForSidebar);
router.get("/getMessages",protectRoute,getMessages);

export default router;


