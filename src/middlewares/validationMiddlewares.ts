import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError, ZodIssue } from 'zod';

function formatZodError(error: ZodError) {
  const formattedErrors = error.issues.reduce<Record<string, string>>((acc, curr: ZodIssue) => {
    const path = curr.path.join('.') || 'root';
    acc[path] = curr.message;
    return acc;
  }, {});
  return formattedErrors;
}

type StringRecord = Record<string, string>;

export const validateBody =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction): Response | void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: formatZodError(result.error) });
    }
    req.body = result.data;
    next();
  };

export const validateParams =
  <T extends StringRecord>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction): Response | void => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return res.status(400).json({ errors: formatZodError(result.error) });
    }
    req.params = result.data;
    next();
  };
