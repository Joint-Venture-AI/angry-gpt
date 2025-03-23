import { model, Schema } from 'mongoose';
import { TChat } from './Chat.interface';

const chatSchema = new Schema<TChat>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bot: {
      type: String,
      enum: ['angry', 'lola', 'mimi'],
      default: 'angry',
    },
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Chat = model<TChat>('Chat', chatSchema);

export default Chat;
