import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { CartServices } from './Cart.service';

export const CartControllers = {
  add: catchAsync(async ({ params, user }, res) => {
    await CartServices.add(params.bookId, user!._id!);

    serveResponse(res, {
      message: 'Cart added successfully',
    });
  }),

  retrieve: catchAsync(async ({ user }, res) => {
    const books = await CartServices.retrieve(user!._id!);

    serveResponse(res, {
      message: 'Cart retrieved successfully',
      data: books,
    });
  }),

  remove: catchAsync(async ({ params, user }, res) => {
    await CartServices.remove(params.bookId, user!._id!);

    serveResponse(res, {
      message: 'Cart removed successfully',
    });
  }),
};
