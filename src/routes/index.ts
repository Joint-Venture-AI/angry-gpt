import { Router } from 'express';
import { AuthRoutes } from '../app/modules/auth/Auth.route';
import { UserRoutes } from '../app/modules/user/User.route';
import { AdminRoutes } from '../app/modules/admin/Admin.routes';
type TRoute = {
  path: string;
  route: Router;
};

/**
 * Main router for the application
 *
 * This router is the main entry point for all API routes in the application.
 * It aggregates all the routes from different modules and mounts them on the appropriate paths.
 */
const router = Router();

const apiRoutes: TRoute[] = [
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
    route: AdminRoutes,
  },
];

apiRoutes.forEach(({ path, route }) => router.use(path, route));

export default router;
