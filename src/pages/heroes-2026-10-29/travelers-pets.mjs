// /travelers stand-in with the live Travelers v2 embeds (head, open slot, footer line) and filled CMS lists: people, one hidden card, one pet.
// Checks the pets block, chip counts, the N CARDS line, filter clicks, search, no empty grid cell, card flag rings. Usage: node travelers-pets.mjs [layer.js]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const ROOT = path.resolve(DIR, '../../..');
const OUT = path.join(DIR, 'travelers-pets'); fs.mkdirSync(OUT, { recursive: true });
const layer = fs.readFileSync(path.join(ROOT, process.argv[2] || 'src/site-layers/tll-travelers-fix-v1.js'), 'utf8');
const EMB = path.join(ROOT, 'src/pages/travelers/after-2026-10-20');
const head = fs.readFileSync(path.join(EMB, 'tv-head-d8735ad4.html'), 'utf8'), open = fs.readFileSync(path.join(EMB, 'tv-open-4cd74f9a.html'), 'utf8'), foot = fs.readFileSync(path.join(EMB, 'tv-foot-e467ec5e.html'), 'utf8');
const IMG = path.join(ROOT, 'src/pages/home/mobile-proto-2026-10-26/img');
const inv = 'class="w-condition-invisible"';
function person(o) {
  const m = k => `<span data-tv-on="${k}" ${o.on && o.on.includes(k) ? '' : inv}></span>`;
  return `<div role="listitem" class="w-dyn-item"><a class="tv-card${o.hidden ? ' w-condition-invisible' : ''}" data-tll-trav-card="traveler" data-st3-base="/contributors/" data-st3-slug="${o.slug}" data-name="${o.name}" data-tll-badge="${o.badge || ''}" data-tll-flags="${o.flags || ''}" data-tll-home="${o.home || ''}" data-tll-snapshot='${o.snap ? JSON.stringify(o.snap) : ''}'>`
    + `<div class="tv-photo"><img class="tll-trav-avatar${o.img ? '' : ' w-dyn-bind-empty'}" alt="" src="${o.img ? 'http://img.test/' + o.img : ''}"><span class="tv-initials" aria-hidden="true" data-tv-initials="1"></span><div class="tv-label${o.badge ? '' : ' w-dyn-bind-empty'}">${o.badge || ''}</div></div>`
    + `<div class="tv-body"><h2 class="tv-name">${o.name}</h2><div class="tv-line${o.line ? '' : ' w-dyn-bind-empty'}">${o.line || ''}</div><div class="tv-meta"><div class="tv-home${o.home ? '' : ' w-dyn-bind-empty'}">${o.home || ''}</div><span class="tv-flags" aria-hidden="true" data-tv-flags="1"></span></div><div class="tv-stats" data-tv-stats="1"></div></div>`
    + m('expats') + m('creators') + m('press') + m('ranges') + `</a></div>`;
}
const P = [
  { name: 'Fiona', slug: 'fiona' },
  { name: 'Barzy Adam', slug: 'barzy-adam', img: 'avatar-barzy.jpg', line: 'Drove five hours from Phoenix for one look at Horseshoe Bend.' },
  { name: 'Zain M', slug: 'zain-m', img: 'avatar-chesney.jpg', line: 'Avid Traveler and Content Writer', home: 'Bangkok, Thailand', flags: 'pk,th,tr,ae,id', on: ['expats'] },
  { name: 'Chesney Lish', slug: 'chesney-lish', img: 'avatar-chesney.jpg', on: ['creators'], badge: 'FOUNDING 02' },
  { name: 'Nancy Carleton', slug: 'nancy-carleton', img: 'avatar-nancy.jpg', badge: 'FOUNDER · EDITOR', on: ['creators', 'press', 'ranges'], snap: { countries: 89, storiesBy: 5 }, flags: 'us,dk,br,ae,vn', home: 'Copenhagen, Denmark' },
  { name: 'Luke Luby', slug: 'luke-luby', img: 'spain-ibiza.jpg' },
  { name: 'Not public', slug: 'hidden', hidden: true },
];
const roster = `<div class="w-dyn-list" data-tll-cms-cards="roster"><div role="list" class="w-dyn-items">${P.map(person).join('')}</div></div>`;
const pets = `<div class="w-dyn-list" data-tv-list="pets"><div role="list" class="w-dyn-items"><div role="listitem" class="w-dyn-item"><a class="tv-card" data-tll-trav-card="pet" data-st3-base="/pets/" data-st3-slug="magnus-waffles" data-name="Magnus" data-tll-countries="dk,se,de"><div class="tv-photo"><img alt="" src="http://img.test/magnus-holi.jpg"><span class="tv-initials" aria-hidden="true" data-tv-initials="1"></span><div class="tv-label">Samoyed</div><div class="tv-pet">PET</div></div><div class="tv-body"><h2 class="tv-name">Magnus</h2><div class="tv-line">Holi colors and a passport.</div><div class="tv-stats" data-tv-stats="1"></div></div></a></div></div><div class="w-dyn-empty"><div>No items found.</div></div></div>`;
let html = fs.readFileSync(path.join(DIR, 'fixtures/travelers.html'), 'utf8');
const sec = html.indexOf('data-tll-travelers="v2"'); let a = html.slice(0, sec), s = html.slice(sec);
s = s.replace('<div class="w-embed"></div>', '<div class="w-embed">' + head + '</div>');
const g0 = s.indexOf('<div class="tll-trav-grid" data-tll-roster-grid="">'), g1 = s.indexOf('<div class="w-embed"></div></div>', g0);
s = s.slice(0, g0) + '<div class="tll-trav-grid" data-tll-roster-grid="">' + roster + pets + '<div class="w-embed">' + open + '</div></div>' + s.slice(g1 + '<div class="w-embed"></div></div>'.length);
s = s.replace('<div class="w-embed"></div>', '<div class="w-embed">' + foot + '</div>');
html = (a + s).replace('<!--BUNDLE-->', '<style>.w-condition-invisible{display:none!important}.tv-card{display:flex;flex-direction:column;background:#FDF9F3;border:1px solid #E0DACE;color:#0A0B14;text-decoration:none}.tv-photo{position:relative;aspect-ratio:4/5;background:#0A0B14;overflow:hidden}.tv-photo .tv-label,.tv-photo .tv-pet{position:absolute;left:12px;top:12px}.tv-photo .tv-pet{left:auto;right:12px}.tv-body{display:flex;flex-direction:column;padding:18px}.tv-meta,.tv-flags,.tv-stats{display:flex;flex-wrap:wrap}</style><script>' + layer + '</script>');
const FLAG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><circle cx="256" cy="256" r="256" fill="#fff"/><path d="M256 0a256 256 0 0 1 0 512z" fill="#01411C"/></svg>';
const b = await chromium.launch(); const R = {};
for (const [w, h] of [[390, 844], [1440, 900]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 }); const errs = [];
  p.on('pageerror', e => errs.push(e.message.slice(0, 160)));
  await p.route('**/*', r => { const u = r.request().url();
    if (u.startsWith('http://tll.test/css/')) { const f = path.join(ROOT, 'handoff/claude-design-source/webflow-export-2026-10-13/css', u.split('/').pop()); return fs.existsSync(f) ? r.fulfill({ body: fs.readFileSync(f), contentType: 'text/css' }) : r.abort(); }
    if (u === 'http://tll.test/travelers') return r.fulfill({ body: html, contentType: 'text/html; charset=utf-8' });
    if (u.startsWith('http://img.test/')) return r.fulfill({ body: fs.readFileSync(path.join(IMG, u.split('/').pop())), contentType: 'image/jpeg' });
    if (u.includes('circle-flags')) return r.fulfill({ body: FLAG, contentType: 'image/svg+xml' });
    return r.abort(); });
  await p.goto('http://tll.test/travelers').catch(() => {}); await p.waitForTimeout(1500);
  const st = () => p.evaluate(() => {
    const chips = [...document.querySelectorAll('[data-tv-filter]')].map(c => (getComputedStyle(c).display === 'none' ? '(hidden) ' : '') + c.textContent.trim());
    const line = (document.querySelector('[data-tv-countline]') || {}).textContent;
    const cells = []; (function walk(el) { for (const c of el.children) { const cs = getComputedStyle(c); if (cs.display === 'none') continue; if (cs.display === 'contents') { walk(c); continue; } const r = c.getBoundingClientRect(); cells.push({ t: (c.innerText || '').trim().split('\n')[0].slice(0, 22), x: Math.round(r.x), y: Math.round(r.y + scrollY), img: !!c.querySelector('img') }); } })(document.querySelector('[data-tll-roster-grid]'));
    const box = document.querySelector('.tll-tf-pets'); const pets = box && !box.hidden ? [...box.querySelectorAll('.w-dyn-item')].filter(i => getComputedStyle(i).display !== 'none').map(i => i.innerText.trim().split('\n')[0]) : 'hidden';
    const empty = cells.filter(c => !c.t && !c.img).length;
    const g = document.querySelector('[data-tll-roster-grid]'), gx = Math.round(g.getBoundingClientRect().x), firstInCol1 = cells.length ? cells[0].x === gx : null;
    return { firstInCol1, chips, line, cells: cells.map(c => c.t || '(EMPTY)').join(' | '), empty, pets, ph: (document.querySelector('input[data-tll-trav-search]') || {}).placeholder, flagRing: (document.querySelector('.tv-flags span') ? getComputedStyle(document.querySelector('.tv-flags span')).boxShadow : 'none') };
  });
  const r = { load: await st() };
  await p.screenshot({ path: path.join(OUT, `travelers-${w}.png`), fullPage: true });
  await p.click('[data-tv-filter="expats"]'); await p.waitForTimeout(300); r.liveThere = await st();
  await p.click('[data-tv-filter="everyone"]'); await p.waitForTimeout(300);
  await p.fill('input[data-tll-trav-search]', 'magnus'); await p.waitForTimeout(500); r.searchMagnus = await st();
  await p.fill('input[data-tll-trav-search]', 'bangkok'); await p.waitForTimeout(500); r.searchBangkok = await st();
  await p.fill('input[data-tll-trav-search]', ''); await p.waitForTimeout(500); r.cleared = await st();
  const z = await p.$('a[data-st3-slug="zain-m"] .tv-meta'); if (z) await z.screenshot({ path: path.join(OUT, `zain-flags-${w}.png`) });
  r.errs = errs; R[w] = r; await p.close();
}
await b.close(); console.log(JSON.stringify(R, null, 1));
