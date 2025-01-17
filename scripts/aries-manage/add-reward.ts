import { ApiError } from "aptos";
import {
  AriesAccountAddr,
  AriesAccountAddrHex,
  FarmingType,
  SignerProfileInfo,
} from "./aries-account";
import { Command } from "commander";
import { RewardCoins, coins } from "./coin-list";
import { loadConfigAndApply } from "../../src/utils/load";
import { makeEntryTxByCli } from "./common";

const program = new Command();

const cli = program
  .description("update aries reserve config")
  .option("-i, --init", "whether init reward contianer")
  .option("-c, --coin <string>", "coin name")
  .option("-f, --farm <string>", "[deposit | borrow]")
  .option("-r, --reward <string>", "reward coin name")
  .option("-a, --amount <string>", "reward coin amount (with decimal)")
  .option("-p, --per [string]", "reward coin amount per day (with decimal)")
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

  const isInit = !!(cli.opts().init as boolean);
  const Coin = coins[
    cli.opts().coin as keyof typeof coins
  ] as (typeof coins)["apt"];
  const farmingType = FarmingType[cli.opts().farm as keyof typeof FarmingType];
  const reward = RewardCoins[cli.opts().reward as keyof typeof RewardCoins];
  const rewardAmount = cli.opts().amount as string;
  const rewardPerDay = cli.opts().per as string | undefined;

  if (isInit) {
    await makeEntryTxByCli({
      address: AriesAccountAddrHex,
      module: `${AriesAccountAddr}::controller`,
      func: "init_reward_container",
      typeArgs: [reward],
      args: [AriesAccountAddr],
      gas: 50000,
    });
  }

  await makeEntryTxByCli({
    address: AriesAccountAddrHex,
    module: `${AriesAccountAddr}::controller`,
    func: "add_reward",
    typeArgs: [Coin.address, farmingType, reward],
    args: [AriesAccountAddr, rewardAmount],
    gas: 50000,
  });

  if (rewardPerDay) {
    await makeEntryTxByCli({
      address: AriesAccountAddrHex,
      module: `${AriesAccountAddr}::controller`,
      func: "update_reward_rate",
      typeArgs: [Coin.address, farmingType, reward],
      args: [AriesAccountAddr, rewardPerDay],
      gas: 50000,
    });
  }
}

main();
