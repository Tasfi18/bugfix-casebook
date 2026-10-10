# Bug-Fix Casebook

Five bugs that often show up in real web apps, each with the broken code, the fix, tests that prove it, and a fix note written in plain language.

These are practice cases I wrote to show how I work. They are not client code. Every fix I deliver comes with a note in the same format: what was wrong, why it happened, what changed, and how it was tested.

## The cases

| # | Symptom the user sees | Real cause | Stack |
| --- | --- | --- | --- |
| [01](cases/01-react-list-crash/NOTE.md) | Orders page crashes with a blank screen | Component reads data before it has loaded | React / Next.js |
| [02](cases/02-order-total-zero/NOTE.md) | Checkout total shows 0 | `forEach` doesn't wait for async price lookups | Node.js / TypeScript |
| [03](cases/03-login-loop/NOTE.md) | Login loops back to the sign-in page | JWT expiry in seconds compared with milliseconds | Next.js / Node.js, JWT |
| [04](cases/04-slow-report/NOTE.md) | Sales report takes seconds to load | One database query per order (N+1) | Node.js, SQL, EF Core |
| [05](cases/05-wrong-day-report/NOTE.md) | Late-night sales show on the wrong day | Dates taken from UTC instead of local time | JavaScript / TypeScript |

## Each case contains

```
cases/01-react-list-crash/
  before.tsx       the broken code
  after.tsx        the fix
  case.test.tsx    tests that fail on before and pass on after
  NOTE.md          the fix note
```

## Run it

Requires Node.js 20 or later.

```bash
npm install
npm test               # tests against the fixed code: all pass
npm run test:before    # the same tests against the broken code: they fail
```

Running the tests both ways shows each bug and its fix: 18 tests pass on the fixed code, and 13 of them fail on the broken code. Case 02 also reports an unhandled promise rejection on the broken code, which is the hidden error that bug swallows.

## How I approach a bug

1. **Reproduce it.** Get the exact error, or the steps that cause it, before changing anything.
2. **Find the cause, not just the line.** Ask why the code does what it does, so the fix holds.
3. **Write a test that fails.** It proves the bug, and keeps it from coming back.
4. **Make the smallest fix that passes,** and check nearby cases such as empty data, errors and edge times.
5. **Explain it** in a short note your team can read without digging through the code.

## License

MIT
