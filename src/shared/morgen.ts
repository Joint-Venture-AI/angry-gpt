import morgan from 'morgan';
import config from '../config';
import { errorLogger, logger } from './logger';
import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';

morgan.token('message', (_, res: Response) => res?.locals.errorMessage ?? '');

const getIpFormat = () =>
  config.server.node_env === 'development' ? ':remote-addr - ' : '';
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;

const successHandler = morgan(successResponseFormat, {
  skip: (_, { statusCode }) => statusCode >= StatusCodes.BAD_REQUEST,
  stream: { write: (message: string) => logger.info(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (_, { statusCode }) => statusCode < StatusCodes.BAD_REQUEST,
  stream: { write: (message: string) => errorLogger.error(message.trim()) },
});

export const Morgan = { errorHandler, successHandler };
