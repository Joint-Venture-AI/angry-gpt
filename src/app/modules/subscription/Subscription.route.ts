import { Router } from 'express';
import { SubscriptionControllers } from './Subscription.controller';

const adminRoutes = Router();
const userRoutes = Router();

adminRoutes.post('/create', SubscriptionControllers.create);

export const SubscriptionRoutes = {
  admin: adminRoutes,
  user: userRoutes,
};
