import { Router } from 'express';
import { OrderController } from './Order.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import Order from './Order.model';

const publicRouter = Router();
const privateRouter = Router();

// create a order
// publicRouter.get('/', OrderController.retrieve);
publicRouter.post('/checkout', OrderController.checkout);

publicRouter.post(
  '/:orderId/cancel',
  purifyRequest(QueryValidations.exists('orderId', Order)),
  OrderController.cancel,
);

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R E A K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */

privateRouter.post(
  '/:orderId/shipped',
  purifyRequest(QueryValidations.exists('orderId', Order)),
  OrderController.shipped,
);

privateRouter.get(
  '/',
  purifyRequest(QueryValidations.list),
  OrderController.list,
);

export const OrderRoutes = {
  user: publicRouter,
  admin: privateRouter,
};
