import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { CartServices } from './Cart.service';

export const CartControllers = {
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

  update: catchAsync(async ({ params, query, user }, res) => {
    await CartServices.update(
      { bookId: params.bookId, quantity: query.quantity },
      user!._id!,
    );

    serveResponse(res, {
      message: 'Cart added successfully',
    });
  }),
};
