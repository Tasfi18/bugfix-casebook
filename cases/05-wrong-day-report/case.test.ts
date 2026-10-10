import { describe, expect, it } from "vitest";
import { VARIANT } from "../../variant";

const { dailyTotals } = await import(VARIANT === "before" ? "./before" : "./after");

describe(`05 · late-night sales land on the wrong day (${VARIANT})`, () => {
  it("counts a 1:30 am Dhaka sale on the day it happened", () => {
    // 19:30 UTC on 9 Oct is 01:30 on 10 Oct in Dhaka (UTC+6).
    expect(dailyTotals([{ at: "2026-10-09T19:30:00Z", amount: 500 }])).toEqual({ "2026-10-10": 500 });
  });

  it("groups a full day of sales correctly", () => {
    const sales = [
      { at: "2026-10-09T03:00:00Z", amount: 100 }, // 09:00 on 9 Oct
      { at: "2026-10-09T12:00:00Z", amount: 200 }, // 18:00 on 9 Oct
      { at: "2026-10-09T17:59:00Z", amount: 300 }, // 23:59 on 9 Oct
      { at: "2026-10-09T18:01:00Z", amount: 400 }, // 00:01 on 10 Oct
    ];
    expect(dailyTotals(sales)).toEqual({ "2026-10-09": 600, "2026-10-10": 400 });
  });

  it("works for shops in other time zones too", () => {
    // 03:00 UTC on 10 Oct is 23:00 on 9 Oct in New York (UTC-4 in October).
    expect(dailyTotals([{ at: "2026-10-10T03:00:00Z", amount: 75 }], "America/New_York")).toEqual({
      "2026-10-09": 75,
    });
  });
});
