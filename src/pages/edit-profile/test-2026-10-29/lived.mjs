// Stand-in run of /edit-profile for "We ask the expat question twice": Has lived in stays; Directories is marked Opt in; countries
// from From and Has lived in with no desk are offered as one-tap desk adds through the page's own desk Add.
// Injects src/site-layers/tll-ep-ux-v1.js alone (the only layer that runs on /edit-profile for this). Usage: node lived.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const ROOT = path.resolve(DIR, '../../../..');
const layer = fs.readFileSync(path.join(ROOT, 'src/site-layers/tll-ep-ux-v1.js'), 'utf8');
const html = fs.readFileSync(path.join(DIR, 'fixture.html'), 'utf8').replace('<!--BUNDLE-->', '<script>' + layer + '</script>');
const b = await chromium.launch(); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
for (const W of [390, 1440]) {
  const p = await b.newPage({ viewport: { width: W, height: 900 }, hasTouch: W < 600, isMobile: W < 600 });
  const errs = []; p.on('pageerror', e => errs.push(e.message.slice(0, 160)));
  await p.route('**/*', r => { const u = r.request().url();
    if (u.startsWith('http://tll.test/css/')) { const f = path.join(ROOT, 'handoff/claude-design-source/webflow-export-2026-10-13/css', u.split('/').pop()); return fs.existsSync(f) ? r.fulfill({ body: fs.readFileSync(f), contentType: 'text/css' }) : r.abort(); }
    if (u === 'http://tll.test/edit-profile') return r.fulfill({ body: html, contentType: 'text/html; charset=utf-8' });
    if (u.includes('workers.dev')) return r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ ok: true, savedAt: new Date().toISOString() }) });
    return r.abort(); });
  await p.addInitScript(() => {
    const member = { id: 'mem_n', profileImage: '', customFields: { name: 'Nancy', 'home-base': 'Copenhagen, Denmark', 'from-and-lived-in': 'us,dk,br,ae,vn', 'list-expats': 'true', 'share-ranges': 'true', languages: 'English', 'custom-slug': 'nancy' } };
    const st = (f, t) => [{ from: f, to: t }];
    let json = { tllDesks: [{ c: 'us', st: st('1983', '2018'), knows: 'National parks', now: false }, { c: 'dk', st: st('2018', ''), knows: 'Copenhagen', now: true }, { c: 'br', st: st('2023', '2025'), knows: '', now: false }, ],
      tllSnapshot: { countries: 89, places: 90, layovers: 2, antarctica: true } };
    window.__calls = [];
    window.$memberstackDom = { getCurrentMember: async () => ({ data: member }), getMemberJSON: async () => ({ data: json }),
      updateMember: async (x) => { window.__calls.push(['updateMember', x.customFields]); Object.assign(member.customFields, x.customFields || {}); return { data: member }; },
      updateMemberJSON: async (x) => { window.__calls.push(['updateMemberJSON']); json = x.json; return {}; },
      getMemberCookie: () => 'tok', onAuthChange: () => {} };
  });
  await p.goto('http://tll.test/edit-profile'); await p.waitForTimeout(1800);
  const s0 = await p.evaluate(() => { const E = window.TLLEP, sub = document.querySelector('[data-ep-livedflags]').closest('.ep-sub'), n = document.getElementById('tll-eps-lived'), o = document.getElementById('tll-eps-optin'), dh = document.getElementById('ep-dirs-h');
    return { lived: E.get('from-and-lived-in'), subShown: getComputedStyle(sub).display !== 'none', note: n && !n.hidden ? n.textContent : null, noteHref: n && n.querySelector('a').getAttribute('href'),
      optin: o ? o.textContent : null, optinHref: o && o.querySelector('a').getAttribute('href'), chip: (dh.querySelector('.tll-eps-chip') || {}).textContent, oldOptional: [...dh.querySelectorAll('span:not(.tll-eps-chip)')].some(x => getComputedStyle(x).display !== 'none'),
      desks: E.jsonList('desks').map(d => d.c).join(','), quick: [...document.querySelectorAll('[data-tll-desk]')].map(b => b.textContent), pv: document.querySelector('[data-ep-pv-countries]').textContent, calls: window.__calls.length }; });
  console.log(W, JSON.stringify(s0));
  ok(s0.subShown, W + ' Has lived in still asked under Who you are');
  ok(s0.note === 'Know one of these well? Add it as a desk in Directories (opt in).' && s0.noteHref === '#ep-dirs', W + ' line under Has lived in points to Directories');
  ok(s0.chip === 'Opt in' && !s0.oldOptional, W + ' Directories chip reads Opt in, old optional mark hidden');
  ok(/^Add a desk only/.test(s0.optin || '') && s0.optinHref === '/for-expats#tll-expert-apply', W + ' opt-in line with Claim your desk link');
  ok(s0.lived === 'us,dk,br,ae,vn' && s0.calls === 0, W + ' nothing saved or changed on load');
  ok(JSON.stringify(s0.quick) === JSON.stringify(['Add a desk for United Arab Emirates', 'Add a desk for Vietnam']), W + ' one-tap desks offered only for countries with no desk: ' + JSON.stringify(s0.quick));
  ok(/\+ Antarctica$/.test(s0.pv) && !/AQ/.test(s0.pv), W + ' preview reads + Antarctica: ' + s0.pv);
  await p.evaluate(() => document.querySelector('#tll-eps-lived a').click()); await p.waitForTimeout(250);
  ok(await p.evaluate(() => !document.getElementById('ep-dirs').classList.contains('tll-eps-shut')), W + ' the line opens the Directories block');
  const bx = await p.evaluate(() => { const r = document.getElementById('tll-eps-lived').getBoundingClientRect(); return { y: r.top + scrollY, h: r.height }; });
  await p.screenshot({ path: path.join(DIR, 'lived-' + W + '-who.png'), fullPage: true, clip: { x: 0, y: Math.max(0, bx.y - 330), width: W, height: bx.h + 360 } });
  const dx = await p.evaluate(() => { const r = document.getElementById('ep-dirs').getBoundingClientRect(); return { y: r.top + scrollY }; });
  await p.screenshot({ path: path.join(DIR, 'lived-' + W + '-dirs.png'), fullPage: true, clip: { x: 0, y: dx.y, width: W, height: 1100 } });
  const pvs = await p.$('[data-ep-pv-stats]'); if (pvs && await pvs.isVisible()) await pvs.screenshot({ path: path.join(DIR, 'lived-' + W + '-preview.png') });
  await p.click('[data-tll-desk="vn"]', { force: true }); await p.waitForTimeout(300);
  const s1 = await p.evaluate(() => ({ desks: window.TLLEP.jsonList('desks').map(d => d.c).join(','), lived: window.TLLEP.get('from-and-lived-in'), quick: [...document.querySelectorAll('[data-tll-desk]')].map(b => b.getAttribute('data-tll-desk')) }));
  console.log(W, 'after tap', JSON.stringify(s1));
  ok(s1.desks === 'us,dk,br,vn' && s1.lived === 'us,dk,br,ae,vn' && JSON.stringify(s1.quick) === '["ae"]', W + ' tap adds the desk through the page, flags field unchanged, button goes');
  await p.waitForTimeout(1500);
  const sv = await p.evaluate(() => ({ kinds: window.__calls.map(c => c[0]), flagsSaved: window.__calls.some(c => c[0] === 'updateMember' && c[1] && c[1]['from-and-lived-in'] !== undefined) }));
  ok(sv.kinds.includes('updateMemberJSON') && !sv.flagsSaved, W + ' desk saved the usual way, flags field not rewritten: ' + JSON.stringify(sv));
  ok(!errs.length, W + ' no page errors ' + JSON.stringify(errs));
  await p.close();
}
await b.close(); console.log(fails ? fails + ' failed' : 'all passed'); process.exit(fails ? 1 : 0);
