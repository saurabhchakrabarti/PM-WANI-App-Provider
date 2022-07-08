import express from 'express';
import { centralRegistryRoutes } from '../routes';
import { getApListHandler } from './controller/handlers/ap-list';
import { getWaniProvidersHandler } from './controller/handlers/wani-providers';

const router = express.Router();

router.get(centralRegistryRoutes.DownloadWaniAPList, getApListHandler)
router.get(centralRegistryRoutes.DownloadWaniProviders, getWaniProvidersHandler)

export {
  router as centralRegistryRouter
};
