export interface Sale {
  /** When the sale happened, stored by the server in UTC (ISO 8601). */
  at: string;
  amount: number;
}

// FIX: convert each timestamp to the shop's own time zone before taking the
// date. "en-CA" formats dates as YYYY-MM-DD, which sorts correctly.
export function dailyTotals(sales: Sale[], timeZone = "Asia/Dhaka"): Record<string, number> {
  const toLocalDay = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" });
  const totals: Record<string, number> = {};
  for (const s of sales) {
    const day = toLocalDay.format(new Date(s.at));
    totals[day] = (totals[day] ?? 0) + s.amount;
  }
  return totals;
}
