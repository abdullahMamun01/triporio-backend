import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { analyticService } from './analytics.service';

const subscriptionAnalytic = catchAsync(async (req: Request, res: Response) => {
  const userPosts = await analyticService.subscriptionAnalytic();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: userPosts,
    success: true,
    message: 'Payment analytic data retrieved successfully',
  });
});

const postsAnalytic = catchAsync(async (req: Request, res: Response) => {
  const postAnalytic = await analyticService.postsAnalytic();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: postAnalytic,
    success: true,
    message: 'Payment analytic data retrieved successfully',
  });
});

const usersAnalytic = catchAsync(async (req: Request, res: Response) => {
  const postAnalytic = await analyticService.userAnalytic();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: postAnalytic,
    success: true,
    message: 'User analytic data retrieved successfully',
  });
});

const overview = catchAsync(async (req: Request, res: Response) => {
  const postAnalytic = await analyticService.overview();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: postAnalytic,
    success: true,
    message: 'analytic overview data retrieved successfully',
  });
});

export const analyticController = {
  subscriptionAnalytic,
  postsAnalytic,
  usersAnalytic,
  overview
};
