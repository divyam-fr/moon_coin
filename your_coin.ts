/* eslint-disable no-console */
/* eslint-disable max-len */

import { Account, AccountAddress, Aptos, AptosConfig,  Network, NetworkToNetworkName, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import { compilePackage, getPackageBytesToPublish } from "./utils.ts";
import * as template from '@mysten/move-bytecode-template'
import { bcs } from '@mysten/bcs'
// import * as  template  from './move-bytecode-template.js'

const APTOS_NETWORK: Network = NetworkToNetworkName[ Network.DEVNET];
const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

  const updateSymbol = (modifiedByteCode: Uint8Array, symbol: string) =>
    template.update_constants(
      modifiedByteCode,
      bcs.string().serialize(symbol.trim()).toBytes(),
      bcs.string().serialize("SYMBOL").toBytes(),
      "Vector(U8)",
    );


async function main(coinName: string, coinTicker: string, underScoreCoin: string) {
  const privateKey = new Ed25519PrivateKey("0x95c1daacfdb4cef3fd0fa88a858fe73d211bbc302059a078751b4998c7599f95");
  const alice = Account.fromPrivateKey({ privateKey  });
  compilePackage("move/moonCoin", "move/moonCoin/moonCoin.json", [{ name: "cc", address: alice.accountAddress }]);
  const { metadataBytes, byteCode } = getPackageBytesToPublish(`move/moonCoin/moonCoin.json`, coinName, coinTicker, underScoreCoin);
  let metadataByteCode = metadataBytes;
  const modifiedByteCode = template.update_identifiers(metadataByteCode, {
    COIN_TEMPLATE: "TEST",
    coin_template: "TEST",
  });
  console.log(modifiedByteCode)

  console.log(`\n=== Publishing MoonCoin package to ${aptos.config.network} network ===`);
  const transaction = await aptos.publishPackageTransaction({
    account: alice.accountAddress,
    metadataBytes,
    moduleBytecode: byteCode,
  });

  const pendingTransaction = await aptos.signAndSubmitTransaction({
    signer: alice,
    transaction,
  });

  console.log(`Publish package transaction hash: ${pendingTransaction.hash}`);
  await aptos.waitForTransaction({ transactionHash: pendingTransaction.hash });
}

main('Divy', 'DIVY', 'divy');