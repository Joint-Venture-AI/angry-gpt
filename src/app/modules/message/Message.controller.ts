import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { MessageServices } from './Message.service';

export const ChatControllers = {
  create: catchAsync(async (req, res) => {
    const data = await MessageServices.create(req.body);

    serveResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'Message created successfully',
      data,
    });
  }),
  list: catchAsync(async (req, res) => {
    const { messages, meta } = await MessageServices.list(req.query);

    serveResponse(res, {
      message: 'Messages fetched successfully',
      meta,
      data: messages,
    });
  }),
};
