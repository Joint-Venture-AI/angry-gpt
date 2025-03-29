import { z } from 'zod';

export const MessageValidations = {
  chat: z.object({
    body: z.object({
      message: z.string().min(1, 'Message is required'),
    }),
  }),
};
