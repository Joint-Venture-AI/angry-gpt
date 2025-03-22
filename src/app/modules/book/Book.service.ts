import { StatusCodes } from 'http-status-codes';
import { TBook } from './Book.interface';
import Book from './Book.model';
import ServerError from '../../../errors/ServerError';
import deleteFile from '../../../util/file/deleteFile';
import { TPagination } from '../../../util/server/serveResponse';

export const BookServices = {
  async create(bookData: TBook) {
    return await Book.create(bookData);
  },

  async list({ page = '1', limit = '10', search = '', sort = '-createdAt' }) {
    const query = search
      ? {
          $or: [
            { title: { $regex: new RegExp(search, 'i') } },
            { author: { $regex: new RegExp(search, 'i') } },
          ],
        }
      : {};

    const total = await Book.countDocuments(query);

    const books = await Book.find(query)
      .sort(sort)
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const pagination: TPagination = {
      limit: +limit,
      page: +page,
      total,
      totalPage: Math.ceil(total / +limit),
    };

    return {
      books,
      meta: {
        pagination,
        search,
        sort,
      },
    };
  },

  async retrieve(id: string) {
    return await Book.findById(id);
  },

  async edit(id: string, bookData: TBook) {
    const book = await Book.findById(id);

    if (!book) throw new ServerError(StatusCodes.NOT_FOUND, 'Book not found');

    const oldImages = book.images || [];

    Object.assign(book, bookData);
    await book.save();

    oldImages?.forEach(deleteFile);

    return book;
  },

  async delete(id: string) {
    const book = await Book.findByIdAndDelete(id);

    if (!book) throw new ServerError(StatusCodes.NOT_FOUND, 'Book not found');

    book.images?.forEach(deleteFile);

    return book;
  },
};
