import { model, Schema } from 'mongoose';
import { TOrder } from './Order.interface';
import { EOrderState } from './Order.enum';

const addressSchema = new Schema(
  {
    country: { type: String, required: true },
    address: { type: String, required: true },
    zip: { type: String, required: true },
    city: { type: String, required: true },
    apartment: { type: String },
  },
  { _id: false },
);

const customerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    address: { type: addressSchema, required: true },
  },
  { _id: false },
);

const orderSchema = new Schema<TOrder>(
  {
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
    customer: {
      type: customerSchema,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    transaction: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    state: {
      type: String,
      required: true,
      enum: Object.values(EOrderState),
      default: EOrderState.PENDING,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Order = model<TOrder>('Order', orderSchema);

export default Order;
