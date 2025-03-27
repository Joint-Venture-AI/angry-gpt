import { Types } from 'mongoose';

export type TCart = {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  books: Types.ObjectId[];
};
