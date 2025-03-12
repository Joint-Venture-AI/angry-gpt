import { Router, RequestHandler } from 'express';
import { AuthRoutes } from '../app/modules/auth/Auth.route';
import { UserRoutes } from '../app/modules/user/User.route';
import { AdminRoutes } from '../app/modules/admin/Admin.routes';
import auth from '../app/middlewares/auth';

type TRoute = {
  path: string;
  middlewares?: Array<RequestHandler>;
  route: Router;
};

/**
 * Main router for the application
 *
 * This router is the main entry point for all API routes in the application.
 * It aggregates all the routes from different modules and mounts them on the appropriate paths.
 */
const router = Router();

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
    middlewares: [auth('ADMIN')],
    route: AdminRoutes,
  },
];

routes.forEach(({ path, middlewares = [], route }) =>
  router.use(path, ...middlewares, route),
);

export default router;
