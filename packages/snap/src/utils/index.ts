import { BinaryToTextEncoding, createHash } from 'crypto';

export * from './hexHelper';
export * from './xpubHelper';

export const hathorNetwork = {
  messagePrefix: '\x18Hathor Signed Message:\n',
  bech32: 'ht',
  bip32: {
    public: 76067358,
    private: 55720709,
  },
  pubKeyHash: 40,
  scriptHash: 100,
  wif: 128
};


/**
 * Calculate the double sha256 hash of the data.
 *
 * @remarks
 * If encoding is provided a string will be returned; otherwise a Buffer is returned.
 *
 * @param data - Data to be hashed
 * @param encoding - The encoding of the returned object
 * @returns The sha256d hash of the data
 */
export const sha256d = (data: string, encoding: BinaryToTextEncoding): string => {
  const hash1 = createHash('sha256');
  hash1.update(data);
  const hash2 = createHash('sha256');
  hash2.update(hash1.digest());
  return hash2.digest(encoding);
};

export const HATHOR_BIP44_CODE = '280';
