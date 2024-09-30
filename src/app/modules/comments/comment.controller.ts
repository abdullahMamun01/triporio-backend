import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const getCommentList = catchAsync(async (req: Request, res: Response) => {
    const userComment = await commentService.displayAllComments();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      data: userComment,
      success: true,
      message: 'All comment are retrieved successfully',
    });
  });



const addComment = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.postId
    const body  = req.body
  const userComment = await commentService.addComment({...body , post: postId , user:req.user.userId});
  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: userComment,
    success: true,
    message: 'User commented successfully',
  });
});





export const commentController = {
    addComment,
    getCommentList
}