import * as dotenv from 'dotenv';
dotenv.config();

import app from './app';
import logger from './utils/logger.util';
import { connect } from './models/index';

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  logger.info('App is running at http://localhost:%d', port);
  try {
    await connect();
  } catch (error) {
    logger.error('Failed To Start DB Connection', error);
    logger.error('Shutting Down Server...');
    process.exit(1);
  }
});
