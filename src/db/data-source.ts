import { DataSource } from "typeorm";
import { logger } from "../services/logger";

const myDataSource = new DataSource({
  type: "postgres",
  host: process.env.TYPEORM_HOST!,
  port: parseInt(process.env.TYPEORM_PORT!),
  username: process.env.TYPEORM_USERNAME!,
  password: process.env.TYPEORM_PASSWORD!,
  database: process.env.TYPEORM_DATABASE!,
  entities: ["src/models/*.ts"],
  logging: process.env.TYPEORM_LOGGING! === 'true',
  synchronize: process.env.TYPEORM_SYNCHRONIZE! === 'true',
})

async function intializeDB(): Promise<void> {
  try {
    await myDataSource.initialize();

  } catch (error) {
    logger.error(error);
  }
  logger.info('Database successfully initialized');
}

export {
  intializeDB,
  myDataSource
};

