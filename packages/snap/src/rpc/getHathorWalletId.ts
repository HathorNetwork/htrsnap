import { Snap } from '../interface';
import { getHathorXPubKey } from './getHathorXPubKey';
import { sha256d } from '../utils';

export async function getHathorWalletId(origin: string, snap: Snap): Promise<{ walletId: string }> {
  const { xpub } = await getHathorXPubKey(origin, snap);
  const walletId = sha256d(xpub, 'hex');

  return { walletId };
}
