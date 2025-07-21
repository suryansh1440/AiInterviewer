import { Router } from 'express';
import { createFeedback, generateQuestion, getRandomTopic, readPdf } from '../controller/ai.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/readPdf', readPdf);
router.post('/getRandomTopic',protectRoute,getRandomTopic);
router.post('/generateQuestion',protectRoute ,generateQuestion)
router.post('/createFeedback',protectRoute,createFeedback)


export default router;