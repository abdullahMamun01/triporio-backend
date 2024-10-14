import httpStatus from 'http-status';
import AppError from '../../error/AppError';

import UserModel from '../user/user.model';
import PostModel from '../posts/post.model';
import { USER_ROLE } from '../user/user.constants';
import { PaymentModel } from '../payment/payment.model';

const getAllUserFromDB = async (payload: Record<string, unknown>) => {
  const page = (payload.page as number) || 1;
  const limit = (payload.limit as number) || 10;
  const users = await UserModel.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .select('_id firstName lastName email isDeleted isVerified isBlocked role');
  return users;
};

const toggleBlockUserToDB = async (userId: string, block: boolean) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found!');
  }
  const deleteUser = await UserModel.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      isBlocked: block,
    },
    { new: true, runValidators: true },
  );

  return deleteUser;
};

const getAllPaymentListFromDB = async (payload: Record<string, unknown>) => {
  const page = (payload.page as number) || 1;
  const limit = (payload.limit as number) || 10;
  const users = await PaymentModel.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .select('_id amount paymentStatus createdAt subscription ')
    .populate([
      {
        path: 'user',
        select: '_id firstName lastName',
      },
      {
        path: 'subscription',
        select: 'subscriptionType',
      },
    ]);
  return users;
};

const deleteUserFormDB = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found!');
  }
  const deleteUser = await UserModel.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      isDeleted: true,
    },
    { new: true, runValidators: true },
  );

  return deleteUser;
};

const getAllPostsFromDB = async (payload: Record<string, unknown>) => {
  const page = (payload.page as number) || 1;
  const limit = (payload.limit as number) || 10;
  const posts = await PostModel.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .populate({
      path: 'user',
      select: 'firstName lastName ',
    })
    .select('_id title createdAt');
  return posts;
};

const deletePostFromDB = async (postId: string) => {
  const post = await PostModel.findById(postId);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'post not found!');
  }
  const deltePost = await PostModel.findOneAndUpdate(
    {
      _id: postId,
    },
    {
      isDeleted: true,
    },
    { new: true, runValidators: true },
  );

  return deltePost;
};

const updateVerifiedProfile = async (userId: string, isVerified: boolean) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found!');
  }
  const updateVerifiedUser = await UserModel.findByIdAndUpdate(
    userId,
    { isVerified },
    { new: true, runValidators: true },
  ).lean();

  return updateVerifiedUser;
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

export const adminService = {
  getAllUserFromDB,
  deleteUserFormDB,
  toggleBlockUserToDB,
  getAllPostsFromDB,
  deletePostFromDB,
  updateVerifiedProfile,
  updateUserRoleToDB,
  getAllPaymentListFromDB
};
