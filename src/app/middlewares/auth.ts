import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ServerError from '../../errors/ServerError';
import User from '../modules/user/User.model';
import { verifyToken } from '../modules/auth/Auth.utils';

/**
 * Middleware to authenticate and authorize requests based on user roles
 *
 * @param roles - The roles that are allowed to access the resource
 */
const auth =
  (...roles: ('USER' | 'ADMIN')[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = req.headers?.authorization?.split(' ')[1];

      if (!token)
        throw new ServerError(
          StatusCodes.UNAUTHORIZED,
          'You are not authorized',
        );

      const { email } = verifyToken(token, 'access');

      const user = await User.findOne({ email });

      if (!user)
        throw new ServerError(
          StatusCodes.UNAUTHORIZED,
          'You are not authorized',
        );

      req.user = user;

      if (roles.length && !roles.includes(user.role))
        throw new ServerError(
          StatusCodes.FORBIDDEN,
          'You are not authorized to access this api',
        );

      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
