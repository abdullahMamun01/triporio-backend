import { model, Schema } from 'mongoose';
import TVote from './postVote.interface';

const PostSchema = new Schema<TVote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    voteType: { type: String, enum: ['upvote', 'downvote'], required: true },
  },
  { timestamps: true, versionKey: false },
);

const VoteModel = model<TVote>('Vote', PostSchema);
export default VoteModel;
