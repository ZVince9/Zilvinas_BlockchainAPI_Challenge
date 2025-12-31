import { test, expect } from "@playwright/test";
import { QuoteSchema } from "../schemas/quote.schema";
import {
  VALID_QUOTE_SCENARIOS,
  NEGATIVE_QUOTE_SCENARIOS,
} from "../data/data.quote";

test.describe("Multi-Chain Validation", () => {
  for (const scenario of VALID_QUOTE_SCENARIOS) {
    test(`should return valid quote for ${scenario.label}: ${scenario.params.fromToken} to ${scenario.params.toToken}`, async ({
      request,
    }) => {
      const response = await request.get("/v1/quote", {
        params: scenario.params,
        // DO NOT add a headers block at all if you don't have a key
        // headers: { "x-lifi-api-key": process.env.LIFI_API_KEY || "" },
        timeout: 30000,
      });

      const responseBody = await response.json();
      expect(
        response.status(),
        `API Error: ${JSON.stringify(responseBody)}`
      ).toBe(200);

      const validation = QuoteSchema.safeParse(responseBody);
      if (!validation.success) {
        console.error(
          `Schema Error for ${scenario.label}:`,
          validation.error.message
        );
      }
      expect(validation.success).toBe(true);
      expect(responseBody.action.fromToken.symbol).toBe(
        scenario.params.fromToken
      );
      expect(responseBody.action.toToken.symbol).toBe(scenario.params.toToken);
      expect(responseBody.transactionRequest.data.length).toBeGreaterThan(100);
    });
  }
});

test.describe("Negative Path Validation", () => {
  for (const scenario of NEGATIVE_QUOTE_SCENARIOS) {
    test(`should return ${scenario.expectedStatus} for ${scenario.label}`, async ({
      request,
    }) => {
      const response = await request.get("/v1/quote", {
        params: scenario.params as any,
      });

      const responseBody = await response.json();

      expect(response.status()).toBe(scenario.expectedStatus);

      const errorMessage =
        responseBody.message || JSON.stringify(responseBody.errors);
      expect(errorMessage.toLowerCase()).toContain(
        scenario.messagePart.toLowerCase()
      );

      console.log(`✅ Correctly rejected: ${scenario.label}`);
    });
  }
});
