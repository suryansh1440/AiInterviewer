import { Router } from 'express';
import { getRandomTopic, readPdf } from '../controller/ai.controller.js';

const router = Router();

router.post('/readPdf', readPdf);
router.post('/getRandomTopic', getRandomTopic);


export default router;