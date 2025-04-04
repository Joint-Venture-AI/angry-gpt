import { z } from 'zod';

export const CartValidations = {
  update: z.object({
    query: z.object({
      quantity: z.coerce.number().min(1).default(1),
    }),
  }),
};
