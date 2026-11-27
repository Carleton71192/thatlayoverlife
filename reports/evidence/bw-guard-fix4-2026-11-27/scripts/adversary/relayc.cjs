'use strict';
/* Starts relayproc4.cjs as a child process and reads its counts. relay(targetPort, rate) -> { port, mark(), since(m), close() };
   mark and since are async (they ask the relay process over HTTP on 127.0.0.1). */
const { fork } = require('child_process'), http = require('http'), path = require('path');
const ask = port => new Promise((res, rej) => http.get({ host: '127.0.0.1', port, path: '/' }, r => { let b = ''; r.on('data', d => b += d); r.on('end', () => res(JSON.parse(b))); }).on('error', rej));
function relay(targetPort, rate) {
  const ch = fork(path.join(__dirname, 'relayproc4.cjs'), [String(targetPort), String(rate || 0)], { stdio: ['ignore', 'pipe', 'inherit', 'ipc'] });
  return new Promise(res => ch.stdout.once('data', d => {
    const [port, ctl] = String(d).trim().split(' ').map(Number);
    res({ port, mark: async () => (await ask(ctl)).length, since: async m => { await new Promise(r => setTimeout(r, 150)); return (await ask(ctl)).slice(m).reduce((s, x) => s + x, 0); }, conns: async m => (await ask(ctl)).slice(m), close: () => ch.kill() });
  }));
}
module.exports = { relay };
