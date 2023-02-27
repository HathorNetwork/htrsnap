import { panel, text, heading } from '@metamask/snaps-ui';
import * as bip32 from 'bip32';
import { BIP32Interface } from 'bip32';
import { SLIP10Node, Snap } from '../interface';
import { trimHexPrefix } from '../utils';
import { encode, decode } from 'bs58check';

export const CRYPTO_CURVE = 'secp256k1';

const hathorNetwork = {
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

  const path = [ 'm', '44\'', '280', '0\'' ];

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

  let data = decode(node.neutered().toBase58());
  data = data.slice(4);
  data = Buffer.concat([Buffer.from('0488b21e', 'hex'), data]);
  const xpub = encode(data);

  return { xpub };
}
