import { Request, Response } from 'express';
import fs from "fs";
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from "../../../../errors/bad-request-error";
import { isWaniAppToken } from '../../../../interfaces/waniAppToken';
import { WaniProviders } from "../../../../interfaces/waniProviders";
import { decrypt, getPubKeyFromCert } from '../../../../utils/rsa-crypto';

const handler = async (req: Request, res: Response) => {

  const wanipdoatoken = req.query.wanipdoatoken! as string;

  //! assumption key-exp not present
  const [pdoaId, date, token] = wanipdoatoken.split("|");

  if (!pdoaId || !token) {
    throw new BadRequestError("Invalid Token")
  }

  const waniProviders = JSON.parse(fs.readFileSync(__dirname + '/../../../../../utils/waniProviders.json', 'utf8')) as WaniProviders;

  // TODO use central registry model
  const pdoa = waniProviders["WaniRegistry"]["PDOAs"].find((pdoa) => {
    return pdoa.PDOA.some((item) => {
      return item.id.includes(pdoaId);
    });
  });

  if (!pdoa) {
    throw new BadRequestError("PDOA not found")
  }

  const { exp, _: key } = pdoa.PDOA[0].Keys[0].Key[0]

  if (!key) {
    throw new BadRequestError("Invalid Token")
  }
  // check if key has expired
  const expDate = new Date(parseInt(exp[0].substring(0, 4)), parseInt(exp[0].substring(4, 2)) - 1, parseInt(exp[0].substring(6, 2)));
  if (expDate < new Date()) {
    throw new BadRequestError("Key Expired")
  }

  const pubKey = getPubKeyFromCert(key);

  const encWaniAppToken = decrypt(token, pubKey)

  if (!encWaniAppToken) {
    throw new BadRequestError("Token Corrupted")
  }

  const waniAppToken = decrypt(encWaniAppToken, process.env.APP_PROVIDER_PRIVATE_KEY!)

  if (!isWaniAppToken(waniAppToken)) {
    throw new BadRequestError('App Token Invalid')
  }
  // verify waniAppToken
  res.status(StatusCodes.OK).send(waniAppToken);

  // TODO save failed and successful attempt of user to Session

};


export {
  handler as verifyWaniPdoaHandler,
};

