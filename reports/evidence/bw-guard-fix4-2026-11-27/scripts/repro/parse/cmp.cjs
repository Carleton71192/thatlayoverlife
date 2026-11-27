/* parser comparison: day totals 1 to 30 Nov for every log file, old (686e520), r3 (66c0034) and new (49889e7) */
const fs = require('fs'), path = require('path'); const X = process.argv[2];
const mods = { old: require(X + '/old/tools/wf-guard.cjs'), r3: require(X + '/r3/tools/wf-guard.cjs'), new: require(X + '/new/tools/wf-guard.cjs') };
let cells = 0, diff = 0, err = 0; const dir = X + '/parse/logs';
for (const f of fs.readdirSync(dir).sort()) {
  const t = fs.readFileSync(path.join(dir, f), 'utf8'); const row = {};
  for (let d = 1; d <= 30; d++) {
    const day = new Date(Date.UTC(2026, 10, d, 12)); const v = {};
    for (const k in mods) { try { v[k] = +mods[k].dailyTotalMB(t, day).toFixed(4); } catch (e) { v[k] = 'ERR ' + e.message.slice(0, 160); } }
    if (String(v.new).startsWith('ERR')) err++;
    if (v.new !== v.old || v.new !== v.r3) { diff++; console.log('DIFF', f, d, JSON.stringify(v)); }
    if (v.new !== 0) cells++; if (/zxm|main|plus/.test(f) && v.new) row[d] = v.new;
  }
  if (Object.keys(row).length) console.log(f, JSON.stringify(row));
}
console.log('files', fs.readdirSync(dir).length, 'nonzero new cells', cells, 'cells differing', diff, 'new errors', err);
