import bitcoinMessage from 'bitcoinjs-message';
import { text, heading, panel } from '@metamask/snaps-ui';
import { hathorNetwork, addressNodeToP2PKHAddress, trimHexPrefix } from '../utils';
import { Snap } from '../interface';
import { getAddressAtIndex, getHathorRootNode } from './getHathorXPubKey';
import { BIP44Node } from '@metamask/key-tree';

export const CRYPTO_CURVE = 'secp256k1';

export async function signHathorMessage(
  origin: string,
  snap: Snap,
  message: string,
  addressIndex: number,
): Promise<{ signedMessage: string }> {
  const hathorNode = await getHathorRootNode(snap);
  const addressNode: BIP44Node = await getAddressAtIndex(hathorNode, addressIndex);
  const address: string = addressNodeToP2PKHAddress(addressNode, hathorNode);

  await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'Confirmation',
      content: panel([
        heading('Sign message'),
        text(`${origin} is trying to sign the following message:`),
        text(message),
        text(`With the following address: ${address}`),
      ]),
    },
  });

  const privateKeyBuffer = Buffer.from(trimHexPrefix(addressNode.privateKey), 'hex')

  const signature = bitcoinMessage
    .sign(
      message,
      privateKeyBuffer,
      true,
      hathorNetwork.messagePrefix,
    )
    .toString('base64');

  return {
    signedMessage: signature, // signature.toString('base64'),
  };
}
