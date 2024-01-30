import { ApiError } from "aptos";
import { Command } from "commander";
import {
  AriesAccountAddrHex,
  AriesPkgList,
  SignerProfileInfo,
} from "./aries-account";
import { loadConfigAndApply } from "../../src/utils/load";
import { makeTxByCli } from "./common";

const program = new Command();

const cli = program
  .description("deploy aries package")
  .option("-p, --pkg <string>", "package name, eg: util_types")
  .parse(process.argv);

async function main() {
  console.clear();

  try {
    await loadConfigAndApply(SignerProfileInfo);
  } catch (e) {
    if ((e as ApiError).message.includes("Account not found by Address")) {
      console.log("Wallet must have some initial fund to interact with");
      process.exit(1);
    }
    throw e;
  }

  const pkg = AriesPkgList[
    cli.opts().pkg as keyof typeof AriesPkgList
  ] as (typeof AriesPkgList)["util_types"];

  await makeTxByCli({
    address: AriesAccountAddrHex,
    moveDir: pkg.dir,
    deployerAddressName: pkg.named[0],
    gas: 50000,
  });
}

main();
