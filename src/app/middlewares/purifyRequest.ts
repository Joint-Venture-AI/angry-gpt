import { AnyZodObject } from 'zod';
import catchAsync from '../../util/server/catchAsync';

/**
 * Middleware to purify and validate the request {body, cookies, query, params} using multiple Zod schemas.
 *
 * This middleware validates the request against all provided Zod schemas.
 * The validated and merged data is then assigned back to `req`.
 * If validation fails, an error is thrown and handled by `catchAsync`.
 *
 * @param {...AnyZodObject} schemas - The Zod schemas to validate the request against.
 * @return Middleware function to purify the request.
 */
const purifyRequest = (...schemas: AnyZodObject[]) =>
  catchAsync(async (req, _, next) => {
    const { body, cookies, query, params } = req;

    const data = await Promise.all(
      schemas.map(({ parseAsync }) =>
        parseAsync({ body, cookies, query, params }),
      ),
    );

    Object.assign(req, ...data);
    next();
  });

export default purifyRequest;
