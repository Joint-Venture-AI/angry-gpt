import { model, Schema } from 'mongoose';
import { TCart } from './Cart.interface';

const cartSchema = new Schema<TCart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    details: [
      {
        _id: false,
        book: {
          type: Schema.Types.ObjectId,
          ref: 'Book',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
  },
  {
    versionKey: false,
  },
);

const Cart = model<TCart>('Cart', cartSchema);

export default Cart;
