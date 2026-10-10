import { describe, expect, it } from "vitest";
import { VARIANT } from "../../variant";

const { isTokenExpired } = await import(VARIANT === "before" ? "./before" : "./after");

/** Build an unsigned test token with the given payload. */
const token = (payload: object) =>
  ["header", Buffer.from(JSON.stringify(payload)).toString("base64url"), "signature"].join(".");

const NOW = Date.UTC(2026, 9, 9, 12, 0, 0); // fixed clock for the tests
const nowSeconds = NOW / 1000;

describe(`03 · login loops back to sign-in (${VARIANT})`, () => {
  it("keeps the user signed in while the token is valid", () => {
    expect(isTokenExpired(token({ sub: "u1", exp: nowSeconds + 3600 }), NOW)).toBe(false);
  });

  it("signs the user out once the token has expired", () => {
    expect(isTokenExpired(token({ sub: "u1", exp: nowSeconds - 120 }), NOW)).toBe(true);
  });

  it("allows a few seconds of clock difference", () => {
    expect(isTokenExpired(token({ sub: "u1", exp: nowSeconds - 10 }), NOW)).toBe(false);
  });

  it("treats a malformed token as expired instead of crashing", () => {
    expect(isTokenExpired("not-a-token", NOW)).toBe(true);
    expect(isTokenExpired(token({ sub: "u1" }), NOW)).toBe(true);
  });
});
