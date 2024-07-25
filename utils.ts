import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import { AccountAddress } from "@aptos-labs/ts-sdk";

/* eslint-disable no-console */
/* eslint-disable max-len */


const decimalHexMap: Record<number, string> = {
  0 : 'a',
  1 : 'b',
  2 : 'c',
  3 : 'd',
  4 : 'e',
  5 : 'f'
}

const lengthMap: any = {
    3 : {
      coinName: 'Mon',
      coinTicker: 'MON',
      underScoreCoin: 'mon'
    },
    4 : {
      coinName: 'Moon',
      coinTicker: 'MOON',
      underScoreCoin: 'moon'
    },
    5 : {
      coinName: 'Mooon',
      coinTicker: 'MOOON',
      underScoreCoin: 'mooon'
    }
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
  const coinNamePart = lengthMap[coinName.length]['coinName'];
  const coinTickerPart = lengthMap[coinName.length]['coinTicker'];
  const lowercaseCoinPart = lengthMap[coinName.length]['underScoreCoin']
  // current working directory - the root folder of this repo
  const cwd = process.cwd();
  // target directory - current working directory + filePath (filePath json file is generated with the prevoius, compilePackage, cli command)
  const modulePath = path.join(cwd, filePath);
  let jsonData = JSON.parse(fs.readFileSync(modulePath, "utf8"));
  const jsonString = JSON.stringify(jsonData);

  const coinNameHex = makeHex(coinName + 'Coin')
  const coinTickerHex = makeHex(coinTicker)
  const underScoreCoinHex = makeHex(underScoreCoin + '_coin')
  const nameWithSpaceHex = makeHex(coinName + ' Coin')

  
  //maps to MoonCoin with length 
  const moonCoinHex = makeHex(coinNamePart+'Coin')
  //maps to moon_coin with length 
  const moon_coinHex = makeHex(lowercaseCoinPart+'_coin')
  //maps to Moon Coin with length
  const MoonCoinHex = makeHex(coinNamePart+' Coin')
  //maps to MOON with length
  const moonCapsHex = makeHex(coinTickerPart)
//   jsonString.replace(new RegExp(moonCoinHex, 'g'), coinNameHex)
//   jsonString.replace(new RegExp(moon_coinHex, 'g'), underScoreCoinHex)
//   jsonString.replace(new RegExp(moonCapsHex,'g'), coinTickerHex)
//   jsonString.replace(new RegExp(moonCapsHex,'g'), coinTickerHex)
//   jsonData =  JSON.parse(jsonString)
  let metadataBytes = jsonData.args[0].value;
//   metadataBytes = metadataBytes.replace(new RegExp(moonCoinHex, 'g'), coinNameHex)
//   metadataBytes = metadataBytes.replace(new RegExp(moon_coinHex, 'g'), underScoreCoinHex)
//   console.log('part2', metadataBytes)
  let byteString = jsonData.args[1].value[0];
//   console.log(metadataBytes)
//   byteString = byteString.replace(new RegExp(moon_coinHex, 'g'), underScoreCoinHex)
//   byteString = byteString.replace(new RegExp(moonCoinHex, 'g'), coinNameHex)
//   byteString = byteString.replace(new RegExp(moonCapsHex,'g'), coinTickerHex)
//   byteString = byteString.replace(new RegExp(MoonCoinHex, 'g'), nameWithSpaceHex)
//   console.log(metadataBytes)

  jsonData.args[1].value[0] =  byteString
  const byteCode = jsonData.args[1].value;
  return { metadataBytes, byteCode };
}
function makeHex(str: string) {
    // let lengthHex
    // let stringLength = str.length;
    let hexString = Buffer.from(str, 'utf8').toString('hex');
    // if (stringLength < 10) {
    //     lengthHex = '0' + stringLength.toString();
    // } else {
    //     let remainder = stringLength % 10;
    //     lengthHex = '0' + decimalHexMap[remainder]
    // }
    return  hexString;
}

