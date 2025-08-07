import { Router } from 'express';

import { validateBody } from '../middlewares/validationMiddlewares';

import { create, login } from './auth.controller';
import { createSchema, loginSchema } from './auth.validator';

const router = Router();

/**
 * @openapi
 * /auth/create:
 *   post:
 *     summary: Create new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Body needed
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User successfully created
 *       400:
 *         description: Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/create', validateBody(createSchema), create);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Authentication and token
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successfull and user data(included token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/UserData'
 *       400:
 *         description: Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Wrong credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', validateBody(loginSchema), login);

export default router;

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateUserInput:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: user123
 *         email:
 *           type: string
 *           format: email
 *           example: user123@example.com
 *         password:
 *           type: string
 *           minLength: 8
 *           example: 'strongpassword1213'
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user123@example.com
 *         password:
 *           type: string
 *           example: 'strongpassword1213'
 *     UserData:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 64f2a41f0f1afc00159b4474
 *         username:
 *           type: string
 *           example: user123
 *         email:
 *           type: string
 *           format: email
 *           example: user123@example.com
 *     ValidationError:
 *       type: object
 *       properties:
 *         errors:
 *           type: object
 *           additionalProperties:
 *             type: string
 *           example:
 *             email: "Invalid email format"
 *             password: "Password must be at least 8 characters long"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: User not found
 */
