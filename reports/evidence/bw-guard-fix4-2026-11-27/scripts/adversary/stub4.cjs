'use strict';
/* stub4: local stubs on 127.0.0.1 for this check. "wf" plays the Webflow host names, "other" any other host.
   Each request is recorded as { method, host, path, range, wrote } (wrote: socket bytes written for it).
   Routes on both (query ?kb= sets the size in KB, ?ct= the content type):
   /big/<x>    Range honored (206 with "bytes a-b/total"), else 200; Content-Length always
   /star/<x>   Range honored, but the 206 says "bytes a-b/*" (total unknown, allowed by RFC 9110)
   /hdr/<x>    200 with ?hk= KB of extra response headers (X-Pad-N lines) and a ?kb= body
   /kb/<x>     200, Range ignored
   /sniff/<k>  application/octet-stream, Range honored, 3 MB whose first bytes are an MP4 (mp4), WebM (webm), AVI (avi),
               MPEG-TS (ts), Ogg (ogg) or FLV (flv) header, or text with "free" at offset 4 (text)
   /pages      HTML pages set by the caller in pages[path]
   Nothing here talks to the internet. */
const http = require('http');
function mk(name, pages) {
  const hits = [];
  const server = http.createServer((req, res) => {
    const host = (req.headers.host || '').toLowerCase().replace(/:\d+$/, '');
    const u = new URL(req.url, 'http://x'); const p = u.pathname;
    const rec = { server: name, method: req.method, host, path: req.url, range: req.headers.range || null, wrote: 0 };
    hits.push(rec);
    const sock = req.socket, w0 = sock.bytesWritten;
    res.on('close', () => { rec.wrote = sock.bytesWritten - w0; });
    const kb = +(u.searchParams.get('kb') || 3000), ct = u.searchParams.get('ct') || 'application/json';
    const full = () => { const b = Buffer.alloc(kb * 1000); for (let i = 0; i < b.length; i++) b[i] = 97 + (i * 7) % 26; return b; };
    const send = (code, type, body, extra) => { res.writeHead(code, Object.assign({ 'content-type': type, 'access-control-allow-origin': '*', 'content-length': body.length }, extra || {})); res.end(body); };
    if (req.method !== 'GET') return send(405, 'text/plain', Buffer.from('no'));
    if (pages[p]) return send(200, 'text/html', Buffer.from(pages[p](host)));
    if (p.startsWith('/big/') || p.startsWith('/star/')) {
      const f = full(); const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
      if (m) { const a = m[1] === '' ? f.length - +m[2] : +m[1], b = m[1] === '' ? f.length - 1 : (m[2] ? Math.min(+m[2], f.length - 1) : f.length - 1);
        return send(206, ct, f.subarray(a, b + 1), { 'content-range': `bytes ${a}-${b}/${p.startsWith('/star/') ? '*' : f.length}`, 'accept-ranges': 'bytes' }); }
      return send(200, ct, f, { 'accept-ranges': 'bytes' });
    }
    if (p.startsWith('/hdr/')) {
      const extra = {}; const hk = +(u.searchParams.get('hk') || 40);
      for (let i = 0; i < hk; i++) extra['x-pad-' + i] = 'p'.repeat(1000);
      return send(200, ct, full(), extra);
    }
    if (p.startsWith('/kb/')) return send(200, ct, full());
    if (p.startsWith('/sniff/')) {
      const k = p.split('/')[2], f = full();
      const head = { mp4: Buffer.from('000000186674797069736f6d', 'hex'), webm: Buffer.from('1a45dfa3', 'hex'), avi: Buffer.from('RIFF\x00\x00\x00\x00AVI ', 'latin1'), ts: Buffer.from([0x47, 0x40, 0x00, 0x10]), ogg: Buffer.from('OggS'), flv: Buffer.from('FLV\x01'), text: Buffer.from('abcdfree text, not a video') }[k] || Buffer.alloc(0);
      head.copy(f, 0);
      const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
      if (m) { const a = +m[1] || 0, b = m[2] ? Math.min(+m[2], f.length - 1) : f.length - 1; return send(206, 'application/octet-stream', f.subarray(a, b + 1), { 'content-range': `bytes ${a}-${b}/${f.length}` }); }
      return send(200, 'application/octet-stream', f);
    }
    send(404, 'text/plain', Buffer.from('no'));
  });
  return new Promise(r => server.listen(0, '127.0.0.1', () => r({ server, port: server.address().port, hits })));
}
async function start(pages) {
  const wf = await mk('wf', pages), other = await mk('other', pages);
  return { wf, other, close: () => { for (const s of [wf, other]) { s.server.close(); s.server.closeAllConnections && s.server.closeAllConnections(); } } };
}
module.exports = { start };
