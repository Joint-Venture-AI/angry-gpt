import { z } from 'zod';
import Chat from './Chat.model';
import { exists } from '../../../util/db/exists';

export const ChatValidations = {
  create: z.object({
    query: z.object({
      bot: z.enum(['angry', 'lola', 'mimi']).default('angry'),
    }),
  }),

  rename: z.object({
    body: z.object({
      name: z.string().min(1, 'Name is required'),
    }),

    params: z.object({
      chatId: z.string().refine(exists(Chat)),
    }),
  }),

  delete: z.object({
    params: z.object({
      chatId: z.string().refine(exists(Chat)),
    }),
  }),
};
