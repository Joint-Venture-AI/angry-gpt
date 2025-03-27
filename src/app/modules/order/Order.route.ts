import { Router } from 'express';
import { OrderController } from './Order.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import Order from './Order.model';
import { OrderValidation } from './Order.validation';

const router = Router();

router.get(
  '/',
  purifyRequest(QueryValidations.list, OrderValidation.list),
  OrderController.list,
);

router.get(
  '/:orderId',
  purifyRequest(QueryValidations.exists('orderId', Order)),
  OrderController.retrieve,
);

router.post(
  '/checkout',
  purifyRequest(OrderValidation.checkout),
  OrderController.checkout,
);

router.patch(
  '/:orderId/:state',
  purifyRequest(
    QueryValidations.exists('orderId', Order),
    OrderValidation.state,
  ),
  OrderController.changeState,
);

export const OrderRoutes = router;
