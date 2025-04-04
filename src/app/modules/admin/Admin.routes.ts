import { Router } from 'express';
import { SubscriptionRoutes } from '../subscription/Subscription.route';
import { TRoute } from '../../../types/route.types';
import { UserRoutes } from '../user/User.route';
import { BookRoutes } from '../book/Book.route';
import { BotRoutes } from '../bot/Bot.route';
import { TransactionRoutes } from '../transaction/Transaction.route';
import { SettingController } from '../setting/Setting.controller';

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
  {
    path: '/transactions',
    route: TransactionRoutes,
  },
  {
    path: '/settings',
    route: Router().patch('/set', SettingController.modify),
  },
];

export default Router().inject(routes);
