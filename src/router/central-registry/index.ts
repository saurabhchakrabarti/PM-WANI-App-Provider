import express from 'express';
import { keycloak } from '../../app';
import { centralRegistryRoutes } from '../routes';
import { getApListHandler } from './controller/handlers/ap-list';
import { getWaniProvidersHandler } from './controller/handlers/wani-providers';

const router = express.Router();

router.get(centralRegistryRoutes.DownloadWaniAPList, keycloak.protect(), getApListHandler)
router.get(centralRegistryRoutes.DownloadWaniProviders, keycloak.protect(), getWaniProvidersHandler)

export {
  router as centralRegistryRouter
};

