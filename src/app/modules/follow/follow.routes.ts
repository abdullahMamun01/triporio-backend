import express from 'express';

import { authoRization } from '../../middleware/authoRization';
import { USER_ROLE } from '../user/user.constants';

import { followingController } from './follow.controller';

const router = express.Router();

router.post(
  '/:userId/follow',

  authoRization(USER_ROLE.user),
  followingController.followingUser,
);

router.post(
  '/:userId/unfollow',
  authoRization(USER_ROLE.user),
  followingController.unfollowUser,
);

export const followingRoutes = router;
