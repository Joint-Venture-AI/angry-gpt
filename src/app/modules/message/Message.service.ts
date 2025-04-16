import OpenAI from 'openai';
import { ChatConstants } from '../chat/Chat.constant';
import { openai } from '../chat/Chat.lib';
import Chat from '../chat/Chat.model';
import { Message } from './Message.model';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';

export const MessageServices = {
  async chat(chatId: string, message: string) {
    const chat: any = (await Chat.findById(chatId).populate('bot', 'context'))!;

    const histories = await Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .select('content sender -_id')
      .limit(30);

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: chat.bot.context },
      ...histories.reverse().map(msg => ({
        role: (msg.sender === 'user' ? 'user' : 'assistant') as
          | 'user'
          | 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    await Message.create({ chat: chatId, content: message, sender: 'user' });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
    });

    const { content } = completion.choices[0].message;

    if (!content)
      throw new ServerError(
        StatusCodes.BAD_REQUEST,
        'Failed to generate response',
      );

    await Message.create({ chat: chatId, content, sender: 'bot' });

    const { emoji, separator, date } = ChatConstants;

    chat.name = `${emoji()} ${this.genTitle(content!)} ${separator()} ${date()}`;
    await chat.save();

    return content;
  },

  async list({ chat, page, limit }: Record<string, any>) {
    const messages = await Message.find({ chat })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-chat')
      .lean();

    const total = await Message.countDocuments({ chat });

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

  genTitle(response: string) {
    const rawLine = response.split('\n').find(line => line.trim());

    if (!rawLine) return '';

    // Step 1: Clean markdown (*, **, _, __)
    const title = rawLine
      .replace(/(\*\*|\*|__|_)(.*?)\1/g, '$2')
      .replace(/[(){}[\]]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Step 2: Try to find a full sentence ending (. ? !) within 50 chars
    const match = title.match(/^(.{1,50}?[.?!])\s/);

    if (match) return match[1].trim();

    // Step 3: Otherwise just slice to 50 chars
    return title.slice(0, 50).trim();
  },
};
