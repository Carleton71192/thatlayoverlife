/* ext4 old vs new: per case, same requests (path + forwarded headers)? same curl arguments? delivered and counted, page result */
const fs = require('fs'); const [fo, fn] = process.argv.slice(2);
const rd = f => { const m = new Map(); for (const l of fs.readFileSync(f, 'utf8').split('\n')) { const i = l.indexOf(' {'); if (i < 0) continue; try { m.set(l.slice(0, i), JSON.parse(l.slice(i + 1))); } catch (e) { } } return m; };
const O = rd(fo), N = rd(fn); let sameReq = 0, sameCurl = 0, n = 0, more = 0;
/* the wrapper logs the new -w value (it starts with a newline) on two lines; join them, then drop the two known differences */
const strip = a => [a.join(' ').replace(/-D <tmp>|-D -/g, '-D X').replace(/-w\s+@@wf-guard@@ /g, '-w ').replace(/\s+/g, ' ')];
for (const [k, o] of O) { const v = N.get(k); if (!v) { console.log('missing in new', k); continue; } n++;
  const rq = JSON.stringify(o.requests) === JSON.stringify(v.requests); if (rq) sameReq++;
  const ca = JSON.stringify(strip(o.curl)) === JSON.stringify(strip(v.curl)); if (ca) sameCurl++;
  const d = v.deliveredAtRelay - o.deliveredAtRelay; if (d > 1024) more++;
  console.log(`${k}\n   page ${JSON.stringify(o.page)} / ${JSON.stringify(v.page)}; requests ${o.requests.length}/${v.requests.length} ${rq ? 'same' : 'DIFFER'}; curl args ${ca ? 'same but -D' : 'DIFFER'}; delivered ${o.deliveredAtRelay}/${v.deliveredAtRelay} (${d >= 0 ? '+' : ''}${d}); counted ${o.counted}/${v.counted}${d > 1024 ? '  MORE' : ''}`);
  if (!ca) console.log('     old curl', JSON.stringify(o.curl).slice(0, 400), '\n     new curl', JSON.stringify(v.curl).slice(0, 400));
  if (!rq) console.log('     old req', JSON.stringify(o.requests).slice(0, 300), '\n     new req', JSON.stringify(v.requests).slice(0, 300)); }
console.log(`cases ${n}, same requests ${sameReq}, same curl arguments apart from the header output ${sameCurl}, new delivered > old + 1 KB: ${more}`);
