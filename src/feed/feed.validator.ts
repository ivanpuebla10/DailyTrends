import { z } from 'zod';

export const FeedSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  summary: z.string(),
  publicationDate: z.string().transform((str) => new Date(str)),
});

export const IdParamSchema = z.object({
  id: z
    .string()
    .length(24)
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID'),
});
