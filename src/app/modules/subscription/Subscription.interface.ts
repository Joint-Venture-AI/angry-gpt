import { Types } from 'mongoose';
import Stripe from 'stripe';

export type TSubscription = {
  _id?: Types.ObjectId;
  subscription_id: string;
  name: string;
  features: string[];
  price: number;
  interval: Stripe.PriceCreateParams.Recurring.Interval;
  interval_count: number;
  createdAt: Date;
  updatedAt: Date;
};
