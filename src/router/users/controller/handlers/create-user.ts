import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { User } from '../../../../models/User';

const handler = async (req: Request, res: Response) => {

  const { firstName, lastName, username, email, password, phone, preferredPayment } = req.body;

  // TODO check if user with given credentials exists and then create the user

  const userId = await User.createUser({
    firstName, lastName, username, email, password, phone, preferredPayment
  })

  return res.status(StatusCodes.CREATED).send(userId);

};


export {
  handler as createUserHandler,
};

