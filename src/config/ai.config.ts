import { registerAs } from '@nestjs/config';

export default registerAs('ai', () => ({
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  cohere: {
    apiKey: process.env.COHERE_API_KEY,
  },
}));
