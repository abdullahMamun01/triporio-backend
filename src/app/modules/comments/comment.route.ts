import express from 'express';

import { commentController } from './comment.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { updateCommentValidateSchema } from './comment.validation';
import { authoRization } from '../../middleware/authoRization';
import { USER_ROLE } from '../user/user.constants';
import replyRouter from '../replies/reply.routes';

const router = express.Router();

router.patch(
  '/:commentId',
  validateRequest(updateCommentValidateSchema),
  authoRization(USER_ROLE.user, USER_ROLE.admin),
  commentController.updateComment,
);

router.delete(
  '/:commentId',
  authoRization(USER_ROLE.user, USER_ROLE.admin),
  commentController.deleteComment,
);
router.use('/', replyRouter);

export const commentRoutes = router;
