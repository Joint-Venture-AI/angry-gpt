import { model, Schema } from 'mongoose';
import { TBot } from './Bot.interface';

export const botSchema = new Schema<TBot>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    context: {
      type: String,
    },
    isFree: {
      type: Boolean,
      default: true,
    },
    logo: {
      type: String,
      default: '/images/logo.png',
    },
    isBot: {
      type: Boolean,
      default: true,
    },
    url: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Bot = model<TBot>('Bot', botSchema);

export default Bot;
