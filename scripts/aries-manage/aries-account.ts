import { HexString } from "aptos";
import { homedir } from "os";
import path from "path";
import {
  DEFAULT_ENDPOINT,
  DEFAULT_FAUCET,
  DEFAULT_MSAFE,
} from "../../src/utils/load";

export const SignerProfileInfo = {
  configFilePath: `${path.join(homedir(), ".aptos/config.yaml")}`,
  profile: "aries-multisig",
  network: "mainnet",
  endpoint: DEFAULT_ENDPOINT,
  faucet: DEFAULT_FAUCET,
  msafeDeployer: DEFAULT_MSAFE,
};

export const AriesAccountAddr =
  "0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3";
export const AriesAccountAddrHex = new HexString(AriesAccountAddr);

export const AriesPkgBaseDir =
  "/Users/aliver/workspace/repo/aries/aries-markets/packages";

export const DepositFarmingType = `${AriesAccountAddr}::reserve_config::DepositFarming`;
export const BorrowFarmingType = `${AriesAccountAddr}::reserve_config::BorrowFarming`;

export const FarmingType = {
  deposit: DepositFarmingType,
  borrow: BorrowFarmingType,
};

export function pkgDirOf(pkg: string) {
  return path.join(AriesPkgBaseDir, pkg);
}

export const AriesPkgList = {
  util_types: {
    dir: pkgDirOf("util-types"),
    named: ["util_types"],
  },
  decimal: {
    dir: pkgDirOf("decimal"),
    named: ["decimal"],
  },
  oracle: {
    dir: pkgDirOf("oracle"),
    named: ["oracle", "decimal", "util_types"],
  },
  aries_config: {
    dir: pkgDirOf("aries-config"),
    named: ["aries_config", "oracle", "decimal", "util_types"],
  },
  aries: {
    dir: pkgDirOf("aries"),
    named: ["aries", "aries_config", "oracle", "decimal", "util_types"],
  },
  aries_wrapper: {
    dir: pkgDirOf("aries-wrapper"),
    named: [
      "aries_wrapper",
      "aries",
      "util_types",
      "aries_config",
      "decimal",
      "oracle",
    ],
  },
};
