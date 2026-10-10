# 02 · Checkout shows a total of 0

**Stack:** Node.js / TypeScript

| | |
| --- | --- |
| **Symptom** | The order summary shows a total of 0, even though every line item has a price. No error appears anywhere. |
| **Cause** | Prices come from an async lookup, and the code loops with `forEach(async …)`. `forEach` doesn't wait for async callbacks, so the function returns the starting total of 0 before any price arrives. If a lookup fails, that error is silently lost too. |
| **Fix** | Start all lookups with `Promise.all`, wait for every result, then add them up. Failures now reach the caller instead of disappearing. Prices are kept in cents, so the sum is exact. |
| **Proof** | Three tests: the correct total for a three-line order, an empty order, and a failing price lookup. Against the old code, the total test gets 0 and the failure test never sees the error. |
| **Files** | `orderTotal.ts` |

## The change

```diff
 export async function orderTotal(lines, getPrice) {
-  let total = 0;
-  lines.forEach(async (line) => {
-    const price = await getPrice(line.productId);
-    total += price * line.qty;
-  });
-  return total;
+  const prices = await Promise.all(lines.map((line) => getPrice(line.productId)));
+  return lines.reduce((sum, line, i) => sum + prices[i] * line.qty, 0);
 }
```

## Why it matters

Silent bugs are the costly ones: nothing crashes, so they can reach customers or invoices before anyone notices. Running the lookups together is also faster than awaiting them one by one.
