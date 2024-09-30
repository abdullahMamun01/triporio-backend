import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import PostModel from '../posts/model/post.model';
import { findUser } from '../user/user.utils';
import TComment from './comment.interface';
import CommentModel from './comment.model';

const addComment = async (payload: TComment) => {
  await findUser(payload.user.toString());
  const findPost = await PostModel.findById(payload.post);
  if (!findPost) {
    throw new AppError(httpStatus.NOT_FOUND, 'This post not found!');
  }

  const comment = await CommentModel.create(payload);
  return comment;
};

const displayAllComments = async () => {
  return CommentModel.find({});
};

export const commentService = {
  addComment,
  displayAllComments,
};
