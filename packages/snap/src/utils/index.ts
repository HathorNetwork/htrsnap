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

export const HATHOR_BIP44_CODE = '280';
