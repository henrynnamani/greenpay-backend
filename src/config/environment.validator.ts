import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.string().default('3000'),
  MONGO_URI: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES: z.string().regex(/^\d+(d|h|m)$/, {
    message: 'JWT_EXPIRES must be in the format like "10m", "2h", or "7d"',
  }),
  OPENAI_API_KEY: z.string(),
  CELO_NODE_URL: z.string(),
});

export type EnvSchema = z.infer<typeof envSchema>;
