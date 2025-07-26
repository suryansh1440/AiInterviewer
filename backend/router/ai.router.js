import { Router } from 'express';
import { createFeedback, generateQuestion, getRandomTopic, readPdf ,getLeetCodeAnalysis, generateProjectQuestions} from '../controller/ai.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/readPdf', readPdf);
router.post('/getRandomTopic',protectRoute,getRandomTopic);
router.post('/generateQuestion',protectRoute ,generateQuestion)
router.post('/createFeedback',protectRoute,createFeedback)
router.post('/getLeetCodeAnalysis',protectRoute,getLeetCodeAnalysis)
router.post('/project-questions', generateProjectQuestions);


export default router;