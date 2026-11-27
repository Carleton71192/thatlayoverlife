'use strict';
/* check-repro (fix3): the relay of relay.cjs in its own process, so a busy probe process cannot change what it counts.
   node relayproc.cjs <target port>: prints "<relay port> <control port>"; GET http://127.0.0.1:<control port>/ answers the
   bytes delivered per connection as JSON. Everything is on 127.0.0.1. */
const net = require('net'), http = require('http');
const conns = [];
const srv = net.createServer(c => {
  const rec = { delivered: 0 }; conns.push(rec);
  const up = net.connect(+process.argv[2], '127.0.0.1');
  c.on('data', d => up.write(d));
  up.on('data', d => { if (c.destroyed) return; c.write(d, () => { }); rec.delivered += d.length; if (c.writableLength > 0) { up.pause(); c.once('drain', () => up.resume()); } });
  const end = () => { c.destroy(); up.destroy(); };
  c.on('close', end); up.on('close', end); c.on('error', end); up.on('error', end);
});
const ctl = http.createServer((q, s) => { s.end(JSON.stringify(conns.map(x => x.delivered))); });
srv.listen(0, '127.0.0.1', () => ctl.listen(0, '127.0.0.1', () => console.log(srv.address().port + ' ' + ctl.address().port)));
process.on('disconnect', () => process.exit(0)); setTimeout(() => process.exit(0), 600000).unref();
