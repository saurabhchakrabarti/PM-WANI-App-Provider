import { NextFunction, Request, Response } from "express";

import { logger } from "../services/logger";

import session from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    "keycloak-token": string;
  }
}


// a more precise definition of what we get back from payload to help augment currentUser to req
interface UserPayload {
  id: string;
  email: string;
  username: string;
  wani_password: string;
  preferred_payment?: string
}

// augment current user property to req
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload
    }
  }
}


export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const keycloakToken = req.session['keycloak-token']

  try {

    if (!keycloakToken) {
      return next();
    }

    const parsedRaw = JSON.parse(keycloakToken);
    const token = parsedRaw.id_token ? parsedRaw.id_token : parsedRaw.access_token;
    const content = token.split('.')[1];

    const user = JSON.parse(Buffer.from(content, 'base64').toString('utf-8'));

    req.currentUser = user;

  } catch (error) {
    logger.error(error);
    logger.error(JSON.stringify({
      error: "TOKEN MALFORMED",
      keycloakToken
    }));
    return next();
  }

  next();

}
