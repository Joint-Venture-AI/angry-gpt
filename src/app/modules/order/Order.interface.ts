import { Types } from 'mongoose';
import { EOrderState } from './Order.enum';

export type TOrder = {
  _id?: Types.ObjectId;
  details: {
    book: Types.ObjectId;
    quantity: number;
  }[];
  customer: TCustomer;
  user: Types.ObjectId;
  transaction?: Types.ObjectId;
  amount: number;
  state: EOrderState;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TCustomer = {
  name: string;
  email?: string;
  phone?: string;
  address: {
    country: string;
    address: string;
    zip: string;
    city: string;
    apartment?: string;
  };
};
