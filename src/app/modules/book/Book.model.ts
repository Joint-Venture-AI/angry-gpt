import { Schema, model } from 'mongoose';
import { TBook } from './Book.interface';

const bookSchema = new Schema<TBook>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Book = model<TBook>('Book', bookSchema);

export default Book;
