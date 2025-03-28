import { AuthServices } from './Auth.service';
import catchAsync from '../../../util/server/catchAsync';
import config from '../../../config';
import serveResponse from '../../../util/server/serveResponse';
import { verifyToken } from './Auth.utils';

export const AuthControllers = {
  login: catchAsync(async ({ body }, res) => {
    const data = await AuthServices.login(body);

    if (!data)
      return serveResponse(res, {
        message: 'OTP sent to your email. Please verify your account.',
      });

    const { accessToken, refreshToken, user } = data;

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
    Object.keys(req.cookies).forEach(cookie =>
      res.clearCookie(cookie, {
        httpOnly: true,
        secure: config.server.node_env !== 'development',
      }),
    );

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

  sendOtp: catchAsync(async ({ body }, res) => {
    await AuthServices.sendOtp(body.email);

    serveResponse(res, {
      message: 'Send Otp successfully! Check your email.',
    });
  }),

  verifyOtp: catchAsync(async ({ body }, res) => {
    const { email, otp } = body;

    const { accessToken, refreshToken, user } = await AuthServices.verifyOtp(
      email,
      +otp,
    );

    res.cookie('refreshToken', refreshToken, {
      secure: config.server.node_env !== 'development',
      maxAge: verifyToken(refreshToken, 'refresh').exp! * 1000,
      httpOnly: true,
    });

    serveResponse(res, {
      message: 'Otp verified successfully!',
      data: { token: accessToken, user },
    });
  }),

  resetPassword: catchAsync(async ({ body, user }, res) => {
    await AuthServices.resetPassword(user!.email!, body.password);

    serveResponse(res, {
      message: 'Password reset successfully!',
    });
  }),

  refreshToken: catchAsync(async (req, res) => {
    const { accessToken } = await AuthServices.refreshToken(
      req.cookies.refreshToken,
    );

    serveResponse(res, {
      message: 'New Access create successfully!',
      data: { token: accessToken },
    });
  }),

  loginWith: catchAsync(async (req, res) => {
    const { accessToken, refreshToken, user } =
      await AuthServices.loginWith(req);

    res.cookie('refreshToken', refreshToken, {
      secure: config.server.node_env !== 'development',
      maxAge: verifyToken(refreshToken!, 'refresh').exp! * 1000,
      httpOnly: true,
    });

    serveResponse(res, {
      message: 'Login successfully!',
      data: { token: accessToken, user },
    });
  }),
};
