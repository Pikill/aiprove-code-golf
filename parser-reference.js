// Straightforward recursive-descent reference implementation.
// Grammar: expr := term (('+'|'-') term)* ; term := factor (('*'|'/') factor)*
//          factor := ('-'|'+') factor | '(' expr ')' | number
// Left-associative binary ops, * / bind tighter than + -.
function evalExpr(s) {
  s = String(s).replace(/\s+/g, '');
  let i = 0;
  function expr() {
    let v = term();
    while (s[i] === '+' || s[i] === '-') {
      const op = s[i++];
      const r = term();
      v = op === '+' ? v + r : v - r;
    }
    return v;
  }
  function term() {
    let v = factor();
    while (s[i] === '*' || s[i] === '/') {
      const op = s[i++];
      const r = factor();
      v = op === '*' ? v * r : v / r;
    }
    return v;
  }
  function factor() {
    if (s[i] === '-') { i++; return -factor(); }
    if (s[i] === '+') { i++; return factor(); }
    if (s[i] === '(') {
      i++;
      const v = expr();
      i++; // consume ')'
      return v;
    }
    const m = /^[\d.]+/.exec(s.slice(i));
    i += m[0].length;
    return parseFloat(m[0]);
  }
  return expr();
}
module.exports = { evalExpr };
