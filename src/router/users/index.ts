import express from 'express';
import { validateRequest } from '../../middleware/validate-request';
import { userRoutes } from '../routes';
import { createUserHandler } from './controller/handlers/create-user';
import { loginUserHandler } from './controller/handlers/login-user';
import { createUserValidator } from './controller/validators/create-user';
import { loginUserValidator } from './controller/validators/login-user';
const router = express.Router();

router.post(userRoutes.CreateUser, createUserValidator, validateRequest, createUserHandler)
router.post(userRoutes.LoginUser, loginUserValidator, validateRequest, loginUserHandler)
export {
  router as userRouter
};

