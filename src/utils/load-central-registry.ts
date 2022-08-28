import axios from "axios";
import fs from "fs";
import xml2js from "xml2js";
import { logger } from "../services/logger";

export const loadWaniProviders = async (): Promise<void> => {
  logger.info("loading central registry...")
  const [wani_providers_res] = await Promise.all([axios.get(process.env.CENTRAL_REGISTRY_PROVIDER_URL!)])

  const [result_wp] = await Promise.all([xml2js.parseStringPromise(wani_providers_res.data, { mergeAttrs: true })]);

  const json_wp = JSON.stringify(result_wp, null, 4);

  fs.writeFileSync(__dirname + '/waniProviders.json', json_wp);


  logger.info("central registry loaded")

}
