import express from 'express';
import { userController } from './user.controller';
import { validateRequest } from '../../middleware/validateRequest';
import userRegisterValidationSchema, {
  updateUserValidateSchema,
  userRoleSchema,
} from './user.validation';
import { authoRization } from '../../middleware/authoRization';
import { USER_ROLE } from './user.constants';
import { postController } from '../posts/controller/post.controller';

const router = express.Router();
router.get(
  '/users',

  authoRization(USER_ROLE.admin),
  userController.getAllUserController,
);

router.get(
  '/me',
  authoRization(USER_ROLE.user),
  userController.getSingleUserController,
);

router.get(
  '/me/posts',
  authoRization(USER_ROLE.user),
  postController.getUserPosts,
);

router.post(
  '/signup',
  validateRequest(userRegisterValidationSchema),
  userController.signupController,
);

router.put(
  '/users/:userId/role',
  validateRequest(userRoleSchema),
  authoRization(USER_ROLE.admin),
  userController.updateUserRoleController,
);

router.put(
  '/me/update-profile',
  validateRequest(updateUserValidateSchema),
  authoRization(USER_ROLE.user),
  userController.updateProfileController,
);

export const userRoutes = router;
