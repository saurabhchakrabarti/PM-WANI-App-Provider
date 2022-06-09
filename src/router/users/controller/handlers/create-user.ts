import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { User } from '../../../../models/User';

const handler = async (req: Request, res: Response) => {

  const { firstName, lastName, username, email, password, phone, preferredPayment } = req.body;

  // const existingUser = req.currentUser;

  // if (!existingUser) {
  //   throw new NotAuthorizedError();
  // }

  // TODO parse username and password from existing user
  const userId = await User.createUser({
    firstName, lastName, username, email, password, phone, preferredPayment
  })

  res.status(StatusCodes.CREATED).send(userId);

};


export {
  handler as createUserHandler,
};

