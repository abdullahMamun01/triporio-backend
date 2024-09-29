import httpStatus from 'http-status';
import AppError from '../../../error/AppError';
import UserModel from '../../user/user.model';
import TPost from '../interface/post.interface';
import PostModel from '../model/post.model';
import { findUser } from '../../user/user.utils';

const allPost = async () => {
  const posts = await PostModel.find({});
  return posts;
};

const userPosts = async (userId: string) => {
  const posts = await PostModel.find({ userId });
  return posts;
};

const singlePost = async (postId: string, userId: string) => {
  const user = await findUser(userId);
  const post = await PostModel.findById(postId);
  if (post?.premium && user?.role === 'user' && !user?.isVerified) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Access denied. You must verify your account to view premium posts.',
    );
  }
  return post;
};

const createPost = async (payload: TPost) => {
  await findUser(payload.userId.toString());
  const post = await PostModel.create(payload);
  return post;
};

const updatePost = async (payload: Partial<TPost>, postId: string) => {
  const user = await UserModel.findById(payload.userId);
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User not found. Please ensure that the user ID is correct and that the user exists in the system.',
    );
  }

  const update = PostModel.findByIdAndUpdate(postId, payload, {
    new: true,
    runValidators: true,
  });
  if (!update) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Post with ID ${postId} not found. Please check that the post ID is correct and that the post exists.`,
    );
  }

  return update;
};

const deletPost = async (postId: string) => {
  const findPost = await PostModel.findById(postId);
  if (!findPost) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Post with ID ${postId} not found. Please check that the post ID is correct and that the post exists.`,
    );
  }
  const deletPost = await PostModel.findByIdAndDelete(postId);
  return deletPost;
};

export const PostService = {
  allPost,
  userPosts,
  createPost,
  updatePost,
  deletPost,
  singlePost,
};
