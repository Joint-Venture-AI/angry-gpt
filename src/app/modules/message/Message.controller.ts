import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { MessageServices } from './Message.service';

export const MessageControllers = {
  chat: catchAsync(async ({ params, body, query }, res) => {
    const message = await MessageServices.chat(
      params.chatId,
      body.message,
      query.bot as string,
    );

    serveResponse(res, {
      message,
    });
  }),

  list: catchAsync(async ({ query, params }: any, res) => {
    query.chat = params.chatId;

    const { messages, meta } = await MessageServices.list(query);

    serveResponse(res, {
      message: 'Messages fetched successfully',
      meta,
      data: messages.reverse().map((message: any) => {
        message.isBot = message.sender === 'bot';

        return message;
      }),
    });
  }),
};
