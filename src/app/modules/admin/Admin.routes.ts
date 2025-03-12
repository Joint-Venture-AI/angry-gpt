import { Router } from 'express';
import { SubscriptionRoutes } from '../subscription/Subscription.route';
import { TRoute } from '../../../types/route.types';

const routes: TRoute[] = [
  {
    path: '/subscription',
    route: SubscriptionRoutes.admin,
  },
];

export default Router().inject(routes);
