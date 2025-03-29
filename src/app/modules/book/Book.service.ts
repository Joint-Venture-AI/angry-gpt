import { TBook } from './Book.interface';
import Book from './Book.model';
import deleteFile from '../../../util/file/deleteFile';

export const BookServices = {
  async create(bookData: TBook) {
    return await Book.create(bookData);
  },

  async list({ page, limit, search, sort }: Record<string, any>) {
    const query = search
      ? {
          $or: [
            { title: { $regex: new RegExp(search, 'i') } },
            { author: { $regex: new RegExp(search, 'i') } },
          ],
        }
      : {};

    const books = await Book.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Book.countDocuments(query);

    return {
      books,
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit),
        },
        search,
        sort,
      },
    };
  },

  async retrieve(id: string) {
    return await Book.findById(id);
  },

  async update(id: string, bookData: TBook) {
    const book = (await Book.findById(id))!;

    const oldImages = book.images;

    Object.assign(book, bookData);
    await book.save();

    oldImages?.forEach(deleteFile);

    return book;
  },

  async delete(bookId: string) {
    const book = (await Book.findByIdAndDelete(bookId))!;

    book.images?.forEach(deleteFile);

    return book;
  },
};
