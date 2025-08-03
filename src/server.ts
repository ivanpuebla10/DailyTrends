import app from './app';
import logger from './logger';

const port = process.env.PORT || 3000;

app.listen(port, () => logger.info(`Server running on port ${port}`));
