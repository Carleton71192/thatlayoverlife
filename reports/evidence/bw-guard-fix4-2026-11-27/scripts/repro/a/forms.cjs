'use strict';
/* U1: which URL forms does Chromium request differently from the guard's chromeForm (and looseForm)?
   Every request is answered by a route in this script (route.fulfill); nothing leaves the machine.
   Run: node forms.cjs <tools parent> */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const W = require(process.argv[2] + '/tools/wf-guard.cjs');
const loose = x => { const c = W.chromeForm(x); try { return decodeURIComponent(c); } catch (e) { return c; } };
(async () => {
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] });
  const ctx = await browser.newContext(); let seen = null; const reqs = [];
  await ctx.route('**/*', r => { reqs.push(r.request().url()); return r.fulfill({ status: 200, contentType: 'text/html', body: '<p>x</p>' }); });
  const pg = await ctx.newPage(); await pg.goto('http://www.thatlayover.life/start');
  const cands = [];
  for (let c = 0x20; c < 0x7f; c++) { const ch = String.fromCharCode(c); if (ch === '#' || ch === '?') continue; cands.push(['path', `/p${ch}x`], ['query', `/q?a=${ch}x`]); }
  for (const s of ['%', '%g', '%%', '%zz', '%FF', '%C3', '%e9', '%E9', '%c3%a9', 'é', 'é|', '%|', '|%', '^%FF', '%2e', '%2E%2E/x', '.%2e/x', '%7c', '%5e', '%7C%', ' ', ' ', '﻿', 'ä%']) {
    cands.push(['path', `/s${s}x`], ['query', `/q?a=${s}x`]);
  }
  cands.push(['cred', 'http://user:pw@www.thatlayover.life/c'], ['cred', 'http://user@www.thatlayover.life/c']);
  for (const h of ['WWW.ThatLayover.LIFE', 'www.thatlayover.life.', 'www.thatlayover.life:80', 'www.thatlayover.life..', 'xn--www-thatlayover.life', 'www.thatlayover。life', 'www.thatlayover.life．', 'wwŵ.thatlayover.life', 'www.thatlayover.life%2e', 'www%2ethatlayover.life'])
    cands.push(['host', `http://${h}/h`]);
  let diff = 0, looseMiss = 0;
  for (const [kind, raw] of cands) {
    let node; try { node = new URL(raw, 'http://www.thatlayover.life/').href; } catch (e) { console.log(kind, JSON.stringify(raw), 'node rejects'); continue; }
    const to = W.chromeForm(node); seen = null;
    const n0 = reqs.length;
    await pg.evaluate(t => location.replace(t), to).catch(() => { });
    for (let i = 0; i < 300 && reqs.length === n0; i++) await new Promise(r => setTimeout(r, 10));
    seen = reqs.length > n0 ? reqs[n0] : null;
    await pg.waitForLoadState().catch(() => { }); await new Promise(r => setTimeout(r, 30));
    const same = seen === to, lsame = seen && loose(seen) === loose(node);
    const f2 = seen ? W.chromeForm(seen) === to : false;
    if (!same) diff++; if (!same && !lsame && !f2) looseMiss++;
    if (!same) console.log(kind, JSON.stringify(raw), 'to', JSON.stringify(to), 'chromium', JSON.stringify(seen), 'chromeForm(chromium)==to', f2, 'loose match', lsame);
  }
  console.log(`U1 summary: ${cands.length} forms, ${diff} where Chromium's request differs from the redirect target, ${looseMiss} where neither the chromeForm key nor the loose key matches`);
  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
