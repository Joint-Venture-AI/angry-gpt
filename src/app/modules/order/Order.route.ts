import { Router } from 'express';
import { OrderController } from './Order.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { OrderValidation } from './Order.validation';

const publicRouter = Router();
const privateRouter = Router();

// create a order
// publicRouter.get('/', OrderController.retrieve);
publicRouter.post('/checkout', OrderController.checkout);

publicRouter.post(
  '/:orderId/cancel',
  purifyRequest(OrderValidation.exists),
  OrderController.cancel,
);

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R E A K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */

// privateRouter.post('/:id/shipped', OrderController.shipped);
// privateRouter.get('/', OrderController.list);

export const OrderRoutes = {
  user: publicRouter,
  admin: privateRouter,
};
