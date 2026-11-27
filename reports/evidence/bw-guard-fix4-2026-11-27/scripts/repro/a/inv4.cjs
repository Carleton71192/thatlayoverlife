'use strict';
/* check-repro (fix4) I1 to I3: the cap invariant under load. N wf-get processes at once share one tally near a day cap, on a mix
   of URLs (small and large files, Content-Length and chunked, 20 KB, 60 KB and 100 KB of headers, an endless stream). A monitor
   reads the tally file every 2 ms and records the largest (counted bytes of all runs + open reservations of all runs).
   Delivered bytes are measured at a relay in its own process. Run: node -r ./dnsmap.cjs inv4.cjs <tools parent>. All on 127.0.0.1. */
const fs = require('fs'), os = require('os'), path = require('path'), http = require('http'), { spawn } = require('child_process');
const T = process.argv[2]; const { relay } = require('./relayfile.cjs');
const tmp = () => fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'wfi-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const hits = [];
  const srv = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://x'); hits.push(u.pathname); const kb = +(u.searchParams.get('kb') || 100), hk = +(u.searchParams.get('hk') || 0);
    const h = { 'content-type': 'application/javascript' }; for (let i = 0; i < hk; i++) h['x-pad-' + i] = 'p'.repeat(1000);
    const c = Buffer.alloc(64000, 32);
    if (u.pathname.startsWith('/len')) { h['content-length'] = kb * 1000; res.writeHead(200, h); let left = kb * 1000; const go = () => { while (left > 0) { const k = Math.min(c.length, left); left -= k; if (!res.write(c.subarray(0, k))) return res.once('drain', go); } res.end(); }; res.on('close', () => { left = 0; }); return go(); }
    res.writeHead(200, h); let left = u.pathname.startsWith('/endless') ? Infinity : kb * 1000;
    const go = () => { while (left > 0) { const k = Math.min(c.length, left); left -= k; if (!res.write(c.subarray(0, k))) return res.once('drain', go); } res.end(); }; res.on('close', () => { left = 0; }); go();
  });
  await new Promise(r => srv.listen(0, '127.0.0.1', r)); const R = await relay(srv.address().port); const CDN = `http://cdn.prod.website-files.com:${R.port}`;
  const mix = i => [`${CDN}/len/a${i}.js?kb=150`, `${CDN}/len/b${i}.js?kb=900&hk=60`, `${CDN}/chunk/c${i}.js?kb=700`, `${CDN}/len/d${i}.js?kb=400&hk=20`, `${CDN}/len/e${i}.js?kb=3000`,
    `${CDN}/len/f${i}.js?kb=200&hk=100`, `${CDN}/endless/g${i}.js`, `${CDN}/len/h${i}.js?kb=330`, `${CDN}/chunk/k${i}.js?kb=2500`, `${CDN}/len/m${i}.js?kb=50`];
  const day = new Date().toISOString().slice(0, 10);
  for (const [name, n, dayCapMB, maxFileMB] of [['I1 10 processes, day cap 3 MB, max-filesize 1', 10, 3, 1], ['I2 20 processes, day cap 5 MB, max-filesize 2', 20, 5, 2], ['I3 6 processes, day cap 1.2 MB, max-filesize 1', 6, 1.2, 1]]) {
    const sd = tmp(), logf = path.join(tmp(), 'log.md'); fs.writeFileSync(logf, '# log\n');
    const tf = path.join(sd, `tally-${day}.json`); let maxSum = 0, maxAt = null, samples = 0, stop = false, maxRunOver = 0;
    const mon = (async () => { while (!stop) { try { const t = JSON.parse(fs.readFileSync(tf, 'utf8')); let s = 0; for (const r of Object.values(t.runs || {})) s += (+r.bytes || 0) + (r.closed ? 0 : (+r.reserved || 0)); samples++; if (s > maxSum) { maxSum = s; maxAt = samples; } } catch (e) { } await sleep(2); } })();
    const m = R.mark(), h0 = hits.length;
    const kids = await Promise.all(Array.from({ length: n }, (_, i) => new Promise(ok => {
      const c = spawn(process.execPath, ['-r', path.join(__dirname, 'dnsmap.cjs'), path.join(__dirname, 'wfget-child.cjs'), T, JSON.stringify({ label: 'inv4', stateDir: sd, logFile: logf, readLogs: [logf], out: tmp(), dayCapMB, maxFileMB, max: 30 }), ...mix(`${name.slice(0, 2)}-${i}`)], { env: process.env });
      let o = ''; c.stdout.on('data', d => o += d); c.stderr.on('data', d => o += d); c.on('exit', () => { try { ok(JSON.parse(o.trim().split('\n').pop())); } catch (e) { ok({ raw: o.slice(0, 200) }); } });
    })));
    await sleep(500); stop = true; await mon;
    let tally = 0; try { const t = JSON.parse(fs.readFileSync(tf, 'utf8')); for (const r of Object.values(t.runs)) tally += +r.bytes || 0; } catch (e) { }
    console.log(name, JSON.stringify({ capBytes: dayCapMB * 1e6, maxCountedPlusReserved: maxSum, overCap: maxSum > dayCapMB * 1e6, samples, finalTally: tally, stubRequests: hits.length - h0, deliveredAtRelay: R.since(m), gets: kids.reduce((s, k) => s + (k.gets || 0), 0), stopped: kids.filter(k => k.stopped).length, refusedAtStart: kids.filter(k => k.refusedAtStart).length }));
  }
  srv.close(); R.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
