'use strict';
/* check-repro (fix3): bytes delivered at a relay for a GET that curl refuses by its Content-Length (3 MB body, limit 2.98 MB),
   with the curlFetch of each tree, 10 times each, alternating. No browser. Run: node -r ../dnsmap.cjs refused.cjs <tree>... */
const http = require('http'); const { relay, total } = require('../relayline.cjs');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = Buffer.alloc(3e6, 5);
  const srv = http.createServer((q, s) => { s.writeHead(200, { 'content-type': 'application/javascript', 'content-length': b.length }); s.end(b); });
  await new Promise(r => srv.listen(0, '127.0.0.1', r)); const R = await relay(srv.address().port);
  const trees = process.argv.slice(2).map(t => [t.split('/').pop(), require(t + '/tools/wf-guard.cjs')]); const out = {};
  for (let i = 0; i < 10; i++) for (const [n, W] of trees) {
    await sleep(300); const t0 = total();
    const r = await W.curlFetch(`http://cdn.prod.website-files.com:${R.port}/x.js?i=${i}`, { maxBytes: 2983028, timeoutS: 10, headers: { range: 'bytes=0-1' } }).promise;
    await sleep(400); (out[n] = out[n] || []).push(`${r.exit}:${total() - t0}`);
  }
  for (const k in out) process.stdout.write(`refused-by-length ${k} [exit:delivered] ${JSON.stringify(out[k])}\n`);
  srv.close(); R.srv.close(); process.exit(0);
})();
