import catchAsync from '../../../util/server/catchAsync';
import config from '../../../config';
import { PaymentServices } from './Payment.service';
import { stripe } from './Payment.utils';
import serveResponse from '../../../util/server/serveResponse';

export const PaymentControllers = {
  create: catchAsync(async (req, res) => {
    const data = await PaymentServices.create(req.body);

    serveResponse(res, {
      message: 'Order created successfully!',
      data,
    });
  }),

  webhook: catchAsync(async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;

    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.payment.stripe.webhook,
    );

    if (event.type === 'checkout.session.completed')
      await PaymentServices.success(event);

    res.json({ received: true });
  }),
};
