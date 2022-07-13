import axios from "axios";
import { Request, Response } from 'express';
import fs from "fs";
import { StatusCodes } from 'http-status-codes';
import xml2js from "xml2js";
import { NotFoundError } from '../../../../errors/not-found-error';

const handler = async (req: Request, res: Response) => {
  // TODO this should take the pdoa id and send corresponding aplist
  const { data } = await axios.get(process.env.CENTRAL_REGISTRY_AP_URL!)

  if (!data) {
    throw new NotFoundError();
  }

  res.status(StatusCodes.OK).send(data);

  //! calling this every time the function runs.
  // TODO make this into a job that runs every {freq of central registry update} and when the app first loads
  const result = await xml2js.parseStringPromise(data, { mergeAttrs: true });

  const json = JSON.stringify(result, null, 4);

  fs.writeFileSync(__dirname + '/../../../../utils/apList.json', json);


};


export {
  handler as getApListHandler,
};

