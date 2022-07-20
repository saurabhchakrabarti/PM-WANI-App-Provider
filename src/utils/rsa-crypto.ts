import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

function encrypt(toEncrypt: string, key?: string | Buffer, relativeOrAbsolutePathToPublicKey?: string) {
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
  const encrypted = crypto.publicEncrypt({
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_PADDING,
  }, buffer,)
  return encrypted.toString('base64')
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

function decrypt(toDecrypt: string, key?: string | Buffer, relativeOrAbsolutePathToPrivateKey?: string) {
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


  const buffer = Buffer.from(toDecrypt, 'base64')
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey.toString(),
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    buffer,
  )
  return decrypted.toString('utf8')
}


function publicDecrypt(toDecrypt: string, key?: string | Buffer, relativeOrAbsolutePathToPrivateKey?: string) {
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


  const buffer = Buffer.from(toDecrypt, 'base64')
  const decrypted = crypto.publicDecrypt(
    {
      key: privateKey.toString(),
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    buffer,
  )
  return decrypted.toString('utf8')
}


function getPubKeyFromCert(cert: string) {
  return crypto.createPublicKey(cert).export({ type: 'pkcs1', format: 'pem' })
}

export {
  encrypt, decrypt, getPubKeyFromCert, publicDecrypt, privateEncrypt
};

