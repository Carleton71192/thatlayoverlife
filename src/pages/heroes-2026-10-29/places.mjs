// /stories place chips: the layer in the head, the page's own footer code at the end of the body, as live.
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const ROOT = path.resolve(DIR, '../../..');
const layer = fs.readFileSync(path.join(ROOT, 'src/site-layers/tll-stories-places-v1.js'), 'utf8');
const footer = fs.readFileSync(path.join(DIR, 'code/stories-footer.html'), 'utf8');
let html = fs.readFileSync(path.join(DIR, 'fixtures/stories.html'), 'utf8').replace('<!--BUNDLE-->', '<script>' + layer + '</script>').replace('</body>', footer + '<p>Got a trip like these? It could be the next story on the shelf.</p></body>');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = [];
p.on('pageerror', e => errs.push(e.message));
await p.route('**/*', r => r.request().url() === 'http://tll.test/stories' ? r.fulfill({ body: html, contentType: 'text/html' }) : r.abort());
await p.goto('http://tll.test/stories').catch(() => {}); await p.waitForTimeout(1800);
const chips = await p.$$eval('[data-tll-place]', e => e.map(x => x.textContent.trim()));
await p.click('[data-tll-place="Oceania"]'); await p.waitForTimeout(200);
const r1 = await p.evaluate(() => ({ note: (document.getElementById('tll-chip-note') || {}).textContent, on: document.querySelector('.tll-filter-chip-on').textContent }));
await p.click('[data-tll-place="all"]'); await p.waitForTimeout(200);
const r2 = await p.evaluate(() => ({ note: !!document.getElementById('tll-chip-note'), shelf: document.body.innerText.includes('on the shelf') }));
console.log(JSON.stringify({ chips, r1, r2, errs: errs.filter(e => !/CookieConsent/.test(e)) }));
await b.close();
