import { UserServices } from './User.service';
import { StatusCodes } from 'http-status-codes';
import { AuthServices } from '../auth/Auth.service';
import catchAsync from '../../../util/server/catchAsync';
import config from '../../../config';
import serveResponse from '../../../util/server/serveResponse';
import { verifyToken } from '../auth/Auth.utils';
import { imagesUploadRollback } from '../../middlewares/imageUploader';

export const UserControllers = {
  create: catchAsync(async ({ body }, res) => {
    await UserServices.create(body);

    const data = await AuthServices.login({
      email: body.email,
      password: body.password,
    });

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
      statusCode: StatusCodes.CREATED,
      message: 'User registered successfully!',
      data: { token: accessToken, user },
    });
  }),

  edit: catchAsync(async (req, res) => {
    const updatedUser = await UserServices.edit(req);

    serveResponse(res, {
      message: 'Profile updated successfully!',
      data: updatedUser,
    });
  }, imagesUploadRollback),

  list: catchAsync(async (req, res) => {
    const usersWithMeta = await UserServices.list(req.query);

    serveResponse(res, {
      message: 'Users are retrieved successfully!',
      data: usersWithMeta,
    });
  }),
};
