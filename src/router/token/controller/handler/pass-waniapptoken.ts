import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from "../../../../errors/bad-request-error";
import { encrypt, getPubKeyFromCert } from '../../../../utils/rsa-crypto';

const handler = async (req: Request, res: Response) => {


  const pdoaId = 'f22e3f63-bda6-4633-bd3c-55c6cab696ba'
  const apMacId = 'f22e3f63-bda6-4633-bd3c-55c6cab696ba'

  const appPubKey = getPubKeyFromCert(process.env.APP_PROVIDER_PUBLIC_CERTIFICATE!);

  const appProviderId = '4592ffcc-fe45-4bec-a41f-f2aa76a78dcd'

  const token = {
    "ver": "1.0",
    "timestamp": "20220712000000",
    "username": "test4@ispirt.com",
    "password": "Test@1234",
    "apMacId": "20:74:E2:40:14:B2",
    "deviceMacId": "12:22:33:44:55:BA",
    "appId": "4592ffcc-fe45-4bec-a41f-f2aa76a78dcd",
    "appVer": "1.0",
    "totp": "1234",
    "custData": {
      "hey": "THIS IS A TEST",
      "ver": "1.0",
      "timestamp": "20220712000000",
      "username": "test4@ispirt.com",
      "password": "Test@1234",
      "apMacId": "20:74:E2:40:14:B2",
      "deviceMacId": "12:22:33:44:55:BA",
      "appId": "4592ffcc-fe45-4bec-a41f-f2aa76a78dcd",
      "appVer": "1.0",
      "totp": "1234",
      "ver_1": "1.0",
      "timestamp_1": "20220712000000",
      "username_1": "test4@ispirt.com",
      "password_1": "Test@1234",
      "apMacId_1": "20:74:E2:40:14:B2",
      "deviceMacId_1": "12:22:33:44:55:BA",
      "appId_1": "4592ffcc-fe45-4bec-a41f-f2aa76a78dcd",
      "appVer_1": "1.0",
      "totp_1": "1234",
    }
  }

  const buffer = Buffer.from(JSON.stringify(token), 'utf8')
  let base64encToken = ""

  let currIdx = 0;
  while (true) {
    base64encToken = base64encToken + encrypt(buffer.subarray(currIdx, currIdx + 256), appPubKey)
    currIdx = currIdx + 256;

    if (currIdx >= Buffer.byteLength(buffer)) {
      break;
    }
  }


  if (!base64encToken) {
    throw new BadRequestError('enc token not formed')
  }

  const waniAppToken = appProviderId + "|" + base64encToken

  console.log(waniAppToken);
  // TODO find url from wani providers list

  // const response = await axios.get(`https://pdoab.cdot.in/v1/pdoa/0dd1cd73-eef6-4809-a8c0-925bd470b0b6/authreqpost?waniapptoken=${waniAppToken}`)


  res.status(StatusCodes.OK).send();

};


export {
  handler as passWaniAppTokenHandler,
};

