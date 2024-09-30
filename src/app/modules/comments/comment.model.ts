import { model, Schema } from 'mongoose';
import TComment from './comment.interface';

const ReplySchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  parentId: { type: Schema.Types.ObjectId, required: true, ref: 'Comments' },
  reply: { type: String, required: true },
});

const CommentSchema = new Schema<TComment>({
  post: { type: Schema.Types.ObjectId, required: true, ref: 'Post' }, // Associated post
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }, // User who made the comment
  comment: {
    description: { type: String, required: true },
    replies: [ReplySchema], // Nested replies
  },
}, {timestamps: true , versionKey:false});

const CommentModel = model<TComment>('Comments', CommentSchema);

export default CommentModel;
