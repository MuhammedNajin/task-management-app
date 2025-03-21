import { z } from 'zod';

const subtaskSchema = z.object({
  title: z.string().min(1, 'Subtask title must be at least 1 character'),
  completed: z.boolean(), 
});

export const taskCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string(),
  userId: z.string(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  category: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  subtasks: z.array(subtaskSchema).optional(), 
});

export const taskUpdateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').optional(),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  category: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  subtasks: z.array(subtaskSchema).optional(), 
});

export const taskIdSchema = z.object({
  id: z.string(),
});

export const userIdSchema = z.object({
  userId: z.string(),
});


export const subtaskStatusUpdateSchema = z.object({
  completed: z.boolean(),
});