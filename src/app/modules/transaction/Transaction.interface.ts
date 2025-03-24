import { Types } from 'mongoose';

export type TTransaction = {
  _id?: Types.ObjectId;
  transaction_id?: string;
  user: Types.ObjectId;
  amount: number;
  payment_method: string;
  subscription?: string;
  type: 'sell' | 'subscription';
  createdAt?: Date;
  updatedAt?: Date;
};
