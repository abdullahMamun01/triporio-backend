import { Schema } from 'mongoose';
import { z } from 'zod';
import categoryList from './post.constants';

const postValidationSchena = z.object({
  body: z.object({
    userId: z.instanceof(Schema.Types.ObjectId), 
    title: z.string().min(1, 'Title is required'), 
    description: z.string().min(1, 'Description is required'),
    images: z.array(z.string().url(), {
      required_error: 'Images are required',
    }),
    categories: z.array(z.enum(categoryList), {
      required_error: 'Categories are required',
    }), 
    premium: z.boolean().optional(), 
  }),
});


export default  postValidationSchena