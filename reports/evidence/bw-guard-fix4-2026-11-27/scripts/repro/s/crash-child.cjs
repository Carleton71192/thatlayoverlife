'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const W = require(process.env.WT + '/tools/wf-guard.cjs');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const mode = process.argv[2], P = process.env.STUBPORT;
  const browser = await chromium.launch({ handleSIGINT: mode !== 'sigint-nohandler', handleSIGTERM: mode !== 'sigterm-nohandler', args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server', '--wfcheck-tag=fix4cr'] });
  const ctx = await browser.newContext();
  const g = W.guard(ctx, Object.assign({ label: 'crash-' + mode, logFile: process.env.LOGF, mode: 'block', stateDir: process.env.SD }, mode === 'trip-default' ? { runCapMB: 0.2 } : {})); await g.ready;
  const pg = await ctx.newPage(); await pg.goto(`http://www.thatlayover.life:${P}/kb300.js`); await sleep(300);
  console.log('counted before crash', g.stats().bytes);
  if (mode === 'throw') setTimeout(() => { throw new Error('harness bug'); }, 10);
  else if (mode === 'reject') Promise.reject(new Error('unhandled'));
  else if (mode === 'exit') process.exit(1);
  else if (mode.startsWith('sigterm')) process.kill(process.pid, 'SIGTERM');
  else if (mode.startsWith('sigint')) process.kill(process.pid, 'SIGINT');
  else if (mode === 'sigkill') process.kill(process.pid, 'SIGKILL');
  else if (mode === 'browser-crash') { require('child_process').execSync("pkill -9 -f 'wfcheck-tag=fix4c[r]' || true"); await sleep(500); console.log('browser killed; ending normally without close'); }
  else if (mode === 'normal-noclose') { console.log('ending without close'); }
  else if (mode === 'trip-default') { /* default onTrip throw at a tiny cap */ }
  await sleep(3000);
  console.log('still alive after crash attempt');
  if (mode !== 'browser-crash' && mode !== 'normal-noclose') await browser.close();
  else if (mode === 'normal-noclose') { await browser.close(); }
})();
