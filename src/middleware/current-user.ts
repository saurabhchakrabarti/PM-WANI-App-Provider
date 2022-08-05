import { NextFunction, Request, Response } from "express";

import { logger } from "../services/logger";

import jwt from "jsonwebtoken";

// a more precise definition of what we get back from payload to help augment currentUser to req
interface UserPayload {
  id: string;
  email: string;
  name: string;
  preferred_username: string;
  wani_password: string;
  preferred_payment?: string;
  phone_number: string;

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
  const keycloakToken = req.headers["authorization"]?.split(" ")[1]



  try {


    if (!keycloakToken) {
      return next();
    }

    let content;
    jwt.verify(keycloakToken, process.env.KEYCLOAK_PUBLIC_KEY!, { algorithms: ['RS256'] }, (err, payload) => {
      if (err) {
        // Not a valid token
        logger.error(err);
        return next();
      }

      // Token successfully verified
      content = payload;
    });

    if (!content) {
      return next();
    }
    const user = content as UserPayload

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
