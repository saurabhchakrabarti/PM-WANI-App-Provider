import { Request, Response } from 'express';
import fs from "fs";
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from "../../../../errors/bad-request-error";
import { isWaniAppToken } from '../../../../interfaces/waniAppToken';
import { WaniProviders } from "../../../../interfaces/waniProviders";
import { logger } from '../../../../services/logger';
import { decrypt, getPubKeyFromCert } from '../../../../utils/rsa-crypto';

const handler = async (req: Request, res: Response) => {

  const wanipdoatoken = req.query.wanipdoatoken! as string;

  //! assumption key-exp not present
  const [pdoaId, date, token] = wanipdoatoken.split("|");

  if (!pdoaId || !token) {
    throw new BadRequestError("Invalid Token")
  }

  const waniProviders = JSON.parse(fs.readFileSync(__dirname + '/../../../../utils/waniProviders.json', 'utf8')) as WaniProviders;

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

  logger.info(key);

  const pubKey = getPubKeyFromCert(key);

  let encWaniAppToken = '';
  logger.info("public key \n", pubKey);


  while (true) {
    let currIdx = 0;
    encWaniAppToken = encWaniAppToken + decrypt(token.substring(currIdx, currIdx + 256), pubKey)
    currIdx = currIdx + 256;

    if (currIdx >= encWaniAppToken.length) {
      break;
    }
  }

  logger.info("enc Wani App Token \n", encWaniAppToken);

  if (!encWaniAppToken) {
    throw new BadRequestError("Token Corrupted")
  }

  logger.info("app provider private key] \n", process.env.APP_PROVIDER_PRIVATE_KEY!);

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

