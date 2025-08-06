import { Router } from 'express';

import { validateBody, validateParams } from '../middlewares/validationMiddlewares';
import { authenticate } from '../middlewares/authenticate';

import * as feedController from './feed.controller';
import { FeedSchema, IdParamSchema } from './feed.validator';

const router = Router();

router.get('/', feedController.getAll);
router.get('/top10', feedController.getTopFeeds);
router.get('/:id', validateParams(IdParamSchema), feedController.getById);
router.post('/', authenticate, validateBody(FeedSchema), feedController.create);
router.post('/scrape', authenticate, feedController.scrapeFeeds);
router.put(
  '/:id',
  authenticate,
  validateParams(IdParamSchema),
  validateBody(FeedSchema.partial()),
  feedController.updateById,
);
router.delete('/:id', authenticate, validateParams(IdParamSchema), feedController.deleteById);

export default router;
