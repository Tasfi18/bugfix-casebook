export interface Line {
  productId: string;
  qty: number;
}

/** Looks up the current price, e.g. from a database or pricing service. */
export type PriceLookup = (productId: string) => Promise<number>;

// BUG: `forEach` does not wait for async callbacks. The function returns
// before any price has arrived, so the total is always 0.
export async function orderTotal(lines: Line[], getPrice: PriceLookup): Promise<number> {
  let total = 0;
  lines.forEach(async (line) => {
    const price = await getPrice(line.productId);
    total += price * line.qty;
  });
  return total;
}
