import { test, expect } from "@playwright/test";
import { ECOSYSTEMS_TO_TEST, NON_EVM_CHAINS } from "../../data/data.tools";
import { ToolsResponseSchema } from "../../schemas/tools.schema";

test.describe("GET /v1/tools", () => {
  for (const e of ECOSYSTEMS_TO_TEST) {
    test(`should verify valid schema and registry for ${e.name}`, async ({
      request,
    }) => {
      const response = await request.get(
        `${process.env.BASE_URL}${process.env.TOOLS_URL}`,
        { params: { chains: e.id } }
      );

      expect(response.ok()).toBeTruthy();
      const body = await response.json();
      const validatedData = ToolsResponseSchema.parse(body);

      const relevantBridges = validatedData.bridges.filter((bridge) =>
        bridge.supportedChains.some(
          (pair) =>
            String(pair.fromChainId) === e.id || String(pair.toChainId) === e.id
        )
      );

      if (e.id !== String(NON_EVM_CHAINS.BITCOIN)) {
        const relevantExchanges = validatedData.exchanges.filter(
          (ex) =>
            ex.supportedChains.includes(Number(e.id)) ||
            ex.supportedChains.includes(e.id)
        );
        expect(
          relevantExchanges.length,
          `No exchanges found for ${e.name}, but they were expected.`
        ).toBeGreaterThan(0);
      } else {
        const btcExchanges = validatedData.exchanges.filter((ex) =>
          ex.supportedChains.includes(e.id)
        );
        expect(
          btcExchanges.length,
          "Bitcoin should not have native exchanges"
        ).toBe(0);
      }

      expect(
        relevantBridges.length,
        `Ecosystem ${e.name} (ID: ${e.id}) missing from bridge registry`
      ).toBeGreaterThan(0);
    });
  }
});
