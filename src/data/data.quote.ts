export type NegativeParams = Record<string, string | number | undefined>;

export interface NegativeScenario {
  label: string;
  params: NegativeParams;
  expectedStatus: number;
  messagePart: string;
}

export const VALID_QUOTE_SCENARIOS = [
  {
    label: "EVMSwap", // Same chain swap
    params: {
      fromChain: "ETH",
      toChain: "ETH",
      fromToken: "ETH",
      toToken: "USDC",
      fromAmount: "1000000000000000000", // 0.0001 ETH
      fromAddress: "0x6DC1355e30A0A1114069002D6015a5D0d5992330",
    },
  },
  {
    label: "1_CrossChainBridge", // Chain A to Chain B
    params: {
      fromChain: "ETH",
      toChain: "POL",
      fromToken: "ETH",
      toToken: "USDC",
      fromAmount: "200000000000000000", // 0.002 ETH
      fromAddress: "0x6DC1355e30A0A1114069002D6015a5D0d5992330",
    },
  },
  {
    label: "2_CrossChainBridge", // Chain A to Chain B
    params: {
      fromChain: "ETH",
      toChain: "POL",
      fromToken: "ETH",
      toToken: "USDC",
      fromAmount: "2000000000000000", // 0.2 ETH
      fromAddress: "0x6DC1355e30A0A1114069002D6015a5D0d5992330",
    },
  },
];

export const NEGATIVE_QUOTE_SCENARIOS: NegativeScenario[] = [
  {
    label: "Missing Required Field (fromChain)",
    params: {
      toChain: 137,
      fromToken: "ETH",
      toToken: "USDC",
      fromAmount: "1000000000000000000",
      fromAddress: "0x6DC1355e30A0A1114069002D6015a5D0d5992330",
    },
    expectedStatus: 400,
    messagePart: "must have required property 'fromChain'",
  },
  {
    label: "Zero Amount",
    params: {
      fromChain: 1,
      toChain: 137,
      fromToken: "ETH",
      toToken: "USDC",
      fromAmount: "0",
      fromAddress: "0x6DC1355e30A0A1114069002D6015a5D0d5992330",
    },
    expectedStatus: 400,
    messagePart: '/fromamount must pass "isbignumberish" keyword validation', // Adjust based on actual API response
  },
  {
    label: "Invalid Token Symbol",
    params: {
      fromChain: 1,
      toChain: 137,
      fromToken: "FAKE_TOKEN_123",
      toToken: "USDC",
      fromAmount: "1000000000000000000",
      fromAddress: "0x6DC1355e30A0A1114069002D6015a5D0d5992330",
    },
    expectedStatus: 400, // Or 404
    messagePart:
      "/fromtoken invalid address, /fromtoken unknown token symbol, /fromtoken must match exactly one schema in oneof",
  },
  {
    label: "Negative Token amount",
    params: {
      fromChain: "ETH",
      toChain: "ETH",
      fromToken: "ETH",
      toToken: "USDC",
      fromAmount: "-0.01",
      fromAddress: "0x6DC1355e30A0A1114069002D6015a5D0d5992330",
    },
    expectedStatus: 400, // Or 404
    messagePart: '/fromamount must pass "isbignumberish" keyword validation',
  },
];

// you can add more TC in case its needed
