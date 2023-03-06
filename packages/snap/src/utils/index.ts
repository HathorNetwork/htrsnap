import * as bip32 from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';
import { BIP44CoinTypeNode, BIP44Node } from '@metamask/key-tree';
import { BIP32Interface } from 'bip32';
import { createHash } from 'crypto';
import {trimHexPrefix} from './hexHelper';

export * from './hexHelper';
export * from './xpubHelper';

export const hathorNetwork = {
  messagePrefix: '\x18Hathor Signed Message:\n',
  bech32: 'ht',
  bip32: {
    public: 76067358,
    private: 55720709,
  },
  pubKeyHash: 40,
  scriptHash: 100,
  wif: 128
};


/**
 * Calculate the double sha256 hash of the data.
 *
 * @remarks
 * If encoding is provided a string will be returned; otherwise a Buffer is returned.
 *
 * @param data - Data to be hashed
 * @param encoding - The encoding of the returned object
 * @returns The sha256d hash of the data
 */
export const sha256d = (data: string, encoding: any): string => {
  const hash1 = createHash('sha256');
  hash1.update(data);
  const hash2 = createHash('sha256');
  hash2.update(hash1.digest());
  return hash2.digest(encoding);
};

export const addressNodeToP2PKHAddress = (addressNode: BIP44Node, hathorNode: BIP44CoinTypeNode): string => {
  const privateKeyBuffer = Buffer.from(trimHexPrefix(addressNode.privateKey), 'hex')
  const chainCodeBuffer = Buffer.from(trimHexPrefix(hathorNode.chainCode), 'hex')
  const node: BIP32Interface = bip32.fromPrivateKey(privateKeyBuffer, chainCodeBuffer, hathorNetwork)

  const address = bitcoin.payments.p2pkh({
    pubkey: node.publicKey,
    network: hathorNetwork,
  }).address;

  return address;
};

export const HATHOR_BIP44_CODE = '280';
