import { text, heading, panel } from '@metamask/snaps-ui';
import { HATHOR_BIP44_CODE, trimHexPrefix } from '../utils';
import { SLIP10Node, Snap } from '../interface';

export const CRYPTO_CURVE = 'secp256k1';

export async function signHathorMessage(origin: string, snap: Snap, message: string): Promise<{ signedMessage: string }> {
  await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'Confirmation',
      content: panel([
        heading('Sign message'),
        text(`${origin} is trying to sign the following message: ${message}.`),
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
  }) as SLIP10Node;

  // const privateKeyBuffer = Buffer.from(trimHexPrefix(slip10Node.privateKey), 'hex')
  // const keyPair = ECPair.fromPrivateKey(privateKeyBuffer);

  // const signature = bitcoinMessage.sign(message, keyPair.privateKey, keyPair.compressed)

  return {
    signedMessage: '--', // signature.toString('base64'),
  };
}
