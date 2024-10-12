import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import CommentModel from '../comments/comment.model';
import { findUser } from '../user/user.utils';
import TReply from './reply.interface';
import ReplyModel from './reply.model';

const addReply = async (payload: TReply) => {
  await findUser(payload.user.toString());
  const comment = await CommentModel.findById(payload.commentId);
  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found!');
  }

  const reply = (await ReplyModel.create(payload)).populate({
    path: 'user',
    select: 'firstName lastName images',
  });
  return reply;
};

const repliesByComment = async (commentId: string) => {
  const comment = await CommentModel.findById(commentId);
  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found!');
  }

  const replies = await ReplyModel.find({ commentId }).populate({
    path: 'user',
    select: 'firstName lastName images',
  });
  return replies;
};

export const replyService = {
  addReply,
  repliesByComment,
};
