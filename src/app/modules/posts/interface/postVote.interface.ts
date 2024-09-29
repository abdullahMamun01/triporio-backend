import { Types } from 'mongoose';

export type TVote = {
  postId: Types.ObjectId; // Using Mongoose ObjectId type for postId
  userId: Types.ObjectId; // Using Mongoose ObjectId type for userId
  hasUpvoted: boolean;
  hasDownvoted: boolean;
  upvoteCount: number;
  downvoteCount: number;
};
