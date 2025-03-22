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

  async list(query: Record<string, any>) {
    const page = +query.page || 1,
      limit = +query.limit || 10,
      search = query.search || '',
      sort = query.sort || 'createdAt';

    const books = await Book.aggregate([
      {
        $match: {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { author: { $regex: search, $options: 'i' } },
          ],
        },
      },
      {
        $sort: {
          [sort]: -1,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ]);

    const total = await Book.countDocuments({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ],
    });

    const pagination: TPagination = {
      limit,
      page,
      total,
      totalPage: Math.ceil(total / limit),
    };

    return {
      books,
      meta: {
        pagination,
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
