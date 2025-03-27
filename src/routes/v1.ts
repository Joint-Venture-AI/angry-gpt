import { Router } from 'express';
import { AuthRoutes } from '../app/modules/auth/Auth.route';
import { UserRoutes } from '../app/modules/user/User.route';
import auth from '../app/middlewares/auth';
import { EUserRole } from '../app/modules/user/User.enum';
import { TRoute } from '../types/route.types';
import AdminRoutes from '../app/modules/admin/Admin.routes';
import { BookRoutes } from '../app/modules/book/Book.route';
import { OrderRoutes } from '../app/modules/order/Order.route';
import { ChatRoutes } from '../app/modules/chat/Chat.route';
import { PaymentRoutes } from '../app/modules/payment/Payment.route';
import { BotRoutes } from '../app/modules/bot/Bot.route';
import { CartRoutes } from '../app/modules/cart/Cart.route';

const routes: TRoute[] = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/profile',
    middlewares: [auth(EUserRole.USER, EUserRole.ADMIN)],
    route: UserRoutes.user,
  },
  {
    path: '/admin',
    middlewares: [auth(EUserRole.ADMIN)],
    route: AdminRoutes,
  },
  {
    path: '/books',
    route: BookRoutes.user,
  },
  {
    path: '/orders',
    middlewares: [auth(EUserRole.USER, EUserRole.ADMIN)],
    route: OrderRoutes,
  },
  {
    path: '/chats',
    middlewares: [auth(EUserRole.USER, EUserRole.ADMIN)],
    route: ChatRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoutes,
  },
  {
    path: '/bots',
    middlewares: [auth(EUserRole.USER, EUserRole.ADMIN)],
    route: BotRoutes.user,
  },
  {
    path: '/cart',
    middlewares: [auth(EUserRole.USER, EUserRole.ADMIN)],
    route: CartRoutes,
  },
];

export default Router().inject(routes);
