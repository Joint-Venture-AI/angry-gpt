import { z } from 'zod';

export const QueryValidations = {
  list: z.object({
    query: z.object({
      page: z.coerce.number().default(1),
      limit: z.coerce.number().default(10),
    }),
  }),
};
