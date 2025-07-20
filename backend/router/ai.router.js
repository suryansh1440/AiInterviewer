import { Router } from 'express';
import { generateQuestion, getRandomTopic, readPdf } from '../controller/ai.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/readPdf', readPdf);
router.post('/getRandomTopic',protectRoute,getRandomTopic);
router.post('/generateQuestion',protectRoute ,generateQuestion)


export default router;