
import { z } from "zod";



const replyValidateSchema = z.object({
  body: z.object({
    reply: z.string(),
  }),
});


export {replyValidateSchema}