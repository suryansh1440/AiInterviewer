import Router from 'express';
import { processPayment, getKey, claimFree, paymentVerification } from '../controller/payment.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/process', protectRoute,processPayment);
router.get('/getKey', protectRoute,getKey);
router.post('/claimFree', protectRoute,claimFree);
router.post('/paymentVerification', paymentVerification);

export default router;