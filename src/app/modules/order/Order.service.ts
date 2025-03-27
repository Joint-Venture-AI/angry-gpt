import { TOrder } from './Order.interface';
import Book from '../book/Book.model';
import Order from './Order.model';
import { EOrderState } from './Order.enum';
import { RootFilterQuery, Types } from 'mongoose';
import { TUser } from '../user/User.interface';
import { EUserRole } from '../user/User.enum';

export const OrderService = {
  async checkout({ details, customer }: TOrder, user: Types.ObjectId) {
    const bookIds = details.map(({ book }) => book);

    const booksMap = new Map(
      (await Book.find({ _id: { $in: bookIds } }, { price: 1 })).map(book => [
        book._id.toString(),
        book.price,
      ]),
    );

    const amount = details.reduce(
      (sum, { book, quantity }) =>
        sum + booksMap.get(book.toString())! * quantity,
      0,
    );

    const order = await Order.findOneAndUpdate(
      { user, state: EOrderState.PENDING },
      { $set: { details, customer, amount, state: EOrderState.PENDING } },
      { upsert: true, new: true },
    );

    return { orderId: order!._id, amount };
  },

  async changeState(orderId: string, state: EOrderState) {
    return await Order.findByIdAndUpdate(orderId, { state }, { new: true })
      .populate('details.book', 'title images')
      .populate(
        'transaction',
        'transaction_id amount payment_method createdAt',
      );
  },

  async list({ state, page, limit }: Record<any, any>, user: TUser) {
    const filter: RootFilterQuery<TOrder> = state ? { state } : {};

    if (user.role !== EUserRole.ADMIN) filter.user = user._id;

    const orders = await Order.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('details.book', 'title images')
      .populate(
        'transaction',
        'transaction_id amount payment_method createdAt',
      );

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
      .populate(
        'transaction',
        'transaction_id amount payment_method createdAt',
      );
  },
};
