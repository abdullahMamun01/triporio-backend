import { Request, Response } from 'express';
import { catchAsync } from '../../../utils/catchAsync';
import { PostService } from '../services/post.service';
import sendResponse from '../../../utils/sendResponse';
import httpStatus from 'http-status';
import AppError from '../../../error/AppError';
import { uploadImage } from '../../../utils/uploadImage';
import PostModel from '../model/post.model';

const getAllPost = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  const queryParams = {
    page: page,
    limit: limit,
  };

  const postList = await PostService.allPost(queryParams);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: postList,
    success: true,
    message: 'All posts retrieved successfully',
  });
});

const getUserPosts = catchAsync(async (req: Request, res: Response) => {
  const userPosts = await PostService.userPosts(req.user.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: userPosts,
    success: true,
    message: 'All User posts retrieved successfully',
  });
});

const singlePost = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const userId = req.user.userId;
  const userPosts = await PostService.singlePost(postId, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: userPosts,
    success: true,
    message: 'Single User posts retrieved successfully',
  });
});

const createPost = catchAsync(async (req: Request, res: Response) => {
  if (!req.files) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Images are required. Please upload at least one image.',
    );
  }
  const images = await uploadImage(req.files);
  const body = req.body;
  const post = await PostService.createPost({
    ...body,
    images,
    userId: req.user.userId,
  });
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    data: post,
    success: true,
    message: 'Post created successfully',
  });
});

const updatePost = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  const postId = req.params.postId;

  let images = [];
  const post = await PostModel.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }
  if (req.files) {
    images = await uploadImage(req.files);
  } else {
    images = post.images;
  }

  const updatePost = await PostService.updatePost(
    { ...body, userId: req.user.userId, images },
    postId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: updatePost,
    success: true,
    message: 'Post updated successfully',
  });
});

const deletPost = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const deletePost = await PostService.deletPost(postId);
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
  singlePost,
};
