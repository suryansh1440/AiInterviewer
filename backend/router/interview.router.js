import { Router } from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getInterviews } from '../controller/interview.controller.js';

const router = Router();

router.get("/getInterviews",protectRoute,getInterviews)

export default router;