import { Router } from 'express';

import feedRouter from './feed/feed.router';
import authRouter from './auth/auth.router';

const router = Router();

router.get('/alive', (req, res) => res.sendStatus(200));
router.use('/feeds', feedRouter);
router.use('/auth', authRouter);

export default router;
