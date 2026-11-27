'use strict';
/* N-5 and N-6: the log parser. Run: node repro-parser.cjs <worktree> <log file>... (the real logs are only read) */
const fs = require('fs'), os = require('os'), path = require('path');
const W = require(process.argv[2] + '/tools/wf-guard.cjs');
const day = new Date('2026-11-27T12:00:00Z');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'wfrpp-'));
const f = (name, text) => { const p = path.join(tmp, name); fs.writeFileSync(p, text); return p; };
const tryit = fn => { try { return fn(); } catch (e) { return 'THROWS ' + e.name + ': ' + e.message.split('\n').slice(0, 2).join(' | ').replace(/\/tmp\S*\//g, '<tmp>/').slice(0, 220); } };
const L = '- 27 Nov, sweep pass: 100 MB (E)\n', M = '- 27 Nov, other: 5 MB (M)\n';
console.log('N-5 one file, the same line twice ->', tryit(() => W.readDailyTotalMB([f('a.md', L + L)], day)));
console.log('N-5 dailyTotalMB on that text ->', tryit(() => W.dailyTotalMB(L + L, day)));
console.log('N-5 main has the line once, worktree once (a copy) ->', tryit(() => W.readDailyTotalMB([f('m1.md', L), f('w1.md', L)], day)));
console.log('N-5 main twice, worktree once ->', tryit(() => W.readDailyTotalMB([f('m2.md', L + L), f('w2.md', L)], day)));
console.log('N-5 main once, worktree twice plus another line ->', tryit(() => W.readDailyTotalMB([f('m3.md', L), f('w3.md', L + L + M)], day)));
console.log('N-5 three times in one file ->', tryit(() => W.readDailyTotalMB([f('t3.md', L + L + L)], day)));
const lines = ['1. 27 Nov, x: 3 MB', '| 27 Nov | x | 3 MB |', '27 Nov, x: 3 MB', '- 27 Nov, x: 3 M', '- 27 Nov, x: 3000000 bytes', '- 27 Nov, x: 3,000,000 bytes',
  '3 MB on 27 Nov (plain line, size before date)', '## 27 Nov: 3 MB', '> 27 Nov, x: 3 MB', '  27 Nov, x: 3 MB (indented, no bullet)', '1) 27 Nov, x: 3 MB',
  'Budget: 250 MB a day; the 13 Nov STANDING RULE', '- 27 Nov, x: 3 Mbit', '- 27 Nov, x: 3 M pages', '- 27 Nov, x: 300197 bytes, 0.30 MB from Webflow (M)', '- 27 Nov, x: 2 MB and 512 KB', 'Nov 27: 3 MB', '2026-11-27 x 3 MB'];
for (const l of lines) console.log('N-6', JSON.stringify(l).padEnd(62), '->', tryit(() => W.lineMBForDay(l, day)));
for (const p of process.argv.slice(3)) {
  const out = {};
  for (const d of ['2026-11-13', '2026-11-21', '2026-11-22', '2026-11-25', '2026-11-27']) out[d] = tryit(() => +W.readDailyTotalMB([p], new Date(d + 'T12:00:00Z')).toFixed(3));
  console.log('real log', p.replace(/.*scratchpad\//, 'scratchpad/'), JSON.stringify(out));
}
{ /* the error names the file and line; a run does not start on such a log */
  const p = f('bad.md', '# log\n- 27 Nov, a: 1 MB\n| 27 Nov | b | 3 MB |\n');
  console.log('N-6 error text from readDailyTotalMB ->', tryit(() => W.readDailyTotalMB([p], day)));
  console.log('N-6 createRun on that log ->', tryit(() => { W.createRun({ label: 'p', logFile: p, readLogs: [p], stateDir: fs.mkdtempSync(path.join(tmp, 's')), noLog: true, now: () => day }); return 'started'; }));
}
