import { Request } from 'express';
import { TOrder } from './Order.interface';
import Book from '../book/Book.model';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';
import Order from './Order.model';
import { EOrderState } from './Order.enum';
import { RootFilterQuery } from 'mongoose';
import { TUser } from '../user/User.interface';
import { EUserRole } from '../user/User.enum';

export const OrderService = {
  async checkout(req: Request) {
    const { details, customer } = req.body as TOrder;

    let amount = 0;

    for (const { book, quantity } of details) {
      const foundBook = await Book.findById(book);
      if (foundBook) amount += foundBook.price * quantity;
    }

    if (amount === 0)
      throw new ServerError(
        StatusCodes.BAD_REQUEST,
        'No valid books in the order',
      );

    const order = await Order.findOneAndUpdate(
      { user: req.user!._id, state: EOrderState.PENDING },
      {
        $set: {
          details,
          customer,
          amount,
          state: EOrderState.PENDING,
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true, new: true },
    );

    return {
      orderId: order._id,
      amount,
    };
  },

  async cancel(orderId: string) {
    return await Order.findByIdAndUpdate(
      orderId,
      {
        state: 'cancel',
      },
      {
        new: true,
      },
    );
  },

  async shipped(orderId: string) {
    return await Order.findByIdAndUpdate(
      orderId,
      {
        state: 'shipped',
      },
      {
        new: true,
      },
    );
  },

  async list({ state, page, limit }: Record<any, any>) {
    const filter = state ? { state } : {};

    const orders = await Order.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('details.book', 'title images')
      .populate('transaction', 'transaction_id');

    const total = await Order.countDocuments(filter);

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit),
        },
      },
      orders,
    };
  },

  async retrieve(orderId: string, user: TUser) {
    const filter: RootFilterQuery<TOrder> = {
      _id: orderId,
    };

    if (user.role !== EUserRole.ADMIN) filter.user = user._id;

    return await Order.findOne(filter)
      .populate('details.book', 'title images')
      .populate('transaction', 'transaction_id');
  },
};
