import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import serveResponse from '../../../shared/serveResponse';
import { BookServices } from './Book.service';

export const BookController = {
  create: catchAsync(async (req, res) => {
    const data = await BookServices.create(req.body);

    serveResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'Book created successfully',
      data,
    });
  }),

  list: catchAsync(async (req, res) => {
    const { books, meta } = await BookServices.list(req.query);

    serveResponse(res, {
      message: 'Books fetched successfully',
      meta,
      data: books,
    });
  }),

  retrieve: catchAsync(async (req, res) => {
    const data = await BookServices.retrieve(req.params.id);

    serveResponse(res, {
      message: 'Book fetched successfully',
      data,
    });
  }),

  edit: catchAsync(async (req, res) => {
    const data = await BookServices.edit(req.params.bookId, req.body);

    serveResponse(res, {
      message: 'Book updated successfully',
      data,
    });
  }),

  delete: catchAsync(async (req, res) => {
    const data = await BookServices.delete(req.params.id);

    serveResponse(res, {
      message: 'Book deleted successfully',
      data,
    });
  }),
};
