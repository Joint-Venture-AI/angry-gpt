import { SubscriptionServices } from './Subscription.service';
import catchAsync from '../../../shared/catchAsync';
import serveResponse from '../../../shared/serveResponse';

export const SubscriptionControllers = {
  create: catchAsync(async (req, res) => {
    const subscription = await SubscriptionServices.create(req.body);

    serveResponse(res, {
      message: 'Subscription created successfully',
      data: subscription,
    });
  }),
};
