import { AuthServices } from './Auth.service';
import catchAsync from '../../../shared/catchAsync';
import config from '../../../config';
import serveResponse from '../../../shared/serveResponse';
import { verifyToken } from './Auth.utils';

export const AuthController = {
  login: catchAsync(async ({ body }, res) => {
    const { accessToken, refreshToken, user } = await AuthServices.login(body);

    res.cookie('refreshToken', refreshToken, {
      secure: config.server.node_env !== 'development',
      maxAge: verifyToken(refreshToken, 'refresh').exp! * 1000,
      httpOnly: true,
    });

    serveResponse(res, {
      message: 'Login successfully!',
      data: { token: accessToken, user },
    });
  }),

  logout: catchAsync(async (_req, res) => {
    ['refreshToken', 'resetToken'].forEach(token => {
      res.cookie(token, '', {
        secure: config.server.node_env !== 'development',
        maxAge: 0,
        httpOnly: true,
      });
    });

    serveResponse(res, {
      message: 'Logged out successfully',
    });
  }),

  changePassword: catchAsync(async (req, res) => {
    await AuthServices.changePassword(req.user._id!, req.body);

    serveResponse(res, {
      message: 'Password has changed successfully!',
    });
  }),

  // forgetPassword: catchAsync(async (req, res) => {
  //   await AuthServices.forgetPassword(req.user);

  //   serveResponse(res, {
  //     message: 'Password reset link sent successfully!',
  //   });
  // }),

  // resetPassword: catchAsync(async (req, res) => {
  //   await AuthServices.forgetPassword(req.user);

  //   serve(res, {
  //     message: 'Password reset link sent successfully!',
  //   });
  // }),

  refreshToken: catchAsync(async (req, res) => {
    const result = await AuthServices.refreshToken(req.cookies.refreshToken);

    serveResponse(res, {
      message: 'New Access create successfully!',
      data: result,
    });
  }),
};
