import catchAsync from '../../../util/server/catchAsync';
import { TransactionServices } from './Transaction.service';
import serveResponse from '../../../util/server/serveResponse';

export const TransactionControllers = {
  retrieve: catchAsync(async (req, res) => {
    const data = await TransactionServices.retrieve(req.query);

    serveResponse(res, {
      message: 'Transaction retrieved successful.',
      data,
    });
  }),
};
