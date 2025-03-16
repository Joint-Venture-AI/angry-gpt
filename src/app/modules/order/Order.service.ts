import { Request } from 'express';
import { TOrder } from './Order.interface';
import Book from '../book/Book.model';
import { Types } from 'mongoose';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';

export const OrderService = {
  async checkout(req: Request) {
    const { details, customer } = req.body as TOrder;

    let amount = 0,
      books: any[] = await Book.find({
        _id: { $in: details.map(detail => new Types.ObjectId(detail.book)) },
      });

    if (!books.length)
      throw new ServerError(StatusCodes.BAD_REQUEST, 'No valid books found');

    books = books
      .map(book => {
        const bookDetail = details.find(
          detail => detail.book === book._id.toString(),
        );

        if (!bookDetail) return null;

        amount += bookDetail.price * bookDetail.quantity;

        return { ...book, quantity: bookDetail.quantity };
      })
      .filter(Boolean);
  },

  // async cancel(orderId: string) {
  //   await Order.findByIdAndUpdate(orderId, {
  //     state: 'cancel',
  //   });
  // },

  // async shipped(orderId: string) {
  //   await Order.findByIdAndUpdate(orderId, {
  //     state: 'shipped',
  //   });
  // },

  // async list(query: Record<any, any>) {
  //   const { page = '1', limit = '10', state } = query;
  //   const filters: Record<string, any> = {};

  //   if (state) filters.state = state;

  //   const orders = await Order.find(filters)
  //     .skip((+page - 1) * +limit)
  //     .limit(+limit)
  //     .populate('customer', 'name')
  //     .populate('productDetails.product', 'name images')
  //     .populate('transaction', 'transaction_id');

  //   const totalOrders = await Order.countDocuments(filters);

  //   return {
  //     meta: {
  //       totalPages: Math.ceil(totalOrders / +limit),
  //       page: +page,
  //       limit: +limit,
  //       total: totalOrders,
  //     },
  //     orders,
  //   };
  // },

  // async retrieve(query: Record<any, any>) {
  //   if (query.orderId) {
  //     const order = await Order.findById(query.orderId)
  //       .populate('transaction', 'transaction_id')
  //       .populate('productDetails.product', 'name images slug');

  //     if (!order)
  //       throw new ServerError(StatusCodes.NOT_FOUND, 'Order not found');

  //     if (order.customer.toString() !== query.customer)
  //       throw new ServerError(StatusCodes.FORBIDDEN, 'You are not authorized');

  //     return order;
  //   }

  //   const orders = await Order.find({
  //     customer: new Types.ObjectId(query.customer as string),
  //   })
  //     .populate('transaction', 'transaction_id')
  //     .populate('productDetails.product', 'name images slug');

  //   return orders;
  // },
};
