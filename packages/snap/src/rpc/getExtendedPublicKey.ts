import * as bip32 from 'bip32';
import { BIP32Interface } from 'bip32';
import { Network, networks } from 'bitcoinjs-lib';
import { BitcoinNetwork, ScriptType, SLIP10Node, Snap } from '../interface';
import { convertXpub } from "../bitcoin/xpubConverter";
import { getPersistedData, updatePersistedData, trimHexPrefix } from '../utils';
import { RequestErrors, SnapError } from "../errors";
import { heading, panel, text } from "@metamask/snaps-ui";

export const pathMap: Record<ScriptType, string[]> = {
    [ScriptType.P2PKH]: ['m', "44'", "0'"],
    [ScriptType.P2SH_P2WPKH]: ['m', "49'", "0'"],
    [ScriptType.P2WPKH]: ['m', "84'", "0'"]
}

export const CRYPTO_CURVE = "secp256k1";

export async function extractAccountPrivateKey(snap: Snap, network: Network, scriptType: ScriptType): Promise<{node:BIP32Interface, mfp: string}> {
    const path = [
      "m",
      "44'",
      "280",
      "0'"
    ];

    const slip10Node = await snap.request({
        method: "snap_getBip32Entropy",
        params: {
            path,
            curve: CRYPTO_CURVE
        },
    }) as SLIP10Node

    const privateKeyBuffer = Buffer.from(trimHexPrefix(slip10Node.privateKey), "hex")
    const chainCodeBuffer = Buffer.from(trimHexPrefix(slip10Node.chainCode), "hex")
    const node: BIP32Interface = bip32.fromPrivateKey(privateKeyBuffer, chainCodeBuffer, network)
    //@ts-ignore 
    // ignore checking since no function to set depth for node
    node.__DEPTH = slip10Node.depth;
    //@ts-ignore
    // ignore checking since no function to set index for node
    node.__INDEX = slip10Node.index;

    const mfp = slip10Node.masterFingerprint && slip10Node.masterFingerprint.toString(16)
    return {
        node: node.deriveHardened(0),
        mfp
    };
}


export async function getExtendedPublicKey(origin: string, snap: Snap, scriptType: ScriptType, network: Network): Promise<{xpub: string, mfp: string}> {
    const networkName = network == networks.bitcoin ? "mainnet" : "testnet";
    switch (scriptType) {
        case ScriptType.P2PKH:
        case ScriptType.P2WPKH:
        case ScriptType.P2SH_P2WPKH:
            const result = await snap.request({
                method: 'snap_dialog',
                params: {
                    type: 'Confirmation',
                    content: panel([
                        heading('Access your extended public key'),
                        text(`Do you want to allow ${origin} to access Bitcoin ${networkName} ${scriptType} extended public key?`),
                    ]),
                },
            });

            if(result) {
                const { node: accountNode, mfp } = await extractAccountPrivateKey(snap, network, scriptType)
                const accountPublicKey = accountNode.neutered();
                const xpub = convertXpub(accountPublicKey.toBase58(), scriptType, network);

                const snapNetwork = await getPersistedData(snap, "network", "");
                if(!snapNetwork) {
                    await updatePersistedData(snap, "network", network == networks.bitcoin ? BitcoinNetwork.Main : BitcoinNetwork.Test);
                }

                return { mfp, xpub };
            } else {
                throw SnapError.of(RequestErrors.RejectKey);
            }
            
        default:
            throw SnapError.of(RequestErrors.ScriptTypeNotSupport);
    }
}
