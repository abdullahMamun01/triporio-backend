import { Request, Response } from 'express';
import { catchAsync } from '../../../utils/catchAsync';
import { PostService } from '../services/post.service';
import sendResponse from '../../../utils/sendResponse';
import httpStatus from 'http-status';

const getAllPost = catchAsync(async (req: Request, res: Response) => {
  const postList = await PostService.allPost();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: postList,
    success: true,
    message: 'All posts retrieved successfully',
  });
});

const getUserPosts = catchAsync(async (req: Request, res: Response) => {

    const userPosts = await PostService.userPosts(req.user.userId)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        data: userPosts,
        success: true,
        message: 'All User posts retrieved successfully',
      });

});

const createPost = catchAsync(async (req: Request, res: Response) => {
    const body  = req.body
    const post = await PostService.createPost(body)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        data: post,
        success: true,
        message: 'Post created successfully',
      });
});

const updatePost = catchAsync(async (req: Request, res: Response) => {
    const body  = req.body
    const postId = req.params.postId
    const updatePost = await PostService.updatePost(body,postId)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        data: updatePost,
        success: true,
        message: 'Post updated successfully',
      });
});

const deletPost = catchAsync(async (req: Request, res: Response) => {
    const postId = req.params.postId
    const deletePost = await PostService.deletPost(postId)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        data: deletePost,
        success: true,
        message: 'Post deleted successfully',
      });
});

export const postController = {
  getAllPost,
  getUserPosts,
  createPost,
  updatePost,
  deletPost,
};
