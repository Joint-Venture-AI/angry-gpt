import { Router } from 'express';
import { OrderController } from './Order.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import Order from './Order.model';
import { OrderValidation } from './Order.validation';

const publicRouter = Router();
const privateRouter = Router();

publicRouter.get(
  '/',
  purifyRequest(QueryValidations.list),
  OrderController.list,
);

publicRouter.get(
  '/:orderId',
  purifyRequest(QueryValidations.exists('orderId', Order)),
  OrderController.retrieve,
);

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

privateRouter.patch(
  '/:orderId/:state',
  purifyRequest(
    QueryValidations.exists('orderId', Order),
    OrderValidation.state,
  ),
  OrderController.changeState,
);

export const OrderRoutes = {
  user: publicRouter,
  admin: privateRouter,
};
