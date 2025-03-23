import { z } from 'zod';
import Chat from './Chat.model';

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
      chatId: z.string().refine(async id => !!(await Chat.findById(id)), {
        message: 'Chat not found',
      }),
    }),
  }),
  delete: z.object({
    params: z.object({
      chatId: z.string().refine(async id => !!(await Chat.findById(id)), {
        message: 'Chat not found',
      }),
    }),
  }),
};
