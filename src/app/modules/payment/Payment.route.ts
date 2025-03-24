import { Router } from 'express';
import { PaymentControllers } from './Payment.controller';

const router = Router();

router.post('/stripe/webhook', PaymentControllers.webhook);

export const PaymentRoutes = router;
