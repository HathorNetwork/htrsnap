import { addressNodeToP2PKHAddress } from '../utils';
import { Snap } from '../interface';
import { getHathorRootNode, getAddressAtIndex } from './getHathorXPubKey';

export const CRYPTO_CURVE = 'secp256k1';

export async function getHathorAddresses(_origin: string, snap: Snap, from: number, to: number): Promise<{ addresses: string[] }> {
  const hathorNode = await getHathorRootNode(snap);

  const addresses: string[] = [];
  for (let index = from; index <= to; index++) {
    const addressNode = await getAddressAtIndex(hathorNode, index)
    const address = addressNodeToP2PKHAddress(addressNode, hathorNode);

    addresses.push(address);
  }

  return { addresses };
}
