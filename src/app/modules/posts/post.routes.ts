import express from 'express';
import { authoRization } from '../../middleware/authoRization';

import { USER_ROLE } from '../user/user.constants';
import { validateRequest } from '../../middleware/validateRequest';
import postValidationSchena from './post.validation';

import { commentValidateSchema } from '../comments/comment.validation';
import { commentController } from '../comments/comment.controller';
import { voteRoutes } from '../votes/postVote.route';
import { postController } from './post.controller';

const router = express.Router();
router.get('/', postController.getAllPost);

//single post
router.get(
  '/:postId',
  postController.singlePost,
);

router.post(
  '/',
  validateRequest(postValidationSchena),
  authoRization(USER_ROLE.user),
  postController.createPost,
);
//update post
router.patch(
  '/:postId',
  validateRequest(postValidationSchena.deepPartial()),
  authoRization(USER_ROLE.user),
  postController.updatePost,
);

router.delete(
  '/:postId',
  authoRization(USER_ROLE.user),
  postController.deletPost,
);

// router.patch(
//   '/:postId/upvote',
//   authoRization(USER_ROLE.user),
//   voteController.upvote,
// );

// router.patch(
//   '/:postId/downvote',
//   authoRization(USER_ROLE.user),
//   voteController.downVote,
// );

//for comment
router.get('/:postId/comments', commentController.getCommentListByPost);

router.post(
  '/:postId/comments',
  validateRequest(commentValidateSchema),
  authoRization(USER_ROLE.user),
  commentController.addComment,
);

router.use('/', voteRoutes);

export const postRoutes = router;
