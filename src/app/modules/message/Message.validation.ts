import { z } from 'zod';
import Chat from '../chat/Chat.model';
import { exists } from '../../../util/db/exists';

export const MessageValidations = {
  list: z.object({
    params: z.object({
      chatId: z.string().refine(exists(Chat)),
    }),
  }),

  chat: z.object({
    body: z.object({
      message: z.string().min(1, 'Message is required'),
    }),

    params: z.object({
      chatId: z.string().refine(exists(Chat)),
    }),
  }),
};
