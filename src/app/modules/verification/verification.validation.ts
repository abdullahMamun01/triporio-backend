import { z } from 'zod';

const verifiationEamilSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'email is required' })
      .email('must be a valid email'),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'email is required' })
      .email('must be a valid email'),
    newPassword: z.string({ required_error: 'otp is required' }),
  }),
});

const verificationOtpSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'email is required' })
      .email('must be a valid email'),
    otp: z.string({ required_error: 'otp is required' }),
  }),
});

export { verifiationEamilSchema, verificationOtpSchema, resetPasswordSchema };
