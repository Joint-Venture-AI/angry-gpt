import catchAsync from '../../../shared/catchAsync';
import { TransactionServices } from './Transaction.service';
import serveResponse from '../../../shared/serveResponse';

export const TransactionControllers = {
  retrieve: catchAsync(async (req, res) => {
    const data = await TransactionServices.retrieve(req.query);

    serveResponse(res, {
      message: 'Transaction retrieved successful.',
      data,
    });
  }),
};
