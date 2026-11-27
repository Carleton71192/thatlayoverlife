'use strict';
/* Parser check, round 4 (adversary). node parser4.cjs <new tree> <old tree> <log folder>
   P1: every log file in <log folder> (all git versions, the zxm063 tip, the main checkout), every day 1 Oct to 31 Dec 2026:
       day totals old vs new, errors on each side.
   P2: hand-written lines: old mb, new mb or the error, and a flag when new reads lower than old without an error.
   P3: mutations of every real bullet line (bare M, units, brackets, prefixes): same flag.
   Reads files only; no network. */
const fs = require('fs'), path = require('path');
const N = require(path.resolve(process.argv[2], 'tools/wf-guard.cjs'));
const O = require(path.resolve(process.argv[3], 'tools/wf-guard.cjs'));
const dir = process.argv[4];
const days = []; for (let t = Date.UTC(2026, 9, 1); t <= Date.UTC(2026, 11, 31); t += 864e5) days.push(new Date(t + 12 * 3600e3));
const tot = (W, text, d) => { try { return +W.dailyTotalMB(text, d).toFixed(4); } catch (e) { return 'ERR'; } };
let cells = 0, diffs = 0, errN = 0, errO = 0, nonzero = 0;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort();
for (const f of files) {
  const text = fs.readFileSync(path.join(dir, f), 'utf8');
  for (const d of days) {
    const a = tot(O, text, d), b = tot(N, text, d); cells++;
    if (a === 'ERR') errO++; if (b === 'ERR') errN++;
    if (b !== 'ERR' && b) nonzero++;
    if (a !== b) { diffs++; if (diffs <= 40) console.log('P1 DIFF', f, d.toISOString().slice(0, 10), 'old', a, 'new', b); }
  }
}
console.log(`P1 ${files.length} log files x ${days.length} days = ${cells} cells; ${nonzero} non-zero new cells; ${diffs} differences; errors old ${errO}, new ${errN}`);
for (const f of ['zxm063-tip.md', 'main-checkout.md']) {
  const text = fs.readFileSync(path.join(dir, f), 'utf8');
  console.log('P1 totals', f, [20, 21, 22, 23, 24, 25, 26, 27].map(x => `${x} Nov ${tot(N, text, new Date(Date.UTC(2026, 10, x, 12)))}`).join(', '));
}
const day = new Date(Date.UTC(2026, 10, 27, 12));
const one = (W, l) => { try { const p = W.parseLogLine(l); return p ? (p.covers(day) ? +p.mb.toFixed(6) : 'other day') : null; } catch (e) { return 'THROW'; } };
const flag = (o, n) => (n !== 'THROW' && typeof o === 'number' && (n === null || n === 'other day' || n < o - 1e-9)) ? ' NEW BELOW OLD' : '';
const P2 = [
  '- 27 Nov, x: 3 M', '- 27 Nov, x: 3 M.', '- 27 Nov, x: 3M', '- 27 Nov, x: 3 M (M)', '- 27 Nov, x: 2 MB and 3 M (E)',
  '- 27 Nov, x: 2 MB; y: 3 M', '- 27 Nov, x: 3 M; y: 2 M', '- 27 Nov, x: 3 M total', '- 27 Nov, x: 3 M, estimated', '- 27 Nov, x: 3 M [E]',
  '- 27 Nov, x: 40 M, recheck 30 M (E)', '- 27 Nov, 12 M requests, 2.5 MB (M)', '- 27 Nov, 1 MB, video 1080 M', '- 27 Nov, x: 3 Mbit/s link, 5 MB (M)',
  '- 27 Nov, x: 3 Mbps', '- 27 Nov, x: 3 M&M', '- 27 Nov, x: 3M/day', '- 27 Nov, x: 1,080 M pixels', '- 27 Nov, x: 0 M',
  '- 27 Nov, x: 3 M\t', '- 27 Nov, x: 3 M  ', '- 27 Nov, x: 3 M;', '- 27 Nov, x: 3 M,', '- 27 Nov, x: 3 M!', '- 27 Nov, x: 3 M?', '- 27 Nov, x: 3 M)',
  '- 27 Nov, x: 3 M -- done', '- 27 Nov, x: 3 M \u2014 done', '- 27 Nov, x: about 3 M', '- 27 Nov, x: 3 to 5 M', '- 27 Nov, x: 3-5 M (E)',
  '- 27 Nov, x: 3 M [M]', '- 27 Nov, x: 3 M{M}', '- 27 Nov, x: (3 M)', '- 27 Nov, x: 3 M.)', '- 27 Nov, x: 3 M. Next: y.',
  '- 27 Nov, x: 3 M, 2 MB', '- 27 Nov, x: 2 MB, 3 M', '- 27 Nov, x: 3 M 2 M', '- 27 Nov, x: 3 M', '- 27 Nov, x: 3 Μ',
  '- 27 Nov, x: 3 m', '- 27 Nov, x: 3 mb', '- 27 Nov, x: 3 Mb', '- 27 Nov, x: 3 MiB', '- 27 Nov, x: 3 megabyte', '- 27 Nov, x: 3,000 KB',
  '- 27 Nov, x: 3000000 bytes', '- 27 Nov, x: 3 B', '- 27 Nov, x: 3e6 bytes', '- 27 Nov, x: 3.5MB', '- 27 Nov, x: .5 MB', '- 27 Nov, x: 0.5MB',
  '- 27 Nov, x: 5MB/s for 1 s', '- 27 Nov, x: ~3 MB', '- 27 Nov, x: 3 MB?', '- 27 Nov, x: under 3 MB', '- 27 Nov, x: 3_MB', '- 27 Nov, x: **3 MB**',
  '- 27 Nov, x: `3 MB`', '- 27 Nov, x: 3 MB_', '- 27 Nov, x: v1.3 MB', '- 27 Nov, x: id7 MB', '- 27 Nov, x: 3 MBs', '- 27 Nov, x: 3 MB-ish',
  '- On 27 Nov, x: 3 M; y: 2 M', '- On 27 Nov, x: 3 M', '- On 27 Nov, x: 3 MB', '- x: 3 M; y: 2 M', '- x: 12 M requests', '- note: 120 bytes header',
  '* 27 Nov, x: 3 M', '+ 27 Nov, x: 3 M', '  - 27 Nov, x: 3 M', '-\t27 Nov, x: 3 M', '- 27 Nov 2026, x: 3 M', '- Nov 27, x: 3 M', '- 2026-11-27, x: 3 M',
  '- 27/11/2026, x: 3 M', '- 27.11.2026, x: 3 M', '- 26 to 27 Nov, x: 3 M', '- 27th Nov, x: 3 MB', '- 27 November, x: 3 MB', '- Nov. 27, x: 3 MB',
  '- 27 Nov, x: 3 MB (M); run abc123', '- 27 Nov 14:00 UTC, x: wf-guard block run abc123, 0 page loads, 1 Webflow GETs, 0.50 MB from Webflow (M)',
  '1. 27 Nov, x: 3 MB', '| 27 Nov | 3 MB |', '27 Nov, x: 3 MB', '> 27 Nov, x: 3 MB', '# 27 Nov 3 MB', 'Budget: 250 MB a day, the 13 Nov rule',
  '- 27 Nov, x: 3 M (requests)', '- 27 Nov, x: 3 M (', '- 27 Nov, x: 3 MB, then 2 M', '- 27 Nov, x: 3 M then 2 MB',
];
console.log('P2 line | old | new');
let p2below = 0;
for (const l of P2) { const o = one(O, l), n = one(N, l), fl = flag(o, n); if (fl) p2below++; console.log(`P2 ${JSON.stringify(l)} | ${o} | ${n}${fl}`); }
console.log(`P2 ${P2.length} lines, ${p2below} read lower by new without an error`);
/* P3: mutations of real bullet lines */
const real = new Set();
for (const f of files) for (const l of fs.readFileSync(path.join(dir, f), 'utf8').split('\n')) if (/^\s*[-*+]\s/.test(l)) real.add(l);
const muts = [
  l => l.replace(/(\d)\s*MB/, '$1 M'), l => l.replace(/(\d)\s*MB/, '$1M'), l => l.replace(/(\d)\s*MB/g, '$1 M'), l => l.replace(/\(M\)/, '(E)'),
  l => l.replace(/(\d)\s*MB/, '$1 MiB'), l => l.replace(/(\d)\s*MB/, '$1 megabytes'), l => l.replace(/(\d)\s*MB/, '$1 GB'), l => l + ' 2 M',
  l => l + '; 2 M', l => l + ' (2 M)', l => l.replace(/^(\s*)-/, '$1*'), l => l.replace(/^(\s*)-/, '  $1-'), l => l.replace(/(\d+(?:\.\d+)?)\s*MB/, '$1 to $1 MB'),
  l => l.replace(/(\d)\s*MB/, '$1 KB'), l => l.replace(/(\d)\s*MB/, '$1 bytes'), l => l.replace(/, /, ' '), l => l.replace(/(\d+) Nov/, 'Nov $1'),
  l => l.replace(/(\d+) Nov/, '2026-11-$1'), l => l.replace(/\bMB\b/g, 'mb'),
];
let p3 = 0, p3below = 0, p3throwNew = 0, p3throwOld = 0; const ex = [];
for (const l of real) for (const m of muts) {
  const x = m(l); if (x === l) continue; p3++;
  const o = one(O, x), n = one(N, x);
  if (n === 'THROW') p3throwNew++; if (o === 'THROW') p3throwOld++;
  if (flag(o, n)) { p3below++; if (ex.length < 15) ex.push(`${JSON.stringify(x)} old ${o} new ${n}`); }
}
console.log(`P3 ${real.size} real bullet lines, ${p3} mutations; new throws ${p3throwNew}, old throws ${p3throwOld}; ${p3below} read lower by new without an error`);
for (const e of ex) console.log('P3 BELOW', e);
