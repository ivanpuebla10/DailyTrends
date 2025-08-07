import { Request, Response, NextFunction } from 'express';

import Logger from '../logger';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startHrTime = process.hrtime();

  Logger.info(`[Request] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);

  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

    Logger.http(
      `[Response] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Duration: ${elapsedMs.toFixed(3)} ms`,
    );
  });

  next();
}
