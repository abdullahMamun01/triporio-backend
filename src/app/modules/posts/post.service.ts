import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import UserModel from '../user/user.model';
import {  Types } from 'mongoose';
import { findUser } from '../user/user.utils';

import TPost from './post.interface';
import PostModel from './post.model';
import VoteModel from '../votes/postVote.model';
import CommentModel from '../comments/comment.model';

interface Post {
  _id: Types.ObjectId;
  // Add other properties here that your Post model has
}


const allPost = async (payload: Record<string, unknown>) => {
  const page = (payload.page as number) || 1;
  const limit = (payload.limit as number) || 10;
  const searchTerm = payload.searchTerm ? String(payload.searchTerm) : '';
  const categories = payload.categories || '';
  const mostUpvote = Boolean(payload.mostVote);

  // 1. Build the filter query
  const filter: Record<string, unknown> = {};

  // Search term filter (checks both 'title' and 'content')
  if (searchTerm) {
    filter.$or = [
      { title: { $regex: searchTerm, $options: 'i' } },
      { content: { $regex: searchTerm, $options: 'i' } },
    ];
  }

  // Categories filter
  if (categories) {
    filter.categories = { $in: categories };
  }

  // 2. Fetch total posts with filtering by search term and categories
  const totalPosts = await PostModel.countDocuments(filter);
  const totalPage = Math.ceil(totalPosts / limit);

  // 3. Fetch posts with pagination, filtering, and sorting
  const posts = await PostModel.find({
    ...filter,
    isActive: true,
    isDeleted: false,
  })

    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user', 'firstName lastName image isVerified') 
    .sort(mostUpvote ? { upvoteCount: -1 } : { createdAt: -1 })
    .lean()

  // // 4. Fetch votes and comments for each post
  const filteredPosts = await posts.reduce(async (accPromise, post ) => {
    const acc = await accPromise; // Resolve the accumulator promise
    const user = await UserModel.findById(post.user)
  
    if (!user?.isBlocked && !user?.isDeleted) {
      acc.push(post); // Only include the post if the user is not blocked or deleted
    }
  
    return acc;
  }, Promise.resolve([] as Post[]));

  const postIds = filteredPosts.map(post=> post._id)

  // Fetch votes for the posts
  const votes = await VoteModel.find({ postId: { $in: postIds } });

  // Fetch comments for the posts
  const comments = await CommentModel.find({ post: { $in: postIds } });

  // 5. Process posts to add vote and comment counts
  const processedPosts = filteredPosts.map((post) => {
    const postVotes = votes.filter((vote) => vote.postId.equals(post._id));
    const postComments = comments.filter((comment) =>
      comment.post.equals(post._id),
    );

    return {
      ...post,
      upvoteCount: postVotes.filter((vote) => vote.voteType === 'upvote')
        .length,
      downvoteCount: postVotes.filter((vote) => vote.voteType === 'downvote')
        .length,
      commentCount: postComments.length,
    };
  });

  const hasNextPage = page * limit < totalPosts;

  return {
    totalPage,
    page,
    data: processedPosts,
    hasNextPage,
  };
};

const userPosts = async (userId: string) => {
  const posts = await PostModel.aggregate([
    {
      $match: { user: new Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: 'users', // The 'users' collection
        localField: 'user',
        foreignField: '_id',
        as: 'user', // Add user details to each post
        pipeline: [
          {
            $project: {
              _id: 1, // Exclude user ID
              firstName: 1, // Include firstName
              lastName: 1, // Include lastName
              image: 1, // Include image if exists
              isVerified: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'votes', // The 'votes' collection
        localField: '_id',
        foreignField: 'postId',
        as: 'votes', // Add all votes related to each post
      },
    },
    {
      $lookup: {
        from: 'comments', // The 'comments' collection
        localField: '_id',
        foreignField: 'post',
        as: 'comments', // Add all comments related to each post
      },
    },
    {
      $addFields: {
        upvoteCount: {
          $size: {
            $filter: {
              input: '$votes',
              as: 'vote',
              cond: { $eq: ['$$vote.voteType', 'upvote'] },
            },
          },
        },
        downvoteCount: {
          $size: {
            $filter: {
              input: '$votes',
              as: 'vote',
              cond: { $eq: ['$$vote.voteType', 'downvote'] },
            },
          },
        },
        commentCount: { $size: '$comments' }, // Count comments
      },
    },
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true, // In case there's no associated user
      },
    },
    {
      $project: {
        votes: 0,
        comments: 0,
        // userId: 0
      },
    },
  ]);
  return posts;
};

const singlePost = async (postId: string) => {
  // const user = await findUser(userId);
  const post = await PostModel.findById(postId).populate({
    path: 'user',
    select: 'firstName lastName image', // specify fields you want to populate
  });
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post Not found.');
  }
  // if (post?.premium && user?.role === 'user' && !user?.isVerified) {
  //   throw new AppError(
  //     httpStatus.FORBIDDEN,
  //     'Access denied. You must verify your account to view premium posts.',
  //   );
  // }
  return post.populate({
    path: 'user',
    select: 'firstName lastName image',
  });
};

const createPost = async (payload: TPost) => {
  const user = await findUser(payload.user.toString());
  if (payload.premium && !user.isVerified) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Only verified user can be taged as a premium!',
    );
  }
  const post = await PostModel.create(payload);
  return post;
};

const updatePost = async (payload: Partial<TPost>, postId: string) => {
  const user = await UserModel.findById(payload.user);
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
