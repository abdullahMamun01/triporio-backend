import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { voteService } from './postVote.service';
import { Types } from 'mongoose';

const upvote = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const upvoted = await voteService.upvoteSaveIntoDB({
    userId: req.user.userId,
    postId: new Types.ObjectId(postId),
    voteType: 'upvote',
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: upvoted,
    success: true,
    message: 'Post Upvot voted successfully',
  });
});

const downVote = catchAsync(async (req: Request, res: Response) => {
  const post = req.params.postId;
  const downVoted = await voteService.downSaveIntoDB({
    userId: req.user.userId,
    postId: new Types.ObjectId(post),
    voteType: 'downvote',
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: downVoted,
    success: true,
    message: 'Post Down voted successfully',
  });
});

const checkUserVote = catchAsync(async (req: Request, res: Response) => {
  const { postId } = req.params;
  const hasVote = await voteService.checkUserVoteFromDB(
    postId,
    req.user.userId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: hasVote,
    success: true,
    message: 'Post Down voted successfully',
  });
});

export const voteController = {
  upvote,
  downVote,
  checkUserVote,
};
