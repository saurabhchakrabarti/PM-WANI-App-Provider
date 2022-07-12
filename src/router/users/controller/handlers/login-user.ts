import axios from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import qs from 'qs';

const handler = async (req: Request, res: Response) => {

  const { username, password } = req.body;

  const data = qs.stringify({
    'grant_type': 'password',
    'client_id': process.env.KEYCLOAK_CLIENT_ID!,
    'client_secret': process.env.KEYCLOAK_CLIENT_SECRET!,
    username,
    password
  });

  // TODO capture errors related to auth and send invalid cred if such an error occurs
  const response = await axios.post(process.env.KEYCLOAK_AUTH_TOKEN_URL!, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  return res.status(StatusCodes.CREATED).send(response.data);


};


export {
  handler as loginUserHandler,
};

