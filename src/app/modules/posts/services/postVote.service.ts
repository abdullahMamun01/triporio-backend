import PostModel from '../model/post.model';
import AppError from '../../../error/AppError';
import httpStatus from 'http-status';
import UserModel from '../../user/user.model';
import { VoteModel } from '../model/postVote.model';
import { Types } from 'mongoose';

const upvote = async (postId: string, userId: string) => {
  const [findPost, findUser] = await Promise.all([
    PostModel.findById(postId),
    UserModel.findById(userId),
  ]);

  if (!findPost) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Post with ID ${postId} not found.`,
    );
  }

  if (!findUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
  }

  // Check if a VoteModel document exists for this post
  const postVote = await VoteModel.findOne({ postId });

  if (!postVote) {
    // No vote document exists, so create a new one
    const newVote = await VoteModel.create({
      postId,
      upvoteCount: 1,
      votes: [{ userId: new Types.ObjectId(userId), voteType: 'upvote' }],
    });
    return newVote;
  }

  //  check if the user has already voted
  const existingVote = await VoteModel.findOne({
    postId,
    votes: {
      $elemMatch: { userId: new Types.ObjectId(userId), voteType: 'upvote' },
    }, // Check if user already voted
  });

  const hasDownVoted = await VoteModel.findOne({
    postId,
    votes: {
      $elemMatch: { userId: new Types.ObjectId(userId), voteType: 'downvote' },
    }, // Check if user already down voted
  });

  if (existingVote) {
    // Withdraw the upvote for upvote
    const withdrawUpvote = await VoteModel.findOneAndUpdate(
      { postId },
      {
        $inc: { upvoteCount: -1 },
        $pull: { votes: { userId: new Types.ObjectId(userId) } },
      },
      { new: true, runValidators: true },
    );
    return withdrawUpvote;
  } else if (hasDownVoted) {
    //if alread has downvote update to upvote request
    const doVote = await VoteModel.findOneAndUpdate(
      { postId, 'votes.userId': new Types.ObjectId(userId) },
      {
        $inc: { upvoteCount: 1, downvoteCount: -1 },
        $set: { 'votes.$.voteType': 'upvote' },
      },
      { new: true, runValidators: true },
    );
    return doVote;
  } else {
    // Add upvote
    const doVote = await VoteModel.findOneAndUpdate(
      { postId },
      {
        $inc: { upvoteCount: 1 },
        $addToSet: {
          votes: { userId: new Types.ObjectId(userId), voteType: 'upvote' },
        },
      },
      { new: true, runValidators: true },
    );
    return doVote;
  }
};

//downvote
const downvote = async (postId: string, userId: string) => {
  const [findPost, findUser] = await Promise.all([
    PostModel.findById(postId),
    UserModel.findById(userId),
  ]);

  if (!findPost) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Post with ID ${postId} not found.`,
    );
  }

  if (!findUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
  }

  const postVote = await VoteModel.findOne({ postId });

  if (!postVote) {
    const newVote = await VoteModel.create({
      postId,
      downvoteCount: 1,
      votes: [{ userId: new Types.ObjectId(userId), voteType: 'downvote' }],
    });
    return newVote;
  }
  //check already have downvote
  const existingVote = await VoteModel.findOne({
    postId,
    votes: {
      $elemMatch: { userId: new Types.ObjectId(userId), voteType: 'downvote' },
    },
  });
  //check user aleady upvote but want to downvote
  const hasUpvoted = await VoteModel.findOne({
    postId,
    votes: {
      $elemMatch: { userId: new Types.ObjectId(userId), voteType: 'upvote' },
    },
  });

  //existing vote mean for this function for has Down vote
  if (existingVote) {
    const withdrawDownvote = await VoteModel.findOneAndUpdate(
      { postId },
      {
        $inc: { downvoteCount: -1 },
        $pull: { votes: { userId: new Types.ObjectId(userId) } },
      },
      { new: true, runValidators: true },
    );
    return withdrawDownvote;
  } else if (hasUpvoted) {
    const doVote = await VoteModel.findOneAndUpdate(
      { postId, 'votes.userId': new Types.ObjectId(userId) },
      {
        $set: { 'votes.$.voteType': 'downvote' },
        $inc: { downvoteCount: 1, upvoteCount: -1 },
      },
      { new: true, runValidators: true },
    );
    return doVote;
  } else {
    const doVote = await VoteModel.findOneAndUpdate(
      { postId },
      {
        $inc: { downvoteCount: 1 },
        $addToSet: {
          votes: { userId: new Types.ObjectId(userId), voteType: 'downvote' },
        },
      },
      { new: true, runValidators: true },
    );
    return doVote;
  }
};
export const voteService = {
  upvote,
  downvote,
};
