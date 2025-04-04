import { Types } from 'mongoose';
import Cart from './Cart.model';

export const CartServices = {
  async retrieve(userId: Types.ObjectId) {
    const cart = await Cart.findOne({ user: userId }).populate(
      'details.book',
      'title images author price',
    );

    return cart?.details ?? [];
  },

  async remove(bookId: string, userId: Types.ObjectId) {
    await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { details: { book: bookId } } },
      { new: true },
    );
  },

  async update({ bookId, quantity }: any, userId: Types.ObjectId) {
    return (
      (await Cart.findOneAndUpdate(
        { user: userId, 'details.book': bookId },
        { $set: { 'details.$.quantity': quantity } },
        { new: true },
      )) ??
      (await Cart.findOneAndUpdate(
        { user: userId },
        { $addToSet: { details: { book: bookId, quantity } } },
        { new: true, upsert: true },
      ))
    );
  },
};
