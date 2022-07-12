import dotenv from 'dotenv';

dotenv.config()

import { app } from './app';
import { intializeDB } from './db/data-source';
import { kcAdminClient } from './keycloak/keycloak-admin-client';
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

  if (!process.env.TYPEORM_CONNECTION) {
    throw new Error("TYPEORM_CONNECTION must be defined");

  }

  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET must be defined");

  }

  if (!process.env.CENTRAL_REGISTRY_PROVIDER_URL) {
    throw new Error("CENTRAL_REGISTRY_PROVIDER_URL must be defined");

  }

  if (!process.env.CENTRAL_REGISTRY_AP_URL) {
    throw new Error("CENTRAL_REGISTRY_AP_URL must be defined");

  }

  if (!process.env.APP_PROVIDER_PRIVATE_KEY) {
    throw new Error("APP_PROVIDER_PRIVATE_KEY must be defined");

  }

  if (!process.env.KEYCLOAK_CLIENT_ID) {
    throw new Error("KEYCLOAK_CLIENT_ID must be defined");

  }

  if (!process.env.KEYCLOAK_CLIENT_SECRET) {
    throw new Error("KEYCLOAK_CLIENT_SECRET must be defined");

  }

  if (!process.env.KEYCLOAK_BASE_URL) {
    throw new Error("KEYCLOAK_BASE_URL must be defined");

  }

  if (!process.env.KEYCLOAK_REALM_NAME) {
    throw new Error("KEYCLOAK_REALM_NAME must be defined");

  }

  if (!process.env.KEYCLOAK_ADMIN_LIFESPAN) {
    throw new Error("KEYCLOAK_ADMIN_LIFESPAN must be defined");

  }

  if (!process.env.KEYCLOAK_AUTH_TOKEN_URL) {
    throw new Error("KEYCLOAK_AUTH_TOKEN_URL must be defined");

  }

  await intializeDB();


  // ---- Keycloak admin client setup -----


  const credentials = {
    grantType: 'client_credentials',
    clientId: process.env.KEYCLOAK_CLIENT_ID!,
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
  };

  //@ts-ignore
  await kcAdminClient.auth(credentials);

  //@ts-ignore
  setInterval(() => kcAdminClient.auth(credentials), parseInt(process.env.KEYCLOAK_ADMIN_LIFESPAN) * 1000); // seconds

  app.listen(process.env.PORT || 8080, () => {
    logger.info(`NODE_ENV ${process.env.NODE_ENV} services running on port ${process.env.PORT}`);
  })
}

process.on('SIGINT', () => { logger.info("Bye bye!"); process.exit(); });
start();
