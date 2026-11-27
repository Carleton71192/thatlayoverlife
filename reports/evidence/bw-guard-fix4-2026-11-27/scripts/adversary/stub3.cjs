'use strict';
/* stub3: stub2 of the 27 Nov check plus routes for this check (marked ADV). Two local stubs on 127.0.0.1. Webflow URLs in the probes use the port of the "wf" stub, every other host uses the "other"
   stub, so any TCP connection to the wf stub is contact with a Webflow host name (Chromium maps every name to 127.0.0.1).
   Each request is recorded as { method, host, path, range, sent, wrote } where wrote is socket.bytesWritten when it closed.
   Nothing here talks to the internet. */
const http = require('http');
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');

function mk(name, pages) {
  const hits = [], conns = [];
  const failed = new Set();
  const server = http.createServer((req, res) => {
    const host = (req.headers.host || '').toLowerCase().replace(/:\d+$/, '');
    const u = new URL(req.url, 'http://x'); const p = u.pathname;
    const rec = { server: name, method: req.method, host, path: p + (u.search || ''), range: req.headers.range || null, sent: 0, t: Date.now() };
    hits.push(rec);
    const sock = req.socket, w0 = sock.bytesWritten;
    res.on('close', () => { rec.wrote = sock.bytesWritten - w0; });
    const send = (code, type, body, extra) => {
      res.writeHead(code, Object.assign({ 'content-type': type, 'access-control-allow-origin': '*', 'content-length': body.length }, extra || {}));
      rec.sent += body.length; res.end(body);
    };
    if (req.method === 'OPTIONS') return send(204, 'text/plain', Buffer.alloc(0), { 'access-control-allow-methods': '*', 'access-control-allow-headers': '*' });
    if (req.method !== 'GET') { req.on('data', () => { }); return req.on('end', () => send(200, 'text/plain', Buffer.from('got ' + req.method))); }
    /* ADV: /ign/<x>: ignores Range, 200 with Content-Length 3 MB; /ignc/<x>: ignores Range, chunked 3 MB; ?ct= sets the type */
    if (p.startsWith('/ign/') || p.startsWith('/ignc/')) {
      const ct = u.searchParams.get('ct') || (/\.mp4$/.test(p) ? 'video/mp4' : 'application/javascript'); const n = +(u.searchParams.get('kb') || 3000) * 1000;
      if (p.startsWith('/ign/')) return send(200, ct, Buffer.alloc(n, 5));
      res.writeHead(200, { 'content-type': ct, 'access-control-allow-origin': '*' });
      let left = n; const chunk = Buffer.alloc(64000, 5);
      const go = () => { while (left > 0) { const c = chunk.subarray(0, Math.min(chunk.length, left)); left -= c.length; rec.sent += c.length; if (!res.write(c)) return res.once('drain', go); } res.end(); };
      res.on('close', () => { left = 0; }); return go();
    }
    /* ADV: /octet/<x>: an extensionless 3 MB video sent as application/octet-stream (or ?ct=), Range honored */
    if (p.startsWith('/octet/')) {
      const full = Buffer.alloc(+(u.searchParams.get('kb') || 3000) * 1000, 9), ct = u.searchParams.get('ct') || 'application/octet-stream';
      const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
      if (m) { const a = m[1] === '' ? full.length - +m[2] : +m[1], b = m[1] === '' ? full.length - 1 : (m[2] ? Math.min(+m[2], full.length - 1) : full.length - 1);
        return send(206, ct, full.subarray(a, b + 1), { 'content-range': `bytes ${a}-${b}/${full.length}`, 'accept-ranges': 'bytes' }); }
      return send(200, ct, full);
    }
    /* ADV: /loop/start?raw=<target> -> 302 to the raw target; any other /loop/ path with %7C or %5E in it -> 301 to the same
       path with "|" or "^" (a canonicalizing server), query kept; the raw form -> 200 page (?kb= adds size) */
    if (p.startsWith('/loop/')) {
      if (p === '/loop/start') { res.writeHead(302, { location: u.searchParams.get('raw') || '/loop/t|x', 'content-length': 0 }); return res.end(); }
      const [rp, rq] = req.url.split('?'); const canon = rp.replace(/%7C/gi, '|').replace(/%5E/gi, '^');
      if (canon !== rp) { res.writeHead(301, { location: canon + (rq != null ? '?' + rq : ''), 'content-length': 0 }); return res.end(); }
      return send(200, 'text/html', Buffer.from('<p>loop target</p><script>window.__loc = location.href</script>' + ' '.repeat(+(u.searchParams.get('kb') || 0) * 1000)));
    }
    if (p === '/r') { res.writeHead(+(u.searchParams.get('code') || 302), { location: u.searchParams.get('to'), 'access-control-allow-origin': '*', 'content-length': 0 }); return res.end(); }
    if (pages[p]) return send(200, 'text/html', Buffer.from(pages[p](host)));
    if (p.startsWith('/fail')) { if (!failed.has(host + p) || p.startsWith('/failalways')) { failed.add(host + p); return req.socket.destroy(); } }
    if (p.startsWith('/slow')) return setTimeout(() => send(200, /\.js$/.test(p) ? 'application/javascript' : 'image/png', PNG), +(u.searchParams.get('ms') || 700));
    if (/\.(png|jpe?g|webp|avif|ico|gif|svg)$/i.test(p) || p.startsWith('/noext-img')) return send(200, 'image/png', PNG);
    if (/\.woff2?$/.test(p)) return send(200, 'font/woff2', Buffer.alloc(2000));
    if (/\.(mp4|webm)$/.test(p) || p.startsWith('/noext-video')) {
      const full = Buffer.alloc(3000000, 7);
      const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
      if (m) {
        let a, b; if (m[1] === '') { a = full.length - +m[2]; b = full.length - 1; } else { a = +m[1]; b = m[2] ? Math.min(+m[2], full.length - 1) : full.length - 1; }
        return send(206, 'video/mp4', full.subarray(a, b + 1), { 'content-range': `bytes ${a}-${b}/${full.length}`, 'accept-ranges': 'bytes' });
      }
      return send(200, 'video/mp4', full, { 'accept-ranges': 'bytes' });
    }
    if (p.startsWith('/kb')) { const n = +p.slice(3).split('.')[0] * 1000; return send(200, 'application/javascript', Buffer.alloc(n, 32)); }
    if (p.startsWith('/chunked')) {
      const n = +(u.searchParams.get('kb') || 3000) * 1000; res.writeHead(200, { 'content-type': 'application/javascript' });
      let left = n; const chunk = Buffer.alloc(64000, 32);
      const go = () => { while (left > 0) { const c = chunk.subarray(0, Math.min(chunk.length, left)); left -= c.length; rec.sent += c.length; if (!res.write(c)) return res.once('drain', go); } res.end(); };
      res.on('close', () => { left = 0; }); return go();
    }
    if (p === '/sse') { res.writeHead(200, { 'content-type': 'text/event-stream', 'access-control-allow-origin': '*' }); res.write('data: hi\n\n'); return; }
    if (p.endsWith('.css')) return send(200, 'text/css', Buffer.from('body{color:red}'));
    if (p.endsWith('.js')) return send(200, 'application/javascript', Buffer.from('/*js*/'));
    if (p.endsWith('.json') || p.endsWith('.webmanifest')) return send(200, 'application/json', Buffer.from('{}'));
    if (p.endsWith('.html')) return send(200, 'text/html', Buffer.from('<p>page ' + p + '</p>'));
    send(404, 'text/plain', Buffer.from('no'));
  });
  server.on('connection', s => { conns.push({ t: Date.now() }); });
  server.on('upgrade', (req, sock) => { hits.push({ server: name, method: 'UPGRADE', host: req.headers.host, path: req.url, sent: 0 }); sock.destroy(); });
  return new Promise(r => server.listen(0, '127.0.0.1', () => r({ server, port: server.address().port, hits, conns })));
}

async function start(pages) {
  const wf = await mk('wf', pages), other = await mk('other', pages);
  return { wf, other, close: () => { wf.server.close(); other.server.close(); wf.server.closeAllConnections && wf.server.closeAllConnections(); other.server.closeAllConnections && other.server.closeAllConnections(); } };
}
module.exports = { start, PNG };
