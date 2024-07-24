import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import { AccountAddress } from "@aptos-labs/ts-sdk";

/* eslint-disable no-console */
/* eslint-disable max-len */


const decimalHexMap: Record<number, string> = {
  0 : 'A',
  1 : 'B',
  2 : 'C',
  3 : 'D',
  4 : 'E',
  5 : 'F'
}
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
  const coinNameHex = makeHex(coinName + 'Coin')
  const coinTickerHex = makeHex(coinTicker)
  const underScoreCoinHex = makeHex(underScoreCoin + '_coin')
  const nameWithSpaceHex = makeHex(coinName + ' Coin')
  //maps to MoonCoin with length 
  const moonCoinHex = '084d6f6f6e436f696e'
  //maps to moon_coin with length 
  const moon_coinHex = '096d6f6f6e5f636f696e'
  //maps to Moon Coin with length
  const MoonCoinHex = '094d6f6f6e20436f696e'
  //maps to MOON with length
  const moonCapsHex = '044d4f4f4e'
  let metadataBytes = jsonData.args[0].value;
//   console.log(metadataBytes)
  metadataBytes = metadataBytes.replace(new RegExp(moonCoinHex, 'g'), coinNameHex)
  metadataBytes = metadataBytes.replace(new RegExp(moon_coinHex, 'g'), underScoreCoinHex)
//   console.log('part2', metadataBytes)
  let byteString = jsonData.args[1].value[0];
  console.log(byteString)
  byteString = byteString.replace(new RegExp(moon_coinHex, 'g'), underScoreCoinHex)
  byteString = byteString.replace(new RegExp(moonCoinHex, 'g'), coinNameHex)
  byteString = byteString.replace(new RegExp(moonCapsHex,'g'), coinTickerHex)
  byteString = byteString.replace(new RegExp(MoonCoinHex, 'g'), nameWithSpaceHex)
  jsonData.args[1].value[0] =  byteString
  const byteCode = jsonData.args[1].value;
  return { metadataBytes, byteCode };
}
function makeHex(str: string) {
    console.log(str)
    let lengthHex
    let stringLength = str.length;
    let hexString = Buffer.from(str, 'utf8').toString('hex');
    if (stringLength < 10) {
        lengthHex = '0' + stringLength.toString();
    } else {
        let remainder = stringLength % 10;
        lengthHex = '0' + decimalHexMap[remainder]
    }
    console.log(lengthHex + hexString)
    return lengthHex + hexString;
}

