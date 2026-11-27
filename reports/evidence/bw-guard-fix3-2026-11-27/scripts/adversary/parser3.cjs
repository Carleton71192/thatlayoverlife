'use strict';
/* P1 to P4: the log parser against every version of handoff/BANDWIDTH-LOG.md in git history, the live files, and lines
   written to break it (round 3: the bare M rule and dates in paths). Old = 686e520, r2 = 7c53c4f, new = 66c0034.
   Run: node parser3.cjs <new worktree> <old tools parent> <main checkout> <r2 tools parent> */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const NEW = require(process.argv[2] + '/tools/wf-guard.cjs'), OLD = require(process.argv[3] + '/tools/wf-guard.cjs');
const MAIN = process.argv[4]; const R2 = require(process.argv[5] + '/tools/wf-guard.cjs');
const git = (...a) => execFileSync('git', ['-C', MAIN, ...a], { encoding: 'utf8', maxBuffer: 1 << 26 });
const days = []; for (let d = 10; d <= 30; d++) days.push(new Date(Date.UTC(2026, 10, d, 12)));
const tot = (W, text, d) => { try { return +W.dailyTotalMB(text, d).toFixed(3); } catch (e) { return 'ERR ' + e.name; } };

/* P1: every historical version, every day 10 to 30 Nov, old vs new */
const commits = git('log', '--all', '--format=%H %h %cs', '--', 'handoff/BANDWIDTH-LOG.md').trim().split('\n');
let diffs = 0, errs = 0, cells = 0;
for (const c of commits) {
  const [h, short] = c.split(' ');
  let text; try { text = git('show', `${h}:handoff/BANDWIDTH-LOG.md`); } catch (e) { continue; }
  for (const d of days) {
    const o = tot(OLD, text, d), n = tot(NEW, text, d), r2 = tot(R2, text, d); cells++; if (r2 !== n) console.log('P1 r2 vs new', short, d.toISOString().slice(0, 10), 'r2', r2, 'new', n);
    if (typeof n === 'string') { errs++; console.log('P1 ERROR', short, d.toISOString().slice(0, 10), n); }
    else if (o !== n) { diffs++; console.log('P1 DIFF', short, d.toISOString().slice(0, 10), 'old', o, 'new', n); }
  }
}
console.log('P1 history', JSON.stringify({ versions: commits.length, dayCells: cells, differences: diffs, newErrors: errs }));

/* P2: the live files: main checkout, this branch, the zxm063 tip; totals per day with a non-zero value */
const live = { main: fs.readFileSync(path.join(MAIN, 'handoff/BANDWIDTH-LOG.md'), 'utf8'), branch: fs.readFileSync(path.join(process.argv[2], 'handoff/BANDWIDTH-LOG.md'), 'utf8'), zxm063: git('show', 'origin/claude/new-session-zxm063:handoff/BANDWIDTH-LOG.md') };
for (const [k, text] of Object.entries(live)) {
  const per = {}; for (const d of days) { const n = tot(NEW, text, d), o = tot(OLD, text, d); if (n || o) per[d.getUTCDate() + ' Nov'] = n === o ? n : `old ${o} new ${n}`; }
  console.log('P2', k, JSON.stringify(per));
}
/* the guard's own combined read of main + branch (N-5 max rule) */
const tmpd = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'p2-'));
const fa = path.join(tmpd, 'main.md'), fb = path.join(tmpd, 'branch.md'); fs.writeFileSync(fa, live.main); fs.writeFileSync(fb, live.branch);
for (const d of [21, 25, 27].map(x => new Date(Date.UTC(2026, 10, x, 12)))) console.log('P2 readDailyTotalMB main+branch', d.getUTCDate(), 'Nov', 'old', +OLD.readDailyTotalMB([fa, fb], d).toFixed(3), 'new', +NEW.readDailyTotalMB([fa, fb], d).toFixed(3));

