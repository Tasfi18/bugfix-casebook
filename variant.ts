/**
 * Every case has a `before` file (the bug) and an `after` file (the fix).
 * `npm test` checks the fix. `npm run test:before` runs the same tests
 * against the broken code, so you can watch them fail.
 */
export const VARIANT: "before" | "after" = process.env.VARIANT === "before" ? "before" : "after";
