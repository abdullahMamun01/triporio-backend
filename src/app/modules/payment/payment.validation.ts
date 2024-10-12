import { z } from 'zod';

export const stripePaymentServiceSchema = z.object({
  body: z
    .object({
      profileName: z.string().min(1, 'Name is required'),
      subscriptionType: z.enum(['monthly', 'yearly']),
      price: z.number(),
    })
    .superRefine((data, ctx) => {
      if (data.subscriptionType === 'monthly' && data.price !== 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Price for monthly subscription must be $10',
          path: ['price'], // This specifies which field is invalid
        });
      } else if (data.subscriptionType === 'yearly' && data.price !== 90) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Price for yearly subscription must be $90',
          path: ['price'],
        });
      }
    }),
});

export const stripeSessionSchema = z.object({
  body: z.object({
    session_id: z.string().min(1, 'Session ID is required'), // Ensures the session_id is a non-empty string
  }),
});
