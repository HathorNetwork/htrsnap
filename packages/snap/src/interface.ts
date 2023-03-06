export interface GetHathorXPubKey {
  method: 'htr_getxpubkey';
}

export interface GetHathorAuthXPubKey {
  method: 'htr_getauthxpubkey';
}

export interface GetHathorWalletId {
  method: 'htr_getwalletid';
}

export interface SignHathorMessage {
  method: 'htr_signmessage';
  params: {
    message: string;
    addressIndex: number;
  };
}

export interface SignHathorTransaction {
  method: 'htr_signtransaction';
  params: {
    message: string;
  };
}

export interface GetHathorAddresses {
  method: 'htr_getaddresses';
  params: {
    from: number;
    to: number;
  }
}

export type MetamaskHTRRpcRequest =
  | GetHathorXPubKey
  | GetHathorAuthXPubKey
  | GetHathorWalletId
  | GetHathorAddresses
  | SignHathorMessage
  | SignHathorTransaction

export type HTRMethodCallback = (
  originString: string,
  requestObject: MetamaskHTRRpcRequest,
) => Promise<unknown>;

export interface Snap {
  registerRpcMessageHandler: (fn: HTRMethodCallback) => unknown;
  request<T>(options: {
    method: string;
    params?: unknown[] | Record<string, any>;
  }): Promise<T>;
}

export interface SLIP10Node {
  /**
   * The 0-indexed path depth of this node.
   */
  readonly depth: number;

  /**
   * The fingerprint of the master node, i.e., the node at depth 0. May be
   * undefined if this node was created from an extended key.
   */
  readonly masterFingerprint?: number;

  /**
   * The fingerprint of the parent key, or 0 if this is a master node.
   */
  readonly parentFingerprint: number;

  /**
   * The index of the node, or 0 if this is a master node.
   */
  readonly index: number;

  /**
   * The private key of this node.
   */
  readonly privateKey: string;

  /**
   * The public key of this node.
   */
  readonly publicKey: string;

  /**
   * The chain code of this node.
   */
  readonly chainCode: string;

  /**
   * The name of the curve used by the node.
   */
  readonly curve: 'secp256k1';
}
