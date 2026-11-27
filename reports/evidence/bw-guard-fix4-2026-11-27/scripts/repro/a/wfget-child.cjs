'use strict';
/* one wf-get run in its own process: node wfget-child.cjs <tools parent> <json opts> <url>... ; prints one JSON line */
const G = require(process.argv[2] + '/tools/wf-get.cjs');
const o = JSON.parse(process.argv[3]);
G.wfGet(process.argv.slice(4), Object.assign({ quiet: true }, o)).then(r => {
  console.log(JSON.stringify({ pid: process.pid, gets: r.gets, bytes: r.bytes, stopped: r.stopped ? r.stopped.message.slice(0, 160) : null, results: r.results.map(x => `${x.status || 0} ${x.bytes || 0} ${x.error || ''}`) }));
}, e => console.log(JSON.stringify({ pid: process.pid, refusedAtStart: e.message.slice(0, 160) })));
