import type { FakeDb } from "./db";

export interface ReportRow {
  orderId: number;
  customer: string;
  total: number;
}

// BUG: one query for the orders, then ONE MORE QUERY PER ORDER to fetch the
// customer (the "N+1 query" problem). 500 orders means 501 round trips.
// It also crashes on orders whose customer was deleted.
export async function salesReport(db: FakeDb): Promise<ReportRow[]> {
  const orders = await db.getOrders();
  const rows: ReportRow[] = [];
  for (const o of orders) {
    const customer = await db.getCustomerById(o.customerId);
    rows.push({ orderId: o.id, customer: customer!.name, total: o.total });
  }
  return rows;
}
