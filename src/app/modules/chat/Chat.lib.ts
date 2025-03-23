import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import config from '../../../config';

export const openai = new OpenAI({
  apiKey: config.chatgpt.key,
});

export const gemini = new GoogleGenerativeAI(
  config.gemini.key,
).getGenerativeModel({ model: 'gemini-2.0-flash' });

// const response = await openai.chat.completions.create({
//   model: 'gpt-3.5-turbo',
//   messages: [
//     { role: 'system', content: personaPrompt },
//     { role: 'user', content: message },
//   ],
//   temperature: 0.9,
// });

// const content = response.choices[0].message.content;
