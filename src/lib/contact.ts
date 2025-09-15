import {z} from 'zod';

export const ContactSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Please write at least 10 characters')
});

export type ContactInput = z.infer<typeof ContactSchema>;
