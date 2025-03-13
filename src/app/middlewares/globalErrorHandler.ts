/* eslint-disable no-console, no-unused-vars, @typescript-eslint/no-unused-vars, no-unused-expressions */
import { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import colors from 'colors';
import config from '../../config';
import handleValidationError from '../../errors/handleValidationError';
import handleZodError from '../../errors/handleZodError';
import ServerError from '../../errors/ServerError';
import { errorLogger } from '../../util/logger/logger';
import { TErrorHandler, TErrorMessage } from '../../types/errors.types';
import handleMongooseDuplicateError from '../../errors/handleMongooseDuplicateError';

const defaultError: TErrorHandler = {
  statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  message: 'Something went wrong',
  errorMessages: [],
};

/**
 * Global error handler middleware
 *
 * This middleware catches all errors and logs them appropriately based on the environment
 */
const globalErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  config.server.node_env === 'development'
    ? console.log(colors.red('🚨 globalErrorHandler ~~ '), error)
    : errorLogger.error(colors.red('🚨 globalErrorHandler ~~ '), error);

  const { statusCode, message, errorMessages } = handleError(error);

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.server.node_env !== 'production' ? error?.stack : undefined,
  });
};

export default globalErrorHandler;

const createErrorMessage = (message: string): TErrorMessage[] => [
  { path: '', message },
];

const handleError = (error: any): TErrorHandler => {
  const errorHandlers: Record<string, () => TErrorHandler> = {
    ZodError: () => handleZodError(error),
    ValidationError: () => handleValidationError(error),
    TokenExpiredError: () => ({
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'Session Expired',
      errorMessages: createErrorMessage(
        'Your session has expired. Please log in again to continue.',
      ),
    }),
    JsonWebTokenError: () => ({
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'Invalid Token',
      errorMessages: createErrorMessage(
        'Your token is invalid. Please log in again to continue.',
      ),
    }),
  };

  if (error.code === 11000) return handleMongooseDuplicateError(error);

  if (error instanceof ServerError)
    return {
      statusCode: error.statusCode,
      message: error.message,
      errorMessages: createErrorMessage(error.message),
    };

  if (error instanceof Error)
    return {
      ...defaultError,
      message: error.message,
      errorMessages: createErrorMessage(error.message),
    };

  return errorHandlers[error.name]?.() ?? defaultError;
};
