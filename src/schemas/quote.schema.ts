import { z } from "zod";

export const QuoteSchema = z.object({
  id: z.string(),
  type: z.literal("lifi"),
  tool: z.string(),
  action: z.object({
    fromToken: z.object({
      symbol: z.string(),
      decimals: z.number(),
    }),
    toToken: z.object({
      symbol: z.string(),
      decimals: z.number(),
    }),
  }),
  estimate: z.object({
    fromAmount: z.string(),
    toAmount: z.string(),
    feeCosts: z.array(z.any()),
  }),
  transactionRequest: z.object({
    data: z.string().startsWith("0x"),
    to: z.string().startsWith("0x"),
    value: z.string(),
  }),
});
