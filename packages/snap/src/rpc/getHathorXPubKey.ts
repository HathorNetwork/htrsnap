import { panel, text, heading } from '@metamask/snaps-ui';
import { BIP44CoinTypeNode, BIP44Node, getBIP44AddressKeyDeriver } from '@metamask/key-tree';
import * as bip32 from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';
import { BIP32Interface } from 'bip32';
import { Snap } from '../interface';
import {
  xpubFromNode,
  trimHexPrefix,
  hathorNetwork,
  HATHOR_BIP44_CODE,
} from '../utils';

export const CRYPTO_CURVE = 'secp256k1';

export const getAddressAtIndex = async (hathorNode: BIP44CoinTypeNode, index: number): Promise<BIP44Node> => {
  const hathorAddressDeriver = await getBIP44AddressKeyDeriver(hathorNode);
  const derivedAddress = await hathorAddressDeriver(index);

  return derivedAddress;
};

export async function getHathorRootNode(snap: Snap): Promise<BIP44CoinTypeNode> {
  const hathorNode = await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: parseInt(HATHOR_BIP44_CODE, 10),
    },
  }) as BIP44CoinTypeNode;

  return hathorNode;
}

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

  const hathorNode = await getHathorRootNode(snap);

  const privateKeyBuffer = Buffer.from(trimHexPrefix(hathorNode.privateKey), 'hex')
  const chainCodeBuffer = Buffer.from(trimHexPrefix(hathorNode.chainCode), 'hex')
  const node: BIP32Interface = bip32.fromPrivateKey(privateKeyBuffer, chainCodeBuffer, hathorNetwork)
  const xpub = xpubFromNode(node);

  return { xpub };
}
