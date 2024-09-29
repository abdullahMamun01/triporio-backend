import express from 'express';
import { authoRization } from '../../middleware/authoRization';
import { postController } from './controller/post.controller';
import { USER_ROLE } from '../user/user.constants';
import { validateRequest } from '../../middleware/validateRequest';
import postValidationSchena from './post.validation';
import { voteController } from './controller/postVote.controller';

const router = express.Router();
router.get('/', postController.getAllPost);

router.post(
  '/',
  validateRequest(postValidationSchena),
  authoRization(USER_ROLE.user),
  postController.createPost,
);

router.patch(
  '/',
  validateRequest(postValidationSchena.deepPartial()),
  authoRization(USER_ROLE.user),
  postController.updatePost,
);

router.delete('/:postId', authoRization(USER_ROLE.user), postController.deletPost);

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

export const postRoutes = router;
