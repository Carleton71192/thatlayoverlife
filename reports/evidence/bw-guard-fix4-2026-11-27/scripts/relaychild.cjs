'use strict';
/* the relay of relay.cjs in its own process: counts the bytes it passes to the client per connection and reports each
   connection's running total to the parent over IPC. node relaychild.cjs <target port>. Everything is on 127.0.0.1. */
const net = require('net');
const conns = [];
const srv = net.createServer(c => {
  const id = conns.length; conns.push(0); process.send({ id, n: 0 });
  const up = net.connect(+process.argv[2], '127.0.0.1');
  c.on('data', d => up.write(d));
  up.on('data', d => { if (c.destroyed) return; c.write(d, () => { }); conns[id] += d.length; process.send({ id, n: conns[id] }); if (c.writableLength > 0) { up.pause(); c.once('drain', () => up.resume()); } });
  const end = () => { c.destroy(); up.destroy(); };
  c.on('close', end); up.on('close', end); c.on('error', end); up.on('error', end);
});
srv.listen(0, '127.0.0.1', () => process.send({ port: srv.address().port }));
process.on('disconnect', () => process.exit(0));
