/* side by side of two bytes.cjs outputs: node cmpb.cjs old.txt new.txt */
const fs = require('fs');
const rd = f => fs.readFileSync(f, 'utf8').split('\n').filter(l => /^B\d/.test(l)).map(l => { const i = l.indexOf(' {'); return [l.slice(0, i), JSON.parse(l.slice(i + 1))]; });
const a = rd(process.argv[2]), b = rd(process.argv[3]);
for (let i = 0; i < Math.max(a.length, b.length); i++) {
  const [k, x] = a[i] || ['', {}], [, y] = b[i] || ['', {}];
  console.log(`${k} | old: ${x.wfRequests && x.wfRequests.length} req, ${x.deliveredAtRelay} delivered, ${x.countedBytes} counted, ${String(x.page).slice(0, 30)} | new: ${y.wfRequests && y.wfRequests.length} req ${JSON.stringify(y.wfRequests)}, ${y.deliveredAtRelay} delivered, ${y.countedBytes} counted, ${String(y.page).slice(0, 30)}${y.deliveredAtRelay > x.deliveredAtRelay + 1024 ? '  NEW MORE' : ''}`);
}
