import { z } from 'zod';

export const userRegistrationSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(30, { message: 'Username cannot exceed 30 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' }),
  email: z
    .string()
    .email({ message: 'Please provide a valid email address' })
    .max(255, { message: 'Email cannot exceed 255 characters' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(128, { message: 'Password cannot exceed 128 characters' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    }),
});


export const loginSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(1, { message: 'Username or email is required' })
    .max(255, { message: 'Username or email cannot exceed 255 characters' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .max(128, { message: 'Password cannot exceed 128 characters' }),
});

export type UserRegistrationDto = z.infer<typeof userRegistrationSchema>;
export type LoginDto = z.infer<typeof loginSchema>;