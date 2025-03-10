import { Router } from 'express';
import { AuthRoutes } from '../app/modules/auth/Auth.route';
import { UserRoutes } from '../app/modules/user/User.route';

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
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
