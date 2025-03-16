import { Router } from 'express';
import { SubscriptionRoutes } from '../subscription/Subscription.route';
import { TRoute } from '../../../types/route.types';
import { UserRoutes } from '../user/User.route';

const routes: TRoute[] = [
  {
    path: '/subscription',
    route: SubscriptionRoutes.admin,
  },
  {
    path: '/users',
    route: UserRoutes.admin,
  },
];

export default Router().inject(routes);
