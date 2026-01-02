import { test, expect } from "@playwright/test";
import {
  TOKENS,
  CHAINS,
  PAYLOADS,
  VALIDATION_AMOUNTS,
} from "../../data/data.routes";
import { getCachedData } from "../../../utils/cache";

test.describe("POST /v1/advanced/routes", () => {
  for (const p of PAYLOADS) {
    const cacheKey = `routes-${p.label},${p.fC}-${p.tC}-${p.fT}-${p.tT}`;

    test(`should return valid cross-chain routes for ${p.label} ${p.fC} to ${p.tC}`, async ({
      request,
    }) => {
      const body = await getCachedData(cacheKey, async () => {
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

        if (!response.ok()) {
          throw new Error(
            `Failed to fetch routes: ${response.status()} - ${await response.text()}`
          );
        }
        return await response.json();
      });

      expect(body.routes.length).toBeGreaterThan(0);
      expect(body.routes[0]).toHaveProperty("id");
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
});
