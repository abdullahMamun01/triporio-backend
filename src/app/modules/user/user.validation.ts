import { z } from 'zod';
import { USER_ROLE } from './user.constants';

const userSchmea = z.object({
  firstName: z.string({ required_error: 'Name is required' }),
  lastName: z.string({ required_error: 'Name is required' }),
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address' })
    // eslint-disable-next-line no-useless-escape
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
      message: 'Invalid email format',
    }),
  password: z.string({ required_error: 'Password is required!' }),
  phone: z
    .string({ required_error: 'phone number is required' })
    .regex(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format' }),
  role: z.enum(['user', 'admin']).default('user'),
  address: z.string({ required_error: 'Address is required' }),
});

const userRegisterValidationSchema = z.object({
  body: userSchmea,
});

export const updateUserValidateSchema = z.object({
  body: z.object({
    firstName: z
      .string({ required_error: 'First name is required' })
      .optional(),
    lastName: z.string({ required_error: 'Last name is required' }).optional(),
    phone: z
      .string({ required_error: 'Phone number is required' })
      .regex(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format' })
      .optional(),
    address: z.string().optional(),
    image: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    website: z.string().url({ message: 'Invalid URL format' }).optional(),
    socialLinks: z
      .object({
        facebook: z.string().url({ message: 'Invalid URL format' }).optional(),
        twitter: z.string().url({ message: 'Invalid URL format' }).optional(),
        instagram: z.string().url({ message: 'Invalid URL format' }).optional(),
      })
      .optional(),
  }),
});

export const userRoleSchema = z.object({
  body: z.object({
    role: z.enum(
      Object.values(USER_ROLE) as [
        (typeof USER_ROLE)[keyof typeof USER_ROLE],
        ...(typeof USER_ROLE)[keyof typeof USER_ROLE][],
      ],
    ),
  }),
});

export default userRegisterValidationSchema;
