import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { replyService } from './reply.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { Types } from 'mongoose';

const addReply = catchAsync(async (req: Request, res: Response) => {
  const commentId = req.params.commentId;
  const reply = req.body;
  
  const userComment = await replyService.addReply({
    commentId: new Types.ObjectId(commentId),
    user: req.user.userId,
    ...reply,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: userComment,
    success: true,
    message: 'Comment reply successfully',
  });
});

const getRepliesByComment = catchAsync(async (req: Request, res: Response) => {
  const commentId = req.params.commentId;

  const userComment = await replyService.repliesByComment(commentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: userComment,
    success: true,
    message: 'All reply retrieved successfully',
  });
});

export const replyController = {
  getRepliesByComment,
  addReply
};