/* P3: lines written to break the parser. For each: new result for 27 Nov (MB or error), old result */
const d27 = new Date(Date.UTC(2026, 10, 27, 12));
const one = (W, l) => { try { return +W.lineMBForDay(l, d27).toFixed(6); } catch (e) { return 'throws ' + e.name; } };
const lines = [
  // N-6 cases from check.md
  '1. 27 Nov, x: 3 MB', '| 27 Nov | x | 3 MB |', '27 Nov, x: 3 MB', '- 27 Nov, x: 3 M', '- 27 Nov, x: 3000000 bytes', '- 27 Nov, x: 3,000,000 bytes',
  // variations that should still be caught
  '2) 27 Nov, x: 3 MB', '> 27 Nov, x: 3 MB', '> - 27 Nov, x: 3 MB', '  27 Nov, x: 3 MB', '27 November 2026: 3 MB', 'Nov 27: 3 MB', '2026-11-27 run: 3 MB',
  '• 27 Nov, x: 3 MB', '– 27 Nov, x: 3 MB', '1.  27 Nov, x: 3 MB', '- [x] 27 Nov, x: 3 MB', '- **27 Nov**, x: 3 MB', '-\t27 Nov, x: 3 MB',
  '| x | 27 Nov | 3 MB |', '| 3 MB | 27 Nov |', 'x: 3 MB on 27 Nov', '3 MB, 27 Nov',
  '- 27 Nov, x: 3 mb', '- 27 Nov, x: 3MB', '- 27 Nov, x: 3 Mb', '- 27 Nov, x: 3 m', '- 27 Nov, x: 3M', '- 27 Nov, x: 3.5M', '- 27 Nov, x: 3 megs',
  '- 27 Nov, x: 3 MBytes', '- 27 Nov, x: 3 Mbit', '- 27 Nov, x: 3e6 bytes', '- 27 Nov, x: 3 000 000 bytes', '- 27 Nov, x: 3 B', '- 27 Nov, x: 3 octets',
  // new false positives: does the new reader add sizes that are not Webflow MB?
  '- 27 Nov, x: 2.5 MB (M)', '- 27 Nov, x: 2.5 MB (M); 12 M requests', '- 27 Nov, x: 0 MB, checked at 10 M', '- 27 Nov, x: 1 MB, 4 bytes of header',
  '- 27 Nov, x: 1 MB; page size 300 bytes', '- 27 Nov, x: 1 MB, video 1080 M', '- 27 Nov, x: 1 MB at 10 AM', '- 27 Nov, x: 1 MB, 5 M&M',
  // new false errors: plain lines that would now stop every run
  'See reports/evidence/bw-guard-fix-2026-11-27/check.md: 3 MB', '  continued: reports/x-2026-11-27/ held 3 MB', 'Mar 3 notes: 2 MB', 'Updated 27 Nov: budget 250 MB a day',
  '## 27 Nov 2026 (2.5 MB)', '<!-- 27 Nov: 3 MB -->', 'Budget: 250 MB a day; the 13 Nov rule', 'From 1 Dec the budget is 250 MB a day', 'Version 1.2.2026 uses 3 MB',
];
lines.push(
  // round 3: bare M figures the new rule drops (r2 counted them), and how they compare with old
  '- 27 Nov, x: 3 M total', '- 27 Nov, x: 40 M, recheck 30 M (E)', '- 27 Nov, x: 3 M; y: 2 M', '- 27 Nov, x: 3 M, y: 2 MB', '- 27 Nov, x: 3 M (E), 2 M',
  '- 27 Nov, x: about 3 M', '- 27 Nov, x: 3 M from Webflow', '- 27 Nov, x: 3 M.', '- 27 Nov, x: 3 M, estimated', '- 27 Nov, x: 3 M [E]', '- 27 Nov, x: 3 M - estimate',
  '- 27 Nov, x: 3 to 5 M', '- 27 Nov, x: 3 to 5 M (E)', '- 27 Nov, x: 3 M (M)', '- 27 Nov, x: 3M (E)', '- 27 Nov, x: 3 M&M',
  // round 3: dates in paths and file names on plain lines (now skipped) and on bullets
  'reports/2026-11-27: 3 MB', 'run 2026-11-27/x 3 MB', 'At 2026-11-27-run: 3 MB', '2026-11-27: 3 MB', '27-11-2026: 3 MB', '(2026-11-27) 3 MB', '2026-11-27, 3 MB',
  '"2026-11-27" 3 MB', '2026.11.27 3 MB', '2026/11/27 3 MB', 'x_2026-11-27 3 MB', '2026-11-27_x 3 MB', '27 Nov/run: 3 MB',
  '- 2026-11-27/x: 3 MB', '- reports/2026-11-27: 3 MB',
);
for (const l of lines) { const n = one(NEW, l), r = one(R2, l), o = one(OLD, l); console.log('P3', JSON.stringify(l), '-> new', JSON.stringify(n), 'r2', JSON.stringify(r), 'old', JSON.stringify(o), (typeof n === 'number' && typeof o === 'number' && n < o) ? 'NEW BELOW OLD' : (typeof n === 'number' && typeof r === 'number' && n < r) ? 'new below r2' : ''); }

/* P4: N-5 repeats */
const L1 = '- 27 Nov, sweep pass: 100 MB (E)';
const w = (n, t) => { const f = path.join(tmpd, n); fs.writeFileSync(f, t); return f; };
const cases = {
  'one file, line twice': [[L1, L1].join('\n')],
  'main once, worktree once': [L1, L1],
  'main once, worktree twice': [L1, [L1, L1].join('\n')],
  'main twice, worktree once': [[L1, L1].join('\n'), L1],
  'main twice, worktree twice': [[L1, L1].join('\n'), [L1, L1].join('\n')],
  'main once, worktree once with trailing space': [L1, L1 + '  '],
  'main once, worktree once indented': [L1, '  ' + L1],
  'main once, worktree once with * bullet': [L1, L1.replace(/^-/, '*')],
};
for (const [k, texts] of Object.entries(cases)) {
  const files = texts.map((t, i) => w(`${k.replace(/\W+/g, '_')}-${i}.md`, t));
  console.log('P4', k, 'new', NEW.readDailyTotalMB(files, d27), 'old', OLD.readDailyTotalMB(files, d27));
}
