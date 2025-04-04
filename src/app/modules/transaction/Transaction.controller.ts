import catchAsync from '../../../util/server/catchAsync';
import { TransactionServices } from './Transaction.service';
import serveResponse from '../../../util/server/serveResponse';

export const TransactionControllers = {
  list: catchAsync(async (req, res) => {
    const { transactions } = await TransactionServices.list(req.query);
    const meta = await TransactionServices.retrieveMeta();

    serveResponse(res, {
      message: 'Transactions retrieved successfully!',
      meta,
      data: transactions,
    });
  }),

  retrieve: catchAsync(async (req, res) => {
    const data = await TransactionServices.retrieve(req.params.transactionId);

    serveResponse(res, {
      message: 'Transaction retrieved successfully!',
      data,
    });
  }),
};
