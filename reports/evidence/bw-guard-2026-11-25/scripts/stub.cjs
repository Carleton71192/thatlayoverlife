'use strict';
/* Local stub that answers for every host name (Chromium maps every host to 127.0.0.1). Records each request as
   "METHOD host path" with the bytes it sent. Nothing here talks to the internet. */
const http = require('http');
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');

function start(pages) {
  const hits = [];
  let failOnce = new Set();
  const server = http.createServer((req, res) => {
    const host = (req.headers.host || '').toLowerCase();
    const u = new URL(req.url, 'http://x');
    const p = u.pathname;
    const rec = { method: req.method, host, path: p, range: req.headers.range || null, sent: 0 };
    hits.push(rec);
    const send = (code, type, body, extra) => {
      res.writeHead(code, Object.assign({ 'content-type': type, 'access-control-allow-origin': '*', 'content-length': body.length }, extra || {}));
      rec.sent += body.length; res.end(body);
    };
    if (req.method === 'OPTIONS') return send(204, 'text/plain', Buffer.alloc(0), { 'access-control-allow-methods': '*', 'access-control-allow-headers': '*' });
    if (req.method !== 'GET') { let n = 0; req.on('data', d => n += d.length); return req.on('end', () => send(200, 'text/plain', Buffer.from('got ' + req.method))); }
    if (p === '/r') { res.writeHead(302, { location: u.searchParams.get('to'), 'access-control-allow-origin': '*' }); return res.end(); }
    if (pages[p]) return send(200, 'text/html', Buffer.from(pages[p](host)));
    if (p.startsWith('/fail-') && !failOnce.has(host + p)) { failOnce.add(host + p); return req.socket.destroy(); }
    if (p.startsWith('/slow-')) return setTimeout(() => send(200, 'image/png', PNG), 700);
    if (/\.(png|jpe?g|webp|avif)$/i.test(p) || p.startsWith('/noext-img')) return send(200, 'image/png', PNG);
    if (/\.woff2$/.test(p)) return send(200, 'font/woff2', Buffer.alloc(2000));
    if (p === '/sw.js') return send(200, 'application/javascript', Buffer.from(pages.__sw(host)), { 'service-worker-allowed': '/' });
    if (/\.mp4$/.test(p) || p.startsWith('/noext-video')) {
      const full = Buffer.alloc(2000000, 7);
      const m = /bytes=(\d+)-(\d*)/.exec(req.headers.range || '');
      if (m) {
        const a = +m[1], b = m[2] ? Math.min(+m[2], full.length - 1) : Math.min(a + 499999, full.length - 1);
        const part = full.subarray(a, b + 1);
        return send(206, 'video/mp4', part, { 'content-range': `bytes ${a}-${b}/${full.length}`, 'accept-ranges': 'bytes' });
      }
      return send(200, 'video/mp4', full, { 'accept-ranges': 'bytes' });
    }
    if (p.startsWith('/kb')) { const n = +p.slice(3).split('.')[0] * 1000; return send(200, 'application/javascript', Buffer.alloc(n, 32)); }
    if (p === '/stream') {
      res.writeHead(200, { 'content-type': 'application/javascript', 'access-control-allow-origin': '*' });
      const chunk = Buffer.alloc(64000, 32);
      const t = setInterval(() => { if (res.destroyed) return clearInterval(t); res.write(chunk); rec.sent += chunk.length; }, 50);
      res.on('close', () => clearInterval(t));
      return;
    }
    if (p === '/gz.html') {
      const zlib = require('zlib'); const z = zlib.gzipSync(Buffer.from('<p>' + 'compress me '.repeat(20000) + '</p>'));
      return send(200, 'text/html', z, { 'content-encoding': 'gzip' });
    }
    if (p.endsWith('.js')) return send(200, 'application/javascript', Buffer.from('/*js*/'));
    if (p.endsWith('.pdf')) return send(200, 'application/pdf', Buffer.alloc(3000000, 1));
    send(404, 'text/plain', Buffer.from('no'));
  });
  return new Promise(r => server.listen(0, '127.0.0.1', () => r({ server, port: server.address().port, hits })));
}

const count = (hits, f) => hits.filter(f).length;
const sent = (hits, f) => hits.filter(f).reduce((s, h) => s + h.sent, 0);
module.exports = { start, count, sent, PNG };
