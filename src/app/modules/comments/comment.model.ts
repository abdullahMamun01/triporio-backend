import { model, Schema } from 'mongoose';
import TComment from './comment.interface';

const CommentSchema = new Schema<TComment>({
  post: { type: Schema.Types.ObjectId, required: true, ref: 'Post' }, // Associated post
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }, // User who made the comment
  comment: { type: String, required: true },
}, {timestamps: true , versionKey:false});

const CommentModel = model<TComment>('Comments', CommentSchema);

export default CommentModel;
