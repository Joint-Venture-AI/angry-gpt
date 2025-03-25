import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { MessageServices } from './Message.service';

export const MessageControllers = {
  chat: catchAsync(async (req, res) => {
    const message = await MessageServices.chat(
      req.params.chatId,
      req.body.message,
    );

    serveResponse(res, {
      message,
    });
  }),

  list: catchAsync(async ({ query, params }: any, res) => {
    const filter = {
      page: +query.page || 1,
      limit: +query.limit || 10,
      chat: params.chatId,
    };

    const { messages, meta } = await MessageServices.list(filter);

    serveResponse(res, {
      message: 'Messages fetched successfully',
      meta,
      data: messages.reverse(),
    });
  }),
};
