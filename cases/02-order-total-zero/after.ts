export interface Line {
  productId: string;
  qty: number;
}

/** Looks up the current price, e.g. from a database or pricing service. */
export type PriceLookup = (productId: string) => Promise<number>;

// FIX: start all lookups together and wait for every one of them.
// Prices are in cents (whole numbers) so the sum is exact.
export async function orderTotal(lines: Line[], getPrice: PriceLookup): Promise<number> {
  const prices = await Promise.all(lines.map((line) => getPrice(line.productId)));
  return lines.reduce((sum, line, i) => sum + prices[i] * line.qty, 0);
}
