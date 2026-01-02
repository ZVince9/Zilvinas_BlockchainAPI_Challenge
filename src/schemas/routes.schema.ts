import { z } from "zod";

// Step within a route
const StepSchema = z.object({
  id: z.string(),
  type: z.enum(["swap", "cross", "lifi"]),
  tool: z.string(),
  action: z.object({
    fromChainId: z.number(),
    toChainId: z.number(),
    fromToken: z.object({ address: z.string(), symbol: z.string() }),
    toToken: z.object({ address: z.string(), symbol: z.string() }),
  }),
  estimate: z.object({
    fromAmount: z.string(),
    toAmount: z.string(),
    toAmountMin: z.string(),
    feeCosts: z.array(z.any()).optional(),
  }),
});

// The main Route object
export const RouteSchema = z.object({
  id: z.string(),
  fromChainId: z.number(),
  toChainId: z.number(),
  fromAmount: z.string(),
  toAmount: z.string(),
  steps: z.array(StepSchema).min(1),
});

// The full API response
export const RouteResponseSchema = z.object({
  routes: z.array(RouteSchema),
});
