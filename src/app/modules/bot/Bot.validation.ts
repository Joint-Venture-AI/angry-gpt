import { z } from 'zod';

export const BotValidations = {
  createBot: z.object({
    body: z.object({
      name: z.string().min(1, { message: 'Name is required' }),
      description: z.string().min(1, { message: 'Description is required' }),
      logo: z.string().optional(),
      context: z.string().min(1, { message: 'Context is required' }),
      isFree: z
        .string()
        .transform(val => val === 'true')
        .optional(),
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
      isFree: z
        .string()
        .transform(val => val === 'true')
        .optional(),
      url: z.string().optional(),
    }),
  }),
};
