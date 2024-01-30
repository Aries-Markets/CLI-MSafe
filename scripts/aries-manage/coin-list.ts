export type OracleConfigType = [
  string, // pythId or switchboard address
  string, // max deviation bips
  string, // max age
  string // weight
];

export type ReserveConfigType = [
  number, // loan_to_value
  number, // liquidation_threshold
  string, // liquidation_bonus_bips
  string, // liquidation_fee_hundredth_bips
  number, // borrow_factor
  number, // reserve_ratio
  string, // borrow_fee_hundredth_bips
  string, // withdraw_fee_hundredth_bips
  string, // deposit_limit
  string, // borrow_limit
  boolean, // allow_collateral
  boolean, // allow_redeem
  string // flash_loan_fee_hundredth_bips
];

export type InterestRateType = [
  string, // min_borrow_rate
  string, // optimal_borrow_rate
  string, // max_borrow_rate
  string // optimal_utilization
];

export type CoinType = {
  address: string;
  sb?: OracleConfigType;
  pyth?: OracleConfigType;
  decimals?: number;
  reserveConfig?: ReserveConfigType;
  interestRate?: InterestRateType;
};

export type CoinTypeFull = Required<CoinType>;

export const coins: { [key in string]: CoinType } = {
  // APT
  apt: {
    address: "0x1::aptos_coin::AptosCoin",
    decimals: 8,
    reserveConfig: [
      70, // loan_to_value
      75, // liquidation_threshold
      "600", // liquidation_bonus_bips
      "20000", // liquidation_fee_hundredth_bips
      100, // borrow_factor
      20, // reserve_ratio
      "3000", // borrow_fee_hundredth_bips
      "0", // withdraw_fee_hundredth_bips
      2_300_000_00000000n.toString(), // deposit_limit
      500_000_00000000n.toString(), // borrow_limit
      true, // allow_collateral
      true, // allow_redeem
      "3000", // flash_loan_fee_hundredth_bips
    ],
  },
  // SOL
  sol: {
    address:
      "0xdd89c0e695df0692205912fb69fc290418bed0dbe6e4573d744a6d5e6bab6c13::coin::T",
  },
  // USDC (wormhole)
  wusdc: {
    address:
      "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T",
    reserveConfig: [
      80, // loan_to_value
      85, // liquidation_threshold
      "100", // liquidation_bonus_bips
      "20000", // liquidation_fee_hundredth_bips
      100, // borrow_factor
      20, // reserve_ratio
      "1000", // borrow_fee_hundredth_bips
      "0", // withdraw_fee_hundredth_bips
      10_000_000_000000n.toString(), // deposit_limit
      8_000_000_000000n.toString(), // borrow_limit
      true, // allow_collateral
      true, // allow_redeem
      "3000", // flash_loan_fee_hundredth_bips
    ],
  },
  // zUSDC
  zusdc: {
    address:
      "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
    reserveConfig: [
      80, // loan_to_value
      85, // liquidation_threshold
      "100", // liquidation_bonus_bips
      "20000", // liquidation_fee_hundredth_bips
      100, // borrow_factor
      20, // reserve_ratio
      "1000", // borrow_fee_hundredth_bips
      "0", // withdraw_fee_hundredth_bips
      12_000_000_000000n.toString(), // deposit_limit
      9_600_000_000000n.toString(), // borrow_limit
      true, // allow_collateral
      true, // allow_redeem
      "3000", // flash_loan_fee_hundredth_bips
    ],
  },
  // wormhole ETH
  weth: {
    address:
      "0xcc8a89c8dce9693d354449f1f73e60e14e347417854f029db5bc8e7454008abb::coin::T",
    decimals: 8,
  },
  // tAPT
  tapt: {
    address:
      "0x84d7aeef42d38a5ffc3ccef853e1b82e4958659d16a7de736a29c55fbbeb0114::staked_aptos_coin::StakedAptosCoin",
  },
  // layer zero WETH
  zweth: {
    address:
      "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH",
    decimals: 6,
    reserveConfig: [
      70, // loan_to_value
      75, // liquidation_threshold
      "500", // liquidation_bonus_bips
      "0", // liquidation_fee_hundredth_bips
      85, // borrow_factor
      10, // reserve_ratio
      "500", // borrow_fee_hundredth_bips
      "0", // withdraw_fee_hundredth_bips
      800_000000n.toString(), // deposit_limit
      200_000000n.toString(), // borrow_limit
      true, // allow_collateral
      true, // allow_redeem
      "1500", // flash_loan_fee_hundredth_bips
    ],
  },
  // amnis StakedAPT
  stapt: {
    address:
      "0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a::stapt_token::StakedApt",
    decimals: 8,
    reserveConfig: [
      60, // loan_to_value
      65, // liquidation_threshold
      "700", // liquidation_bonus_bips
      "0", // liquidation_fee_hundredth_bips
      80, // borrow_factor
      10, // reserve_ratio
      "10000", // borrow_fee_hundredth_bips
      "0", // withdraw_fee_hundredth_bips
      800_000_00000000n.toString(), // deposit_limit
      50_000_00000000n.toString(), // borrow_limit
      true, // allow_collateral
      true, // allow_redeem
      "10000", // flash_loan_fee_hundredth_bips
    ],
  },
  // cake
  cake: {
    address:
      "0x159df6b7689437016108a019fd5bef736bac692b6d4a1f10c941f6fbb9a74ca6::oft::CakeOFT",
    decimals: 8,
    reserveConfig: [
      50, // loan_to_value
      55, // liquidation_threshold
      "800", // liquidation_bonus_bips
      "20000", // liquidation_fee_hundredth_bips
      80, // borrow_factor
      20, // reserve_ratio
      "5000", // borrow_fee_hundredth_bips
      "0", // withdraw_fee_hundredth_bips
      1_000_000_00000000n.toString(), // deposit_limit
      30_000_00000000n.toString(), // borrow_limit
      true, // allow_collateral
      true, // allow_redeem
      "3000", // flash_loan_fee_hundredth_bips
    ],
  },
  zusdt: {
    address:
      "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT",
    pyth: [
      "0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b",
      "200",
      "3600",
      "1",
    ],
    decimals: 6,
    reserveConfig: [
      80, // loan_to_value
      85, // liquidation_threshold
      "100", // liquidation_bonus_bips
      "20000", // liquidation_fee_hundredth_bips
      100, // borrow_factor
      20, // reserve_ratio
      "1000", // borrow_fee_hundredth_bips
      "0", // withdraw_fee_hundredth_bips
      10_000_000_000000n.toString(), // deposit_limit
      8_000_000_000000n.toString(), // borrow_limit
      true, // allow_collateral
      true, // allow_redeem
      "3000", // flash_loan_fee_hundredth_bips
    ],
    interestRate: [
      "0", // min_borrow_rate
      "9", // optimal_borrow_rate
      "200", // max_borrow_rate
      "80", // optimal_utilization
    ],
  },
  zwbtc: {
    address:
      "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WBTC",
    pyth: [
      "0xc9d8b075a5c69303365ae23633d4e085199bf5c520a3b90fed1322a0342ffc33",
      "200",
      "360",
      "1",
    ],
    decimals: 6,
    reserveConfig: [
      20, // loan_to_value
      30, // liquidation_threshold
      "800", // liquidation_bonus_bips
      "50000", // liquidation_fee_hundredth_bips
      80, // borrow_factor
      20, // reserve_ratio
      "10000", // borrow_fee_hundredth_bips
      "0", // withdraw_fee_hundredth_bips
      3_000000n.toString(), // deposit_limit
      2_000000n.toString(), // borrow_limit
      true, // allow_collateral
      true, // allow_redeem
      "10000", // flash_loan_fee_hundredth_bips
    ],
    interestRate: [
      "0", // min_borrow_rate
      "10", // optimal_borrow_rate
      "200", // max_borrow_rate
      "65", // optimal_utilization
    ],
  },
};

export const RewardCoins = {
  apt: "0x1::aptos_coin::AptosCoin",
};
