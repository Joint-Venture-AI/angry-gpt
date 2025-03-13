/* eslint-disable no-unused-expressions */
import {
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';

/**
 * Wraps an Express request handler to catch and handle async errors
 *
 * @param fn - The Express request handler function to wrap
 * @param errFn - Optional error handler function to handle caught errors
 * @returns A wrapped request handler that catches async errors
 */
const catchAsync =
  (fn: RequestHandler, errFn?: ErrorRequestHandler): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      errFn?.(error, req, res, next) ?? next(error);
    }
  };

export default catchAsync;
