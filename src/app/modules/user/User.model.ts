import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { TUser } from './User.interface';
import config from '../../../config';

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

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(config.bcrypt_salt_rounds);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.post('save', async function (doc: any, next) {
  doc.password = undefined;

  next();
});

const User = model<TUser>('User', userSchema);

export default User;
