import { RequestHandler, Router } from 'express';

export type TRoute = {
  path: string;
  middlewares?: Array<RequestHandler>;
  route: Router;
};
