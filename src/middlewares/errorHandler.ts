import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodIssue } from 'zod';

import logger from '../logger';

interface HttpError extends Error {
  status?: number;
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  logger.error(err);

  if (err instanceof ZodError) {
    const formattedErrors = err.issues.reduce<Record<string, string>>((acc, curr: ZodIssue) => {
      const path = curr.path.join('.') || 'root';
      acc[path] = curr.message;
      return acc;
    }, {});

    return res.status(400).json({ errors: formattedErrors });
  }

  const error = err as HttpError;
  const statusCode = typeof error.status === 'number' ? error.status : 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({ error: { message } });
}
