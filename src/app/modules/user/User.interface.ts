import { Types } from 'mongoose';
import { EUserRole } from './User.enum';

export type TUser = {
  _id?: Types.ObjectId;
  name: string;
  avatar: string;
  email: string;
  password: string;
  role: EUserRole;
  otp?: number;
  otpExp?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};
