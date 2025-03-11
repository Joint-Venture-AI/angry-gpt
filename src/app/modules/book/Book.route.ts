import { Router } from 'express';
import { BookController } from './Book.controller';
import { BookValidations } from './Book.validation';
import purifyRequest from '../../middlewares/purifyRequest';
import imageUploader from '../../middlewares/imageUploader';
const adminRoutes = Router();
const userRoutes = Router();

/**
 * Admin Routes
 */
adminRoutes.post(
  '/create',
  imageUploader((req, images) => {
    req.body.images = images;
  }),
  purifyRequest(BookValidations.create),
  BookController.create,
);
adminRoutes.patch(
  '/:bookId/edit',
  imageUploader((req, images) => {
    req.body.images = images;
  }, true),
  purifyRequest(BookValidations.edit),
  BookController.edit,
);
adminRoutes.delete('/:bookId/delete', BookController.delete);

/**
 * User Routes
 */
userRoutes.get('/', BookController.list);
userRoutes.get('/:bookId', BookController.retrieve);

export const BookRoutes = {
  admin: adminRoutes,
  user: userRoutes,
};
