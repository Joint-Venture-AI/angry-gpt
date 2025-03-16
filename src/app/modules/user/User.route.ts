import { Router } from 'express';
import { UserControllers } from './User.controller';
import imageUploader from '../../middlewares/imageUploader';
import purifyRequest from '../../middlewares/purifyRequest';
import { UserValidations } from './User.validation';

const adminRoutes = Router();
const userRoutes = Router();

adminRoutes.get('/', UserControllers.list);

userRoutes.patch(
  '/edit',
  imageUploader((req, images) => {
    req.body.avatar = images[0];
  }, true),
  purifyRequest(UserValidations.edit),
  UserControllers.edit,
);

export const UserRoutes = {
  admin: adminRoutes,
  user: userRoutes,
};
