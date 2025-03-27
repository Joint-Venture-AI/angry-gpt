import { Types } from 'mongoose';
import Cart from './Cart.model';

export const CartServices = {
  async add(book: string, user: Types.ObjectId) {
    await Cart.findOneAndUpdate(
      { user },
      { $addToSet: { books: book } },
      { upsert: true, new: true },
    );
  },

  async retrieve(user: Types.ObjectId) {
    const cart = await Cart.findOne({ user }).populate(
      'books',
      'title images author price',
    );

    return cart?.books ?? [];
  },

  async remove(book: string, user: Types.ObjectId) {
    await Cart.findOneAndUpdate(
      { user },
      { $pull: { books: book } },
      { upsert: true, new: true },
    );
  },
};
