import { z } from 'zod';
import Book from '../book/Book.model';
import { Types } from 'mongoose';
import { exists } from '../../../util/db/exists';
import Order from './Order.model';

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
            book: z.string().refine(val => Types.ObjectId.isValid(val), {
              message: 'Invalid book ID',
            }),
            quantity: z.number().min(1, 'Quantity is required'),
          }),
        )
        .min(1, 'At least one book is required')
        .transform(async details => {
          const validDetails = await Promise.all(
            details.map(async item => {
              const book = await Book.findById(item.book);
              return book ? item : null;
            }),
          );
          return validDetails.filter(Boolean);
        }),
    }),
  }),

  exists: z.object({
    params: z.object({
      orderId: z.string().refine(exists(Order)),
    }),
  }),
};
