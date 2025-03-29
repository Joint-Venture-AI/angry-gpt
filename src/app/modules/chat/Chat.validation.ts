import { z } from 'zod';
import { exists } from '../../../util/db/exists';
import Bot from '../bot/Bot.model';

export const ChatValidations = {
  create: z.object({
    query: z.object({
      bot: z.string().refine(exists(Bot)),
    }),
  }),

  rename: z.object({
    body: z.object({
      name: z.string().min(1, 'Name is required'),
    }),
  }),
};
