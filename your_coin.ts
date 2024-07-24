/* eslint-disable no-console */
/* eslint-disable max-len */

import { Account, AccountAddress, Aptos, AptosConfig, HexInput, Network, NetworkToNetworkName, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import { compilePackage, getPackageBytesToPublish } from "./utils";


const APTOS_NETWORK: Network = NetworkToNetworkName[ Network.DEVNET];
const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

async function main(coinName: string, coinTicker: string, underScoreCoin: string) {
  const privateKey = new Ed25519PrivateKey("0x95c1daacfdb4cef3fd0fa88a858fe73d211bbc302059a078751b4998c7599f95");
  const alice = Account.fromPrivateKey({ privateKey  });

  // Please ensure you have the aptos CLI installed
  console.log("\n=== Compiling MoonCoin package locally ===");
  compilePackage("move/moonCoin", "move/moonCoin/moonCoin.json", [{ name: "MoonCoin", address: alice.accountAddress }]);

  const { metadataBytes, byteCode } = getPackageBytesToPublish("move/moonCoin/moonCoin.json", coinName, coinTicker, underScoreCoin);
  console.log(`\n=== Publishing MoonCoin package to ${aptos.config.network} network ===`);
  // Publish MoonCoin package to chain
  console.log(metadataBytes)
  console.log(byteCode)
  // const transaction = await aptos.publishPackageTransaction({
  //   account: alice.accountAddress,
  //   metadataBytes,
  //   moduleBytecode: byteCode,
  // });

  // const pendingTransaction = await aptos.signAndSubmitTransaction({
  //   signer: alice,
  //   transaction,
  // });

  // console.log(`Publish package transaction hash: ${pendingTransaction.hash}`);
  // await aptos.waitForTransaction({ transactionHash: pendingTransaction.hash });

}

main('Mooon', 'MOOON', 'mooon');