// src/utils/validationSchema/Task.schema.ts
import { z } from 'zod';

export const taskCreateSchema = z.object({
    title: z.string().min(3),
    description: z.string(),
    userId: z.string(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    category: z.string().optional(),
    dueDate: z.string().datetime().optional(),
    subtasks: z.array(z.string()).optional(),
});

export const taskUpdateSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    status: z.enum(['pending', 'in_progress', 'completed']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    category: z.string().optional(),
    dueDate: z.string().datetime().optional(),
    subtasks: z.array(z.string()).optional(),
});

export const taskIdSchema = z.object({
    id: z.string(),
});

export const userIdSchema = z.object({
    userId: z.string(),
});