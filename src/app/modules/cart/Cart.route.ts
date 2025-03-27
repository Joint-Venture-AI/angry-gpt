import { Router } from 'express';
import { CartControllers } from './Cart.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import Book from '../book/Book.model';

const router = Router();

router.get('/', CartControllers.retrieve);

router.post(
  '/:bookId/add',
  purifyRequest(QueryValidations.exists('bookId', Book)),
  CartControllers.add,
);

router.delete(
  '/:bookId/remove',
  purifyRequest(QueryValidations.exists('bookId', Book)),
  CartControllers.remove,
);

export const CartRoutes = router;
