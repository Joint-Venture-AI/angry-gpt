import { RequestHandler } from 'express';
import { UserServices } from './User.service';
import { StatusCodes } from 'http-status-codes';
import { AuthServices } from '../auth/Auth.service';
import catchAsync from '../../../shared/catchAsync';
import config from '../../../config';
import serveResponse from '../../../shared/serveResponse';
import { verifyToken } from '../auth/Auth.utils';

const createUser: RequestHandler = catchAsync(async ({ body }, res) => {
  body.name = { firstName: body.firstName, lastName: body.lastName };
  body.role = undefined;

  await UserServices.createUser(body);

  const { accessToken, refreshToken, user } = await AuthServices.loginUser({
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
});

const getAllUser: RequestHandler = catchAsync(async (req, res) => {
  const usersWithMeta = await UserServices.getAllUser(req.query);

  serveResponse(res, {
    message: 'Users are retrieved successfully!',
    data: usersWithMeta,
  });
});

const userList: RequestHandler = catchAsync(async (req, res) => {
  const users = await UserServices.userList(
    req.query.search as string,
    req.query.removeId as string,
  );

  serveResponse(res, {
    message: 'Users are retrieved successfully!',
    data: users,
  });
});

export const UserControllers = {
  createUser,
  getAllUser,
  userList,
};
