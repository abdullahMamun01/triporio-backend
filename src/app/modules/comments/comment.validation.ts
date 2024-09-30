import { z } from 'zod';
import { Types } from 'mongoose'; // Assuming you're using Mongoose types

// Helper function to validate ObjectId
const objectIdSchema = z
  .instanceof(Types.ObjectId)
  .or(z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ObjectId format'));


const replyValidateSchema = z.object({
  body: z.object({
    parentId: objectIdSchema,
    replies: z.string(),
  }),
});


const commentValidateSchema = z.object({
  body: z.object({
    comment: z.object({
      description: z.string().min(1, 'Description is required'),
    }),
  }),
});

export { commentValidateSchema, replyValidateSchema };
