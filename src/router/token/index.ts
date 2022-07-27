import express from 'express';
import { validateRequest } from '../../middleware/validate-request';
import { tokenRoutes } from '../routes';
import { passWaniAppTokenHandler } from './controller/handler/pass-waniapptoken';
import { verifyWaniPdoaHandler } from './controller/handler/verify-wani-pdoa';
import { passWaniapptokenValidator } from './controller/validator/pass-waniapptoken';
import { verifyWaniPdoaValidator } from './controller/validator/verify-wani-pdoa';

const router = express.Router();

router.get(tokenRoutes.VerifyWaniPdoa, verifyWaniPdoaValidator, validateRequest, verifyWaniPdoaHandler)
router.get(tokenRoutes.passWaniapptoken, passWaniapptokenValidator, validateRequest, passWaniAppTokenHandler)

export {
  router as tokenRouter
};

