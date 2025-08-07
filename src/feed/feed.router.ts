import { Router } from 'express';

import { validateBody, validateParams } from '../middlewares/validationMiddlewares';
import { authenticate } from '../middlewares/authenticate';

import * as feedController from './feed.controller';
import { FeedSchema, IdParamSchema } from './feed.validator';

const router = Router();

/**
 * @openapi
 * /feeds/:
 *   get:
 *     summary: Get feeds from all sources(max 10) sorted by date
 *     tags:
 *       - Feed
 *     responses:
 *       200:
 *         description: Feeds
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feed'
 *       500:
 *         description: Server error
 */
router.get('/', feedController.getAll);

/**
 * @openapi
 * /feeds/top10:
 *   get:
 *     summary: Gets 5 latest feeds from "El País" and "El Mundo"
 *     tags:
 *       - Feed
 *     responses:
 *       200:
 *         description: Top feeds by source
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feed'
 *       500:
 *         description: Server error
 */
router.get('/top10', feedController.getTopFeeds);

/**
 * @openapi
 * /feeds/{id}:
 *   get:
 *     summary: Get feed by id
 *     tags:
 *       - Feed
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/IdParam'
 *     responses:
 *       200:
 *         description: Feed details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feed'
 *       400:
 *         description: Invalid id
 *       404:
 *         description: Feed not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Feed not found
 */
router.get('/:id', validateParams(IdParamSchema), feedController.getById);

/**
 * @openapi
 * /feeds/:
 *   post:
 *     summary: Create new feed
 *     tags:
 *       - Feed
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FeedInput'
 *     responses:
 *       201:
 *         description: Feed successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feed'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, validateBody(FeedSchema), feedController.create);

/**
 * @openapi
 * /feeds/scrape:
 *   post:
 *     summary: Execute scrapers to get feeds from sources
 *     tags:
 *       - Feed
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Scraping successfully executed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Scraping successfully executed
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/scrape', authenticate, feedController.scrapeFeeds);

/**
 * @openapi
 * /feeds/{id}:
 *   put:
 *     summary: Updates feed by id
 *     tags:
 *       - Feed
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FeedInputPartial'
 *     responses:
 *       200:
 *         description: Feed successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feed'
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Feed not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Feed not found
 */
router.put(
  '/:id',
  authenticate,
  validateParams(IdParamSchema),
  validateBody(FeedSchema.partial()),
  feedController.updateById,
);

/**
 * @openapi
 * /feeds/{id}:
 *   delete:
 *     summary: Delete feed by id
 *     tags:
 *       - Feed
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/IdParam'
 *     responses:
 *       204:
 *         description: Feed successfully deleted
 *       400:
 *         description: Invalid id
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Feed not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Feed not found
 */
router.delete('/:id', authenticate, validateParams(IdParamSchema), feedController.deleteById);

export default router;

/**
 * @openapi
 * components:
 *   schemas:
 *     Feed:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Feed unique id(24 characters long)
 *           example: "64d2a4a1e2a1fa3c8b2345f1"
 *         title:
 *           type: string
 *           example: "Feed title"
 *         summary:
 *           type: string
 *           description: Feed summary
 *           example: "This is a short summary about the feed"
 *         author:
 *           type: string
 *           example: "Juan Carlos Rodriguez"
 *         source:
 *           type: string
 *           description: Feed original source
 *           example: "El País"
 *         url:
 *           type: string
 *           format: uri
 *           example: "https://elpais.com/feed123"
 *         publicationDate:
 *           type: string
 *           format: date-time
 *           description: Feed publication date in source
 *           example: "2023-08-06T15:00:00Z"
 *         creationDate:
 *           type: string
 *           format: date-time
 *           description: Database creation date
 *           example: "2023-08-06T15:05:00Z"
 *         imageUrl:
 *           type: string
 *           format: uri
 *           description: Image url
 *           example: "https://example.com/image.jpg"
 *     FeedInput:
 *       type: object
 *       required:
 *         - title
 *         - source
 *         - url
 *         - publicationDate
 *       properties:
 *         id:
 *           type: string
 *           description: Optional unique ID(will be generated if not provided)
 *         title:
 *           type: string
 *         summary:
 *           type: string
 *         author:
 *           type: string
 *         source:
 *           type: string
 *         url:
 *           type: string
 *           format: uri
 *         publicationDate:
 *           type: string
 *           format: date-time
 *           description: Publication date in source
 *         imageUrl:
 *           type: string
 *           format: uri
 *     FeedInputPartial:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         summary:
 *           type: string
 *         author:
 *           type: string
 *         source:
 *           type: string
 *         url:
 *           type: string
 *           format: uri
 *         publicationDate:
 *           type: string
 *           format: date-time
 *           description: Publication date in source
 *         imageUrl:
 *           type: string
 *           format: uri
 *     IdParam:
 *       type: string
 *       pattern: '^[0-9a-fA-F]{24}$'
 *       example: "64d2a4a1e2a1fa3c8b2345f1"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
