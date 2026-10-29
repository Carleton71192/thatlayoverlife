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
const from = p.locator('[data-ep-fromq]'); await from.scrollIntoViewIfNeeded(); await from.focus(); await from.type('uk', { delay: 40 }); await p.waitForTimeout(200);
out.suggest = await p.locator('.tll-eps-list:not([hidden]) button').allInnerTexts();
await p.screenshot({ path: path.join(DIR, `${TAG}-${W}-country-list.png`) });
const first = p.locator('.tll-eps-list:not([hidden]) button').first(); if (await first.count()) await first.click({ force: true });
await p.waitForTimeout(300);
out.fromChips = await p.locator('[data-ep-fromflag]').innerText(); out.added = await p.locator('.tll-eps-added').allInnerTexts();
const lived = p.locator('[data-ep-livedq]'); await lived.focus(); await lived.type('Pakistan', { delay: 20 }); await p.locator('[data-ep-f="from-place"]').focus(); await p.waitForTimeout(500);
out.livedChips = await p.locator('[data-ep-livedflags]').innerText(); out.added2 = await p.locator('.tll-eps-added').allInnerTexts();
await p.screenshot({ path: path.join(DIR, `${TAG}-${W}-country-added.png`) });
await p.locator('#ep-f-photo').setInputFiles(path.join(IMG, 'spain-ibiza.jpg')); await p.waitForTimeout(600);
out.dialog = await p.locator('.tll-eps-crop').count(); await p.screenshot({ path: path.join(DIR, `${TAG}-${W}-crop.png`) });
if (out.dialog) { const st = p.locator('.tll-eps-stage'); const bb = await st.boundingBox(); await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.mouse.down(); await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2 + 60, { steps: 5 }); await p.mouse.up();
  await p.locator('.tll-eps-zoom input').fill('1.5'); await p.locator('.tll-eps-acts .tll-eps-btn:not(.tll-eps-btn--ghost)').click({ force: true }); await p.waitForTimeout(800); }
out.calls = await p.evaluate(() => window.__calls.map(c => JSON.stringify(c).slice(0, 140)));
console.log(JSON.stringify(out, null, 1)); await b.close();
