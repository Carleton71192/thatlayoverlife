'use strict';
/* check-repro (fix3): puts the lines of one probe's output on new, r2 and old side by side, matched by their label (the text
   before the first "{"), with chosen fields. Usage: node compare.cjs <runs dir> <job> <field,field,...> [label filter regex] */
const fs = require('fs'), path = require('path');
const [dir, job, fields, filt] = process.argv.slice(2);
const read = t => { const m = new Map(); let f; try { f = fs.readFileSync(path.join(dir, `${job}.${t}.txt`), 'utf8'); } catch (e) { return m; }
  for (const l of f.split('\n')) { const i = l.indexOf('{'); if (i < 0) continue; let label = l.slice(0, i).replace(/^\d+\.\ds /, '').trim(); const rest = l.slice(i);
    const j = rest.lastIndexOf('}'); let o = {}; try { o = JSON.parse(rest.slice(0, j + 1)); } catch (e) { continue; }
    const rel = /relayDeliveredSincePreviousLine=(\d+)/.exec(rest); if (rel) o.relay = +rel[1];
    let k = label, n = 2; while (m.has(k)) k = label + ' #' + n++; m.set(k, o); }
  return m; };
const T = { new: read('new'), r2: read('r2'), old: read('old') };
const fl = fields.split(','); const re = filt ? new RegExp(filt) : null;
for (const k of new Set([...T.new.keys(), ...T.r2.keys(), ...T.old.keys()])) {
  if (re && !re.test(k)) continue;
  console.log(k); for (const t of ['old', 'r2', 'new']) { const o = T[t].get(k); console.log('   ', t.padEnd(4), o ? fl.map(f => `${f}=${JSON.stringify(o[f])}`).join(' ') : '(missing)'); }
}
