import express from 'express';
import { validateRequest } from '../../middleware/validate-request';
import { userRoutes } from '../routes';
import { createUserHandler } from './controller/handlers/create-user';
import { createUserValidator } from './controller/validators/create-user';
const router = express.Router();

router.get(userRoutes.CreateUser, createUserValidator, validateRequest, createUserHandler)

export {
  router as userRouter
};

