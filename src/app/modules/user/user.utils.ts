import httpStatus from 'http-status';
import config from '../../config';
import { USER_ROLE } from './user.constants';
import UserModel from './user.model';
import bcrypt from 'bcrypt';
import AppError from '../../error/AppError';

export const findUserByEmail = async (email: string) => {
  return await UserModel.findOne({ email }).select('+password -__v');
};

export const hashedPassword = async (password: string) => {
  const hashPass = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );
  return hashPass;
};

export const findUser = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User not found. Please ensure that the user ID is correct and that the user exists in the system.',
    );
  }

  return user
};

export const isValidRole = (
  role: string,
): role is (typeof USER_ROLE)[keyof typeof USER_ROLE] => {
  return Object.values(USER_ROLE).includes(
    role as (typeof USER_ROLE)[keyof typeof USER_ROLE],
  );
};
