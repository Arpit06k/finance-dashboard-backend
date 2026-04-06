import { z } from 'zod';

export const RegisterUserSchema = z.object({
  name: z.string({ message: 'Name is required' }).min(1, 'Name cannot be empty'),
  email: z.string({ message: 'Email is required' }).email('Invalid email format'),
  password: z.string({ message: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
  role: z.enum(['viewer', 'analyst', 'admin']).optional(),
});

export const LoginUserSchema = z.object({
  email: z.string({ message: 'Email is required' }).email('Invalid email format'),
  password: z.string({ message: 'Password is required' }),
});

export const CreateRecordSchema = z.object({
  amount: z.number({ message: 'Amount is required' }).positive('Amount must be positive'),
  type: z.enum(['income', 'expense'], { message: 'Type must be income or expense' }),
  category: z.string({ message: 'Category is required' }),
  date: z.string().datetime().optional().or(z.date().optional()),
  notes: z.string().optional(),
});