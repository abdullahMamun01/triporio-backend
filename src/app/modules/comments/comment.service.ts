import httpStatus from 'http-status';
import AppError from '../../error/AppError';

import { findUser } from '../user/user.utils';
import TComment, { TUpdateComment } from './comment.interface';
import CommentModel from './comment.model';
import { Document, Types } from 'mongoose';
import PostModel from '../posts/post.model';
import ReplyModel from '../replies/reply.model';

const addComment = async (payload: TComment) => {
  await findUser(payload.user.toString());
  const findPost = await PostModel.findById(payload.post);
  if (!findPost) {
    throw new AppError(httpStatus.NOT_FOUND, 'This post not found!');
  }

  const comment = await CommentModel.create(payload);
  return comment;
};

// const displayAllComments = async (postId: string) => {
//   const commentList = await CommentModel.aggregate([
//     {
//       $match: { post: new Types.ObjectId(postId) },
//     },
//     {
//       $lookup: {
//         from: 'users',
//         localField: 'user',
//         foreignField: '_id',
//         as: 'user',
//       },
//     },
//     {
//       $lookup: {
//         from: 'replies',
//         localField: '_id',
//         foreignField: 'commentId',
//         as: 'replies',
//       },
//     },

//     {
//       $addFields: {
//         replies: '$replies', // Count comments
//       },
//     },
//     {
//       $lookup: {
//         from: 'users',
//         localField: 'replies.user', // Assuming replies have a field called 'user' for user ID
//         foreignField: '_id',
//         as: 'replies.user', // This will create a new field 'user' within each reply
//       },
//     },
//     {
//       $project: {
//         'user.password': 0, // Exclude sensitive user information, like password
//         'user.__v': 0, // Optionally exclude the version key
//         'replies.commentId': 0, // Exclude commentId from replies if not needed
//         'user.phone': 0,
//         'user.role': 0,
//         'user.isVerified': 0,
//         'user.email': 0,
//         'user.address': 0,
//       },
//     },
//   ]);

//   return commentList;
// };

const displayAllComments = async (postId: string) => {
 
  const post  = await PostModel.findById(postId)

  if(!post){
    throw new AppError(httpStatus.NOT_FOUND , 'The post not found!')
  }
  const comments = await CommentModel.find({ post: postId }).sort({
    createdAt: -1,
  }).populate({ path: 'user', select: 'firstName lastName image' }).lean();

  const commentsWithReplies = comments.map(async (comment) => ({
    ...comment,
    replies: await ReplyModel.find({ commentId: comment._id })
      .populate({ path: 'user', select: 'firstName lastName image' })
      .select('-commentId'),
  }));
  const replise = await Promise.all(commentsWithReplies);

  return replise;
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
