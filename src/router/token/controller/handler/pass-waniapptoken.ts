import axios from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from "../../../../errors/bad-request-error";
import { NotAuthorizedError } from '../../../../errors/not-authorized-error';
import { encrypt, getPubKeyFromCert } from '../../../../utils/rsa-crypto';

const handler = async (req: Request, res: Response) => {

  const existingUser = req.currentUser;

  if (!existingUser) {
    throw new NotAuthorizedError();
  }

  const cpUrl = req.query.cpUrl! as string;

  const pdoaId = 'f22e3f63-bda6-4633-bd3c-55c6cab696ba'
  const apMacId = 'f22e3f63-bda6-4633-bd3c-55c6cab696ba'

  const appPubKey = getPubKeyFromCert(process.env.APP_PROVIDER_PUBLIC_CERTIFICATE!);

  const appProviderId = '4592ffcc-fe45-4bec-a41f-f2aa76a78dcd'

  const date = new Date()

  const timestamp = "" + date.getFullYear() + ("0" + date.getMonth()).slice(-2) + ("0" + date.getDate()).slice(-2) + date.getHours() + date.getMinutes() + date.getSeconds()

  const token = {
    "ver": "1.0",
    "timestamp": timestamp,
    "username": existingUser.username,
    "password": existingUser.waniPassword,
    "apMacId": "20:74:E2:40:14:B2",
    "deviceMacId": "12:22:33:44:55:BA",
    "appId": "4592ffcc-fe45-4bec-a41f-f2aa76a78dcd",
    "appVer": "1.0",
    "totp": "1234",
    "custData": {
    }
  }

  // PKCS1 padding so 256 - 11 = 245 buffer can be encrypted
  const buffer = Buffer.from(JSON.stringify(token), 'utf8')
  let base64encToken = encrypt(buffer, appPubKey)


  if (!base64encToken) {
    throw new BadRequestError('enc token not formed')
  }

  const waniAppToken = appProviderId + "|" + base64encToken

  console.log(waniAppToken);
  // TODO find url from wani providers list

  const response = await axios.get(`${cpUrl}?waniapptoken=${waniAppToken}`)

  res.status(StatusCodes.OK).send(response.data);

};


export {
  handler as passWaniAppTokenHandler,
};

