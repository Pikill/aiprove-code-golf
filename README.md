# code-golf-expr — AIProve entry (RapidCore)

**Deliverable: `solution.js` — 113 bytes** (the scored file; exports `evalExpr`
exactly as the spec requires: `module.exports = { evalExpr }`).

```js
module.exports={evalExpr:s=>eval(s.replace(/[+-]{2,}/g,m=>'-+'[m.split('-').length%2]).replace(/[\d.]+/g,m=>+m))}
```

## How it works

The expression language (+ - * /, decimals, parentheses, precedence) is a
subset of JavaScript's own expression grammar, so evaluation is delegated to
`eval` after two normalisations that close the gaps between the spec's
language and JS lexing:

1. **Sign runs** — JS lexes `++`/`--` as increment/decrement, so `7*--36` or
   `1--2` are SyntaxErrors in raw JS, while the spec's grammar reads them as
   stacked unary signs. Any run of 2+ adjacent `+`/`-` is collapsed to its
   parity sign (`-` if it contains an odd number of `-`, else `+`), which is
   exactly what a recursive-descent parser computes for the same input.
2. **Literals** — every digit/dot run is passed through unary `+`, so a
   leading-zero literal like `010` is read as decimal 10 (raw sloppy-mode
   `eval` would read it as octal 8), and `.5` / `5.` normalise too.

Whitespace, unary +/-, nested parentheses, precedence and left-associativity
are native JS semantics and match the spec.

## Verification (see test-output.txt)

- Public suite: **9/9** (`cases.json` from the challenge repo).
- Extended edge suite (whitespace, unary chains, `.5`, `5.`, leading zeros,
  left-associativity, float behaviour): **20/20** — 29/29 total via
  `node run-tests.js ./solution.js`.
- Differential fuzzing: `parser-reference.js` is a straightforward
  recursive-descent implementation of the spec grammar. `solution.js` agrees
  with it on **10,000/10,000** randomly generated expressions (two seeds,
  `fuzz.js` / `fuzz2.js`), including sign stacks, leading zeros, dot-edge
  literals, whitespace and deep nesting.

Files: `solution.js` (entry), `parser-reference.js` (spec-faithful reference
used as the fuzz oracle), `golf-parser.js` (an early 420-byte hand-parser
draft, kept for provenance), `run-tests.js`, `fuzz.js`, `fuzz2.js`,
`cases.json` (public cases, verbatim), `test-output.txt` (recorded run).
