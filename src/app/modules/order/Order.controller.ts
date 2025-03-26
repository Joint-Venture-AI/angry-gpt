import serveResponse from '../../../util/server/serveResponse';
import { PaymentServices } from '../payment/Payment.service';
import catchAsync from '../../../util/server/catchAsync';
import { OrderService } from './Order.service';
import { EOrderState } from './Order.enum';

export const OrderController = {
  checkout: catchAsync(async (req, res) => {
    const { orderId, amount } = await OrderService.checkout(req);

    const checkout_url = await PaymentServices.create({
      name: orderId.toString(),
      amount,
      method: req.query.method,
    });

    serveResponse(res, {
      message: 'Order created successfully!',
      data: {
        orderId,
        checkout_url,
      },
    });
  }),

  cancel: catchAsync(async (req, res) => {
    const data = await OrderService.cancel(req.params.orderId);

    serveResponse(res, {
      message: 'Order has been cancel successfully!',
      data,
    });
  }),

  changeState: catchAsync(async ({ params }, res) => {
    const data = await OrderService.changeState(
      params.orderId,
      params.state as EOrderState,
    );

    serveResponse(res, {
      message: `Order ${params.state} successfully!`,
      data,
    });
  }),

  list: catchAsync(async (req, res) => {
    const { meta, orders } = await OrderService.list(req.query);

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
