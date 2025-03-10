import { UserServices } from './User.service';
import { StatusCodes } from 'http-status-codes';
import { AuthServices } from '../auth/Auth.service';
import catchAsync, { catchAsyncWithCallback } from '../../../shared/catchAsync';
import config from '../../../config';
import serveResponse from '../../../shared/serveResponse';
import { verifyToken } from '../auth/Auth.utils';
import { imagesUploadRollback } from '../../middlewares/imageUploader';

export const UserControllers = {
  create: catchAsync(async ({ body }, res) => {
    await UserServices.create(body);

    const { accessToken, refreshToken, user } = await AuthServices.login({
      email: body.email,
      password: body.password,
    });

    res.cookie('refreshToken', refreshToken, {
      secure: config.server.node_env !== 'development',
      maxAge: verifyToken(refreshToken, 'refresh').exp! * 1000,
      httpOnly: true,
    });

    serveResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'User created successfully!',
      data: { token: accessToken, user },
    });
  }),

  edit: catchAsyncWithCallback(async (req, res) => {
    const updatedUser = await UserServices.edit(req);

    serveResponse(res, {
      message: 'Update admin successfully!',
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
