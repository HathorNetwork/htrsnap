import { BIP32Interface } from 'bip32';
import { encode, decode } from 'bs58check';

export const xpubFromNode = (node: BIP32Interface): string => {
  let data = decode(node.neutered().toBase58());
  data = data.slice(4);
  data = Buffer.concat([Buffer.from('0488b21e', 'hex'), data]);
  const xpub = encode(data);

  return xpub;
}
