'use strict';
/* N2-N7 wording and counting through wf-get: a 3 MB file at a 0.5 MB run cap, a 3 MB file twice at --max-filesize 1,
   a chunked 3 MB stream at a 0.5 MB run cap. Run: node -r ./dnsmap.cjs words.cjs <tools parent> */
const fs = require('fs'), os = require('os'), path = require('path');
const G = require(process.argv[2] + '/tools/wf-get.cjs');
const { start } = require('./stub3.cjs');
const tmp = () => fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'wfw-'));
(async () => {
  const S = await start({}); const CDN = `http://cdn.prod.website-files.com:${S.wf.port}`;
  for (const [k, o, urls] of [
    ['W1 3 MB (Content-Length) at run cap 0.5 MB', { runCapMB: 0.5 }, [`${CDN}/ign/w1.js`]],
    ['W2 the same 3 MB URL twice at --max-filesize 1', { maxFileMB: 1 }, [`${CDN}/ign/w2.js`, `${CDN}/ign/w2.js`]],
    ['W3 chunked 3 MB at run cap 0.5 MB', { runCapMB: 0.5 }, [`${CDN}/chunked?kb=3000&w=3`]],
    ['W4 3 MB with a query string that changes, --max-filesize 1, 4 URLs', { maxFileMB: 1 }, [1, 2, 3, 4].map(i => `${CDN}/ign/w4.js?v=${i}`)],
  ]) {
    const h0 = S.wf.hits.length;
    const r = await G.wfGet(urls, Object.assign({ label: 'w', quiet: true, stateDir: tmp(), logFile: path.join(tmp(), 'log.md'), out: tmp() }, o));
    console.log(k, JSON.stringify({ stubRequests: S.wf.hits.length - h0, countedMB: +(r.bytes / 1e6).toFixed(3), results: r.results.map(x => `${x.status || 0} ${x.bytes || 0} ${x.error || ''}`), stopped: r.stopped && r.stopped.message, line: r.line }));
  }
  S.close();
})();
