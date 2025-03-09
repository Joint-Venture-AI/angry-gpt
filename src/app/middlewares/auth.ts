import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ServerError from '../../errors/ServerError';
import User from '../modules/user/User.model';
import { verifyToken } from '../modules/auth/Auth.utils';

const auth =
  (...roles: ('USER' | 'ADMIN')[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const bearerToken = req.headers.authorization;

      if (bearerToken?.startsWith('Bearer')) {
        const token = bearerToken.split(' ')[1];

        const { email } = verifyToken(token, 'access');

        const user = await User.findOne({ email });

        if (!user)
          throw new ServerError(
            StatusCodes.UNAUTHORIZED,
            'You are not authorized',
          );

        //set user to header
        req.user = user;

        //guard user
        if (roles.length && !roles.includes(user.role)) {
          throw new ServerError(
            StatusCodes.FORBIDDEN,
            "You don't have permission to access this api",
          );
        }

        next();
      }
    } catch (error) {
      next(error);
    }
  };

export default auth;
