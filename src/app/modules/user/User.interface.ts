import { Types } from 'mongoose';
import { EUserRole, EUserStatus, EUserGender } from './User.enum';

export type TUser = {
  _id?: Types.ObjectId;
  name: {
    firstName: string;
    lastName: string;
  };
  avatar: string;
  gender: EUserGender;
  email: string;
  password: string;
  role: EUserRole;
  status: EUserStatus;
  otp?: number;
  otpExp?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};
