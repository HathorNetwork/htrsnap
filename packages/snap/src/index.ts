import { Snap, MetamaskHTRRpcRequest } from './interface';
import {
  getHathorXPubKey,
  getHathorAuthXPubKey,
  getHathorWalletId,
  signHathorMessage,
  getHathorAddresses,
} from './rpc';
import { SnapError, RequestErrors } from './errors';

declare let snap: Snap;

export type RpcRequest = {
  origin: string;
  request: MetamaskHTRRpcRequest;
};

export const onRpcRequest = async ({origin, request}: RpcRequest) => {
  switch (request.method) {
    // getXPubKey ✓
    // getAuthXPub ✓
    // getWalletId ✓
    // getAddresses ✓
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
    case 'htr_getwalletid':
      return getHathorWalletId(
        origin,
        snap,
      );
    case 'htr_getaddresses':
      return getHathorAddresses(
        origin,
        snap,
        request.params.from,
        request.params.to,
      );
    case 'htr_signmessage':
      return signHathorMessage(
        origin,
        snap,
        request.params.message,
      );
    default:
      throw SnapError.of(RequestErrors.MethodNotSupport);
  }
};
