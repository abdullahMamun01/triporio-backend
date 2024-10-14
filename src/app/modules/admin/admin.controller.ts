import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { adminService } from './admin.service';
import AppError from '../../error/AppError';

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  const query = {
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
  };

  const userPosts = await adminService.getAllUserFromDB(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: userPosts,
    success: true,
    message: 'All User retrieved successfully',
  });
});

const getAllPosts = catchAsync(async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  const query = {
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
  };

  const userPosts = await adminService.getAllPostsFromDB(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: userPosts,
    success: true,
    message: 'All User posts retrieved successfully',
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const userPosts = await adminService.deleteUserFormDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: userPosts,
    success: true,
    message: 'User deleted successfully',
  });
});

const blockUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const userPosts = await adminService.toggleBlockUserToDB(userId , true);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: userPosts,
    success: true,
    message: 'user blocked successfully',
  });
});


const unBlockUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const userPosts = await adminService.toggleBlockUserToDB(userId , false);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: userPosts,
    success: true,
    message: 'user blocked successfully',
  });
});

const deletePost = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.postId;

  const userPosts = await adminService.deletePostFromDB(postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: userPosts,
    success: true,
    message: 'Deleted post successfully',
  });
});

const setUserProfileVerifiedStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { isVerified } = req.body;
    const userId = req.params.userId;
    const updateUser = await adminService.updateVerifiedProfile(
      userId,
      isVerified,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      data: updateUser,
      success: true,
      message: `User profile status changed to ${updateUser?.isVerified} successfully`,
    });
  },
);

const updateUserRoleController = catchAsync(async (req, res) => {
  const { role } = req.body;
  const { userId } = req.params;
  if (req.user.userId === userId) {
    throw new AppError(httpStatus.CONFLICT, 'You cannot change your own role!');
  }

  const user = await adminService.updateUserRoleToDB({ userId, role });

  sendResponse(res, {
    success: true,
    message: 'User role update successfully',
    statusCode: httpStatus.OK,
    data: user,
  });
});


const getAllPaymentList = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const query = {
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
  };
  const user = await adminService.getAllPaymentListFromDB(query);

  sendResponse(res, {
    success: true,
    message: 'User role update successfully',
    statusCode: httpStatus.OK,
    data: user,
  });
});

export const adminController = {
  getAllUser,
  getAllPosts,
  deleteUser,
  deletePost,
  setUserProfileVerifiedStatus,
  updateUserRoleController,
  blockUser,
  unBlockUser,
  getAllPaymentList
};
