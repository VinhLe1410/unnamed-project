import { z } from 'zod';

export const signupSchema = z
  .object({
    email: z.email('Please enter a valid email'),
    username: z.string().min(3, 'Username must be at least 5 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  });

export type SignupInput = z.infer<typeof signupSchema>;
