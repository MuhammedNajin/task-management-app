import { z } from 'zod';

const objectIdSchema = z
  .string()
  .length(24, 'Must be a valid MongoDB ObjectId (24 characters)')
  .regex(/^[0-9a-fA-F]{24}$/, 'Must be a valid MongoDB ObjectId (hexadecimal)');

const taskBaseSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .trim(),
  description: z
    .string()
    .min(1, 'Description is required')
    .trim(),
});

export const taskCreateSchema = taskBaseSchema.extend({
  userId: objectIdSchema,
}).strict();

export const taskUpdateSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .min(1, 'Description is required')
    .trim()
    .optional(),
  status: z
    .enum(['pending', 'in_progress', 'completed'])
    .optional(),
}).strict();

export const taskIdSchema = z.object({
  id: objectIdSchema,
});

export const userIdSchema = z.object({
  userId: objectIdSchema,
});