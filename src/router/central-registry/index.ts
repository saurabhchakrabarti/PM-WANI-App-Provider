import express from 'express';
import { requireAuth } from '../../middleware/require-auth';
import { centralRegistryRoutes } from '../routes';
import { getApListHandler } from './controller/handlers/ap-list';
import { getWaniProvidersHandler } from './controller/handlers/wani-providers';

const router = express.Router();

router.get(centralRegistryRoutes.DownloadWaniAPList, requireAuth, getApListHandler)
router.get(centralRegistryRoutes.DownloadWaniProviders, requireAuth, getWaniProvidersHandler)

export {
  router as centralRegistryRouter
};

