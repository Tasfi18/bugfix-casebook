# 04 · Sales report takes several seconds to load

**Stack:** Node.js / any SQL database (the same fix applies to Entity Framework Core in ASP.NET Core)

| | |
| --- | --- |
| **Symptom** | The sales report gets slower every month, and now takes several seconds. Database load spikes whenever someone opens it. It sometimes crashes too. |
| **Cause** | The report loads all orders in one query, then runs one more query per order to fetch that order's customer. This is the classic "N+1 query" problem: 300 orders means 301 database round trips, and the count grows with every sale. Orders whose customer was deleted crash the loop. |
| **Fix** | Load every customer the report needs in a single `WHERE id IN (…)` query, then join the names in memory. The report now takes 2 queries, whatever the number of orders. Orders with a missing customer show "Unknown customer". |
| **Proof** | Four tests on 300 orders and 50 customers. They count the queries, check the rows are unchanged, and cover a deleted customer and an empty report. Against the old code, the report makes 301 queries and crashes on the missing customer. |
| **Files** | `reports/salesReport.ts` |

## The change

```diff
 export async function salesReport(db) {
   const orders = await db.getOrders();
-  const rows = [];
-  for (const o of orders) {
-    const customer = await db.getCustomerById(o.customerId);
-    rows.push({ orderId: o.id, customer: customer!.name, total: o.total });
-  }
-  return rows;
+  const ids = [...new Set(orders.map((o) => o.customerId))];
+  const customers = ids.length ? await db.getCustomersByIds(ids) : [];
+  const nameById = new Map(customers.map((c) => [c.id, c.name]));
+  return orders.map((o) => ({
+    orderId: o.id,
+    customer: nameById.get(o.customerId) ?? "Unknown customer",
+    total: o.total,
+  }));
 }
```

## In Entity Framework Core

The same bug appears when a loop reads a navigation property that wasn't loaded. The fix there is to load it with the first query, using `.Include(o => o.Customer)`, or to project only the fields the report needs with `.Select(...)`.
