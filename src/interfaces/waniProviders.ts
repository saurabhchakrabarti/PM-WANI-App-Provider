import { AppProvider } from "./appProvider"
import { PDOA } from "./pdoa"

interface WaniProviders {
  "WaniRegistry": {
    "lastUpdated": string[],
    "ttl": string[],
    "PDOAs": {
      "PDOA": PDOA[]
    }[],
    "AppProviders": {
      "AppProvider": AppProvider[]
    }[],
    "Signature": Signature[]
  }
}

interface Signature {
  "xmlns": string[],
  "SignedInfo": {
    "CanonicalizationMethod": {
      "Algorithm": string[]
    }[],
    "SignatureMethod": {
      "Algorithm": string[]
    }[],
    "Reference": {
      "URI": string[],
      "Transforms": [
        {
          "Transform": {
            "Algorithm": string[]
          }[]
        }
      ],
      "DigestMethod": [
        {
          "Algorithm": string[]
        }
      ],
      "DigestValue": string[]
    }[]
  }[],
  "SignatureValue": string[],
  "KeyInfo": {
    "X509Data": [
      {
        "X509SubjectName": string[],
        "X509Certificate": string[]
      }
    ]
  }[]

}

export {
  WaniProviders
}

