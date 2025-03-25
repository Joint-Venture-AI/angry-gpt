import { TBot } from './Bot.interface';
import Bot from './Bot.model';

export const BotServices = {
  async create(botData: TBot) {
    return await Bot.create(botData);
  },

  async update(botId: string, botData: TBot) {
    return await Bot.findByIdAndUpdate(botId, botData, { new: true });
  },

  async delete(botId: string) {
    return await Bot.findByIdAndDelete(botId);
  },

  async list({ page, limit }: Record<string, any>) {
    const bots = await Bot.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Bot.countDocuments();

    return {
      bots,
      meta: {
        pagination: {
          limit,
          page,
          total,
          totalPage: Math.ceil(total / limit),
        },
      },
    };
  },
};
