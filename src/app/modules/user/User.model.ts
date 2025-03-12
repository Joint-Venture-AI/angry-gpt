import { model, Schema } from 'mongoose';
import { TUser } from './User.interface';
import { UserMiddlewares } from './User.middleware';
import { EUserRole, EUserStatus, EUserGender } from './User.enum';

const userSchema = new Schema<TUser>(
  {
    name: {
      type: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
      },
      required: true,
    },
    gender: {
      type: String,
      enum: [EUserGender.MALE, EUserGender.FEMALE],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: [EUserRole.ADMIN, EUserRole.USER],
      default: EUserRole.USER,
    },
    status: {
      type: String,
      enum: [EUserStatus.ACTIVE, EUserStatus.SUSPENDED, EUserStatus.DELETED],
      default: EUserStatus.ACTIVE,
    },
    otp: Number,
    otpExp: Date,
  },
  { timestamps: true },
);

userSchema.inject(UserMiddlewares.schema);

const User = model<TUser>('User', userSchema);

export default User;
