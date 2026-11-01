/* check-album-poll.cjs (1 Nov 2026): offline check of the /edit-profile poll in tll-album-settings-v1 (the split build moved its anchors,
   #tll-st, #tll-col and #ep-crew, into the edit-profile chunk, so they can arrive late). Serves the layer on a mocked /edit-profile with
   a stubbed Memberstack cookie and Worker, inserts the anchors at chosen times after DOMContentLoaded and asserts where and whether the
   "05D · Your album" section lands. Run from the repo root: node scratchpad/check-album-poll.cjs */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const LAYER = fs.readFileSync(path.join(ROOT, 'src/site-layers/tll-album-settings-v1.js'), 'utf8');
const SITE = 'https://www.thatlayover.life';
const CASES = [
  /* name, anchors inserted at ms after DOMContentLoaded, expected anchor the section follows (null: no section), wait ms */
  ['stamps section at +1000', { 'tll-st': 1000 }, 'tll-st', 3000],
  ['crew at +500, stamps at +2000: waits for the stamps section', { 'ep-crew': 500, 'tll-st': 2000 }, 'tll-st', 4000],
  ['crew only, at +8000 (slow chunk): found by the poll', { 'ep-crew': 8000 }, 'ep-crew', 10500],
  ['collections only, at +1000: falls back after 2.5 s', { 'tll-col': 1000 }, 'tll-col', 4500],
  ['no anchor ever: no section, no error', {}, null, 16000],
];
(async () => {
  const b = await chromium.launch(); let fails = 0;
  const check = (ok, msg) => { if (!ok) fails++; console.log((ok ? '  ok   ' : '  FAIL ') + msg); };
  for (const [name, anchors, want, wait] of CASES) {
    console.log('\n' + name);
    const ctx = await b.newContext();
    await ctx.addInitScript(() => { window.$memberstackDom = { getMemberCookie: () => 'tok' }; window.__posts = []; });
    const page = await ctx.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(String(e.message || e).split('\n')[0]));
    await page.route('**/*', (route) => {
      const u = route.request().url();
      if (u === SITE + '/layer.js') return route.fulfill({ status: 200, contentType: 'application/javascript', body: LAYER });
      if (u.startsWith(SITE)) return route.fulfill({ status: 200, contentType: 'text/html', body: `<!doctype html><html><head><meta charset="utf-8"><script src="/layer.js"></script></head><body><main><h1>Edit profile</h1><section class="ep-sec" id="first"><h2 class="ep-eb">05A</h2></section></main>
<script>document.addEventListener('DOMContentLoaded',function(){var A=${JSON.stringify(anchors)};Object.keys(A).forEach(function(id){setTimeout(function(){var s=document.createElement('section');s.className='ep-sec';s.id=id;s.innerHTML='<h2 class="ep-eb">'+id+'</h2>';document.querySelector('main').appendChild(s);},A[id]);});});</script></body></html>` });
      if (u.indexOf('/crew/inbox') > -1) return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, me: { slug: 'jay' } }) });
      if (u.indexOf('/album?slug=') > -1) return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ model: 'seven', mapCounts: {} }) });
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });
    const t0 = Date.now();
    await page.goto(SITE + '/edit-profile', { waitUntil: 'load' });
    let landedAt = null;
    if (want) { try { await page.waitForSelector('#tll-alb-set', { timeout: wait }); landedAt = Date.now() - t0; } catch (e) { /* reported below */ } }
    else await page.waitForTimeout(wait);
    const st = await page.evaluate(() => { const s = document.getElementById('tll-alb-set'); return { present: !!s, prev: s && s.previousElementSibling ? s.previousElementSibling.id : null, count: document.querySelectorAll('#tll-alb-set').length, heading: s ? s.querySelector('h2').textContent : '' }; });
    if (want) {
      check(st.present && st.prev === want, `section inserted after #${want} (got ${st.present ? 'after #' + st.prev : 'no section'}${landedAt ? ', ' + landedAt + ' ms after navigation' : ''})`);
      check(st.count === 1, `exactly one section (${st.count})`);
      check(st.heading === '05D · Your album', `heading unchanged: ${JSON.stringify(st.heading)}`);
    } else check(!st.present, `no section without an anchor (${st.present ? 'one appeared' : 'none'})`);
    check(errors.length === 0, `no page errors: ${JSON.stringify(errors)}`);
    await ctx.close();
  }
  await b.close();
  console.log(fails ? `\n${fails} check(s) failed` : '\nall checks passed');
  process.exit(fails ? 1 : 0);
})();
