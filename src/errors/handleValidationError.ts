import { Error } from 'mongoose';
import { IErrorMessage } from '../types/errors.types';
import { StatusCodes } from 'http-status-codes';

const handleValidationError = (error: Error.ValidationError) => {
  const errorMessages: IErrorMessage[] = Object.values(error.errors).map(
    (el: Error.ValidatorError | Error.CastError) => {
      return {
        path: el.path,
        message: el.message,
      };
    },
  );

  return {
    statusCode: StatusCodes.BAD_REQUEST,
    message: 'Data validation error',
    errorMessages,
  };
};

export default handleValidationError;
