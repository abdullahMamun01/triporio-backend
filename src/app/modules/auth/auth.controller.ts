import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';

import { authService } from './auth.service';

const login = catchAsync(async (req, res) => {
  const body = req.body;
  const loginInfo = await authService.loginUser(body);

  res.cookie('refreshToken', loginInfo.refreshToken, {
    secure: true,
    httpOnly: true,
  });

  res.status(httpStatus.OK).json({
    message: 'user login successfully',
    success: true,
    statusCode: httpStatus.OK,
    token: loginInfo.token,
    data: loginInfo.user,
  });
});

export const authController = {
  login,
};
