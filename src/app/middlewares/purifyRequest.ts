import { AnyZodObject } from 'zod';
import catchAsync from '../../shared/catchAsync';

/**
 * Middleware to purify and validate the request {body, cookies} using a Zod schema.
 *
 * This middleware uses the provided Zod schema to parse and validate the request body.
 * If the validation is successful, the purified data is assigned back to `req.body`.
 * If the validation fails, an error is thrown and handled by the `catchAsync` function.
 *
 * @param {AnyZodObject} schema - The Zod schema to validate the request body against.
 * @return Middleware function to purify the request body.
 */
const purifyRequest = ({ parseAsync }: AnyZodObject) =>
  catchAsync(async (req, _, next) => {
    const parsedData = await parseAsync({
      body: req.body,
      cookies: req.cookies,
      query: req.query,
      params: req.params,
    });

    Object.assign(req, parsedData);

    next();
  });

export default purifyRequest;
