# 03 · Login loops back to the sign-in page

**Stack:** Next.js / Node.js, JWT authentication

| | |
| --- | --- |
| **Symptom** | Users sign in successfully, then get sent straight back to the sign-in page, over and over. Sometimes the page crashes instead. |
| **Cause** | The expiry check compares the token's `exp` value with `Date.now()`. JWT `exp` is in seconds, while `Date.now()` is in milliseconds, so every token looks as if it expired in January 1970. Separately, a malformed or cut-off token makes `JSON.parse` throw and crashes the page. |
| **Fix** | Convert `exp` to milliseconds before comparing. Treat a malformed token, or one without `exp`, as expired. Allow 30 seconds for small clock differences between the server and the user's device. |
| **Proof** | Four tests: a valid token, an expired token, a token within the clock allowance, and malformed tokens. Against the old code, valid tokens are reported as expired and the malformed token throws. |
| **Files** | `auth/isTokenExpired.ts` |

## The change

```diff
 export function isTokenExpired(token, now = Date.now()) {
-  const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
-  return payload.exp < now;
+  let exp;
+  try {
+    const payload = JSON.parse(Buffer.from(token.split(".")[1] ?? "", "base64url").toString("utf8"));
+    exp = payload.exp;
+  } catch {
+    return true;
+  }
+  if (typeof exp !== "number") return true;
+  return (exp + CLOCK_SKEW_SECONDS) * 1000 <= now;
 }
```

## Note

This check only decides when to show the sign-in page. The server must still verify the token's signature on every request; the fix doesn't change that.
