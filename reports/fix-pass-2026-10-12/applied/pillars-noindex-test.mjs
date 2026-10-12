import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const F = fs.readFileSync('/home/user/thatlayoverlife/reports/fix-pass-2026-10-12/applied/pillars-template-footer-after.html','utf8');
const item = s => `<div class="w-dyn-item"><a class="tllpr-card" id="x">x</a><div class="tllpr-pflag">${s}</div></div>`;
const page = (items, robots) => `<!doctype html><html><head>${robots?'<meta name="robots" content="index">':''}</head><body><div id="tllpr-stories">${items.map(item).join('')}</div><div id="tllpr-layovers" style="display:none"></div><div id="tllpr-diary" style="display:none"><div class="w-dyn-item">d</div></div><div class="tllpr-none" style="display:none"></div>${F}</body></html>`;
const cases = [
  ['cultural-intelligence', ['cultural-intelligence','travel-logistics'], false, 'noindex, follow'],
  ['travel-logistics', ['travel-logistics','travel-logistics','travel-logistics'], false, null],
  ['layover-guides', [], false, 'noindex, follow'],
  ['stories-from-the-road', ['stories-from-the-road'], false, null],
  ['paw-passport', [], false, null],
  ['cultural-intelligence', ['cultural-intelligence'], true, 'index'],
];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); let fails = 0;
for (const [slug, items, robots, want] of cases) {
  const ctx = await b.newContext(); await ctx.route('**/*', r => r.fulfill({ contentType: 'text/html', body: page(items, robots) }));
  const p = await ctx.newPage(); await p.goto('http://tll.test/pillars/' + slug);
  const got = await p.evaluate(() => { const m = document.querySelectorAll('meta[name="robots"]'); return m.length ? [m.length, m[0].content] : null; });
  const pass = want === null ? got === null : (got && got[0] === 1 && got[1] === want);
  console.log((pass ? 'PASS ' : 'FAIL ') + `${slug} items=${items.length} preexisting=${robots} -> ${JSON.stringify(got)}`); if (!pass) fails++;
  await ctx.close();
}
await b.close(); console.log(fails ? 'FAILED' : 'ALL PASS');
