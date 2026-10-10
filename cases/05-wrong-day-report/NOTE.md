# 05 · Late-night sales show up on the wrong day

**Stack:** JavaScript / TypeScript (front end or back end)

| | |
| --- | --- |
| **Symptom** | The daily sales report doesn't match the cash count. Sales made after midnight appear on the previous day, so one day looks too high and the next too low. |
| **Cause** | The server stores times in UTC, which is correct. But the report takes the date straight from the UTC timestamp. Bangladesh is six hours ahead of UTC, so every sale between midnight and 6 am local time is counted on the day before. |
| **Fix** | Convert each timestamp to the shop's time zone before taking the date, using the built-in `Intl.DateTimeFormat`. The time zone is a setting, so shops in other countries get correct reports too. |
| **Proof** | Three tests: a 1:30 am sale in Dhaka, a full day of sales either side of midnight, and a shop in New York. Against the old code, the after-midnight sales are counted on the wrong day. |
| **Files** | `reports/dailyTotals.ts` |

## The change

```diff
-export function dailyTotals(sales, _timeZone = "Asia/Dhaka") {
+export function dailyTotals(sales, timeZone = "Asia/Dhaka") {
+  const toLocalDay = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" });
   const totals = {};
   for (const s of sales) {
-    const day = s.at.slice(0, 10);
+    const day = toLocalDay.format(new Date(s.at));
     totals[day] = (totals[day] ?? 0) + s.amount;
   }
   return totals;
 }
```

## Why it matters

Reports that don't match the till make owners lose trust in the whole system. The bug is easy to miss, because daytime sales are always counted correctly.
