import { z } from 'zod';
import categoryList from './post.constants';

const postValidationSchena = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    categories: z.enum(categoryList, {
      required_error: 'Categories are required',
    }),
    premium: z.union([z.boolean(), z.string()])  
    .optional()
    .transform((value) => {
   
      if (typeof value === 'string') {
        return value === 'true';
      }
      return value;
    }),
  }),
});

export default postValidationSchena;
