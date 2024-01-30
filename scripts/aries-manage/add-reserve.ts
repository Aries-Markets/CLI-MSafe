import { ApiError } from "aptos";
import {
  AriesAccountAddr,
  AriesAccountAddrHex,
  SignerProfileInfo,
} from "./aries-account";
import { Command } from "commander";
import { CoinTypeFull, coins } from "./coin-list";
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
    /// add reserve
    await makeEntryTxByCli({
      address: AriesAccountAddrHex,
      module: `${AriesAccountAddr}::controller`,
      func: "add_reserve",
      args: [AriesAccountAddr],
      typeArgs: [Coin.address],
    });
  }

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

  {
    /// update interest rate conf
    await makeEntryTxByCli({
      func: "update_interest_rate_config",
      module: `${AriesAccountAddr}::controller`,
      address: AriesAccountAddrHex,
      typeArgs: [Coin.address],
      args: [
        AriesAccountAddr, // admin
        ...Coin.interestRate,
      ],
    });
  }

  if (Coin.sb) {
    /// set switchboard oracle
    await makeEntryTxByCli({
      address: AriesAccountAddrHex,
      module: `${AriesAccountAddr}::oracle`,
      func: "set_switchboard_oracle",
      args: [
        AriesAccountAddr, // admin
        ...Coin.sb,
      ],
      typeArgs: [Coin.address],
    });
  }

  if (Coin.pyth) {
    // set pyth oracle
    await makeEntryTxByCli({
      address: AriesAccountAddrHex,
      module: `${AriesAccountAddr}::oracle`,
      func: "set_pyth_oracle",
      args: [AriesAccountAddr, ...Coin.pyth],
      typeArgs: [Coin.address],
    });
  }
}

main();
