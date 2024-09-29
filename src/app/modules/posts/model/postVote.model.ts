import { Schema, model } from 'mongoose';
import { TVote } from '../interface/postVote.interface';

const VoteSchema = new Schema<TVote>(
    {
        postId: {
          type: Schema.Types.ObjectId,
          ref: 'Post',
          required: true,
        },
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        hasUpvoted: {
          type: Boolean,
          default: false,
        },
        hasDownvoted: {
          type: Boolean,
          default: false,
        },
        upvoteCount: {
          type: Number,
          default: 0,
        },
        downvoteCount: {
          type: Number,
          default: 0,
        },
      },
  {
    timestamps: true,
  }
);

export const VoteModel = model<TVote>('Vote', VoteSchema);
