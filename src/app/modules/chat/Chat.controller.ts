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
};
