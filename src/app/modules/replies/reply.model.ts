import { model, Schema } from 'mongoose';
import TReply from './reply.interface';

 const ReplySchema = new Schema<TReply>({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  commentId: { type: Schema.Types.ObjectId, required: true, ref: 'Comments' },
  reply: { type: String, required: true },
}, {timestamps:true ,versionKey:false});


const ReplyModel = model<TReply>("Reply" , ReplySchema)

export default ReplyModel