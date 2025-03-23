import { Types } from 'mongoose';
export type TBot = 'angry' | 'lola' | 'mimi';

export type TChat = {
  user: Types.ObjectId;
  bot: TBot;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};
