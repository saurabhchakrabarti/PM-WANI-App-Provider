import express from 'express';
import { requireAuth } from '../../middleware/require-auth';
import { centralRegistryRoutes } from '../routes';
import { getWaniProvidersHandler } from './controller/handlers/wani-providers';

const router = express.Router();


router.get(centralRegistryRoutes.DownloadWaniProviders, requireAuth, getWaniProvidersHandler)

export {
  router as centralRegistryRouter
};

