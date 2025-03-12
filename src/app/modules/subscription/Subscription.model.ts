import { Schema, model } from 'mongoose';
import { TSubscription } from './Subscription.interface';

const subscriptionSchema = new Schema<TSubscription>(
  {
    subscription_id: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      unique: true,
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    interval: {
      type: String,
      enum: ['day', 'week', 'month', 'year'],
      required: true,
    },
    interval_count: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

const Subscription = model<TSubscription>('Subscription', subscriptionSchema);

export default Subscription;
