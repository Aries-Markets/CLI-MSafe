/* eslint-disable @typescript-eslint/no-explicit-any */
import { BCS, HexString, TxnBuilderTypes } from "aptos";
import {
  printMsafeDetails,
  printMyMessage,
  printSeparator,
  printTxDetails,
} from "../../src/cmd/common";
import * as Aptos from "../../src/web3/global";
import { MomentumSafe } from "../../src/momentum-safe/momentum-safe";
import {
  compileAndMakeModulePublishTx,
  makeEntryFunctionTx,
} from "../../src/momentum-safe/msafe-txn";
import { splitModuleComponents } from "../../src/utils/parse";
import { IncludedArtifacts } from "../../src/momentum-safe/move-publisher";

export async function makeEntryTxByCli(c: {
  address: HexString;
  module: string;
  func: string;
  args: any[];
  typeArgs: string[];
  gas?: number;
}) {
  console.clear();
  await printMyMessage();

  const addr = c.address;
  const msafe = await MomentumSafe.fromMomentumSafe(addr);

  const info = await msafe.getMomentumSafeInfo();
  printMsafeDetails(info);

  const sn = await msafe.getNextSN();
  const tx = await (async () => {
    const [contractAddr, moduleName] = splitModuleComponents(c.module);

    console.log();
    console.log("Pulling ABI from chain...");

    printSeparator();

    const moduleData = await Aptos.getAccountModule(contractAddr, moduleName);
    if (!moduleData.abi) {
      throw new Error(`${c.module} has no ABI exposed`);
    }
    if (!moduleData.abi.exposed_functions) {
      throw new Error(`${c.module} has no exposed function`);
    }

    printSeparator();
    const selectedFn = moduleData.abi.exposed_functions
      .filter((fn) => fn.is_entry && fn.visibility === "public")
      .find((f) => f.name === c.func);

    if (!selectedFn) {
      throw new Error("Function doesnt exist");
    }

    const args: Uint8Array[] = [];

    for (let i = 0; i != selectedFn.params.length; i += 1) {
      const param = selectedFn.params[i];

      const binary = (() => {
        const val = c.args[i];
        switch (param) {
          case "&signer":
          case "signer": {
            return undefined;
          }
          case "u128": {
            return BCS.bcsSerializeU128(val);
          }
          case "u64": {
            return BCS.bcsSerializeUint64(val);
          }
          case "u32": {
            return BCS.bcsSerializeU32(val);
          }
          case "u16": {
            return BCS.bcsSerializeU16(val);
          }
          case "u8": {
            return BCS.bcsSerializeU8(val);
          }
          case "bool": {
            return BCS.bcsSerializeBool(val);
          }
          case "address": {
            return BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(val));
          }
          case "vector<u8>": {
            return BCS.bcsSerializeBytes(HexString.ensure(val).toUint8Array());
          }
          case "0x1::string::String": {
            return BCS.bcsSerializeStr(val);
          }
          default: {
            throw new Error(`Unsupported type: ` + param);
          }
        }
      })();

      if (binary) {
        args.push(binary);
      }
    }

    const ciArgs = {
      fnName: `${contractAddr}::${moduleName}::${c.func}`,
      typeArgs: c.typeArgs,
      args: args,
    };

    return await makeEntryFunctionTx(msafe, ciArgs, { sequenceNumber: sn });
  })();

  printSeparator();

  await printTxDetails(tx.getTxnInfo());
  printSeparator();

  const { pendingTx: res } = await msafe.initTransaction(Aptos.MY_ACCOUNT, tx, {
    maxGas: 100000n,
  });
  const myHash = (res as any).hash;

  console.log();
  console.log(`\tTransaction ${myHash} submitted to blockchain`);
  await Aptos.waitForTransaction(myHash);
  console.log(`\tTransaction confirmed on chain.`);
}

export async function makeTxByCli(c: {
  address: HexString;
  moveDir: string;
  deployerAddressName: string;
  gas?: number;
}) {
  console.clear();
  await printMyMessage();

  const addr = c.address;
  const msafe = await MomentumSafe.fromMomentumSafe(addr);

  const info = await msafe.getMomentumSafeInfo();
  printMsafeDetails(info);

  const sn = await msafe.getNextSN();

  const tx = await compileAndMakeModulePublishTx(
    msafe,
    {
      moveDir: c.moveDir,
      artifacts: IncludedArtifacts.None,
      deployerAddressName: c.deployerAddressName,
    },
    { sequenceNumber: sn, maxGas: c.gas ? BigInt(c.gas) : BigInt(5000) }
  );

  printSeparator();

  await printTxDetails(tx.getTxnInfo());
  printSeparator();

  // Submit transaction
  const { pendingTx: res } = await msafe.initTransaction(Aptos.MY_ACCOUNT, tx, {
    maxGas: 100000n,
  });
  const myHash = (res as any).hash;
  console.log();
  console.log(`\tTransaction ${myHash} submitted to blockchain`);
  // await Aptos.waitForTransaction(myHash);
  console.log(`\tTransaction confirmed on chain.`);
}
