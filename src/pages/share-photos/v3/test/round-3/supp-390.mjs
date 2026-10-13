// Supplement: checks 4 to 10 repeated at 390x844, plus the members/anonymous visibility of the signed-in run.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const dir = new URL('.', import.meta.url).pathname;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const res = [];
const rec = (c, n, p, e) => res.push({ check: c, name: n, pass: !!p, evidence: JSON.stringify(e) });
async function open(file, query = '') {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } }); const page = await ctx.newPage();
  const errors = [], net = [];
  await ctx.addInitScript(() => { window.__rej = []; addEventListener('unhandledrejection', e => window.__rej.push(String(e.reason))); });
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); }); page.on('pageerror', e => errors.push(String(e)));
  await page.route('**/*', async r => { const u = r.request().url();
    if (u.startsWith('http://tll.test/')) { const p = new URL(u).pathname; if (p.endsWith('.css')) return r.fulfill({ body: fs.readFileSync(dir + p.slice(1)), contentType: 'text/css' }); if (p.endsWith('.html')) return r.fulfill({ body: fs.readFileSync(dir + p.slice(1)), contentType: 'text/html' }); }
    net.push(u);
    if (/cookieconsent\.umd\.js/.test(u)) return r.fulfill({ contentType: 'application/javascript', body: 'window.CookieConsent={run(){},show(){},hide(){},acceptCategory(){},acceptedCategory(){return false},getCookie(){return {}},getUserPreferences(){return {acceptedCategories:[]}},validConsent(){return false}};' });
    if (/\.js(\?|$)/.test(u)) return r.fulfill({ contentType: 'application/javascript', body: '' });
    if (/\.css(\?|$)|fonts\.googleapis/.test(u)) return r.fulfill({ contentType: 'text/css', body: '' });
    return r.fulfill({ status: 204, body: '' }); });
  await page.goto('http://tll.test/' + file + query); await page.waitForTimeout(800);
  return { page, ctx, errors, net };
}
const f3 = [1, 2, 3].map(i => dir + `fixtures/photo-${i}.jpg`);
{
  const { page, ctx, errors, net } = await open('mock-in.html');
  const vis = await page.evaluate(() => ({ members: getComputedStyle(document.querySelector('[data-ms-content=members]')).display, anon: getComputedStyle(document.querySelector('[data-ms-content=anonymous]')).display }));
  rec(11, 'in 390: members block visible, anonymous hidden in the signed-in run', vis.members !== 'none' && vis.anon === 'none', vis);
  const d = () => page.evaluate(() => ['tll-more-detail', 'tll-more-share'].map(id => { const b = document.getElementById(id + '-btn'), p = document.getElementById(id); return [b.getAttribute('aria-expanded'), getComputedStyle(p).visibility, Math.round(b.getBoundingClientRect().height)]; }));
  const d0 = await d(); await page.click('#tll-more-detail-btn'); await page.click('#tll-more-share-btn'); await page.waitForTimeout(400); const d1 = await d();
  await page.click('#tll-more-detail-btn'); await page.click('#tll-more-share-btn'); await page.waitForTimeout(400); const d2 = await d();
  rec(4, 'in 390: disclosures closed on load, open and close on click, buttons >= 44px', d0.every(x => x[0] === 'false' && x[1] === 'hidden' && x[2] >= 44) && d1.every(x => x[0] === 'true' && x[1] === 'visible') && d2.every(x => x[0] === 'false' && x[1] === 'hidden'), { d0, d1, d2 });
  const n0 = net.length;
  await page.click('input[type=submit]'); await page.waitForTimeout(400);
  const s = await page.evaluate(() => ({ status: document.querySelector('.tll-pen-status').textContent, inv: [...document.querySelectorAll('[aria-invalid=true]')].map(e => e.name), wf: window.__wfHandlerRuns, ae: document.activeElement.id, url: location.href, errs: ['photos','country','rights','license','people'].map(k => document.getElementById('tll-err-' + k).textContent) }));
  rec(6, 'in 390: empty submit blocked, five errors, focus on photos input, "5 things to fix above."', s.status === '5 things to fix above.' && s.inv.length === 5 && s.wf === 0 && s.ae === 'photos-upload' && net.length === n0 && s.errs.join('|') === 'Add at least one photo.|Tell us the country, at least.|Tick this one to send.|Tick this one to send.|Tick this one to send.', s);
  await page.setInputFiles('#photos-upload', f3); await page.waitForTimeout(500);
  await page.fill('[name=country]', 'Portugal'); await page.waitForTimeout(150);
  const r = await page.evaluate(() => ({ rows: document.querySelectorAll('#tll-photos-list li').length, count: document.getElementById('tll-photos-count').textContent, err: document.getElementById('tll-err-photos').hidden, sum: document.getElementById('tll-photos-summary').textContent, status: document.querySelector('.tll-pen-status').textContent, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, removeH: Math.round(document.querySelector('.tll-photos-remove').getBoundingClientRect().height) }));
  rec(5, 'in 390: three rows, "3 of 12 chosen.", photos error cleared, summary "3 photos from Portugal.", no overflow with rows', r.rows === 3 && r.count === '3 of 12 chosen.' && r.err && r.sum === '3 photos from Portugal.' && r.status === '3 things to fix above.' && r.sw === r.cw && r.removeH >= 44, r);
  await page.screenshot({ path: dir + 'in-390-filled.png', fullPage: true });
  const c = await page.evaluate(() => document.getElementById('tll-credited-as').textContent);
  await page.check('input[name=credit-mode][value=anonymous]'); const ch = await page.evaluate(() => document.getElementById('tll-credited-as').hidden);
  rec(8, 'in 390: credited-as line and hide on Anonymous', c === 'Credited as Nancy Carleton, from your account.' && ch, { c, ch });
  await page.evaluate(() => { document.querySelector('.w-form-done').style.display = 'block'; }); await page.waitForTimeout(200);
  const f = await page.evaluate(() => document.activeElement === document.querySelector('.w-form-done'));
  rec(10, 'in 390: success box takes focus', f, f);
  const rej = await page.evaluate(() => window.__rej);
  rec(1, 'in 390 (interaction run): no errors or rejections', errors.length === 0 && rej.length === 0, { errors, rej });
  await ctx.close();
}
await browser.close();
fs.writeFileSync(dir + 'results-390-supplement.json', JSON.stringify(res, null, 1));
for (const r of res) console.log((r.pass ? 'PASS' : 'FAIL') + ' [' + r.check + '] ' + r.name + (r.pass ? '' : ' :: ' + r.evidence));
