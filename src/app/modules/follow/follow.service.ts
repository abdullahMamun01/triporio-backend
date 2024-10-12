import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { findUser } from '../user/user.utils';
import FollowModel from './follow.model';
import UserModel from '../user/user.model';

const followUser = async (followingId: string, userId: string) => {
  await findUser(userId);
  await findUser(followingId);
  if (followingId === userId) {
    throw new AppError(httpStatus.CONFLICT, 'You cannot follow yourself.');
  }
  const alreadyFollowing = await FollowModel.findOne({
    user: userId,
    following: { $elemMatch: { $eq: followingId } },
  });
  if (alreadyFollowing) {
    throw new AppError(
      httpStatus.CONFLICT,
      'You are already following this user.',
    );
  }

  await FollowModel.findOneAndUpdate(
    { user: followingId },
    { $addToSet: { followers: userId } },
    { upsert: true, new: true },
  );

  // Add the target user to the current user's `following` list
  const following = await FollowModel.findOneAndUpdate(
    { user: userId },
    { $addToSet: { following: followingId } },
    { upsert: true, new: true },
  );

  return following;
};

const isFollowingUserFromDB = async (followingId: string, userId: string) => {
  const currentUser = await UserModel.findById(userId);
  const followingUser = await UserModel.findById(followingId);
  if (!currentUser || !followingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not found!');
  }
  const isFollowing = await FollowModel.findOne({
    user: userId,
    following: { $elemMatch: { $eq: followingId } },
  });
  return isFollowing;
};

const unfollowUser = async (unfollowId: string, userId: string) => {
  const findUnfollowUser = await UserModel.findById(unfollowId);
  const findUser = await UserModel.findById(userId);
  if (!findUnfollowUser || !findUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user not found!');
  }

  const isFollowing = await FollowModel.findOne({
    user: userId,
    following: { $elemMatch: { $eq: unfollowId } },
  });
  if (!isFollowing) {
    throw new AppError(httpStatus.CONFLICT, 'You are not following this user.');
  }

  const unfollow = await FollowModel.findOneAndUpdate(
    { user: userId },
    { $pull: { following: unfollowId } },
    { upsert: true, new: true },
  );

  return unfollow;
};

export const followingService = {
  followUser,
  unfollowUser,
  isFollowingUserFromDB
};
