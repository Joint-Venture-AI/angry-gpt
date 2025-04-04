import { Types } from 'mongoose';

export type TCart = {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  details: [
    {
      book: Types.ObjectId;
      quantity: number;
    },
  ];
};
