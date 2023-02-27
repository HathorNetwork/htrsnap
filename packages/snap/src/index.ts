import { Snap, MetamaskHTRRpcRequest } from './interface';
import { getHathorXPubKey, getHathorAuthXPubKey } from './rpc';
import { SnapError, RequestErrors } from './errors';

declare let snap: Snap;

export type RpcRequest = {
  origin: string;
  request: MetamaskHTRRpcRequest;
};

export const onRpcRequest = async ({origin, request}: RpcRequest) => {
  switch (request.method) {
    // getXPubKey
    // getAuthXPub
    // getWalletId
    // signMessage
    case 'htr_getxpubkey':
      return getHathorXPubKey(
        origin,
        snap,
      );
    case 'htr_getauthxpubkey':
      return getHathorAuthXPubKey(
        origin,
        snap,
      );
    default:
      throw SnapError.of(RequestErrors.MethodNotSupport);
  }
};
