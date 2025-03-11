import { z } from 'zod';

export const BookValidations = {
  create: z.object({
    body: z.object({
      title: z.string().min(1, { message: 'Title is required' }),
      author: z.string().min(1, { message: 'Author is required' }),
      description: z.string().min(1, { message: 'Description is required' }),
      price: z.number().min(1, { message: 'Price is required' }),
      stock: z.number().min(1, { message: 'Stock is required' }),
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
      price: z.number().optional(),
      stock: z.number().optional(),
      images: z.array(z.string()).optional(),
    }),
  }),
};
