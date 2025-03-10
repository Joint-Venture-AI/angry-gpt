import { UserServices } from './User.service';
import { StatusCodes } from 'http-status-codes';
import { AuthServices } from '../auth/Auth.service';
import catchAsync from '../../../shared/catchAsync';
import config from '../../../config';
import serveResponse from '../../../shared/serveResponse';
import { verifyToken } from '../auth/Auth.utils';

export const UserControllers = {
  create: catchAsync(async ({ body }, res) => {
    body.name = { firstName: body.firstName, lastName: body.lastName };
    body.role = undefined;

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

  list: catchAsync(async (req, res) => {
    const usersWithMeta = await UserServices.list(req.query);

    serveResponse(res, {
      message: 'Users are retrieved successfully!',
      data: usersWithMeta,
    });
  }),
};
