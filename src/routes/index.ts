import { Router } from 'express';
import { AuthRoutes } from '../app/modules/auth/Auth.route';
import { UserRoutes } from '../app/modules/user/User.route';
import { AdminRoutes } from '../app/modules/admin/Admin.routes';
import auth from '../app/middlewares/auth';
import { EUserRole } from '../app/modules/user/User.enum';
import { TRoute } from '../types/route.types';

const routes: TRoute[] = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/admin',
    middlewares: [auth(EUserRole.ADMIN)],
    route: AdminRoutes,
  },
];

export default Router().inject(routes);
