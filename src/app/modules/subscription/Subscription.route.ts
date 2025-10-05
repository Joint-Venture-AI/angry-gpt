import { Router } from 'express';
import { SubscriptionControllers } from './Subscription.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { SubscriptionValidations } from './Subscription.validation';
import { QueryValidations } from '../query/Query.validation';

const admin = Router();
const user = Router();

admin.post(
  '/create',
  purifyRequest(SubscriptionValidations.create),
  SubscriptionControllers.create,
);

user.get(
  '/',
  purifyRequest(QueryValidations.list),
  SubscriptionControllers.list,
);

export const SubscriptionRoutes = {
  admin,
  user,
};
