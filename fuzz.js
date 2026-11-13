// Differential fuzz: solution.js vs parser-reference.js on random expressions.
const A = require('./solution.js').evalExpr;
const B = require('./parser-reference.js').evalExpr;
let seed = 123456789;
const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
const pick = a => a[Math.floor(rnd() * a.length)];
function num() {
  const r = rnd();
  const d = () => Math.floor(rnd() * 100);
  if (r < 0.35) return String(d());                                  // int
  if (r < 0.5) return '0' + String(d());                             // leading zero
  if (r < 0.7) return d() + '.' + d();                               // decimal
  if (r < 0.8) return '.' + (1 + Math.floor(rnd() * 99));            // .5 style
  if (r < 0.9) return d() + '.';                                     // 5. style
  return String(1 + Math.floor(rnd() * 9));                          // small int
}
const sp = () => (rnd() < 0.25 ? ' ' : '');
function factor(d) {
  const r = rnd();
  if (d > 3 || r < 0.55) return num();
  if (r < 0.7) return '(' + sp() + expr(d + 1) + sp() + ')';
  if (r < 0.85) return '-' + factor(d + 1);
  return '+' + factor(d + 1);
}
function term(d) {
  let s = factor(d);
  const n = Math.floor(rnd() * 3);
  for (let k = 0; k < n; k++) s += sp() + pick(['*', '/']) + sp() + factor(d);
  return s;
}
function expr(d) {
  let s = term(d);
  const n = Math.floor(rnd() * 3);
  for (let k = 0; k < n; k++) s += sp() + pick(['+', '-']) + sp() + term(d);
  return s;
}
const eq = (a, b) => a === b || (Number.isNaN(a) && Number.isNaN(b)) ||
  (typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)));
let bad = 0;
const N = 5000;
for (let k = 0; k < N; k++) {
  const s = expr(0);
  let a, b, ea = null, eb = null;
  try { a = A(s); } catch (e) { ea = e; }
  try { b = B(s); } catch (e) { eb = e; }
  if ((ea === null) !== (eb === null) || (ea === null && !eq(a, b))) {
    if (++bad <= 5) console.log('MISMATCH', JSON.stringify(s), 'solution=', ea ? 'ERR' : a, 'parser=', eb ? 'ERR' : b);
  }
}
console.log(`fuzz: ${N - bad}/${N} expressions agree between solution.js and parser-reference.js`);
process.exit(bad ? 1 : 0);
