import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../../config';

export type TTokenType = 'access' | 'reset' | 'refresh';

export const createToken = (jwtPayload: JwtPayload, type: TTokenType) => {
  jwtPayload.tokenType = type;

  let token = '';

  switch (type) {
    case 'access':
      token = jwt.sign(jwtPayload, config.jwt.access_token.secret as string, {
        expiresIn: config.jwt.access_token.expire_in,
      });
      break;
    case 'reset':
      token = jwt.sign(jwtPayload, config.jwt.access_token.secret as string, {
        expiresIn: '10m',
      });
      break;
    case 'refresh':
      token = jwt.sign(jwtPayload, config.jwt.refresh_token.secret as string, {
        expiresIn: config.jwt.refresh_token.expire_in,
      });
  }

  return token;
};

export const verifyToken = (token: string, type: TTokenType) => {
  let user: JwtPayload;

  switch (type) {
    case 'access':
      user = jwt.verify(
        token,
        config.jwt.access_token.secret as string,
      ) as JwtPayload;
      break;
    case 'reset':
      user = jwt.verify(
        token,
        config.jwt.access_token.secret as string,
      ) as JwtPayload;
      break;
    case 'refresh':
      user = jwt.verify(
        token,
        config.jwt.refresh_token.secret as string,
      ) as JwtPayload;
  }

  return user;
};
