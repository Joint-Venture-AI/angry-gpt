import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../../config';

export type TTokenType = 'access' | 'reset' | 'refresh';

export const createToken = (jwtPayload: JwtPayload, type: TTokenType) => {
  jwtPayload.tokenType = type;

  switch (type) {
    case 'access':
      return jwt.sign(jwtPayload, config.jwt.access_token.secret, {
        expiresIn: config.jwt.access_token.expire_in,
      });
    case 'reset':
      return jwt.sign(jwtPayload, config.jwt.access_token.secret, {
        expiresIn: '10m',
      });
    case 'refresh':
      return jwt.sign(jwtPayload, config.jwt.refresh_token.secret, {
        expiresIn: config.jwt.refresh_token.expire_in,
      });
  }
};

export const verifyToken = (token: string, type: TTokenType) => {
  switch (type) {
    case 'access':
      return jwt.verify(token, config.jwt.access_token.secret) as JwtPayload;
    case 'reset':
      return jwt.verify(token, config.jwt.access_token.secret) as JwtPayload;
    case 'refresh':
      return jwt.verify(token, config.jwt.refresh_token.secret) as JwtPayload;
  }
};

export const generateOtp = () =>
  Math.floor(1_00_000 + Math.random() * 9_00_000);
