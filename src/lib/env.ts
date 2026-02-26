import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  ADMIN_SECRET: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
})

const parsed = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  ADMIN_SECRET: process.env.ADMIN_SECRET,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
})

export const env = {
  ...parsed,
  // Fallback for local/dev if ADMIN_SECRET is not set.
  // In production, set ADMIN_SECRET explicitly in the environment.
  ADMIN_SECRET: parsed.ADMIN_SECRET ?? 'dev-admin-secret',
}


