/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { TUser } from './user.interface';
import UserModel from './user.model';
import { findUser, findUserByEmail } from './user.utils';
import { USER_ROLE } from './user.constants';
import PostModel from '../posts/model/post.model';
import { Types } from 'mongoose';

const getAllUserFromDB = async (adminId: string) => {
  const users = await UserModel.find({ _id: { $ne: adminId } });

  return users;
};

const getSingleUserFromDB = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `this user : ${userId} is not found!`,
    );
  }

  return user;
};

const createUser = async (payload: TUser) => {
  const isUserExist = await findUserByEmail(payload.email);
  if (isUserExist) {
    throw new AppError(
      httpStatus.FOUND,
      `this email : ${payload.email} is already registered!`,
    );
  }
  const newUser = await UserModel.create(payload);
  const userObject = newUser.toObject();

  // eslint-disable-next-line no-unused-vars
  const { password, ...res } = userObject;
  return res;
};

const updateUserRoleToDB = async (payload: {
  userId: string;
  role: (typeof USER_ROLE)[keyof typeof USER_ROLE];
}) => {
  const isUserExist = await UserModel.findById(payload.userId);
  if (!isUserExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `this email : ${payload.userId} is not found!`,
    );
  }
  const updateUser = await UserModel.findByIdAndUpdate(
    payload.userId,
    { role: payload.role },
    { new: true, runValidators: true },
  );

  return updateUser;
};

const updateProfileToDB = async (userId: string, payload: Partial<TUser>) => {
  const findUser = await UserModel.findById(userId);
  if (!findUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found!');
  }
  const image = payload.image || findUser.image;

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { ...payload, image },
    {
      new: true,
      runValidators: true,
    },
  );

  return user;
};

const updateVerifyProfile = async (userId: string) => {
  const user = await findUser(userId);
  if(user.isVerified){
    throw new AppError(httpStatus.CONFLICT , "User already verified!")
  }
  const updateUser = await UserModel.findOneAndUpdate(
    { _id: userId },
    { isVerified: true },
    { runValidators: true, new: true },
  );
  return updateUser;
};

const checkVerifyEligibility = async (userId: string) => {
  await findUser(userId);

  const checkUpvoteGreaterThenFour = await PostModel.aggregate([
    { $match: { userId: new Types.ObjectId(userId) } },
    {
      $lookup: {
        from: 'votes',
        localField: '_id',
        foreignField: 'postId',
        as: 'votes',
      },
    },
    {
      $addFields: {
        totalUpvotes: { $sum: '$votes.upvoteCount' }, // Sum the upvotes from the votes array
      },
    },
    {
      $match: {
        'votes.upvoteCount': { $gte: 5 }, // Match only posts where at least one vote has 5 or more upvotes
      },
    },

    {
      $project: {
        votes: 0,
      },
    },
  ]);

  return (
    checkUpvoteGreaterThenFour.length > 0 &&
    checkUpvoteGreaterThenFour[0].totalUpvotes >= 5
  );
};

export const userService = {
  createUser,
  updateUserRoleToDB,
  getAllUserFromDB,
  getSingleUserFromDB,
  updateProfileToDB,
  updateVerifyProfile,
  checkVerifyEligibility,
};
