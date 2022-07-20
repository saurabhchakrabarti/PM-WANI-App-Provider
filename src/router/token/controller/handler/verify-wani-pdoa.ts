import { Request, Response } from 'express';
import fs from "fs";
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from "../../../../errors/bad-request-error";
import { isWaniAppToken } from '../../../../interfaces/waniAppToken';
import { WaniProviders } from "../../../../interfaces/waniProviders";
import { logger } from '../../../../services/logger';
import { decrypt, getPubKeyFromCert, publicDecrypt } from '../../../../utils/rsa-crypto';

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

  const key_temp = "-----BEGIN CERTIFICATE-----\nMIID4TCCAsmgAwIBAgIJAMMdpCQthV2FMA0GCSqGSIb3DQEBCwUAMIGGMQswCQYD\nVQQGEwJJTjESMBAGA1UECAwJS0FSTkFUQUtBMRIwEAYDVQQHDAlCQU5HQUxPUkUx\nDjAMBgNVBAoMBUMtRE9UMQwwCgYDVQQLDANQU0cxEDAOBgNVBAMMB3NhbmRlZXAx\nHzAdBgkqhkiG9w0BCQEWEHNhbmRlZXBhQGNkb3QuaW4wHhcNMjEwMTAyMTQxNTUx\nWhcNMjIwMTAyMTQxNTUxWjCBhjELMAkGA1UEBhMCSU4xEjAQBgNVBAgMCUtBUk5B\nVEFLQTESMBAGA1UEBwwJQkFOR0FMT1JFMQ4wDAYDVQQKDAVDLURPVDEMMAoGA1UE\nCwwDUFNHMRAwDgYDVQQDDAdzYW5kZWVwMR8wHQYJKoZIhvcNAQkBFhBzYW5kZWVw\nYUBjZG90LmluMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAx9kw9gOh\nl/K4Mu/cMOdiboeyhH8u530W0ueEU2tRXKml+DRKs91eW5EXfCwCwrsDOr3/X7f2\nBwZFeM55Pu0n9EbrvWv31TWdM6pe0swXwsPSm+R/JYsygjt7Mwqgsooci2z2G5fp\njfoEHQpaKGhTvhQElL5UETMW9kbPXl1lYGNWmwl3Cn1dTPHX+ytaS2DFKRpmAq0J\nGZg8IyxahJbETTWv/UkESNQjDRMWtboZgYe7bPnIIW6crSMVnbZfNLZZj3JsJhBL\nZ18heNW4qgzvzhQ8xkajeqShJbDaSEYRufbsrXzmL4Ko80BrXdUmH5VPB0+d1t4O\n78esYwHTRjK3TQIDAQABo1AwTjAdBgNVHQ4EFgQUxkmi2Tj+1xdxoIdgIvCOsQRu\nXx4wHwYDVR0jBBgwFoAUxkmi2Tj+1xdxoIdgIvCOsQRuXx4wDAYDVR0TBAUwAwEB\n/zANBgkqhkiG9w0BAQsFAAOCAQEADwCexrsQE+uFx+OrwWit07OlMB00YQdwQiN4\nvp7oa0Gyijj22nx8QivGATHcgL46lviBKKjPXMsT9Ou+Ws/ZTyyb/K43K16i7+bU\n9zCZl4woCsz8g90nriNj+eRV4EOdBelQHNhmUPfto/xCSQWXl/NMwHeHil2CzskJ\nDTczQlzkGoi+YeehKS6CzmjVZk3kDYg6qbIoH5J2GpH3aAsHJkqP5iYLg1+Kph3J\n2M8wkbrfIk8fmg8DKKYwkmIlBEabmGpOU/dm01xzIlEJ7uCJHz2kv9EpPql20+Is\nHHPJn0x06l4uzutiqo8FyaziQgztsxZpx6FmGU5RQX7NPjPZ+g==\n-----END CERTIFICATE-----"
  const pubKey = getPubKeyFromCert(key_temp);

  let encWaniAppToken = '';

  while (true) {
    let currIdx = 0;
    encWaniAppToken = encWaniAppToken + publicDecrypt(token.substring(currIdx, currIdx + 256), pubKey)
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

