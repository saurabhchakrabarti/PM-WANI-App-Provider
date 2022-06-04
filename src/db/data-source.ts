import { DataSource } from "typeorm";
import { logger } from "../services/logger";

const dataSource = new DataSource({
  type: "postgres",
  host: process.env.TYPEORM_HOST!,
  port: parseInt(process.env.TYPEORM_PORT!),
  username: process.env.TYPEORM_USERNAME!,
  password: process.env.TYPEORM_PASSWORD!,
  database: process.env.TYPEORM_DATABASE!,
  entities: ["src/entities/*.ts"],
  logging: process.env.TYPEORM_LOGGING! === 'true',
  synchronize: process.env.TYPEORM_SYNCHRONIZE! === 'true',
})

async function intializeDB(): Promise<void> {
  try {
    await dataSource.initialize();

  } catch (error) {
    logger.error(error);
  }
  logger.info('Database successfully initialized');
}

export {
  intializeDB,
  dataSource
};

