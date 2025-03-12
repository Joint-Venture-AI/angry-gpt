import { z } from 'zod';

export const SubscriptionValidations = {
  create: z.object({
    body: z.object({
      name: z.string().min(1, 'Name is required'),
      price: z.number().min(1, 'Price is required'),
      interval: z.enum(['day', 'week', 'month', 'year'], {
        message: 'Invalid interval',
      }),
      interval_count: z
        .number()
        .min(1, 'Interval count is required')
        .default(1),
      features: z.array(z.string()).min(1, 'Features are required'),
    }),
  }),

  update: z.object({
    body: z.object({
      name: z.string().optional(),
      price: z.number().optional(),
      interval: z.enum(['day', 'week', 'month', 'year']).optional(),
      interval_count: z
        .number()
        .min(1, 'Interval count is required')
        .optional(),
      features: z.array(z.string()).optional(),
    }),
  }),
};
