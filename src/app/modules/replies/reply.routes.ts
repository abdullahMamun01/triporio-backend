import express from 'express';

import { authoRization } from '../../middleware/authoRization';
import { USER_ROLE } from '../user/user.constants';
import { replyValidateSchema } from './reply.validation';
import { validateRequest } from '../../middleware/validateRequest';
import { replyController } from './reply.controller';

const replyRouter = express.Router();

replyRouter.get('/:commentId/reply', replyController.getRepliesByComment);

replyRouter.post(
  '/:commentId/reply',
  validateRequest(replyValidateSchema),
  authoRization(USER_ROLE.user, USER_ROLE.admin),
  replyController.addReply,
);

export default replyRouter;
