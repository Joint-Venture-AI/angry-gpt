import { SubscriptionServices } from './Subscription.service';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';

export const SubscriptionControllers = {
  create: catchAsync(async (req, res) => {
    const subscription = await SubscriptionServices.create(req.body);

    serveResponse(res, {
      message: 'Subscription created successfully',
      data: subscription,
    });
  }),
};
