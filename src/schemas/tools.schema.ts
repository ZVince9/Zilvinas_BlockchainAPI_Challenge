import { z } from "zod";

// Schema for the individual chain pairs inside a Bridge
const SupportedChainSchema = z.object({
  fromChainId: z.union([z.string(), z.number()]),
  toChainId: z.union([z.string(), z.number()]),
});

// Schema for a Bridge tool
const BridgeSchema = z.object({
  key: z.string(),
  name: z.string(),
  logoURI: z.string().url(),
  supportedChains: z.array(SupportedChainSchema),
});

// Schema for an Exchange tool
const ExchangeSchema = z.object({
  key: z.string(),
  name: z.string(),
  logoURI: z.string().url(),
  supportedChains: z.array(z.union([z.string(), z.number()])),
});

// The full response schema
export const ToolsResponseSchema = z.object({
  bridges: z.array(BridgeSchema),
  exchanges: z.array(ExchangeSchema),
});
