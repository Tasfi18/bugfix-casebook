/** Seconds of tolerance for small clock differences between server and device. */
const CLOCK_SKEW_SECONDS = 30;

/**
 * Decides whether the app should send the user back to the sign-in page.
 * (The server still verifies the token's signature; this only checks expiry.)
 */
export function isTokenExpired(token: string, now: number = Date.now()): boolean {
  let exp: unknown;
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1] ?? "", "base64url").toString("utf8"));
    exp = payload.exp;
  } catch {
    return true; // FIX: a malformed token counts as expired instead of crashing.
  }
  if (typeof exp !== "number") return true;

  // FIX: JWT `exp` is in seconds; convert before comparing with milliseconds.
  return (exp + CLOCK_SKEW_SECONDS) * 1000 <= now;
}
