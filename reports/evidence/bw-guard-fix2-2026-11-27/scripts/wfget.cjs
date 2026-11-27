'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), zlib = require('zlib');
const G = require(process.argv[2] + '/tools/wf-get.cjs'), W = require(process.argv[2] + '/tools/wf-guard.cjs');
const { start, count } = require('./stub.cjs');
const note = (k, v) => console.log(k, JSON.stringify(v));
(async () => {
  const { server, port, hits } = await start({});
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wfgget-'));
  const curl = path.join(dir, 'curl-local.sh');
  // every connection curl makes goes to the local stub; no proxy
  fs.writeFileSync(curl, `#!/bin/sh\nexec curl --noproxy '*' --connect-to ::127.0.0.1:${port} "$@"\n`); fs.chmodSync(curl, 0o755);
  const o = x => Object.assign({ label: 'wfget-check', out: path.join(dir, 'out'), logFile: path.join(dir, 'log.md'), stateDir: path.join(dir, 'state'), curl, quiet: true }, x);
  const sentOf = p => hits.filter(h => h.path === p).reduce((s, h) => s + h.sent, 0);
  let r = await G.wfGet(['http://www.thatlayover.life/gz.html'], o());
  const z = zlib.gzipSync(Buffer.from('<p>' + 'compress me '.repeat(20000) + '</p>'));
  note('W1 gzip page: counted bytes vs compressed body vs decoded body', { counted: r.bytes, compressedBody: z.length, decoded: zlib.gunzipSync(z).length, savedFile: fs.statSync(r.results[0].file).size });
  r = await G.wfGet(['http://other.example/r?to=' + encodeURIComponent('http://www.thatlayover.life/kb300.js')], o());
  note('W2 non-Webflow URL redirecting to a 300 KB Webflow file', { counted: r.bytes, stubSent: sentOf('/kb300.js') });
  r = await G.wfGet(['http://www.thatlayover.life/r?to=' + encodeURIComponent('http://cdn.prod.website-files.com/w3.png')], o());
  note('W3 Webflow URL redirecting to a Webflow image', { result: r.results[0].status, imageFetched: count(hits, h => h.path === '/w3.png') });
  r = await G.wfGet(['http://cdn.prod.website-files.com/noext-img-w'], o());
  note('W4 Webflow image URL with no extension', { status: r.results[0].status, fetched: count(hits, h => h.path === '/noext-img-w') });
  r = await G.wfGet(['http://cdn.prod.website-files.com/doc.pdf', 'http://www.thatlayover.life/kb100.js'], o({ runCapMB: 1, logFile: path.join(dir, 'log2.md') }));
  note('W5 run cap 1 MB, first URL is a 3 MB file', { counted: r.bytes, gets: r.gets, stopped: r.stopped && r.stopped.message, secondFetched: count(hits, h => h.path === '/kb100.js') });
  r = await G.wfGet(['http://WWW.THATLAYOVER.LIFE./kb50.js', 'http://cdn.thatlayover.life/kb60.js'], o());
  note('W6 trailing dot host and other subdomain: counted', { counted: r.bytes, stubSent: sentOf('/kb50.js') + sentOf('/kb60.js') });
  r = await G.wfGet(['http://www.thatlayover.life/r?to=' + encodeURIComponent('http://www.thatlayover.life/kb200.js')], o());
  note('W7 Webflow redirect chain: counted vs sent', { counted: r.bytes, stubSent: sentOf('/kb200.js') });
  note('W8 files written', fs.readdirSync(path.join(dir, 'out')));
  note('W9 log lines', fs.readFileSync(path.join(dir, 'log.md'), 'utf8').trim().split('\n').map(l => l.slice(0, 140)));
  note('W10 non-GET requests seen by the stub', hits.filter(h => h.method !== 'GET').length);
  // W11 default output folder, run from another folder
  process.chdir(os.tmpdir());
  r = await G.wfGet(['http://www.thatlayover.life/kb1.js'], { label: 'w11 default/out', logFile: path.join(dir, 'log3.md'), stateDir: path.join(dir, 'state'), curl, quiet: true });
  note('W11 default out folder (cwd is ' + process.cwd() + ')', { out: r.out, file: r.results[0].file });
  // W12 default --max: 35 URLs
  const n0 = hits.length;
  r = await G.wfGet(Array.from({ length: 35 }, (_, i) => 'http://www.thatlayover.life/kb1.js?i=' + i), o({ logFile: path.join(dir, 'log4.md') }));
  note('W12 35 URLs with the default --max', { gets: r.gets, stubRequests: hits.length - n0, stopped: r.stopped && r.stopped.message });
  // W13 --cache stores the page in the cache layout
  const cdir = path.join(dir, 'cache');
  r = await G.wfGet(['http://www.thatlayover.life/kb2.js'], o({ cache: cdir }));
  note('W13 --cache', { files: fs.readdirSync(cdir), hit: !!W.makeCache(cdir).get('http://www.thatlayover.life/kb2.js') });
  // W14 a 6 MB Webflow file with the default --max-filesize (5 MB), and a redirect to a .mp4
  const n1 = hits.length;
  r = await G.wfGet(['http://www.thatlayover.life/kb6000.js', 'http://www.thatlayover.life/r?to=' + encodeURIComponent('http://cdn.prod.website-files.com/v.mp4')], o({ logFile: path.join(dir, 'log5.md') }));
  note('W14 6 MB file (default 5 MB limit), redirect to .mp4', { results: r.results.map(x => x.error || x.status), counted: r.bytes, stubSent: hits.slice(n1).map(h => h.path + ' ' + h.sent) });
  server.close();
})();
