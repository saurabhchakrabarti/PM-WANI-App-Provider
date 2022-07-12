import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { kcAdminClient } from '../../../../keycloak/keycloak-admin-client';
import { User } from '../../../../models/User';

const handler = async (req: Request, res: Response) => {

  const { firstName, lastName, username, email, password, phone, preferredPayment } = req.body;

  // TODO check if user with given credentials exists and then create the user
  await kcAdminClient.users.create({
    username,
    email,
    firstName,
    lastName,
    credentials: [{
      type: "password",
      value: password,
      temporary: false
    }],
    attributes: {
      phone,
      preferredPayment
    },
    // enabled required to be true in order to send actions email
    emailVerified: true,
    enabled: true,
    realmRoles: ['app-user']
  });


  const userId = await User.createUser({
    firstName, lastName, username, email, password, phone, preferredPayment
  })

  return res.status(StatusCodes.CREATED).send(userId);

};


export {
  handler as createUserHandler,
};

