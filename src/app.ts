import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import helmet from 'helmet';
import createRateLimit from 'express-rate-limit';

import { setupSwagger } from './swagger';
import router from './router';
import logger from './logger';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';

const app = express();

app.use(helmet());

const limiter = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  const mongoUri = process.env.MONGO_URI || '';
  mongoose
    .connect(mongoUri)
    .then(() => logger.info('Database connected'))
    .catch((err) => {
      logger.error('Error trying to connect to the database:', err);
    });
}
app.use(requestLogger);

app.use(router);

setupSwagger(app);
app.use(errorHandler);

export default app;
