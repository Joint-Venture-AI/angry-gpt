import { z } from 'zod';
import { exists } from '../../../util/db/exists';
import Book from './Book.model';

export const BookValidations = {
  create: z.object({
    body: z.object({
      title: z.string().min(1, { message: 'Title is required' }),
      author: z.string().min(1, { message: 'Author is required' }),
      description: z.string().min(1, { message: 'Description is required' }),
      price: z
        .string()
        .transform(val => parseFloat(val))
        .refine(val => !isNaN(val), {
          message: 'Price must be a number',
        }),
      stock: z
        .string()
        .transform(val => parseInt(val, 10))
        .refine(val => !isNaN(val), {
          message: 'Stock must be an integer',
        }),
      images: z
        .array(z.string())
        .min(1, { message: 'At least one image is required' }),
    }),
  }),

  edit: z.object({
    body: z.object({
      title: z.string().optional(),
      author: z.string().optional(),
      description: z.string().optional(),
      price: z
        .string()
        .transform(val => parseFloat(val))
        .refine(val => !isNaN(val), {
          message: 'Price must be a number',
        })
        .optional(),
      stock: z
        .string()
        .transform(val => parseInt(val, 10))
        .refine(val => !isNaN(val), {
          message: 'Stock must be an integer',
        })
        .optional(),
      images: z.array(z.string()).optional(),
    }),
  }),

  exists: z.object({
    params: z.object({
      bookId: z.string().refine(exists(Book)),
    }),
  }),
};
