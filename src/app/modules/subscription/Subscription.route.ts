import { Router } from 'express';
import { SubscriptionControllers } from './Subscription.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { SubscriptionValidations } from './Subscription.validation';

const adminRoutes = Router();
const userRoutes = Router();

adminRoutes.post(
  '/create',
  purifyRequest(SubscriptionValidations.create),
  SubscriptionControllers.create,
);

export const SubscriptionRoutes = {
  admin: adminRoutes,
  user: userRoutes,
};
