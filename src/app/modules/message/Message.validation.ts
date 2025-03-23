import { z } from 'zod';
import Chat from '../chat/Chat.model';

export const MessageValidations = {
  list: z.object({
    params: z.object({
      chatId: z.string().refine(async id => !!(await Chat.findById(id)), {
        message: 'Chat not found',
      }),
    }),
  }),
  chat: z.object({
    body: z.object({
      message: z.string().min(1, 'Message is required'),
    }),
    params: z.object({
      chatId: z.string().refine(async id => !!(await Chat.findById(id)), {
        message: 'Chat not found',
      }),
    }),
  }),
};
