// Sample mode on /the-map (25 Oct 2026, Nancy: option B). Offline: MapLibre and tiles are not served, so the map canvas
// fails to start, but the record, the SAMPLE label, the counters and the badges render before the map does.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const R = new URL('..', import.meta.url).pathname;
const results = []; const rec = (n, p, e) => results.push({ n, p: !!p, e });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
async function run({ visitor = 'sample', member = null, local = undefined }) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 900 } });
  const p = await ctx.newPage(); const errs = []; const got = [];
  p.on('pageerror', e => errs.push(String(e)));
  await p.route('**/*', r => {
    const u = new URL(r.request().url()); got.push(u.pathname);
    if (u.host === 'tll.test') {
      if (u.pathname === '/page.html') return r.fulfill({ contentType: 'text/html', body: `<!doctype html><meta charset="utf-8"><body>
        <div id="tll-map-layers" ${visitor ? `data-tll-visitor="${visitor}"` : ''} data-tll-data="http://tll.test/data/" data-tll-config="http://tll.test/collections.json"></div>
        <script src="http://tll.test/dist/tll-map-layers.js"></script></body>` });
      const f = R + u.pathname.replace(/^\//, ''); if (fs.existsSync(f)) return r.fulfill({ body: fs.readFileSync(f), contentType: f.endsWith('.json') ? 'application/json' : 'application/javascript' });
    }
    return r.fulfill({ status: 404, body: '' });
  });
  await p.addInitScript(({ member, local }) => {
    if (local !== undefined) localStorage.setItem('tllStates', JSON.stringify(local));
    window.$memberstackDom = { getCurrentMember: () => Promise.resolve({ data: member }), getMemberJSON: () => Promise.resolve({ data: member ? { tllStates: { v: 2, travelers: [{ id: 't1', name: 'Me' }], states: { '208': { t1: 'lived' } } } } : {} }) };
  }, { member, local });
  await p.goto('http://tll.test/page.html'); await p.waitForTimeout(2500);
  const st = await p.evaluate(() => ({ banner: !!document.getElementById('tllm-sample'), text: (document.getElementById('tllm-sample') || {}).textContent || '', badges: [...document.querySelectorAll('.tllm-card-src')].map(x => x.textContent), src: (function(){var m=document.getElementById('tll-map-layers');return m&&m.tllmState?m.tllmState().source:(window.tllmState?window.tllmState().source:null);})() }));
  await p.screenshot({ path: `shot-${visitor || 'none'}-${member ? 'member' : 'out'}-${local ? 'local' : 'x'}.png` });
  await ctx.close(); return { st, errs, got };
}
let r = await run({});
rec('signed out: SAMPLE label shows', r.st.banner && /SAMPLE MAP/.test(r.st.text) && /made-up traveler/.test(r.st.text), r.st);
rec('signed out: record is the sample', r.st.src === 'sample', r.st.src);
rec('signed out: owner record never requested', !r.got.some(x => /owner-record/.test(x)) && r.got.some(x => /sample-record/.test(x)), r.got.filter(x => /record/.test(x)));
rec('signed out: badges say SAMPLE, never SITE OWNER', !r.st.badges.some(x => /SITE OWNER/.test(x)), r.st.badges);
r = await run({ local: { v: 2, travelers: [{ id: 't1', name: 'Me' }], states: {} } });
rec('empty browser copy does not hide the sample', r.st.banner && r.st.src === 'sample', r.st);
r = await run({ local: { v: 2, travelers: [{ id: 't1', name: 'Me' }], states: { '250': { t1: 'visited' } } } });
rec('visitor with own browser map sees theirs, no label', !r.st.banner && r.st.src === 'local', r.st);
r = await run({ member: { id: 'mem_x' } });
rec('member sees own record, no label', !r.st.banner && r.st.src === 'member', r.st);
r = await run({ visitor: '' });
rec('without the attribute the old behavior stays (owner)', !r.st.banner && r.st.src === 'owner', r.st.src);
await b.close();
fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
for (const x of results) console.log((x.p ? 'PASS ' : 'FAIL ') + x.n + (x.p ? '' : ' ' + JSON.stringify(x.e)));
console.log(results.filter(x => x.p).length + '/' + results.length);
