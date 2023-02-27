import * as bip32 from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';
import { Snap } from '../interface';
import { hathorNetwork } from '../utils';
import { getHathorXPubKey } from './getHathorXPubKey';

export const CRYPTO_CURVE = 'secp256k1';

export const getAddressAtIndex = (xpubkey: string, addressIndex: number): string => {
  const node = bip32.fromBase58(xpubkey).derive(addressIndex);
  return bitcoin.payments.p2pkh({
    pubkey: node.publicKey,
    network: hathorNetwork,
  }).address;
};

export async function getHathorAddresses(origin: string, snap: Snap, from: number, to: number): Promise<{ addresses: string[] }> {
  const { xpub } = await getHathorXPubKey(origin, snap);

  const addresses: string[] = [];
  for (let index = from; index <= to; index++) {
    addresses.push(getAddressAtIndex(xpub, index));
  }

  return { addresses };
}
