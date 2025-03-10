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

  logout: catchAsync(async (req, res) => {
    Object.keys(req.cookies).forEach(cookie => {
      res.clearCookie(cookie, {
        httpOnly: true,
        secure: config.server.node_env !== 'development',
      });
    });

    serveResponse(res, {
      message: 'Logged out successfully',
    });
  }),

  changePassword: catchAsync(async (req, res) => {
    await AuthServices.changePassword(req.user!._id!, req.body);

    serveResponse(res, {
      message: 'Password has changed successfully!',
    });
  }),

  sendOtp: catchAsync(async (req, res) => {
    const { email } = req.body;

    await AuthServices.sendOtp(email);

    serveResponse(res, {
      message: 'Send Otp successfully! Check your email.',
    });
  }),

  verifyOtp: catchAsync(async (req, res) => {
    const { email, otp } = req.body;

    const { accessToken } = await AuthServices.verifyOtp(email, +otp);

    serveResponse(res, {
      message: 'Otp verified successfully! Set your new password.',
      data: { accessToken },
    });
  }),

  resetPassword: catchAsync(async (req, res) => {
    const { password } = req.body;

    await AuthServices.resetPassword(req.user!.email!, password);

    serveResponse(res, {
      message: 'Password reset successfully!',
    });
  }),

  refreshToken: catchAsync(async (req, res) => {
    const token = await AuthServices.refreshToken(req.cookies.refreshToken);

    serveResponse(res, {
      message: 'New Access create successfully!',
      data: { token },
    });
  }),
};
