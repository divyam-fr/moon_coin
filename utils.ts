import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import { AccountAddress } from "@aptos-labs/ts-sdk";

/* eslint-disable no-console */
/* eslint-disable max-len */

/**
 * A convenience function to compile a package locally with the CLI
 * @param packageDir
 * @param outputFile
 * @param namedAddresses
 */
export function compilePackage(
  packageDir: string,
  outputFile: string,
  namedAddresses: Array<{ name: string; address: AccountAddress }>,
) {
  console.log("In order to run compilation, you must have the `aptos` CLI installed.");
  try {
    execSync("aptos --version");
  } catch (e) {
    console.log("aptos is not installed. Please install it from the instructions on aptos.dev");
  }

  const addressArg = namedAddresses.map(({ name, address }) => `${name}=${address}`).join(" ");
  // Assume-yes automatically overwrites the previous compiled version, only do this if you are sure you want to overwrite the previous version.
  const compileCommand = `aptos move build-publish-payload --json-output-file ${outputFile} --package-dir ${packageDir} --named-addresses ${addressArg} --assume-yes`;
  execSync(compileCommand);
}

/**
 * A convenience function to get the compiled package metadataBytes and byteCode
 * @param packageDir
 * @param outputFile
 * @param namedAddresses
 */
export function getPackageBytesToPublish(filePath: string, coinName: string, coinTicker :string, underScoreCoin: string) {
  // current working directory - the root folder of this repo
  const cwd = process.cwd();
  // target directory - current working directory + filePath (filePath json file is generated with the prevoius, compilePackage, cli command)
  const modulePath = path.join(cwd, filePath);
  const jsonData = JSON.parse(fs.readFileSync(modulePath, "utf8"));
  const coinNameHex = makeHex(coinName)
  const coinTickerHex = makeHex(coinTicker)
  const underScoreCoinHex = makeHex(underScoreCoin)
  //maps to moon
  const moonString = '6d6f6f6e'
  //maps to Moon
  const moonCoinString = "4d6f6f6e"
  //maps to MOON
  const moonCapsString = "4d4f4f4e"
  let metadataBytes = jsonData.args[0].value;
  metadataBytes = metadataBytes.replace(moonCoinString, coinNameHex)
  metadataBytes = metadataBytes.replace(moonString, underScoreCoinHex)
  let byteString = jsonData.args[1].value[0];
  byteString = byteString.replace(moonString, underScoreCoinHex)
  byteString = byteString.replace(moonCoinString, coinNameHex)
  byteString = byteString.replace(moonCapsString, coinTickerHex)
  jsonData.args[1].value[0] =  byteString
  const byteCode = jsonData.args[1].value;
  return { metadataBytes, byteCode };
}

function makeHex(string: string): string {
    const buffer = Buffer.from(string, 'utf8')
    return buffer.toString('hex')
}