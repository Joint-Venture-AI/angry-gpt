import { Types } from 'mongoose';

export type TChat = {
  user: Types.ObjectId;
  bot: 'angry' | 'lola' | 'mimi';
  name: string;
  createdAt: Date;
  updatedAt: Date;
};
