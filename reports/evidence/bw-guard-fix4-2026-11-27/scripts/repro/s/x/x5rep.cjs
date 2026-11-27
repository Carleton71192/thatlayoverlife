'use strict';
/* check-repro (fix3): X5 repeated. wf-get with a run cap of 0.5 MB on an endless stream and on a chunked 3 MB file, five times
   each per tree, bytes delivered at a relay (relayline.cjs). No browser. Run: node -r ../dnsmap.cjs x5rep.cjs <tree>... */
const fs = require('fs'), os = require('os'), path = require('path'), http = require('http');
const { relay, total } = require('../relayline.cjs');
const tmp = () => fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'wfx5-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const srv = http.createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'application/javascript' }); const c = Buffer.alloc(64000, 32); let left = req.url.startsWith('/endless') ? Infinity : 3e6;
    const go = () => { while (left > 0) { left -= c.length; if (!res.write(c)) return res.once('drain', go); } res.end(); }; res.on('close', () => { left = 0; }); go();
  });
  await new Promise(r => srv.listen(0, '127.0.0.1', r)); const R = await relay(srv.address().port);
  const CDN = `http://cdn.prod.website-files.com:${R.port}`;
  for (const t of process.argv.slice(2)) {
    const G = require(t + '/tools/wf-get.cjs'); const tag = path.basename(t);
    for (const kind of ['endless', 'chunked3MB']) {
      const rows = [];
      for (let i = 0; i < 5; i++) {
        await sleep(300); const t0 = total();
        const r = await G.wfGet([`${CDN}/${kind}.js?i=${i}&t=${tag}`], { label: 'x5', quiet: true, stateDir: tmp(), logFile: path.join(tmp(), 'log.md'), out: tmp(), runCapMB: 0.5 });
        await sleep(500); rows.push([r.bytes, total() - t0]);
      }
      process.stdout.write(`X5r ${tag} ${kind}, wf-get run cap 0.5 MB, 5 runs [counted, delivered]: ${JSON.stringify(rows)}\n`);
    }
  }
  srv.close(); R.srv.close(); process.exit(0);
})();
