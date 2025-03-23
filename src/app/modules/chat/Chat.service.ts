import { Types } from 'mongoose';
import { Message } from '../message/Message.model';
import Chat from './Chat.model';

export const ChatServices = {
  async create(user: Types.ObjectId, bot: string) {
    return await Chat.create({ user, bot });
  },
  async rename(chatId: string, name: string) {
    return await Chat.findByIdAndUpdate(chatId, { name });
  },
  async delete(chatId: string) {
    const session = await Chat.startSession();
    session.startTransaction();
    try {
      await Chat.findByIdAndDelete(chatId, { session });
      await Message.deleteMany({ chat: chatId }).session(session);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },
  async list({ user, page, limit }: Record<string, any>) {
    const chats = await Chat.find({ user })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Chat.countDocuments({ user });

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit),
        },
      },
      chats,
    };
  },
};
