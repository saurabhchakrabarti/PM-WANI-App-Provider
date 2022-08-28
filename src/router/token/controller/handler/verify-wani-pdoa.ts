import crypto from "crypto";
import { Request, Response } from 'express';
import fs from "fs";
import { StatusCodes } from 'http-status-codes';
import { Status } from "../../../../entities/Session";
import { BadRequestError } from "../../../../errors/bad-request-error";
import { isWaniAppToken, WaniAppToken } from '../../../../interfaces/waniAppToken';
import { WaniProviders } from "../../../../interfaces/waniProviders";
import { Session } from "../../../../models/Session";
import { User } from '../../../../models/User';
import { decrypt, getPubKeyFromCert, privateEncrypt, publicDecrypt } from '../../../../utils/rsa-crypto';
const handler = async (req: Request, res: Response) => {

  const wanipdoatoken = req.query.wanipdoatoken! as string;

  //! assumption key-exp not present
  const [pdoaId, keyExp, token] = wanipdoatoken.split("|");

  if (!pdoaId || !token) {
    throw new BadRequestError("Invalid Token")
  }

  const waniProviders = JSON.parse(fs.readFileSync(__dirname + '/../../../../utils/waniProviders.json', 'utf8')) as WaniProviders;

  // TODO use central registry model
  const pdoa = waniProviders["WaniRegistry"]["PDOAs"][0]["PDOA"].filter(pdoa => pdoa.id.includes(pdoaId))

  if (!pdoa) {
    throw new BadRequestError("PDOA not found")
  }

  const { exp, _: key } = pdoa[0].Keys[0].Key.filter(key => key.exp.includes(String(keyExp)))[0]

  if (!key) {
    throw new BadRequestError("Invalid Token")
  }
  // check if key has expired
  const expDate = new Date(parseInt(exp[0].substring(0, 4)), parseInt(exp[0].substring(4, 2)) - 1, parseInt(exp[0].substring(6, 2)));
  if (expDate < new Date()) {
    throw new BadRequestError("Key Expired")
  }

  const pubKey = getPubKeyFromCert(key);

  let encWaniAppToken = '';
  const buffer = Buffer.from(decodeURIComponent(token), 'base64')

  let currIdx = 0;

  while (true) {
    encWaniAppToken = encWaniAppToken + publicDecrypt(buffer.subarray(currIdx, currIdx + 256), pubKey)
    currIdx = currIdx + 256;

    if (currIdx >= Buffer.byteLength(buffer)) {
      break;
    }
  }

  encWaniAppToken = encWaniAppToken.replace(/ /g, "+")

  if (!encWaniAppToken) {
    throw new BadRequestError("Token Corrupted")
  }

  const [appProviderId, encToken] = encWaniAppToken.split("|");

  currIdx = 0;
  const encTokenBuffer = Buffer.from(encToken, 'base64')

  const waniAppToken = decrypt(encTokenBuffer, process.env.APP_PROVIDER_PRIVATE_KEY!)



  if (!waniAppToken) {
    throw new BadRequestError("App Token Corrupted")
  }

  const appTokenObject = JSON.parse(waniAppToken) as WaniAppToken

  // verify waniAppToken
  if (!isWaniAppToken(appTokenObject)) {
    throw new BadRequestError('App Token Invalid')
  }

  const appProvider = waniProviders["WaniRegistry"]["AppProviders"][0].AppProvider.find((ap) => {
    return ap.id.some((item) => {
      return item.includes(appProviderId);
    });
  });


  const user = await User.getUserByUsername(appTokenObject.username)

  if (!user) {
    throw new BadRequestError('User does not exist')
  }

  const date = new Date()

  const timestamp = "" + date.getFullYear() + ("0" + date.getMonth()).slice(-2) + ("0" + date.getDate()).slice(-2) + date.getHours() + date.getMinutes() + date.getSeconds()

  // HASH input according to specification
  const hashInput = "" + timestamp + appTokenObject.username + appTokenObject.password + appTokenObject.apMacId + user?.preferredPayment + appTokenObject.deviceMacId
  const hash = crypto.createHash('sha256').update(hashInput).digest('base64');
  const signature = privateEncrypt(hash, process.env.APP_PROVIDER_PRIVATE_KEY!)

  const response = {
    "ver": appTokenObject.ver,
    "timestamp": appTokenObject.timestamp,
    "username": appTokenObject.username,
    "password": appTokenObject.password,
    "apMacId": appTokenObject.apMacId,
    "deviceMacId": appTokenObject.deviceMacId,
    "payment-address": user?.preferredPayment || "",
    "app-provider-id": appProviderId,
    "app-provider-name": appProvider?.name[0],
    "signature": signature,
    "key-exp": keyExp
  }

  res.status(StatusCodes.OK).send(response);

  await Session.createSession({
    user_id: user.id!,
    accessTimestamp: date,
    pdoaId: pdoaId,
    status: Status.VERIFIED,
    username: user.username!
  })
};


export {
  handler as verifyWaniPdoaHandler,
};

