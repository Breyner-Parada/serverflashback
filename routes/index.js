import { Router } from 'express';

import postRouter from './postRouter.js';
import userRouter from './userRouter.js';


export function routerWeb(app) {
  const router = Router();
  app.use('/app', router);
  router.use('/post', postRouter);
  router.use('/user', userRouter);
}

