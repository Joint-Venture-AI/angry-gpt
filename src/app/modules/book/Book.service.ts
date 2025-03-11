import { StatusCodes } from 'http-status-codes';
import { TBook } from './Book.interface';
import Book from './Book.model';
import ServerError from '../../../errors/ServerError';
import deleteFile from '../../../shared/deleteFile';

export const BookServices = {
  async create(bookData: TBook) {
    return await Book.create(bookData);
  },

  async list(query: any) {
    return await Book.find(query);
  },

  async retrieve(id: string) {
    return await Book.findById(id);
  },

  async edit(id: string, bookData: TBook) {
    return await Book.findByIdAndUpdate(id, bookData, {
      new: true,
      runValidators: true,
      upsert: true,
    });
  },

  async delete(id: string) {
    const book = await Book.findByIdAndDelete(id);

    if (!book) throw new ServerError(StatusCodes.NOT_FOUND, 'Book not found');

    book.images?.forEach(async (image: string) => await deleteFile(image));

    return book;
  },
};
