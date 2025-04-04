import { Router } from 'express';
import { CartControllers } from './Cart.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import Book from '../book/Book.model';
import { CartValidations } from './Cart.validation';

const router = Router();

router.get('/', CartControllers.retrieve);

router.patch(
  '/:bookId',
  purifyRequest(
    QueryValidations.exists('bookId', Book),
    CartValidations.update,
  ),
  CartControllers.update,
);

router.delete(
  '/:bookId/remove',
  purifyRequest(QueryValidations.exists('bookId', Book)),
  CartControllers.remove,
);

export const CartRoutes = router;
