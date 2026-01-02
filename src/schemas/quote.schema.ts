import { z } from "zod";

export const QuoteSchema = z.object({
  id: z.string().min(1),
  type: z.literal("lifi"),
  tool: z.string().min(1),
  action: z.object({
    fromToken: z.object({
      symbol: z.string(),
      decimals: z.number().int().min(0).max(100),
      address: z.string(),
    }),
    toToken: z.object({
      symbol: z.string(),
      decimals: z.number().int().min(0).max(100),
      address: z.string(),
    }),
  }),
  estimate: z.object({
    fromAmount: z.string().regex(/^\d+$/, "Must be a numeric string"),
    toAmount: z.string().regex(/^\d+$/, "Must be a numeric string"),
    // Some quotes (like internal system routes) might not have feeCosts
    feeCosts: z.array(z.any()).optional(),
  }),
  transactionRequest: z
    .object({
      // RELAXATION: Only check for 0x if you are 100% sure the test is EVM-only.
      // If the test hits Solana, startsWith("0x") will fail.
      data: z.string().startsWith("0x"),
      to: z.string().startsWith("0x"),
      value: z.string(),
      gasLimit: z.string().optional(),
      gasPrice: z.string().optional(),
    })
    .nullable()
    .optional(), // Added optional() in case the field is missing entirely
});
