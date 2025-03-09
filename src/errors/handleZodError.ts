import { ZodError } from 'zod';
import { IErrorMessage } from '../types/errors.types';
import { StatusCodes } from 'http-status-codes';

const handleZodError = (error: ZodError) => {
  const errorMessages: IErrorMessage[] = error.errors.map(el => {
    return {
      path: el.path[el.path.length - 1],
      message: el.message,
    };
  });

  return {
    statusCode: StatusCodes.BAD_REQUEST,
    message: 'Request validation error',
    errorMessages,
  };
};

export default handleZodError;
