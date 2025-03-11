import { Router } from 'express';
import { PaymentControllers } from './Payment.controller';
import bodyParser from 'body-parser';

const router = Router();

router.post(
  '/stripe/webhook',
  bodyParser.raw({ type: 'application/json' }),
  PaymentControllers.webhook,
);

export const PaymentRoutes = router;
