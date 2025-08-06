import { z } from 'zod';

export const createSchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
});

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});
