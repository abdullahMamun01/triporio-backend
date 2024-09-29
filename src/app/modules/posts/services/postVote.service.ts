
import PostModel from '../model/post.model';
import AppError from '../../../error/AppError';
import httpStatus from 'http-status';
import UserModel from '../../user/user.model';
import { VoteModel } from '../model/postVote.model';

const upvote = async (postId: string, userId: string) => {
  const findPost = await PostModel.findById(postId);
  const findUser = await UserModel.findById(userId);

  if (!findPost) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Post with ID ${postId} not found. Please check that the post ID is correct and that the post exists.`,
    );
  }
  if (!findUser) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User not found. Please ensure that the user ID is correct and that the user exists in the system.',
    );
  }

  const upvoted = await VoteModel.findOneAndUpdate(
    { postId },
    {
      $inc: { upvoteCount: 1, downvoteCount: -1 },
      $set: { hasUpvoted: true, hasDownvoted: false },
    },
    { new: true, runValidators: true, upsert: true },
  );

  return upvoted;
};

const downVote = async (postId: string, userId: string) => {
  const findPost = await PostModel.findById(postId);
  const findUser = await UserModel.findById(userId);

  if (!findPost) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Post with ID ${postId} not found. Please check that the post ID is correct and that the post exists.`,
    );
  }
  if (!findUser) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User not found. Please ensure that the user ID is correct and that the user exists in the system.',
    );
  }

  const downVoted = await VoteModel.findOneAndUpdate(
    { postId },
    {
      $inc: { upvoteCount: -1, downvoteCount: 1 },
      $set: { hasUpvoted: false, hasDownvoted: true },
    },
    { new: true, runValidators: true, upsert: true },
  );
  return downVoted;
};

export const voteService = {
  upvote,
  downVote,
};
