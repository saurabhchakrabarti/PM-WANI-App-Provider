import dotenv from 'dotenv';

dotenv.config()

import { app } from './app';
import { intializeDB } from './db/data-source';
import { logger } from './services/logger';

const start = async () => {
  logger.info('starting up ......');
  if (!process.env.TYPEORM_HOST) {
    throw new Error("TYPEORM_HOST must be defined");

  }
  if (!process.env.TYPEORM_USERNAME) {
    throw new Error("TYPEORM_USERNAME must be defined");

  }

  if (!process.env.TYPEORM_PASSWORD) {
    throw new Error("TYPEORM_PASSWORD must be defined");
  }

  if (!process.env.TYPEORM_DATABASE) {
    throw new Error("TYPEORM_DATABASE must be defined");
  }

  if (!process.env.TYPEORM_PORT) {
    throw new Error("TYPEORM_PORT must be defined");
  }

  if (!process.env.TYPEORM_SYNCHRONIZE) {
    throw new Error("TYPEORM_SYNCHRONIZE must be defined");
  }

  if (!process.env.TYPEORM_LOGGING) {
    throw new Error("TYPEORM_LOGGING must be defined");

  }

  try {
    await intializeDB();

    logger.info("connected to database")
  } catch (e) {
    logger.error(e);
  }


  app.listen(process.env.PORT || 8080, () => {
    logger.info(`NODE_ENV ${process.env.NODE_ENV} services running on port ${process.env.PORT}`);
  })
}

process.on('SIGINT', () => { logger.info("Bye bye!"); process.exit(); });
start();
