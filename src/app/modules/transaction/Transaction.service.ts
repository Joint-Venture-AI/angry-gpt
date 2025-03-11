import { TTransaction } from './Transaction.interface';
import Transaction from './Transaction.model';

export const TransactionServices = {
  async create(transactionData: TTransaction) {
    return await Transaction.create(transactionData);
  },

  async retrieve({ page = 1, limit = 10 }: Record<string, any>) {
    const transactions = await Transaction.find()
      .populate('user')
      .skip((page - 1) * limit)
      .limit(limit);

    return transactions;
  },
};
