import { describe, expect, it } from "vitest";
import { VARIANT } from "../../variant";

const { orderTotal } = await import(VARIANT === "before" ? "./before" : "./after");

// Prices in cents, returned after a short delay like a real database call.
const PRICES: Record<string, number> = { oil: 260, rice: 980, tea: 320 };
const getPrice = (id: string) => new Promise<number>((r) => setTimeout(() => r(PRICES[id]), 5));

describe(`02 · order total shows 0 (${VARIANT})`, () => {
  it("adds up every line after the prices arrive", async () => {
    const total = await orderTotal(
      [
        { productId: "oil", qty: 3 },
        { productId: "rice", qty: 1 },
        { productId: "tea", qty: 2 },
      ],
      getPrice,
    );
    expect(total).toBe(260 * 3 + 980 + 320 * 2); // 2400 cents = $24.00
  });

  it("returns 0 for an empty order", async () => {
    expect(await orderTotal([], getPrice)).toBe(0);
  });

  it("passes on a failed price lookup instead of hiding it", async () => {
    const failing = () => Promise.reject(new Error("pricing service down"));
    await expect(orderTotal([{ productId: "oil", qty: 1 }], failing)).rejects.toThrow("pricing service down");
  });
});
