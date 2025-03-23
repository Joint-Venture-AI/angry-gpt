import { Types } from 'mongoose';

export type TMessage = {
  chat: Types.ObjectId;
  content: string;
  sender: 'user' | 'bot';
  createdAt: Date;
  updatedAt: Date;
};
