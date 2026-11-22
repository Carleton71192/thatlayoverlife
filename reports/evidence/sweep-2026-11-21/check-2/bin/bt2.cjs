/* Nov 22 check-2: focus tests for the builder's notes 1, 2, 3, 4 and 8, variants live, base (1ef84ab) and br (f3bc3f4).
   Usage: NODE_PATH=/opt/node22/lib/node_modules node bt2.cjs [filter]. Resumable (skips name+variant+run already in results/bt2.jsonl). */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { load, sleep, OUT } = require('./ab.cjs');
const RES = path.join(OUT, process.env.BTRES || 'bt2.jsonl');

/* the card, its computed placement and every other fixed element it overlaps; the key state; which chunks loaded */
const gateCard = page => page.evaluate(() => { const b = document.getElementById('tll-gate-back');
  const r = e => { if (!e) return null; const x = e.getBoundingClientRect(); return [Math.round(x.left), Math.round(x.top), Math.round(x.right), Math.round(x.bottom)]; };
  const ov = (a, c) => a && c && !(a[2] <= c[0] || c[2] <= a[0] || a[3] <= c[1] || c[3] <= a[1]);
  const fixed = [].filter.call(document.querySelectorAll('body *'), e => { const c = getComputedStyle(e); return c.position === 'fixed' && e.offsetWidth && e.id !== 'tll-gate-back' && !(b && b.contains(e)) && c.display !== 'none' && c.visibility !== 'hidden' && +c.opacity > 0; })
    .map(e => ({ k: e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + '.' + String(e.className).split(' ')[0], r: r(e) }));
  const cs = b && getComputedStyle(b);
  let topAt = null; if (b) { const x = b.getBoundingClientRect(); const t = document.elementFromPoint(x.left + 8, x.top + x.height / 2); topAt = t ? (b.contains(t) ? 'card' : t.tagName.toLowerCase() + '.' + String(t.className).split(' ')[0]) : null; }
  let key = null; try { const v = JSON.parse(sessionStorage.getItem('tll-gate-return')); key = v ? v.p : null; } catch (e) { key = 'bad'; }
  return { vw: innerWidth, vh: innerHeight, scrollY: Math.round(scrollY), card: b ? { text: b.innerText.replace(/\s+/g, ' ').trim(), href: b.querySelector('a') && b.querySelector('a').getAttribute('href'), r: r(b), pos: cs.position, z: cs.zIndex,
      fromRight: Math.round(innerWidth - b.getBoundingClientRect().right), fromBottom: Math.round(innerHeight - b.getBoundingClientRect().bottom), inView: r(b)[0] >= 0 && r(b)[2] <= innerWidth && r(b)[1] >= 0 && r(b)[3] <= innerHeight, topAt } : null,
    overlapsFixed: b ? fixed.filter(f => ov(f.r, r(b))).map(f => f.k) : [], key, style: !!document.getElementById('tll-gate-return-v1'),
    chunks: [].map.call(document.querySelectorAll('script[src*="/chunks/"]'), s => s.src.replace(/^.*\//, '')) }; });
const atScroll = async page => { const a = await gateCard(page); await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await sleep(600); const b = await gateCard(page);
  await page.evaluate(() => window.scrollTo(0, Math.round(document.documentElement.scrollHeight / 2))); await sleep(600); const c = await gateCard(page); return { top: a, bottom: b, middle: c }; };
const setKey = (p, ageMin) => new Function('if(!sessionStorage.getItem("chk-once")){sessionStorage.setItem("chk-once","1");sessionStorage.setItem("tll-gate-return",JSON.stringify({p:' + JSON.stringify(p) + ',t:Date.now()-' + (ageMin * 60000) + '}));}');
const PV = () => { try { localStorage.setItem('tll-preview-check', '1'); } catch (e) { } };
const both = (...fns) => fns.map(f => '(' + f.toString() + ')();').join('\n');
const gateClick = async (page) => { const o = {}; const links = []; for (const h of await page.$$('[data-ms-content="anonymous"] a[href^="/login"]')) if (!(await h.evaluate(a => !!a.closest('nav')))) links.push(h);
  o.gateLinks = links.length; let vis = null; for (const l of links) if (await l.isVisible()) { vis = l; break; }
  o.visible = !!vis; o.chunksBefore = await page.evaluate(() => [].map.call(document.querySelectorAll('script[src*="/chunks/"]'), s => s.src.replace(/^.*\//, '')));
  if (!vis) { await page.evaluate(() => { const a = [].find.call(document.querySelectorAll('[data-ms-content="anonymous"] a[href^="/login"]'), x => !x.closest('nav')); if (a) a.click(); }); } else await vis.click();
  await page.waitForLoadState('load').catch(() => { }); await sleep(1500);
  o.landed = await page.evaluate(() => location.pathname); o.key = await page.evaluate(() => { try { const v = JSON.parse(sessionStorage.getItem('tll-gate-return')); return v ? v.p : null; } catch (e) { return 'bad'; } });
  o.ss = await page.evaluate(() => Object.keys(sessionStorage).filter(k => /tll/.test(k)).sort()); return o; };
const navClick = async (page) => { await page.evaluate(() => { const a = [].find.call(document.querySelectorAll('nav a[href^="/login"]'), x => x); if (a) { a.addEventListener('click', e => e.preventDefault(), { once: true }); a.click(); } });
  return page.evaluate(() => ({ key: sessionStorage.getItem('tll-gate-return'), navLogin: !!document.querySelector('nav a[href^="/login"]') })); };
const keyState = page => page.evaluate(() => ({ key: sessionStorage.getItem('tll-gate-return') ? 'kept' : 'none', card: !!document.getElementById('tll-gate-back'), style: !!document.getElementById('tll-gate-return-v1'),
  chunks: [].map.call(document.querySelectorAll('script[src*="/chunks/"]'), s => s.src.replace(/^.*\//, '')) }));
const cardBack = async (page) => { const a = await page.$('#tll-gate-back a'); if (!a) return 'no card'; await a.click(); await page.waitForLoadState('load').catch(() => { }); await sleep(2500);
  return page.evaluate(() => ({ at: location.pathname, key: sessionStorage.getItem('tll-gate-return'), card: !!document.getElementById('tll-gate-back') })); };
const closeCard = async (page) => { const x = await page.$('#tll-gate-back button'); if (!x) return 'no card'; await x.click(); await sleep(200); return page.evaluate(() => ({ key: sessionStorage.getItem('tll-gate-return'), card: !!document.getElementById('tll-gate-back') })); };

/* place wait: when the mark went off, the grid's visibility then, the end state */
const WAITWATCH = () => { window.__pw = { on: null, off: null, gridHiddenAtOff: null, tl: [] };
  /* the document node exists before documentElement: observe it with subtree */
  new MutationObserver(() => { const h = !!document.documentElement && document.documentElement.hasAttribute('data-tll-place-wait'); if (h && window.__pw.on == null) window.__pw.on = Math.round(performance.now()); if (!h && window.__pw.on != null && window.__pw.off == null) window.__pw.off = Math.round(performance.now()); })
    .observe(document, { attributes: true, subtree: true, attributeFilter: ['data-tll-place-wait'] });
  let last = ''; const iv = setInterval(() => { const g = document.querySelector('.tll-lib-grid') || document.querySelector('.tll-library-grid'); const m = !!document.documentElement && document.documentElement.hasAttribute('data-tll-place-wait');
    const st = (m ? 'mark' : '-') + ' ' + (g ? getComputedStyle(g).visibility + ' ' + [].filter.call(document.querySelectorAll('.tll-lib-card'), c => c.offsetParent).length : 'nogrid');
    if (st !== last) { last = st; window.__pw.tl.push(Math.round(performance.now()) + ' ' + st); } if (performance.now() > 12000) clearInterval(iv); }, 50); };
const placeState = page => page.evaluate(() => { const g = document.querySelector('.tll-lib-grid') || document.querySelector('.tll-library-grid');
  return { url: location.search, pressed: [].map.call(document.querySelectorAll('[data-tll-place][aria-pressed="true"]'), c => c.getAttribute('data-tll-place')), shown: [].filter.call(document.querySelectorAll('.tll-lib-card'), c => c.offsetParent).length,
    gridVis: g ? getComputedStyle(g).visibility : null, mark: document.documentElement.hasAttribute('data-tll-place-wait'), pw: window.__pw || null, shifts: window.__perf.shifts.slice(0, 8),
    chunks: [].map.call(document.querySelectorAll('script[src*="/chunks/"]'), s => s.src.replace(/^.*\//, '')) }; });

/* clipping, as ov.cjs: text runs clipped by overflow, spilling their parent, or off screen; class and width only (no text) */
const OVER = () => { const out = [];
  for (const e of document.body.querySelectorAll('*')) { if (/^(SCRIPT|STYLE|SVG|PATH|IMG|INPUT|TEXTAREA|SELECT|HTML|BODY)$/i.test(e.tagName)) continue; const r = e.getBoundingClientRect(); if (r.width < 4 || r.height < 4) continue;
    let txt = false; for (const c of e.childNodes) if (c.nodeType === 3 && c.nodeValue.trim()) txt = true; if (!txt) continue;
    const cs = getComputedStyle(e); if (cs.visibility === 'hidden') continue;
    const xo = e.scrollWidth > e.clientWidth + 1 && /hidden|clip|auto|scroll/.test(cs.overflowX + cs.overflow); const pr = e.parentElement && e.parentElement.getBoundingClientRect();
    const spill = pr && pr.width > 10 && (r.right > pr.right + 2 || r.left < pr.left - 2) && !/absolute|fixed/.test(cs.position) && cs.display !== 'inline';
    const off = r.right > innerWidth + 1;
    if (xo || spill || off) out.push((xo ? 'clip ' : spill ? 'spill ' : 'offscreen ') + e.tagName.toLowerCase() + '.' + String(e.className).split(' ')[0] + ' ' + Math.round(r.width) + '/' + Math.round(pr ? pr.width : 0) + ' i' + [].indexOf.call(document.querySelectorAll(e.tagName), e)); }
  const meta = [].filter.call(document.querySelectorAll('.tll-lib-meta'), e => e.offsetParent);
  return { n: out.length, list: out, meta: meta.length, metaClipped: meta.filter(e => e.scrollWidth > e.clientWidth + 1).length, metaLs: meta[0] && getComputedStyle(meta[0]).letterSpacing, metaFs: meta[0] && getComputedStyle(meta[0]).fontSize }; };
const eyebrows = page => page.evaluate(() => ({ eb: [].map.call(document.querySelectorAll('[data-tll-x=eyebrow]'), e => getComputedStyle(e).fontSize + (e.closest('[data-tll-x=map],[id*=map],[class*=map]') ? ' map' : '') + (e.offsetParent ? '' : ' hidden')),
  docState: document.readyState }));

const T = [];
const add = (name, vs, file, w, s, opt, runs) => { for (let run = 0; run < (runs || 1); run++) for (const v of vs) T.push([name, v, file, w, s, opt, run]); };
const GP = [['home.html', '/'], ['account.html', '/account'], ['stories.html', '/stories'], ['the-map.html', '/the-map'], ['about.html', '/about']];
/* note 1 and 2: card with the preview flag (localStorage tll-preview-* key), all five pages, both widths, scrolled top, bottom, middle */
for (const [f] of GP) for (const w of [390, 1440]) add('N1 card flag ' + f + ' ' + w, ['br', 'base'], f, w, 1, { init: both(PV, setKey('/submit', 1)), act: atScroll, wait: 6000 });
add('N1 card ?preview= home 390', ['br'], 'home.html', 390, 1, { q: '?preview=check', init: setKey('/my-pets', 1), act: atScroll, wait: 6000 });
add('N1 card ?qr= stories 1440', ['br'], 'stories.html', 1440, 1, { q: '?qr=1', init: setKey('/share-photos', 1), act: atScroll, wait: 6000 });
add('N1 card flag account 960', ['br'], 'account.html', 960, 1, { init: both(PV, setKey('/submit', 1)), act: gateCard, wait: 6000 });
add('N1 card back link flag', ['br'], 'account.html', 1440, 1, { init: both(PV, setKey('/submit', 1)), act: cardBack });
add('N1 card close flag', ['br'], 'home.html', 390, 1, { init: both(PV, setKey('/submit', 1)), act: closeCard });
add('N1 expired 31 min flag', ['br'], 'home.html', 1440, 1, { init: both(PV, setKey('/submit', 31)), act: gateCard });
add('N1 signed out flag', ['br'], 'home.html', 390, 0, { init: both(PV, setKey('/submit', 1)), act: gateCard });
add('N1 Memberstack blocked flag', ['br'], 'home.html', 1440, 1, { init: both(PV, setKey('/submit', 1)), noMs: true, wait: 8000, act: gateCard });
/* note 2: no flag: no card, no style, the key left exactly as live leaves it; the gate click stores no key */
for (const [f] of GP) for (const w of [390, 1440]) add('N2 no flag ' + f + ' ' + w, ['live', 'br'], f, w, 1, { init: setKey('/submit', 1), act: keyState, wait: 6000 });
for (const [f, w] of [['submit.html', 390], ['my-pets.html', 1440], ['share-photos.html', 390]]) { add('N2 gate click no flag ' + f, ['live', 'base', 'br'], f, w, 0, { act: gateClick }); add('N2 gate click flag ' + f, ['br'], f, w, 0, { init: PV, act: gateClick }); }
add('N2 nav login flag', ['br'], 'submit.html', 1440, 0, { init: PV, act: navClick });
/* note 3: ?place= with core and chunks 3 s late; at normal speed; edge cases */
add('N3 late ?place=Europe 390', ['live', 'base', 'br'], 'stories.html', 390, 0, { q: '?place=Europe', slowJs: 3000, wait: 8000, init: WAITWATCH, act: placeState }, 5);
add('N3 late ?place=Europe 1440', ['live', 'base', 'br'], 'stories.html', 1440, 0, { q: '?place=Europe', slowJs: 3000, wait: 8000, init: WAITWATCH, act: placeState }, 5);
add('N3 late ?place=Asia 390', ['live', 'base', 'br'], 'stories.html', 390, 0, { q: '?place=Asia', slowJs: 3000, wait: 8000, init: WAITWATCH, act: placeState }, 3);
add('N3 ?place=Europe 390', ['live', 'base', 'br'], 'stories.html', 390, 0, { q: '?place=Europe', init: WAITWATCH, act: placeState }, 3);
add('N3 ?place=Europe 1440', ['live', 'base', 'br'], 'stories.html', 1440, 0, { q: '?place=Europe', init: WAITWATCH, act: placeState }, 3);
add('N3 late no place 390', ['live', 'br'], 'stories.html', 390, 0, { slowJs: 3000, wait: 8000, init: WAITWATCH, act: placeState }, 2);
add('N3 ?place=Nowhere', ['br'], 'stories.html', 390, 0, { q: '?place=Nowhere', init: WAITWATCH, act: placeState });
add('N3 ?place=europe lower', ['br'], 'stories.html', 390, 0, { q: '?place=europe', init: WAITWATCH, act: placeState });
add('N3 ?place=Middle%20East', ['br'], 'stories.html', 390, 0, { q: '?place=Middle%20East', init: WAITWATCH, act: placeState });
add('N3 ?q=lisbon&place=Europe', ['br'], 'stories.html', 390, 0, { q: '?q=lisbon&place=Europe', init: WAITWATCH, act: placeState });
add('N3 chunks blocked ?place=Europe', ['br'], 'stories.html', 390, 0, { q: '?place=Europe', block: /^chunks\//, init: WAITWATCH, act: placeState });
add('N3 chips script missing ?place=Europe', ['br'], 'stories.html', 390, 0, { q: '?place=Europe', init: WAITWATCH, act: placeState, mod: b => b.replace('<script id="tll-lib-chips-v1">', '<script id="tll-lib-chips-v1" type="text/plain">') });
add('N3 flag ?place=Europe late', ['br'], 'stories.html', 390, 0, { q: '?place=Europe&preview=check', slowJs: 3000, wait: 8000, init: WAITWATCH, act: placeState });
add('N3 slow net ?place=Europe', ['live', 'br'], 'stories.html', 390, 0, { q: '?place=Europe', throttle: { lat: 300, down: 200000, cpu: 4 }, wait: 9000, init: WAITWATCH, act: placeState });
/* note 3 again with the watcher fixed (the first watcher threw: documentElement was null at init) */
add('N3b late ?place=Europe 390', ['br', 'live'], 'stories.html', 390, 0, { q: '?place=Europe', slowJs: 3000, wait: 8000, init: WAITWATCH, act: placeState }, 3);
add('N3b late ?place=Asia 390', ['br'], 'stories.html', 390, 0, { q: '?place=Asia', slowJs: 3000, wait: 8000, init: WAITWATCH, act: placeState }, 2);
add('N3b late ?place=Europe 1440', ['br'], 'stories.html', 1440, 0, { q: '?place=Europe', slowJs: 3000, wait: 8000, init: WAITWATCH, act: placeState }, 2);
add('N3b ?place=Europe 390', ['br'], 'stories.html', 390, 0, { q: '?place=Europe', init: WAITWATCH, act: placeState }, 2);
add('N3b ?place=Europe 1440', ['br'], 'stories.html', 1440, 0, { q: '?place=Europe', init: WAITWATCH, act: placeState }, 2);
add('N3b ?place=Nowhere', ['br'], 'stories.html', 390, 0, { q: '?place=Nowhere', init: WAITWATCH, act: placeState });
add('N3b no place', ['br'], 'stories.html', 390, 0, { init: WAITWATCH, act: placeState });
add('N3b chunks blocked ?place=Europe', ['br'], 'stories.html', 390, 0, { q: '?place=Europe', block: /^chunks\//, init: WAITWATCH, act: placeState });
add('N3b stories chunk blocked ?place=Europe', ['br'], 'stories.html', 390, 0, { q: '?place=Europe', block: /^chunks\/stories/, init: WAITWATCH, act: placeState });
add('N3b chips script missing ?place=Europe', ['br'], 'stories.html', 390, 0, { q: '?place=Europe', init: WAITWATCH, act: placeState, mod: b => b.replace('<script id="tll-lib-chips-v1">', '<script id="tll-lib-chips-v1" type="text/plain">') });
add('N3b flag ?place=Europe late', ['br'], 'stories.html', 390, 0, { q: '?place=Europe&preview=check', slowJs: 3000, wait: 8000, init: WAITWATCH, act: placeState });
/* note 4: clipping on /stories (390 the focus, 1440 too) */
add('N4 clip stories 390', ['live', 'base', 'br'], 'stories.html', 390, 0, { act: p => p.evaluate(OVER) }, 3);
add('N4 clip stories 1440', ['live', 'base', 'br'], 'stories.html', 1440, 0, { act: p => p.evaluate(OVER) }, 2);
/* note 8: /for-expats eyebrows in every load; also with the scripts late */
add('N8 eyebrow 390', ['live', 'base', 'br'], 'for-expats.html', 390, 0, { act: eyebrows }, 4);
add('N8 eyebrow 1440', ['live', 'base', 'br'], 'for-expats.html', 1440, 0, { act: eyebrows }, 4);
add('N8 eyebrow late 390', ['live', 'br'], 'for-expats.html', 390, 0, { slowJs: 3000, wait: 7000, act: eyebrows }, 2);
/* note 2, A01 (C13): the page note wins on ?q=zzqx; with and without the flag */
const qnote = page => page.evaluate(() => { const n = document.getElementById('tll-q-note'); return n ? { s3: n.getAttribute('data-s3'), si: n.getAttribute('data-tll-si'), page: /^No stories match/.test(n.innerText.trim()), fallback: /^No story matches/.test(n.innerText.trim()), vis: !!n.offsetParent } : null; });
add('A01 ?q=zzqx', ['live', 'base', 'br'], 'stories.html', 390, 0, { q: '?q=zzqx', act: qnote }, 2);
add('A01 ?q=zzqx late', ['br'], 'stories.html', 390, 0, { q: '?q=zzqx', slowJs: 3000, wait: 7000, act: qnote });

if (require.main === module) (async () => {
  const flt = process.argv[2]; const done = new Set(fs.existsSync(RES) ? fs.readFileSync(RES, 'utf8').split('\n').filter(Boolean).map(l => { const j = JSON.parse(l); return j.name + ' ' + j.v + ' ' + j.run; }) : []);
  const browser = await chromium.launch({ args: ['--no-sandbox'], proxy: { server: process.env.HTTPS_PROXY || 'http://127.0.0.1:44389' } });
  try { for (const [name, v, f, w, s, opt, run] of T) { if (flt && !name.includes(flt)) continue; if (done.has(name + ' ' + v + ' ' + run)) continue;
      const st = await load(browser, v, f, w, !!s, Object.assign({ sig: false, tag: 'bt2' }, opt)); st.name = name; st.run = run;
      fs.appendFileSync(RES, JSON.stringify(st) + '\n'); console.log(name, v, run, 'errs', st.errs.length, 'cls', st.perf && st.perf.cls, JSON.stringify(st.act || '').slice(0, 260), st.navErr || ''); } }
  finally { await browser.close(); }
})();
