import express from 'express';
import { analyticController } from './analytics.controller';
import { authoRization } from '../../middleware/authoRization';
import { USER_ROLE } from '../user/user.constants';

const router = express.Router();

router.get(
  '/subscription',
  authoRization(USER_ROLE.admin),
  analyticController.subscriptionAnalytic,
);

router.get(
  '/posts',
  authoRization(USER_ROLE.admin),
  analyticController.postsAnalytic,
);
router.get(
  '/users',
  authoRization(USER_ROLE.admin),
  analyticController.usersAnalytic,
);
router.get(
  '/overview',
  authoRization(USER_ROLE.admin),
  analyticController.overview,
);
export const analyticRoute = router;
