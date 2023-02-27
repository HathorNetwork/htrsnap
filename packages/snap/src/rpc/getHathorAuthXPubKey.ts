import { panel, text, heading } from '@metamask/snaps-ui';
import * as bip32 from 'bip32';
import { BIP32Interface } from 'bip32';
import { SLIP10Node, Snap } from '../interface';
import { xpubFromNode, trimHexPrefix, hathorNetwork, HATHOR_BIP44_CODE } from '../utils';

export const CRYPTO_CURVE = 'secp256k1';
export const WALLET_SERVICE_AUTH_DERIVATION_PATH = `m/${HATHOR_BIP44_CODE}'/${HATHOR_BIP44_CODE}'`;

export async function getHathorAuthXPubKey(origin: string, snap: Snap): Promise<{ xpub: string }> {
  await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'Confirmation',
      content: panel([
        heading('Access your auth xpubkey'),
        text(`${origin} is trying to access your Hathor auth xpubkey.`),
      ]),
    },
  });

  const path = WALLET_SERVICE_AUTH_DERIVATION_PATH.split('\/');

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
