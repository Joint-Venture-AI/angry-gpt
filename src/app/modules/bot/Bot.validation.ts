import { z } from 'zod';
import { exists } from '../../../util/db/exists';
import Bot from './Bot.model';

export const BotValidations = {
  createBot: z.object({
    body: z.object({
      name: z.string().min(1, { message: 'Name is required' }),
      description: z.string().min(1, { message: 'Description is required' }),
      logo: z.string().optional(),
      context: z.string().optional(),
      isFree: z.boolean().optional(),
    }),
  }),

  createUrl: z.object({
    body: z.object({
      name: z.string().min(1, { message: 'Name is required' }),
      description: z.string().min(1, { message: 'Description is required' }),
      logo: z.string().optional(),
      url: z.string().url({ message: 'Invalid URL' }),
      isBot: z.literal(false).default(false),
    }),
  }),

  edit: z.object({
    body: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      logo: z.string().optional(),
      context: z.string().optional(),
      isFree: z.boolean().optional(),
      url: z.boolean().optional(),
    }),
  }),

  exists: z.object({
    params: z.object({
      botId: z.string().refine(exists(Bot)),
    }),
  }),

  list: z.object({
    query: z.object({
      page: z.coerce.number().default(1),
      limit: z.coerce.number().default(10),
    }),
  }),
};
