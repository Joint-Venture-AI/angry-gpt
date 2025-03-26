import { z } from 'zod';
import { EOrderState } from './Order.enum';
import Book from '../book/Book.model';
import { exists } from '../../../util/db/exists';
import config from '../../../config';

export const OrderValidation = {
  checkout: z.object({
    body: z.object({
      customer: z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email format').optional(),
        phone: z.string().optional(),
        address: z.object({
          country: z.string().min(1, 'Country is required'),
          address: z.string().min(1, 'Address is required'),
          zip: z.string().min(1, 'Zip is required'),
          city: z.string().min(1, 'City is required'),
          apartment: z.string().optional(),
        }),
      }),

      details: z
        .array(
          z.object({
            book: z.string().refine(exists(Book)),
            quantity: z.number().default(1),
          }),
        )
        .min(1, 'At least one book is required'),
    }),

    query: z.object({
      method: z.enum(config.payment.methods),
    }),
  }),

  state: z.object({
    params: z.object({
      state: z
        .string()
        .transform(val => val.toUpperCase() as EOrderState)
        .refine(val => val in EOrderState, { message: 'Invalid order state' }),
    }),
  }),
};
