import express from 'express';
import { keycloak } from '../../app';
import { validateRequest } from '../../middleware/validate-request';
import { tokenRoutes } from '../routes';
import { passWaniAppTokenHandler } from './controller/handler/pass-waniapptoken';
import { verifyWaniPdoaHandler } from './controller/handler/verify-wani-pdoa';
import { verifyWaniPdoaValidator } from './controller/validator/verify-wani-pdoa';

const router = express.Router();

router.get(tokenRoutes.VerifyWaniPdoa, verifyWaniPdoaValidator, validateRequest, verifyWaniPdoaHandler)
router.get(tokenRoutes.passWaniapptoken, keycloak.protect(), passWaniAppTokenHandler)

export {
  router as tokenRouter
};

