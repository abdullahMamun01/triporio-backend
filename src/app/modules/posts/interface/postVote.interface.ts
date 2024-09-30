import { Types } from 'mongoose';


type TVotes = {
  userId: Types.ObjectId; // Reference to the User model
  voteType: 'upvote' | 'downvote'; // Enum type for vote type
}


export type TVote = {
  postId: Types.ObjectId; 
  upvoteCount: number;
  downvoteCount: number;
  votes?: TVotes[];
};
