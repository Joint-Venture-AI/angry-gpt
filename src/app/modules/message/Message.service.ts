import { gemini } from '../chat/Chat.lib';
import Chat from '../chat/Chat.model';
import { chatModel } from './Message.constant';
import { Message } from './Message.model';

export const MessageServices = {
  async chat(chatId: string, message: string) {
    const chat = await Chat.findById(chatId);

    const histories = await Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .select('content sender -_id')
      .limit(5);

    const history = [
      {
        role: 'user',
        parts: [{ text: chatModel[chat!.bot] }],
      },
      ...histories.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
    ];

    const session = gemini.startChat({ history });

    await Message.create({ chat: chatId, content: message, sender: 'user' });

    const result = await session.sendMessage(message);
    const content = result.response.text();

    await Message.create({ chat: chatId, content, sender: 'bot' });

    chat!.name = `${this.genTitle(content)}...`;
    await chat!.save();

    return content;
  },

  async list({ chat, page, limit }: Record<string, any>) {
    const messages = await Message.find({ chat })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

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

    if (!rawLine) {
      const date = new Date();

      const dateFormats = [
        date.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' }),
        date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      ];

      const titleTemplates = [
        'Thoughts from',
        'Conversation on',
        'AI Session -',
        'Ideas Unlocked -',
        'You + AI •',
        'Memory from',
      ];

      const randomDate =
        dateFormats[Math.floor(Math.random() * dateFormats.length)];
      const randomText =
        titleTemplates[Math.floor(Math.random() * titleTemplates.length)];

      return `${randomText} ${randomDate}`;
    }

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
