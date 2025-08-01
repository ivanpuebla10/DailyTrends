import { Router } from 'express';

import feedRouter from './feed/feed.router';

const router = Router();

router.get('/alive', (req, res) => res.sendStatus(200));
router.use('/feeds', feedRouter);

export default router;
