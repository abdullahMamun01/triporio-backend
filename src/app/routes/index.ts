import { Router } from 'express';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { postRoutes } from '../modules/posts/post.routes';


const router = Router();

const routes = [
  {
    path: '/',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/posts',
    route: postRoutes,
  }


];

routes.forEach(({ path, route }) => {
  router.use(path, route);
});
export default router;
