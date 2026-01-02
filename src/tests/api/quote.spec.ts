import { test, expect } from "@playwright/test";
import { QuoteSchema } from "../../schemas/quote.schema";
import {
  VALID_QUOTE_SCENARIOS,
  NEGATIVE_QUOTE_SCENARIOS,
} from "../../data/data.quote";
import { getCachedData } from "../../../utils/cache";

test.describe("GET /v1/quote", () => {
  for (const scenario of VALID_QUOTE_SCENARIOS) {
    const cacheKey = `quote-${scenario.label}-${scenario.params.fromToken}-${scenario.params.toToken}-${scenario.params.fromAmount}`;

    test(`should return valid quote for ${scenario.label}`, async ({
      request,
    }) => {
      const responseBody = await getCachedData(cacheKey, async () => {
        const response = await request.get(
          `${process.env.BASE_URL}${process.env.QUOTE_URL}`,
          {
            params: scenario.params,
            timeout: 30000,
            // headers: { "x-lifi-api-key": process.env.LIFI_API_KEY || "" },
          }
        );

        if (response.status() !== 200) {
          throw new Error(
            `Failed to fetch: ${response.status()} - ${await response.text()}`
          );
        }
        return await response.json();
      });

      const validation = QuoteSchema.safeParse(responseBody);
      expect(
        validation.success,
        `Schema Error: ${validation.error?.message}`
      ).toBe(true);

      expect(responseBody.action.fromToken.symbol).toBe(
        scenario.params.fromToken
      );
      expect(responseBody.action.toToken.symbol).toBe(scenario.params.toToken);
    });
  }
});

test.describe("GET /v1/quote - Negative Path Validation", () => {
  for (const scenario of NEGATIVE_QUOTE_SCENARIOS) {
    test(`should return ${scenario.expectedStatus} for ${scenario.label}`, async ({
      request,
    }) => {
      const response = await request.get(
        `${process.env.BASE_URL}${process.env.QUOTE_URL}`,
        {
          params: scenario.params as any,
        }
      );

      const responseBody = await response.json();

      expect(response.status()).toBe(scenario.expectedStatus);

      const errorMessage =
        responseBody.message || JSON.stringify(responseBody.errors);
      expect(errorMessage.toLowerCase()).toContain(
        scenario.messagePart.toLowerCase()
      );
    });
  }
});
