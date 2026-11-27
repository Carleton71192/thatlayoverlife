'use strict';
/* check-repro (fix4): old vs new for every probe output in a runs folder. Lines are matched by label (text before the first
   "{"). Every numeric field whose name says delivered bytes (deliver, relay, stubWrote, wrote) is compared; a new value more
   than 1 KB above old is flagged MORE. Request counts (stubRequests, gets, requests arrays) are compared too.
   Usage: node cmp4.cjs <runs dir> [job filter regex] [--all] */
const fs = require('fs'), path = require('path');
const [dir, filt] = process.argv.slice(2); const all = process.argv.includes('--all');
const read = f => { const m = new Map(); let t; try { t = fs.readFileSync(f, 'utf8'); } catch (e) { return m; }
  for (const l of t.split('\n')) { const i = l.indexOf('{'); if (i < 0) continue; let label = l.slice(0, i).replace(/^\d+\.\ds /, '').trim(); const rest = l.slice(i);
    const j = rest.lastIndexOf('}'); let o = {}; try { o = JSON.parse(rest.slice(0, j + 1)); } catch (e) { continue; }
    const rel = /relayDeliveredSincePreviousLine=(\d+)/.exec(rest); if (rel) o.relayLine = +rel[1];
    let k = label, n = 2; while (m.has(k)) k = label + ' #' + n++; m.set(k, o); }
  return m; };
const flat = (o, p = '', out = {}) => { for (const [k, v] of Object.entries(o || {})) { const q = p ? p + '.' + k : k; if (v && typeof v === 'object' && !Array.isArray(v)) flat(v, q, out); else out[q] = v; } return out; };
const isDel = k => /deliver|relay|stubwrote|wrote$/i.test(k.split('.').pop());
const isReq = k => /^(stubRequests|gets|requests|wfRequests|stubRequestsAtClose|httpRequests|wfConnections)$/.test(k.split('.').pop());
let more = 0, rows = 0;
const jobs = fs.readdirSync(dir).filter(f => /\.new\.txt$/.test(f)).map(f => f.replace(/\.new\.txt$/, '')).filter(j => !filt || new RegExp(filt).test(j)).sort();
for (const job of jobs) {
  const N = read(path.join(dir, job + '.new.txt')), O = read(path.join(dir, job + '.old.txt'));
  if (!O.size) { console.log(`== ${job}: no old output lines`); continue; }
  console.log(`== ${job}`);
  for (const k of new Set([...O.keys(), ...N.keys()])) {
    const o = flat(O.get(k)), n = flat(N.get(k)); if (!O.has(k) || !N.has(k)) { console.log(`  ${k.slice(0, 110)}: only in ${O.has(k) ? 'old' : 'new'}`); continue; }
    const parts = []; let flag = '';
    for (const f of new Set([...Object.keys(o), ...Object.keys(n)])) {
      const a = o[f], b = n[f];
      if (isDel(f) && typeof a === 'number' && typeof b === 'number') { parts.push(`${f} ${a}/${b}`); if (b > a + 1024) { flag = ' MORE'; } }
      else if (isReq(f)) { const ca = Array.isArray(a) ? a.length : a, cb = Array.isArray(b) ? b.length : b; if (ca !== cb || all) parts.push(`${f} ${JSON.stringify(ca)}/${JSON.stringify(cb)}`); }
    }
    rows++; if (flag) more++;
    if (parts.length) console.log(`  ${flag ? 'MORE ' : ''}${k.slice(0, 110)}: ${parts.join(', ')}`);
  }
}
console.log(`rows ${rows}, rows with new delivered > old + 1 KB: ${more}`);
