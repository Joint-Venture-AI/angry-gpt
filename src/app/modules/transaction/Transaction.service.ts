import { TTransaction } from './Transaction.interface';
import Transaction from './Transaction.model';

export const TransactionServices = {
  async create(transactionData: TTransaction) {
    return await Transaction.create(transactionData);
  },

  async list({ page = 1, limit = 10 }: Record<string, any>) {
    const transactions = await Transaction.find()
      .populate('user')
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      transactions,
    };
  },

  async retrieve(transactionId: string) {
    return Transaction.findById(transactionId)
      .populate('user', 'name avatar')
      .populate({
        path: 'order',
        populate: [
          { path: 'details.book', select: 'title images' },
          { path: 'customer', select: 'name email phone address' },
        ],
        select: 'amount details customer',
      });
  },
};
