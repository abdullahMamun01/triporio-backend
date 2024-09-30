import express from 'express';

import { commentController } from './comment.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { commentValidateSchema } from './comment.validation';
import { authoRization } from '../../middleware/authoRization';
import { USER_ROLE } from '../user/user.constants';

const router = express.Router();
router.get('/', commentController.getCommentList);
router.post(
  '/:postId',
  validateRequest(commentValidateSchema),
  authoRization(USER_ROLE.user),
  commentController.addComment,
);

export const commentRoutes = router;
