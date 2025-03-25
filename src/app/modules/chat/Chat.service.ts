import { Types } from 'mongoose';
import { Message } from '../message/Message.model';
import Chat from './Chat.model';

export const ChatServices = {
  async create(user: Types.ObjectId, bot: string) {
    return await Chat.create({ user, bot });
  },

  async rename(chatId: string, name: string) {
    return await Chat.findByIdAndUpdate(chatId, { name }, { new: true });
  },

  async delete(chat: string | Types.ObjectId) {
    const session = await Chat.startSession();
    session.startTransaction();
    try {
      await Chat.findByIdAndDelete(chat, { session });
      await Message.deleteMany({ chat }, { session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  },

  async clear(user: Types.ObjectId) {
    const chats = await Chat.find({ user }).select('_id');
    await Promise.allSettled(chats.map(({ _id }) => this.delete(_id)));
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
