import express from 'express';
import { keycloak } from '../../app';
import { validateRequest } from '../../middleware/validate-request';
import { tokenRoutes } from '../routes';
import { verifyWaniPdoaHandler } from './controller/handler/verify-wani-pdoa';
import { verifyWaniPdoaValidator } from './controller/validator/verify-wani-pdoa';

const router = express.Router();

router.get(tokenRoutes.VerifyWaniPdoa, keycloak.protect(), verifyWaniPdoaValidator, validateRequest, verifyWaniPdoaHandler)

export {
  router as tokenRouter
};

