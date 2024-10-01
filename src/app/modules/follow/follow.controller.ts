import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';

import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { followingService } from './follow.service';

const followingUser = catchAsync(async (req: Request, res: Response) => {
  const followingId = req.params.userId;
  const follow = await followingService.followUser(followingId, req.user.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: follow,
    success: true,
    message: 'User following  successfully',
  });
});


const unfollowUser = catchAsync(async (req: Request, res: Response) => {
  const unfollowId = req.params.userId;

  const follow = await followingService.unfollowUser(unfollowId, req.user.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: follow,
    success: true,
    message: 'User unfollow  successfully',
  });
});

export const followingController = {
  followingUser,
  unfollowUser
};
