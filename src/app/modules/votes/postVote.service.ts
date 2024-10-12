import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import UserModel from '../user/user.model';
import TVote from './postVote.interface';
import VoteModel from './postVote.model';
import { Types } from 'mongoose';

const upvoteSaveIntoDB = async (payload: TVote) => {
  const user = await UserModel.findById(payload.userId);
  const userId = new Types.ObjectId(payload.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'use not found!');
  }
  const hasUpvoted = await VoteModel.findOne({
    postId: payload.postId,
    userId,
    voteType: 'upvote',
  });
  if (hasUpvoted) {
    const removeVote = await VoteModel.findOneAndDelete({
      postId: payload.postId,
      userId,
    });
    return removeVote;
  }

  const upvote = await VoteModel.findOneAndUpdate(
    { postId: payload.postId, userId },
    { voteType: 'upvote' },
    { upsert: true, new: true },
  );

  return upvote;
};

const downSaveIntoDB = async (payload: TVote) => {
  const user = await UserModel.findById(payload.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'use not found!');
  }
  const userId = new Types.ObjectId(payload.userId);
  const hasDownvoted = await VoteModel.findOne({
    postId: payload.postId,
    userId,
    voteType: 'downvote',
  });

  if (hasDownvoted) {
    const removeVote = await VoteModel.findOneAndDelete({
      postId: payload.postId,
      userId,
    });
    return removeVote;
  }

  const upvote = await VoteModel.findOneAndUpdate(
    { postId: payload.postId, userId: payload.userId },
    { voteType: 'downvote' },
    { new: true, upsert: true },
  );

  return upvote;
};

const checkUserVoteFromDB = async (userId: string, postId: string) => {
  const vote = await VoteModel.findOne({ userId, postId });

  if (!vote) {
    return { hasVoted: false, voteType: null };
  }

  return { hasVoted: true, voteType: vote.voteType };
};

export const voteService = {
  upvoteSaveIntoDB,
  downSaveIntoDB,
  checkUserVoteFromDB,
};
