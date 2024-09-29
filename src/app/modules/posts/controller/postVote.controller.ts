import { Request, Response } from 'express';
import sendResponse from '../../../utils/sendResponse';
import { catchAsync } from '../../../utils/catchAsync';
import httpStatus from 'http-status';
import { voteService } from '../services/postVote.service';

const upvote = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const upvoted = await voteService.upvote(req.user.userId, postId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: upvoted,
    success: true,
    message: 'up voted successfully',
  });
});

const downVote = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const downVoted = await voteService.downVote(req.user.userId, postId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: downVoted,
    success: true,
    message: 'Down voted successfully',
  });
});

export const voteController = {
  upvote,
  downVote,
};
