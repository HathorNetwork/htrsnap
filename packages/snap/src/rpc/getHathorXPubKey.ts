import { panel, text, heading } from '@metamask/snaps-ui';
import * as bip32 from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';
import { BIP32Interface } from 'bip32';
import { SLIP10Node, Snap } from '../interface';
import {
  xpubFromNode,
  trimHexPrefix,
  hathorNetwork,
  HATHOR_BIP44_CODE,
} from '../utils';

export const CRYPTO_CURVE = 'secp256k1';

export const getAddressAtIndex = (xpubkey: string, addressIndex: number): string => {
  const node = bip32.fromBase58(xpubkey).derive(addressIndex);
  return bitcoin.payments.p2pkh({
    pubkey: node.publicKey,
    network: hathorNetwork,
  }).address;
};

export async function getHathorXPubKey(origin: string, snap: Snap): Promise<{ xpub: string }> {
  await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'Confirmation',
      content: panel([
        heading('Access your extended public key'),
        text(`${origin} is trying to access your Hathor extended public key.`),
      ]),
    },
  });

  const path = [ 'm', '44\'', HATHOR_BIP44_CODE, '0\'' ];

  const slip10Node = await snap.request({
    method: 'snap_getBip32Entropy',
    params: {
      path,
      curve: CRYPTO_CURVE
    },
  }) as SLIP10Node

  const privateKeyBuffer = Buffer.from(trimHexPrefix(slip10Node.privateKey), 'hex')
  const chainCodeBuffer = Buffer.from(trimHexPrefix(slip10Node.chainCode), 'hex')
  const node: BIP32Interface = bip32.fromPrivateKey(privateKeyBuffer, chainCodeBuffer, hathorNetwork)
  const xpub = xpubFromNode(node);

  return { xpub };
}
