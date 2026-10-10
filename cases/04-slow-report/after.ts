import type { FakeDb } from "./db";

export interface ReportRow {
  orderId: number;
  customer: string;
  total: number;
}

// FIX: fetch every customer the report needs in ONE query, then join in
// memory. Two round trips no matter how many orders there are.
export async function salesReport(db: FakeDb): Promise<ReportRow[]> {
  const orders = await db.getOrders();
  const ids = [...new Set(orders.map((o) => o.customerId))];
  const customers = ids.length ? await db.getCustomersByIds(ids) : [];
  const nameById = new Map(customers.map((c) => [c.id, c.name]));

  return orders.map((o) => ({
    orderId: o.id,
    customer: nameById.get(o.customerId) ?? "Unknown customer",
    total: o.total,
  }));
}
