import { Schema, model } from 'mongoose';
import { TVote } from '../interface/postVote.interface';

const VoteSchema = new Schema<TVote>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    upvoteCount: {
      type: Number,
      default: 0,
    },
    downvoteCount: {
      type: Number,
      default: 0,
    },

    votes: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        voteType: {
          type: String,
          enum: ['upvote', 'downvote'],
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const VoteModel = model<TVote>('Votes', VoteSchema);
