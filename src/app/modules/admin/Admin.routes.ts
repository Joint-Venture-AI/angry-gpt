import { Router } from 'express';
import { SubscriptionRoutes } from '../subscription/Subscription.route';
import { TRoute } from '../../../types/route.types';
import { UserRoutes } from '../user/User.route';
import { BookRoutes } from '../book/Book.route';
import { BotRoutes } from '../bot/Bot.route';

const routes: TRoute[] = [
  {
    path: '/subscription',
    route: SubscriptionRoutes.admin,
  },
  {
    path: '/users',
    route: UserRoutes.admin,
  },
  {
    path: '/books',
    route: BookRoutes.admin,
  },
  {
    path: '/bots',
    route: BotRoutes.admin,
  },
];

export default Router().inject(routes);
