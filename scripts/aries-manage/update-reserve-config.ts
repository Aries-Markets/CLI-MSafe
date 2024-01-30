import { ApiError } from "aptos";
import {
  AriesAccountAddr,
  AriesAccountAddrHex,
  SignerProfileInfo,
} from "./aries-account";
import { CoinTypeFull, coins } from "./coin-list";
import { Command } from "commander";
import { loadConfigAndApply } from "../../src/utils/load";
import { makeEntryTxByCli } from "./common";

const program = new Command();

const cli = program
  .description("update aries reserve config")
  .option("-c, --coin <string>", "coin name")
  .parse(process.argv);

async function main() {
  try {
    await loadConfigAndApply(SignerProfileInfo);
  } catch (e) {
    if ((e as ApiError).message.includes("Account not found by Address")) {
      console.log("Wallet must have some initial fund to interact with");
      process.exit(1);
    }
    throw e;
  }

  const Coin = coins[cli.opts().coin as keyof typeof coins] as CoinTypeFull;

  {
    /// update reserve config
    await makeEntryTxByCli({
      func: "update_reserve_config",
      module: `${AriesAccountAddr}::controller`,
      address: AriesAccountAddrHex,
      typeArgs: [Coin.address],
      args: [AriesAccountAddr, ...Coin.reserveConfig],
    });
  }
}

main();
