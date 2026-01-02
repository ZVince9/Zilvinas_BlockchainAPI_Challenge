export const CHAINS = { ETH: 1, GNOSIS: 100, POLYGON: 137, SOLANA: 115111108 };
export const TOKENS = {
  ETH_NATIVE: "0x0000000000000000000000000000000000000000",
  POLYGON_USDC: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
  SOL_USDC: "EPjFW3F2KV9qfWpx68695vCK9Ro6tuSNEfL89bdL87ad",
};

export const VALIDATION_AMOUNTS = ["0", "-1000"];

export const PAYLOADS = [
  {
    label: "Polygon to Base (USDC)",
    fC: 137,
    tC: 8453,
    fT: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359", // USDC (Polygon)
    tT: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC (Base)
    amount: "30000000", // 30 USDC
  },
  {
    label: "Polygon to Arbitrum (USDC)",
    fC: 137,
    tC: 42161,
    fT: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359", // USDC (Polygon)
    tT: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // USDC (Arb)
    amount: "50000000", // 50 USDC
  },
  {
    label: "Arbitrum to Base (USDC)",
    fC: 42161,
    tC: 8453,
    fT: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    tT: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC (Base)
    amount: "50000000", // 50 USDC
  },
  {
    label: "Base to Polygon (USDC)",
    fC: 8453,
    tC: 137,
    fT: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    tT: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359", // USDC (Base)
    amount: "5000000", // 5 USDC
  },
  {
    label: "Ethereum to Arbitrum (ETH)", // The gold standard of bridging
    fC: 1,
    tC: 42161,
    fT: "0x0000000000000000000000000000000000000000",
    tT: "0x0000000000000000000000000000000000000000",
    amount: "20000000000000000", // 0.02 ETH
  },
  {
    label: "Ethereum to Polygon (ETH to POL)",
    fC: 1,
    tC: 42161,
    fT: "0x0000000000000000000000000000000000000000",
    tT: "0xEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
    amount: "2000000000000000000", // 0.02 ETH
  },
];
