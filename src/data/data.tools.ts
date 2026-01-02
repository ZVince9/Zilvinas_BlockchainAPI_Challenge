export interface Eco {
  name: string;
  id: string;
}

export const NON_EVM_CHAINS = {
  SOLANA: "1151111081099710",
  BITCOIN: "20000000000001",
  SUI: "9270000000000000",
};

export const ECOSYSTEMS_TO_TEST: Eco[] = [
  { name: "Solana", id: NON_EVM_CHAINS.SOLANA },
  { name: "Bitcoin", id: NON_EVM_CHAINS.BITCOIN },
  { name: "SUI", id: NON_EVM_CHAINS.SUI },
];
