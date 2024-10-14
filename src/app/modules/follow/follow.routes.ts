import express from 'express';

import { authoRization } from '../../middleware/authoRization';
import { USER_ROLE } from '../user/user.constants';

import { followingController } from './follow.controller';

const router = express.Router();
router.get(
  '/:userId/follow-status',
  authoRization(USER_ROLE.user),
  followingController.isFollowingUser,
);
router.get(
  '/:userId/followers',

  followingController.getFollowers,
);

router.get(
  '/:userId/followings',

  followingController.getFollowingList,
);
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
