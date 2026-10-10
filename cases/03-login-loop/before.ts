/**
 * Decides whether the app should send the user back to the sign-in page.
 * (The server still verifies the token's signature; this only checks expiry.)
 */
export function isTokenExpired(token: string, now: number = Date.now()): boolean {
  const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
  // BUG: `exp` in a JWT is in SECONDS, but Date.now() is in MILLISECONDS.
  // Every token looks expired, so users are sent back to sign-in in a loop.
  // A malformed token also throws here and crashes the page.
  return payload.exp < now;
}
