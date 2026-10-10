export interface Sale {
  /** When the sale happened, stored by the server in UTC (ISO 8601). */
  at: string;
  amount: number;
}

// BUG: takes the date from the UTC timestamp. Bangladesh is UTC+6, so every
// sale between midnight and 6 am local time is counted on the PREVIOUS day.
export function dailyTotals(sales: Sale[], _timeZone = "Asia/Dhaka"): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const s of sales) {
    const day = s.at.slice(0, 10);
    totals[day] = (totals[day] ?? 0) + s.amount;
  }
  return totals;
}
