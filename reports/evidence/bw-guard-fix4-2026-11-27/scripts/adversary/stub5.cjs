'use strict';
/* stub5: a raw TCP HTTP/1.1 stub on 127.0.0.1 for the header edge cases of round 4. Each request is answered and the
   connection closed. Query: kb (body KB, default 100), hk (KB of extra headers in 1000 B lines), hb (one header line of
   this many bytes), ct (content type), tk (KB of trailers), ehk (KB of Link headers in a 103 Early Hints first).
   Paths:
   /h/<x>      200 with Content-Length, hk/hb extra headers
   /chunk/<x>  200 chunked (no length), hk/hb extra headers, tk KB of trailers after the body
   /gz/<x>     200 gzip, chunked, hk/hb extra headers (body: kb KB of random bytes, so gzip does not shrink it)
   /eh/<x>     103 Early Hints with ehk KB of Link headers, then the /h answer
   /inject/<x> 200 whose first extra header line starts with the guard's -w marker text ("@@wf-guard@@ x: 200 0 0 0"), then hk KB
   /slow/<x>   headers trickled in 1000 B lines every 5 ms (hk KB), then the body
   Records { path, wrote } per request (socket bytes written). Nothing here talks to the internet. */
const net = require('net'), zlib = require('zlib'), crypto = require('crypto');
function start() {
  const hits = [];
  const srv = net.createServer(sock => {
    let buf = '';
    sock.on('error', () => { });
    sock.on('data', d => {
      buf += d.toString('latin1'); const i = buf.indexOf('\r\n\r\n'); if (i < 0) return;
      const line = buf.slice(0, buf.indexOf('\r\n')); const [, p0] = line.split(' ');
      const u = new URL(p0, 'http://x'), p = u.pathname, q = k => u.searchParams.get(k);
      const rec = { path: p0, wrote: 0 }; hits.push(rec);
      const w = b => { if (!sock.destroyed) { sock.write(b, 'latin1'); rec.wrote += Buffer.byteLength(b, 'latin1'); } };
      const kb = +(q('kb') || 100), hk = +(q('hk') || 0), hb = +(q('hb') || 0), tk = +(q('tk') || 0), ehk = +(q('ehk') || 0);
      const ct = q('ct') || 'application/javascript';
      const pad = () => { let s = ''; for (let j = 0; j < hk; j++) s += `X-Pad-${j}: ${'p'.repeat(1000 - 12 - String(j).length)}\r\n`; if (hb) s += `X-Big: ${'q'.repeat(Math.max(0, hb - 9))}\r\n`; return s; };
      const body = Buffer.alloc(kb * 1000, 97);
      if (p.startsWith('/eh/')) { let s = 'HTTP/1.1 103 Early Hints\r\n'; for (let j = 0; j < ehk; j++) s += `Link: </x${j}.css>; rel=preload; as=style; x=${'l'.repeat(950)}\r\n`; w(s + '\r\n'); }
      if (p.startsWith('/h/') || p.startsWith('/eh/') || p.startsWith('/inject/')) {
        let s = `HTTP/1.1 200 OK\r\nContent-Type: ${ct}\r\nContent-Length: ${body.length}\r\nConnection: close\r\n`;
        if (p.startsWith('/inject/')) s += '@@wf-guard@@ x: 200 0 0 0\r\n';
        w(s + pad() + '\r\n'); w(body.toString('latin1')); return sock.end();
      }
      if (p.startsWith('/chunk/')) {
        let s = `HTTP/1.1 200 OK\r\nContent-Type: ${ct}\r\nTransfer-Encoding: chunked\r\nConnection: close\r\n${tk ? 'Trailer: X-T\r\n' : ''}`;
        w(s + pad() + '\r\n');
        for (let o = 0; o < body.length; o += 16000) { const c = body.subarray(o, o + 16000); w(c.length.toString(16) + '\r\n' + c.toString('latin1') + '\r\n'); }
        let t = '0\r\n'; for (let j = 0; j < tk; j++) t += `X-T: ${'t'.repeat(990)}\r\n`; w(t + '\r\n'); return sock.end();
      }
      if (p.startsWith('/gz/')) {
        const z = zlib.gzipSync(crypto.randomBytes(kb * 1000));
        w(`HTTP/1.1 200 OK\r\nContent-Type: ${ct}\r\nContent-Encoding: gzip\r\nTransfer-Encoding: chunked\r\nConnection: close\r\n` + pad() + '\r\n');
        for (let o = 0; o < z.length; o += 16000) { const c = z.subarray(o, o + 16000); w(c.length.toString(16) + '\r\n' + c.toString('latin1') + '\r\n'); }
        w('0\r\n\r\n'); return sock.end();
      }
      if (p.startsWith('/slow/')) {
        w(`HTTP/1.1 200 OK\r\nContent-Type: ${ct}\r\nContent-Length: ${body.length}\r\nConnection: close\r\n`);
        let j = 0; const tick = () => { if (sock.destroyed) return; if (j < hk) { w(`X-Pad-${j}: ${'p'.repeat(1000 - 12 - String(j).length)}\r\n`); j++; return setTimeout(tick, 5); } w('\r\n'); w(body.toString('latin1')); sock.end(); };
        return tick();
      }
      w('HTTP/1.1 404 Not Found\r\nContent-Length: 2\r\nConnection: close\r\n\r\nno'); sock.end();
    });
  });
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r({ port: srv.address().port, hits, close: () => srv.close() })));
}
module.exports = { start };
