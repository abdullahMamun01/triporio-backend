import { z } from 'zod';

const commentValidateSchema = z.object({
  body: z.object({
    comment: z.string().min(1, 'Description is required'),
  }),
});

const updateCommentValidateSchema = z.object({
  body: z.object({
    newComment: z.string().min(1, 'Description is required'),
  }),
});


export { commentValidateSchema ,updateCommentValidateSchema};
