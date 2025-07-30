import { Router } from 'express';
import { addApi, getAllApis, overUsage, resetApi, deleteApi } from '../controller/api.controller.js';

const router = Router();

router.post('/addApi', addApi);
router.get('/getAllApis', getAllApis);
router.post('/overUsage', overUsage);
router.post('/resetApi', resetApi);
router.delete('/deleteApi', deleteApi);

export default router;