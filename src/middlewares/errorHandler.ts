import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

import logger from '../logger';

interface HttpError extends Error {
  status?: number;
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  logger.error(err);

  if (err instanceof ZodError) {
    const treeifiedError = z.treeifyError(err);
    return res.status(400).json({ errors: treeifiedError });
  }

  const error = err as HttpError;
  const statusCode = typeof error.status === 'number' ? error.status : 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({ error: { message } });
}
