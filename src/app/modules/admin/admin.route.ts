import express from 'express';
import { authoRization } from '../../middleware/authoRization';
import { USER_ROLE } from '../user/user.constants';
import { adminController } from './admin.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { userRoleSchema } from './admin.validation';

const router = express.Router();

router.get(
  '/users',
  authoRization(USER_ROLE.admin),
  adminController.getAllUser,
);

router.get(
  '/posts',
  authoRization(USER_ROLE.admin),
  adminController.getAllPosts,
);
router.patch(
  '/users/:user',
  authoRization(USER_ROLE.admin),
  adminController.setUserProfileVerifiedStatus,
);
router.patch(
  '/:userId/role',
  validateRequest(userRoleSchema) ,
  authoRization(USER_ROLE.admin),
  adminController.updateUserRoleController,
);



router.delete(
  '/users/:userId',
  authoRization(USER_ROLE.admin),
  adminController.deleteUser,
);

router.patch(
    '/users/:userId/block',
    authoRization(USER_ROLE.admin),
    adminController.blockUser,
  );
router.delete(
  '/posts/:postId',
  authoRization(USER_ROLE.admin),
  adminController.deleteUser,
);

export const adminRoutes = router;
