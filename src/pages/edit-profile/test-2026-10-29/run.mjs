// Stand-in run of /edit-profile: fake Memberstack member, fake Worker (save refused like a missing profile item, press route missing).
// Usage: TAG=before|after BUNDLE=src/site-layers/tll-site-layers-vN.js [W=390] node run.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const ROOT = path.resolve(DIR, '../../../..');
const TAG = process.env.TAG || 'before', W = +(process.env.W || 390);
const bundle = process.env.BUNDLE ? fs.readFileSync(path.join(ROOT, process.env.BUNDLE), 'utf8') : '';
const html = fs.readFileSync(path.join(DIR, 'fixture.html'), 'utf8').replace('<!--BUNDLE-->', bundle ? '<script>' + bundle + '</script>' : '');
const FONTS = path.join(ROOT, 'src/design/magazine-2026-10/type/fonts'); const IMG = path.join(ROOT, 'src/pages/home/mobile-proto-2026-10-26/img');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: 844 }, deviceScaleFactor: 2, hasTouch: W < 600, isMobile: W < 600 });
const errs = []; p.on('pageerror', e => errs.push(e.message.slice(0, 160)));
const worker = [];
await p.route('**/*', async r => { const u = r.request().url();
  if (u.startsWith('http://tll.test/css/')) { const f = path.join(ROOT, 'handoff/claude-design-source/webflow-export-2026-10-13/css', u.split('/').pop()); return fs.existsSync(f) ? r.fulfill({ body: fs.readFileSync(f), contentType: 'text/css' }) : r.abort(); }
  if (u === 'http://tll.test/edit-profile') return r.fulfill({ body: html, contentType: 'text/html; charset=utf-8' });
  if (u.includes('workers.dev')) { worker.push(u.replace(/^https?:\/\/[^/]+/, '') + ' ' + (r.request().postData() || '').slice(0, 120));
    if (u.endsWith('/profile/save')) return r.fulfill({ status: 404, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ error: 'Your profile page has not been created yet. Give it a minute and reload.' }) });
    return r.fulfill({ status: 404, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ error: 'not found' }) }); }
  if (/\.(jpe?g|png)(\?|$)/i.test(u)) return r.fulfill({ body: fs.readFileSync(path.join(IMG, 'avatar-barzy.jpg')), contentType: 'image/jpeg' });
  return r.abort(); });
await p.addInitScript(() => {
  const member = { id: 'mem_x', profileImage: '', customFields: { name: 'Shahzain Test', 'home-base': 'Karachi, Pakistan', 'from-and-lived-in': '', languages: 'English', 'custom-slug': 'shahzain-test' } };
  let json = {}; window.__calls = [];
  window.$memberstackDom = { getCurrentMember: async () => ({ data: member }), getMemberJSON: async () => ({ data: json }),
    updateMember: async (x) => { window.__calls.push(['updateMember', x]); Object.assign(member.customFields, x.customFields || {}); return { data: member }; },
    updateMemberJSON: async (x) => { window.__calls.push(['updateMemberJSON']); json = x.json; return {}; },
    updateMemberProfileImage: async (x) => { window.__calls.push(['img', x.profileImage && x.profileImage.size, x.profileImage && x.profileImage.type]); member.profileImage = 'https://x.test/a.jpg'; return { data: member }; },
    getMemberCookie: () => 'tok', onAuthChange: () => {} };
  document.cookie = '_ms-mid=tok';
});
await p.goto('http://tll.test/edit-profile'); await p.waitForTimeout(1500);
const out = { errs };
await p.screenshot({ path: path.join(DIR, `${TAG}-${W}-top.png`) });
// type a one-line and watch the page move
const f = p.locator('#ep-f-oneline, [data-ep-f="one-line"]').first();
if (await f.count()) { await f.scrollIntoViewIfNeeded(); await p.waitForTimeout(200);
  const y0 = await f.evaluate(e => e.getBoundingClientRect().top); const ys = [];
  await f.click(); await f.type('Testing the save bar', { delay: 20 });
  for (let i = 0; i < 16; i++) { await p.waitForTimeout(250); ys.push(Math.round(await f.evaluate(e => e.getBoundingClientRect().top))); }
  out.fieldTopDrift = { y0: Math.round(y0), ys };
  out.status = await p.evaluate(() => [...document.querySelectorAll('[data-ep-status]')].map(s => s.textContent + ' [' + s.getAttribute('data-state') + ']'));
  out.bar = await p.evaluate(() => { const t = document.querySelector('.tll-eps'); return t ? t.innerText : null; });
  await p.screenshot({ path: path.join(DIR, `${TAG}-${W}-after-typing.png`) }); }
out.worker = worker; out.calls = await p.evaluate(() => window.__calls.map(c => JSON.stringify(c).slice(0, 120)));
console.log(JSON.stringify(out, null, 1)); await b.close();
