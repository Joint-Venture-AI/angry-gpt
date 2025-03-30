import { model, Schema } from 'mongoose';
import { TTransaction } from './Transaction.interface';

const transactionSchema = new Schema<TTransaction>(
  {
    transaction_id: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    payment_method: {
      type: String,
      required: true,
      trim: true,
    },
    subscription: String,
  },
  {
    timestamps: true,
  },
);

const Transaction = model<TTransaction>('Transaction', transactionSchema);

export default Transaction;
