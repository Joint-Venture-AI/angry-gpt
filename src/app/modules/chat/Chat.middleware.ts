import { Schema } from 'mongoose';
import { TChat } from './Chat.interface';
import { ChatConstants } from './Chat.constant';

export const ChatMiddlewares = {
  schema: (schema: Schema<TChat>) => {
    schema.pre('save', function (next) {
      if (this.name?.trim()) return next();

      const { text, emoji, separator, date } = ChatConstants;

      this.name = `${emoji()} ${text()} ${separator()} ${date}`;
      next();
    });
  },
};
