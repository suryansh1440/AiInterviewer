import { Router } from 'express';
import { addApi, getAllApis, overUsage, resetApi } from '../controller/api.controller.js';

const router = Router();

router.post('/addApi', addApi);
router.get('/getAllApis', getAllApis);
router.post('/overUsage', overUsage);
router.post('/resetApi', resetApi);

export default router;