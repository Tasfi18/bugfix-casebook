import { describe, expect, it } from "vitest";
import { VARIANT } from "../../variant";
import { FakeDb, type Customer, type Order } from "./db";

const { salesReport } = await import(VARIANT === "before" ? "./before" : "./after");

const customers: Customer[] = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, name: `Customer ${i + 1}` }));
const orders: Order[] = Array.from({ length: 300 }, (_, i) => ({ id: i + 1, customerId: (i % 50) + 1, total: 100 + i }));

describe(`04 · sales report is slow (${VARIANT})`, () => {
  it("builds the report with at most 2 queries, however many orders there are", async () => {
    const db = new FakeDb(orders, customers);
    const rows = await salesReport(db);
    expect(rows).toHaveLength(300);
    expect(db.queries).toBeLessThanOrEqual(2);
  });

  it("returns the same rows, with the right customer on each order", async () => {
    const rows = await salesReport(new FakeDb(orders, customers));
    expect(rows[0]).toEqual({ orderId: 1, customer: "Customer 1", total: 100 });
    expect(rows[51]).toEqual({ orderId: 52, customer: "Customer 2", total: 151 });
  });

  it("does not crash when an order's customer was deleted", async () => {
    const rows = await salesReport(new FakeDb([{ id: 1, customerId: 999, total: 50 }], customers));
    expect(rows).toEqual([{ orderId: 1, customer: "Unknown customer", total: 50 }]);
  });

  it("makes only one query when there are no orders", async () => {
    const db = new FakeDb([], customers);
    expect(await salesReport(db)).toEqual([]);
    expect(db.queries).toBe(1);
  });
});
