import express from 'express';

import { authoRization } from '../../middleware/authoRization';
import { USER_ROLE } from '../user/user.constants';
import { voteController } from './postVote.controller';

const router = express.Router();
router.get(
  '/:postId/check-vote',
  authoRization(USER_ROLE.user),
  voteController.checkUserVote,
);
router.patch(
  '/:postId/upvote',
  authoRization(USER_ROLE.user),
  voteController.upvote,
);

router.patch(
  '/:postId/downvote',
  authoRization(USER_ROLE.user),
  voteController.downVote,
);

export const voteRoutes = router;
