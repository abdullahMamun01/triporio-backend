import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { commentService } from './comment.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const getCommentListByPost = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.postId;

  const userComment = await commentService.displayAllComments(postId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: userComment,
    success: true,
    message: 'All comment are retrieved successfully',
  });
});

const addComment = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const body = req.body;
  const userComment = await commentService.addComment({
    ...body,
    post: postId,
    user: req.user.userId,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: userComment,
    success: true,
    message: 'User commented successfully',
  });
});

const updateComment = catchAsync(async (req: Request, res: Response) => {
  const commentId = req.params.commentId;

  const body = req.body;
  const userComment = await commentService.updateComment({
    ...body,
    commentId,
    user: req.user.userId,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: userComment,
    success: true,
    message: 'User update commented successfully',
  });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const commentId = req.params.commentId;
  const userComment = await commentService.deleteComment(
    commentId,
    req.user.userId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: userComment,
    success: true,
    message: 'User Delete commented successfully',
  });
});

export const commentController = {
  addComment,
  getCommentListByPost,
  updateComment,
  deleteComment,
};
