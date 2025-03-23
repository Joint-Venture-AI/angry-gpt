import { TMessage } from './Message.interface';
import { Message } from './Message.model';

export const MessageServices = {
  async create(messageData: TMessage) {
    return await Message.create(messageData);
  },

  async list(query: Record<string, any>) {
    const { chatId } = query;
    const page = +query.page || 1;
    const limit = +query.limit || 10;

    const messages = await Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Message.countDocuments({ chat: chatId });

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit),
        },
      },
      messages,
    };
  },
};
