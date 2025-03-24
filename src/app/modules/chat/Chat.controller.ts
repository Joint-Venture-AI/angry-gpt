import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { ChatServices } from './Chat.service';

export const ChatControllers = {
  create: catchAsync(async (req, res) => {
    const data = await ChatServices.create(
      req.user!._id!,
      req.query.bot as string,
    );

    serveResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'Chat created successfully',
      data,
    });
  }),
  rename: catchAsync(async (req, res) => {
    const data = await ChatServices.rename(req.params.chatId, req.body.name);

    serveResponse(res, {
      message: 'Chat renamed successfully',
      data,
    });
  }),
  delete: catchAsync(async (req, res) => {
    await ChatServices.delete(req.params.chatId);

    serveResponse(res, {
      message: 'Chat deleted successfully',
    });
  }),
  clear: catchAsync(async (req, res) => {
    await ChatServices.clear(req.user!._id!);

    serveResponse(res, {
      message: 'Chat cleared successfully',
    });
  }),
  list: catchAsync(async ({ query, user }: any, res) => {
    const filter = {
      page: +query.page || 1,
      limit: +query.limit || 10,
      user: user._id,
    };

    const { chats, meta } = await ChatServices.list(filter);

    serveResponse(res, {
      message: 'Chats fetched successfully',
      meta,
      data: chats,
    });
  }),
};
