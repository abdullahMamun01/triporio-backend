import { Router } from 'express';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { postRoutes } from '../modules/posts/post.routes';
import { commentRoutes } from '../modules/comments/comment.route';

import { paymentRoutes } from '../modules/payment/payment.route';
import { analyticRoute } from '../modules/analytics/analytics.route';
import { adminRoutes } from '../modules/admin/admin.route';


const router = Router();

const routes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/posts',
    route: postRoutes,
  },
  {
    path: '/comments',
    route: commentRoutes,
  },
  {
    path: '/payment',
    route: paymentRoutes,
  },
  {
    path: '/analytics',
    route: analyticRoute,
  },
  {
    path: '/admin',
    route: adminRoutes,
  },
];

routes.forEach(({ path, route }) => {
  router.use(path, route);
});
export default router;
