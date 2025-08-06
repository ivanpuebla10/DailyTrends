import { Router } from 'express';

import { validateBody } from '../middlewares/validationMiddlewares';

import { create, login } from './auth.controller';
import { createSchema, loginSchema } from './auth.validator';

const router = Router();

router.post('/create', validateBody(createSchema), create);
router.post('/login', validateBody(loginSchema), login);

export default router;
