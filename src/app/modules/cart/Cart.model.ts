import { model, Schema } from 'mongoose';
import { TCart } from './Cart.interface';

const cartSchema = new Schema<TCart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    books: {
      type: [Schema.Types.ObjectId],
      ref: 'Book',
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

const Cart = model<TCart>('Cart', cartSchema);

export default Cart;
