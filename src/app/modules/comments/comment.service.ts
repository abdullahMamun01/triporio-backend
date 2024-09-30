import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import PostModel from '../posts/model/post.model';
import { findUser } from '../user/user.utils';
import TComment, { TUpdateComment } from './comment.interface';
import CommentModel from './comment.model';
import { Types } from 'mongoose';

const addComment = async (payload: TComment) => {
  await findUser(payload.user.toString());
  const findPost = await PostModel.findById(payload.post);
  if (!findPost) {
    throw new AppError(httpStatus.NOT_FOUND, 'This post not found!');
  }

  const comment = await CommentModel.create(payload);
  return comment;
};

const displayAllComments = async (postId: string) => {
  // return await CommentModel.find({ post: postId });
  const commentList = await CommentModel.aggregate([
    {
      $match :  {'post' :  new Types.ObjectId(postId) }
    } ,
    {
      $lookup: {
        from: 'replies', // The 'comments' collection
        localField: '_id',
        foreignField: 'commentId',
        as: 'replies', // Add all comments related to each post
      },
    },
    {
      $addFields: {
 
        replies: '$replies' , // Count comments
      },
    },

    {
      $project: {
        'replies.commentId': 0, // Exclude votes if not needed in the response
      },
    },
  ])

  return  commentList

};

const updateComment = async (payload: TUpdateComment) => {
  await findUser(payload.user.toString());
  
  const comment = await CommentModel.findById(payload.commentId);
  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  if (comment.user.toString() !== payload.user.toString()) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to update this comment',
    );
  }

  const update = await CommentModel.findByIdAndUpdate(
    payload.commentId,
    {
      comment: payload.newComment,
    },
    { new: true, runValidators: true },
  );
  return update;
};

const deleteComment = async (commentId: string, userId: string) => {
  await findUser(userId);

  const comment = await CommentModel.findById(commentId);
  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  if (comment.user.toString() !== userId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to delete this comment',
    );
  }
  const deleteComment = await CommentModel.findByIdAndDelete(commentId);
  return deleteComment;
};

export const commentService = {
  addComment,
  displayAllComments,
  updateComment,
  deleteComment,
};
