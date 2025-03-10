import { model, Schema } from 'mongoose';
import { TUser } from './User.interface';
import { UserMiddlewares } from './User.middleware';

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
      enum: ['male', 'female'],
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
      enum: ['ADMIN', 'USER'],
      default: 'USER',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED', 'DELETED'],
      default: 'ACTIVE',
    },
    otp: Number,
    otpExp: Date,
  },
  { timestamps: true },
);

UserMiddlewares.schema(userSchema);

const User = model<TUser>('User', userSchema);

export default User;
