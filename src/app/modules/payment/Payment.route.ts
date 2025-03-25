import { Router } from 'express';
import { PaymentControllers } from './Payment.controller';

export const PaymentRoutes = Router().post(
  '/stripe/webhook',
  PaymentControllers.webhook,
);
