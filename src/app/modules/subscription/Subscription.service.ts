import { StatusCodes } from 'http-status-codes';
import ServerError from '../../../errors/ServerError';
import { stripe } from '../payment/Payment.utils';
import { TSubscription } from './Subscription.interface';
import Subscription from './Subscription.model';

export const SubscriptionServices = {
  async create(subscriptionData: TSubscription) {
    const { name, price, interval, interval_count } = subscriptionData;

    const hasSubscription = await Subscription.exists({
      name,
    });

    if (hasSubscription)
      throw new ServerError(
        StatusCodes.BAD_REQUEST,
        'Subscription already exists',
      );

    const { id: product_id } = await stripe.products.create({
      name,
    });

    const { id: subscription_id } = await stripe.prices.create({
      unit_amount: price * 100,
      currency: 'usd',
      recurring: { interval, interval_count },
      product: product_id,
    });

    const subscription = await Subscription.create({
      ...subscriptionData,
      subscription_id,
    });

    return subscription;
  },

  async list({ page, limit }: any) {
    const subscriptions = await Subscription.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Subscription.countDocuments();

    return {
      subscriptions,
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit),
        },
      },
    };
  },
};
