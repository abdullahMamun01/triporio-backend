import { z } from 'zod';

export const stripePaymentServiceSchema = z.object({
  body: z.object({
    profileName: z.string().min(1, 'Name is required'), 
  })
});

export const stripeSessionSchema = z.object({
  body: z.object({
    session_id: z.string().min(1, 'Session ID is required'), // Ensures the session_id is a non-empty string
  }),
});
