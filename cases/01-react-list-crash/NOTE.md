# 01 · Orders page crashes with a blank screen

**Stack:** React / Next.js

| | |
| --- | --- |
| **Symptom** | The orders page goes blank. The console shows `TypeError: Cannot read properties of undefined (reading 'items')`. It happens on slow connections and sometimes on refresh. |
| **Cause** | The component reads `data.items` on its first render. The orders request hasn't finished yet, so `data` is `undefined`. Fast connections hide the bug because the data often arrives before anyone notices. |
| **Fix** | Handle every state the request can be in, before touching the data: error, loading, empty, and loaded. Each state now gets a clear message instead of a crash. |
| **Proof** | Four tests render the component in each state. Against the old code, the loading test throws the same `TypeError` users saw. |
| **Files** | `OrderList.tsx` |

## The change

```diff
 export function OrderList({ state }) {
+  if (state.error) return <p role="alert">Could not load orders: {state.error}</p>;
+  if (!state.data) return <p>Loading orders…</p>;
+  if (state.data.items.length === 0) return <p>No orders yet.</p>;
+
   return (
     <ul>
-      {state.data!.items.map((o) => (
+      {state.data.items.map((o) => (
```

## Why it matters

A crash here takes down the whole page, not just the list. The empty and error states also stop users from seeing a blank list and assuming their orders are gone.
