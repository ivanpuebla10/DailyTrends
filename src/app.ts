import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import logger from './logger';

dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || '';

mongoose
  .connect(mongoUri)
  .then(() => logger.info('Database connected'))
  .catch((err) => logger.error('Error trying to connect to the database:', err));

app.get('/', (req, res) => res.send('Alive!'));

app.listen(port, () => logger.info(`Server running on port ${port}`));
