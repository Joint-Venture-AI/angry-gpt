import { Router } from 'express';
import { BookController } from './Book.controller';
import { BookValidations } from './Book.validation';
import purifyRequest from '../../middlewares/purifyRequest';
import imageUploader from '../../middlewares/imageUploader';
import { QueryValidations } from '../query/Query.validation';
import Book from './Book.model';

const adminRoutes = Router();

/**
 * Admin Routes
 */
adminRoutes.post(
  '/create',
  imageUploader(
    (req, images) => {
      req.body.images = images;
    },
    {
      width: 390,
      height: 550,
    },
  ),
  purifyRequest(BookValidations.create),
  BookController.create,
);

adminRoutes.patch(
  '/:bookId/edit',
  purifyRequest(QueryValidations.exists('bookId', Book)),
  imageUploader(
    (req, images) => {
      req.body.images = images;
    },
    {
      isOptional: true,
      width: 390,
      height: 550,
    },
  ),
  purifyRequest(BookValidations.update),
  BookController.update,
);

adminRoutes.delete(
  '/:bookId/delete',
  purifyRequest(QueryValidations.exists('bookId', Book)),
  BookController.delete,
);

/**
 * User Routes
 */
const userRoutes = Router();

userRoutes.get(
  '/',
  purifyRequest(QueryValidations.list, BookValidations.list),
  BookController.list,
);

userRoutes.get(
  '/:bookId',
  purifyRequest(QueryValidations.exists('bookId', Book)),
  BookController.retrieve,
);

export const BookRoutes = {
  admin: adminRoutes,
  user: userRoutes,
};
