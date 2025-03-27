import serveResponse from '../../../util/server/serveResponse';
import { PaymentServices } from '../payment/Payment.service';
import catchAsync from '../../../util/server/catchAsync';
import { OrderService } from './Order.service';
import { EOrderState } from './Order.enum';
import { EUserRole } from '../user/User.enum';

export const OrderController = {
  checkout: catchAsync(async ({ body, user, query }, res) => {
    const { orderId, amount } = await OrderService.checkout(body, user!._id!);

    const checkout_url = await PaymentServices.create({
      name: orderId.toString(),
      amount,
      method: query.method,
    });

    serveResponse(res, {
      message: 'Order created successfully!',
      meta: {
        orderId,
      },
      data: {
        checkout_url,
      },
    });
  }),

  changeState: catchAsync(async ({ params, user }, res) => {
    if (user?.role !== EUserRole.ADMIN) params.state = EOrderState.CANCEL;

    const data = await OrderService.changeState(
      params.orderId,
      params.state as EOrderState,
    );

    serveResponse(res, {
      message: `Order ${params.state} successfully!`,
      data,
    });
  }),

  list: catchAsync(async ({ query, user }, res) => {
    const { meta, orders } = await OrderService.list(query, user!);

    serveResponse(res, {
      message: 'Orders retrieved successfully!',
      meta,
      data: orders,
    });
  }),

  retrieve: catchAsync(async ({ user, params }, res) => {
    const data = await OrderService.retrieve(params.orderId, user!);

    serveResponse(res, {
      message: 'Order retrieved successfully!',
      data,
    });
  }),
};
