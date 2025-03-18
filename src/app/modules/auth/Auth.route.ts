import express from 'express';
import { AuthControllers } from './Auth.controller';
import { AuthValidations } from './Auth.validation';
import auth from '../../middlewares/auth';
import { UserControllers } from '../user/User.controller';
import { UserValidations } from '../user/User.validation';
import imageUploader from '../../middlewares/imageUploader';
import purifyRequest from '../../middlewares/purifyRequest';
import { EUserRole } from '../user/User.enum';

const router = express.Router();

router.post(
  '/register',
  purifyRequest(UserValidations.create),
  UserControllers.create,
);

router.patch(
  '/edit',
  auth(EUserRole.USER, EUserRole.ADMIN),
  imageUploader((req, images) => {
    req.body.avatar = images[0];
  }, true),
  purifyRequest(UserValidations.edit),
  UserControllers.edit,
);

router.post('/login', AuthControllers.login);

router.post(
  '/login-with',
  purifyRequest(AuthValidations.loginWithValidationSchema),
  AuthControllers.loginWith,
);

router.post('/logout', AuthControllers.logout);

router.patch(
  '/change-password',
  auth(EUserRole.USER, EUserRole.ADMIN),
  purifyRequest(AuthValidations.passwordChangeValidationSchema),
  AuthControllers.changePassword,
);

router.post('/send-otp', AuthControllers.sendOtp);

router.post('/verify-otp', AuthControllers.verifyOtp);

router.post(
  '/reset-password',
  auth(EUserRole.USER, EUserRole.ADMIN),
  AuthControllers.resetPassword,
);

/**
 * generate new access token
 */
router.get(
  '/refresh-token',
  purifyRequest(AuthValidations.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

export const AuthRoutes = router;
