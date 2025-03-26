import serveResponse from '../../../util/server/serveResponse';
import { PaymentServices } from '../payment/Payment.service';
import catchAsync from '../../../util/server/catchAsync';
import { OrderService } from './Order.service';

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

  shipped: catchAsync(async (req, res) => {
    const data = await OrderService.shipped(req.params.orderId);

    serveResponse(res, {
      message: 'Order has been shipped successfully!',
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

  // retrieve: catchAsync(async (req, res) => {
  //   const data = await OrderService.retrieve(req.query);

  //   serveResponse(res, {
  //     message: 'Order retrieved successfully!',
  //     data,
  //   });
  // }),
};
