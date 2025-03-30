import { TTransaction } from '../transaction/Transaction.interface';
import { TransactionServices } from '../transaction/Transaction.service';
import { stripe } from './Payment.utils';
import Stripe from 'stripe';
import config from '../../../config';
import Order from '../order/Order.model';
import { EOrderState } from '../order/Order.enum';
import { exec, execSync } from 'child_process';

export const PaymentServices = {
  create: async ({ name, amount, method = 'card' }: Record<string, any>) => {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: [method],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: config.url.payment.success,
      cancel_url: config.url.payment.cancel,
    });

    return session.url;
  },

  success: async (event: Stripe.Event) => {
    const session: any = event.data.object;

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    const paymentIntent: any = await stripe.paymentIntents.retrieve(
      session.payment_intent,
    );

    const paymentMethod = await stripe.paymentMethods.retrieve(
      paymentIntent.payment_method,
    );

    const order = await Order.findById(lineItems.data[0].description);

    if (!order) return;

    const transactionData: TTransaction = {
      transaction_id: session.payment_intent,
      type: 'sell',
      payment_method: paymentMethod.type,
      amount: order.amount,
      user: order.user,
    };

    const transaction = await TransactionServices.create(transactionData);

    order.transaction = transaction._id;
    order.state = EOrderState.SUCCESS;

    await order.save();
  },

  listener: () => {
    if (config.server.node_env !== 'development') return;

    execSync('taskkill /F /IM stripe.exe >nul 2>&1');

    const forwardUrl = `${config.server.href}/api/v1/payment/stripe/webhook`;
    const stripe = exec(`stripe listen --forward-to ${forwardUrl}`);

    stripe.stdout?.on('data', data => process.stdout.write(data));
    stripe.stderr?.on('data', data => process.stderr.write(data));

    return stripe;
  },
};
