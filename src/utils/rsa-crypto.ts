import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

function encrypt(toEncrypt: Buffer, key?: string | Buffer, relativeOrAbsolutePathToPublicKey?: string) {
  if (!key && !relativeOrAbsolutePathToPublicKey) {
    return null
  }

  let publicKey: string | Buffer = "";
  if (relativeOrAbsolutePathToPublicKey) {

    const absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey)
    publicKey = fs.readFileSync(absolutePath, 'utf8')
  }

  if (key) {
    publicKey = key
  }
  let currIdx = 0;
  let encryptedBuffers = [];

  while (true) {
    encryptedBuffers.push(crypto.publicEncrypt({
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    }, toEncrypt.subarray(currIdx, currIdx + 245)))

    currIdx = currIdx + 245;

    if (currIdx >= Buffer.byteLength(toEncrypt)) {
      break;
    }
  }


  return Buffer.concat(encryptedBuffers).toString('base64')
}

function privateEncrypt(toEncrypt: string, key?: string | Buffer, relativeOrAbsolutePathToPublicKey?: string) {
  if (!key && !relativeOrAbsolutePathToPublicKey) {
    return null
  }

  let publicKey: string | Buffer = "";
  if (relativeOrAbsolutePathToPublicKey) {

    const absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey)
    publicKey = fs.readFileSync(absolutePath, 'utf8')
  }

  if (key) {
    publicKey = key
  }
  const buffer = Buffer.from(toEncrypt, 'utf8')
  const encrypted = crypto.privateEncrypt({
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_PADDING,
  }, buffer,)
  return encrypted.toString('base64')
}

function decrypt(toDecrypt: Buffer, key?: string | Buffer, relativeOrAbsolutePathToPrivateKey?: string) {
  if (!key && !relativeOrAbsolutePathToPrivateKey) {
    return null
  }

  let privateKey: string | Buffer = "";
  if (relativeOrAbsolutePathToPrivateKey) {
    const absolutePath = path.resolve(relativeOrAbsolutePathToPrivateKey)
    privateKey = fs.readFileSync(absolutePath, 'utf8')
  }

  if (key) {
    privateKey = key
  }

  let currIdx = 0;
  let decrypted = ""

  while (true) {

    decrypted = decrypted + crypto.privateDecrypt(
      {
        key: privateKey.toString(),
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      toDecrypt.subarray(currIdx, currIdx + 256),
    ).toString('utf8')
    currIdx = currIdx + 256;

    if (currIdx >= Buffer.byteLength(toDecrypt)) {
      break;
    }
  }

  return decrypted
}


function publicDecrypt(toDecrypt: Buffer, key?: string | Buffer, relativeOrAbsolutePathToPrivateKey?: string) {
  if (!key && !relativeOrAbsolutePathToPrivateKey) {
    return null
  }

  let privateKey: string | Buffer = "";
  if (relativeOrAbsolutePathToPrivateKey) {
    const absolutePath = path.resolve(relativeOrAbsolutePathToPrivateKey)
    privateKey = fs.readFileSync(absolutePath, 'utf8')
  }

  if (key) {
    privateKey = key
  }

  const decrypted = crypto.publicDecrypt(
    {
      key: privateKey.toString(),
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    toDecrypt,
  )
  return decrypted.toString('utf8')
}


function getPubKeyFromCert(cert: string) {
  return crypto.createPublicKey(cert).export({ type: 'pkcs1', format: 'pem' })
}

export {
  encrypt, decrypt, getPubKeyFromCert, publicDecrypt, privateEncrypt
};

