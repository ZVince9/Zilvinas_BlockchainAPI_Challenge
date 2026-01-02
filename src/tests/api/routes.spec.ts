import { test, expect } from "@playwright/test";
import {
  TOKENS,
  CHAINS,
  PAYLOADS,
  VALIDATION_AMOUNTS,
  UNREALISTIC_LIQ,
} from "../../data/data.routes";
import { getCachedData } from "../../../utils/cache";
import { RouteResponseSchema } from "../../schemas/routes.schema";

test.describe("POST /v1/advanced/routes - Schema & Data Integrity", () => {
  for (const p of PAYLOADS) {
    const cacheKey = `routes-${p.label},${p.fC}-${p.tC}-${p.fT}-${p.tT}`;

    test(`should verify valid schema and routes for ${p.label}`, async ({
      request,
    }) => {
      const data = await getCachedData(cacheKey, async () => {
        const response = await request.post(
          `${process.env.BASE_URL}${process.env.ROUTES_URL}`,
          {
            data: {
              fromChainId: p.fC,
              toChainId: p.tC,
              fromTokenAddress: p.fT,
              toTokenAddress: p.tT,
              fromAmount: "1000000",
              options: { integrator: "tc" },
            },
          }
        );
        expect(response.ok()).toBeTruthy();
        return await response.json();
      });

      const validation = RouteResponseSchema.safeParse(data);
      if (!validation.success) {
        console.error("Schema Validation Error:", validation.error.format());
      }
      expect(validation.success).toBe(true);

      expect(data.routes.length).toBeGreaterThan(0);
      const firstRoute = data.routes[0];

      expect(firstRoute.toChainId).toBe(p.tC);
      expect(firstRoute.steps.length).toBeGreaterThanOrEqual(1);
    });
  }
});

// add validation describe block
test.describe("POST /v1/advanced/routes - Negative Path Validation", () => {
  test("should return error for invalid token address", async ({ request }) => {
    const response = await request.post(
      `${process.env.BASE_URL}${process.env.ROUTES_URL}`,
      {
        data: {
          fromChainId: CHAINS.ETH,
          toChainId: CHAINS.POLYGON,
          fromTokenAddress: "0xINVALID_TOKEN_ADDRESS",
          toTokenAddress: TOKENS.POLYGON_USDC,
          fromAmount: "1000000",
        },
      }
    );

    expect(response.status()).toBe(400);
    const errorBody = await response.json();
    expect(errorBody.message).toContain(
      "/fromTokenAddress must match exactly one schema"
    );
  });

  for (const amount of VALIDATION_AMOUNTS) {
    test(`should reject amount: ${amount}`, async ({ request }) => {
      const response = await request.post(
        `${process.env.BASE_URL}${process.env.ROUTES_URL}`,
        {
          data: {
            fromChainId: CHAINS.ETH,
            toChainId: CHAINS.POLYGON,
            fromTokenAddress: TOKENS.ETH_NATIVE,
            toTokenAddress: TOKENS.POLYGON_USDC,
            fromAmount: amount,
          },
        }
      );
      expect(response.status()).toBe(400);
    });
  }

  test("should return error for insufficient liquidity (unrealistic amount)", async ({
    request,
  }) => {
    const response = await request.post(
      `${process.env.BASE_URL}${process.env.ROUTES_URL}`,
      {
        data: {
          fromChainId: UNREALISTIC_LIQ.fC,
          toChainId: UNREALISTIC_LIQ.tC,
          fromTokenAddress: UNREALISTIC_LIQ.fT,
          toTokenAddress: UNREALISTIC_LIQ.tT,
          fromAmount: UNREALISTIC_LIQ.amount,
        },
      }
    );

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.routes.length).toBe(0);
  });

  test("should return error for unsupported/invalid chainId", async ({
    request,
  }) => {
    const response = await request.post(
      `${process.env.BASE_URL}${process.env.ROUTES_URL}`,
      {
        data: {
          fromChainId: 999999,
          toChainId: CHAINS.POLYGON,
          fromTokenAddress: TOKENS.ETH_NATIVE,
          toTokenAddress: TOKENS.POLYGON_USDC,
          fromAmount: "1000000",
        },
      }
    );

    expect(response.status()).toBe(400);
    const errorBody = await response.json();
    expect(errorBody.message).toContain("fromChainId");
  });
});
