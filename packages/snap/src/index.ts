import { Snap, MetamaskBTCRpcRequest } from './interface';
import { getHathorXPubKey } from './rpc';
import { SnapError, RequestErrors } from './errors';

declare let snap: Snap;

export type RpcRequest = {
  origin: string;
  request: MetamaskBTCRpcRequest;
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
    default:
      throw SnapError.of(RequestErrors.MethodNotSupport);
  }
};
