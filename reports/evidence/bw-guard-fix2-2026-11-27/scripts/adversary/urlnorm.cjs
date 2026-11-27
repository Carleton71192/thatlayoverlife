'use strict';
/* U1: does Chromium request the same URL string that Node's URL parser gives for a redirect target? The redirect page
   (N-4) stores the final answer under Node's form and the browser asks for its own form; a difference means a replay miss.
   No network: every request is answered by a route on a local page. */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] });
  const ctx = await browser.newContext(); const seen = [];
  await ctx.route('**/*', r => { seen.push(r.request().url()); r.fulfill({ status: 200, contentType: 'text/html', body: '<p>x</p>' }); });
  const pg = await ctx.newPage();
  const base = 'http://www.thatlayover.life/';
  const tails = ['a|b', 'a^b', 'a[b]', 'a{b}', 'a`b', "a'b", 'a"b', 'a<b>', 'a b', 'a\\b', 'café', 'a%zz', 'a%7cb', '?q=a|b', "?q=a'b", '?q=a^b', '?q={x}', '?q=a b', '?q=`', '?q=café', 'a;b', 'a,b', 'a!b', 'a~b', 'a$b', 'a@b', '?q=%', 'a%2Fb', '%41', '?q=%41', 'a/./b/../c', 'A%2e%2E/b'];
  let diff = 0;
  for (const t of tails) {
    const nodeForm = new URL(t, base).href;
    seen.length = 0;
    await pg.goto(base).catch(() => { });
    seen.length = 0;
    await pg.evaluate(u => location.replace(u), nodeForm).catch(() => { });
    await pg.waitForLoadState('load').catch(() => { }); await new Promise(r => setTimeout(r, 150));
    const got = seen[seen.length - 1];
    const same = got === nodeForm; if (!same) diff++;
    console.log('U1', JSON.stringify(t), same ? 'same' : 'DIFF', JSON.stringify({ node: nodeForm, chromium: got }));
  }
  console.log('U1 summary', JSON.stringify({ tried: tails.length, differ: diff }));
  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
