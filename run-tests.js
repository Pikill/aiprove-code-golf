// Test runner: node run-tests.js <file>  — runs public cases + edge cases
// against the given implementation file and prints a pass/fail report.
const path = require('path');
const file = process.argv[2] || './solution.js';
const { evalExpr } = require(path.resolve(file));
const pub = require('./cases.json');
// Extra edge cases beyond the public set (values computed by hand / by JS semantics):
const edge = [
  { in: ' 1 + 2 * 3 ', out: 7 },          // whitespace
  { in: '-3+1', out: -2 },                // leading unary minus
  { in: '2*-3', out: -6 },                // unary minus after operator
  { in: '-(1+2)', out: -3 },              // unary minus on parenthesis
  { in: '1+-2', out: -1 },
  { in: '.5*2', out: 1 },                 // leading-dot decimal
  { in: '5.', out: 5 },                   // trailing-dot decimal
  { in: '010+1', out: 11 },               // leading-zero literal is decimal
  { in: '8/2/2', out: 2 },                // left-assoc division
  { in: '1-2+3', out: 2 },                // left-assoc + -
  { in: '((2))', out: 2 },                // redundant parens
  { in: '3*(2+4)/4-1', out: 3.5 },
  { in: '0.1+0.2', out: 0.1 + 0.2 },      // float semantics
  { in: '1000000*1000000', out: 1e12 },
  { in: '7/2', out: 3.5 },
  { in: '2*(3+4*5)-6/2', out: 43 },
  { in: '42', out: 42 },
  { in: '0', out: 0 },
  { in: '9- -1', out: 10 },
  { in: '1/3', out: 1 / 3 },
];
let pass = 0, fail = 0;
function check(c, tag) {
  let got, err = null;
  try { got = evalExpr(c.in); } catch (e) { err = e; }
  const ok = !err && typeof got === 'number' && Math.abs(got - c.out) <= 1e-12 * Math.max(1, Math.abs(c.out));
  if (ok) { pass++; } else { fail++; console.log(`FAIL [${tag}] ${JSON.stringify(c.in)} -> ${err ? 'ERR ' + err.message : got}, expected ${c.out}`); }
}
pub.forEach(c => check(c, 'public'));
edge.forEach(c => check(c, 'edge'));
console.log(`${file}: ${pass}/${pass + fail} passing (${pub.length} public + ${edge.length} edge)`);
process.exit(fail ? 1 : 0);
