import { Types } from 'mongoose';

type TVote = {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  voteType: 'upvote' | 'downvote';
};

export default TVote;
