/* /stories page code, first-paint stability check (7 Nov 2026). Copy of swap-live.cjs, extended; swap-live.cjs itself is untouched.
   Loads the live www.thatlayover.life/stories with the saved page head and footer blocks (before/) replaced by the edited ones
   (after/), measures, checks function, screenshots and compares. Nothing is written to Webflow.

   Usage (NODE_PATH=/opt/node22/lib/node_modules):
     node check-stories.cjs measure [runs]      cls, fcp, lcp and the shift list, before and after, 390 and 1440, layers old and new,
                                                runs each (default 3), medians printed; JSON in out/measure.json
     node check-stories.cjs functional          merge, search, chips, lead card and page errors on the after page, 390 and 1440
     node check-stories.cjs shots               screenshots at 12 s, before and after, 390 and 1440, PNG diff with a 2% tolerance
     node check-stories.cjs cascade             selectors shared between the moved style blocks and the blocks whose order changed,
                                                plus a computed-style diff of every element, before against after
     node check-stories.cjs diff                every hunk between the before and after files
     node check-stories.cjs all                 all of the above
   Env: LAYERS=old,new,live (default old,new), SHOTS_DIR (default out/), PAGE (default /stories).
   Layers pins: old = 16.49.0 (4fdf0e1, what was live when the task was written), new = staged 16.50.1 (544f412),
   live = whatever pin the served page carries (f9e8ab4 on 7 Nov, 16.50.1 plus the byline focus fix). The served page's own pin is
   read from the HTML, so the swap keeps working after the site pin moves. Throttled like Lighthouse mobile at widths under 800. */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const { execSync, execFileSync } = require('child_process');
const DIR = __dirname; const BEFORE = path.join(DIR, 'before'), AFTER = path.join(DIR, 'after'); const OUT = process.env.SHOTS_DIR || path.join(DIR, 'out'); fs.mkdirSync(OUT, { recursive: true });
const PAGE = process.env.PAGE || '/stories'; const ORIGIN = 'https://www.thatlayover.life';
const PINS = { old: ['4fdf0e1dd86efb7222ce9974a11c5f3b37dec395', 'sha384-nhPusohaBlq/Zjv4waze9244S8XzUexwIq2EQptseCl0pJQsH9ZU4tDvVmERTr8c'], new: ['544f412343657747c405d12d5d966a08784cccc5', 'sha384-T/eNEKiifHPXkqmxXQNq0YE+noKr4zXkKi/jumEY/gtAu7S3qIZr3VvOmQOam/tB'] };
const FILES = ['stories-head.html', 'stories-footer.html'];
const LAYERS = (process.env.LAYERS || 'old,new').split(',');
const MERGE_GATE = 'html.tllp-stories';

function fetchPage(url) { return execSync('curl -sS -m 60 ' + JSON.stringify(url), { maxBuffer: 1 << 26 }).toString('utf8'); }
function swapBlocks(body, state) {
  if (state !== 'after') return body;
  for (const f of FILES) { const bf = fs.readFileSync(path.join(BEFORE, f), 'utf8').trim(), af = fs.readFileSync(path.join(AFTER, f), 'utf8').trim(); const n = body.split(bf).length - 1; if (n !== 1) throw new Error(`block ${f} occurs ${n} times in the served page`); body = body.replace(bf, () => af); }
  return body;
}
function swapLayers(body, layers) {
  if (layers === 'live' || !PINS[layers]) return body;
  const m = /thatlayoverlife@([0-9a-f]{40})\/src\/site-layers\/tll-site-layers-v16\.js/.exec(body); if (!m) throw new Error('site layers tag not found');
  const [pin, sri] = PINS[layers]; if (m[1] === pin) return body;
  const re = new RegExp('(<script[^>]*' + m[1] + '[^>]*>)'); body = body.replace(re, (tag) => tag.replace(m[1], pin).replace(/integrity="[^"]*"/, 'integrity="' + sri + '"'));
  if (!body.includes(pin)) throw new Error('layers swap failed'); return body;
}
async function open(width, layers, state, opts = {}) {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width, height: width < 800 ? 844 : 900 }, isMobile: width < 800, hasTouch: width < 800, deviceScaleFactor: 1 });
  const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  if (width < 800 && !opts.fast) { await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 }); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); }
  const reqs = []; p.on('request', (r) => { if (/cookieconsent|site-layers|chunks\//.test(r.url())) reqs.push(r.url().replace(/^https:\/\/[^/]+\//, '').slice(0, 90)); });
  const errors = []; p.on('pageerror', (e) => errors.push(String(e.message).slice(0, 160)));
  await p.route((u) => u.origin === ORIGIN && u.pathname === PAGE, async (route) => {
    let body = fetchPage(route.request().url()); body = swapBlocks(body, state); body = swapLayers(body, layers);
    await route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body });
  });
  await p.addInitScript(() => { window.__m = { lcp: 0, cls: 0, fcp: 0, shifts: [], mergedAt: 0, dclAt: 0 };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) { window.__m.cls += e.value; window.__m.shifts.push([Math.round(e.startTime), +e.value.toFixed(3), (e.sources || []).slice(0, 3).map((s) => { const n = s.node; return n ? (n.id ? '#' + n.id : (n.nodeType === 1 ? n.tagName.toLowerCase() + '.' + String(n.className).split(' ').slice(0, 2).join('.') : '#text')).slice(0, 50) + ' y' + Math.round(s.previousRect.y) + '>' + Math.round(s.currentRect.y) : '?'; })]); } }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__m.fcp = e.startTime; }).observe({ type: 'paint', buffered: true });
    const mo = new MutationObserver(() => { if (!window.__m.mergedAt && document.querySelector('.tll-filters-inner[data-tll-merged]')) { window.__m.mergedAt = Math.round(performance.now()); mo.disconnect(); } }); mo.observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-tll-merged'] }); // document, not documentElement: at init-script time <html> does not exist yet
    document.addEventListener('DOMContentLoaded', () => { window.__m.dclAt = Math.round(performance.now()); }); });
  await p.goto(ORIGIN + PAGE, { waitUntil: 'load', timeout: 120000 });
  return { b, p, reqs, errors };
}
const median = (a) => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };

async function measure(runs) {
  const rows = [];
  for (const width of [390, 1440]) for (const layers of LAYERS) for (const state of ['before', 'after']) {
    const got = [];
    for (let i = 0; i < runs; i++) {
      const { b, p, errors, reqs } = await open(width, layers, state); await p.waitForTimeout(12000);
      const m = await p.evaluate(() => window.__m); const shot = path.join(OUT, `measure-${state}-${width}-${layers}-${i}.png`); await p.screenshot({ path: shot });
      const r = { width, layers, state, run: i, fcp: Math.round(m.fcp), lcp: Math.round(m.lcp), cls: +m.cls.toFixed(3), mergedAt: m.mergedAt, dclAt: m.dclAt, shifts: m.shifts.filter((s) => s[1] >= 0.01), errors, reqs: reqs.slice(0, 4), shot };
      got.push(r); console.log(JSON.stringify(r)); await b.close();
    }
    rows.push({ width, layers, state, runs: got, fcp: median(got.map((g) => g.fcp)), lcp: median(got.map((g) => g.lcp)), cls: median(got.map((g) => g.cls)), mergedAt: median(got.map((g) => g.mergedAt)), dclAt: median(got.map((g) => g.dclAt)), errors: got.flatMap((g) => g.errors) });
  }
  fs.writeFileSync(path.join(OUT, 'measure.json'), JSON.stringify(rows, null, 1));
  console.log('\nMEDIANS (runs=' + runs + ')\nwidth layers state  fcp   lcp   cls    mergedAt dclAt errors');
  for (const r of rows) console.log([r.width, r.layers, r.state.padEnd(6), String(r.fcp).padStart(5), String(r.lcp).padStart(5), String(r.cls).padEnd(6), String(r.mergedAt).padStart(8), String(r.dclAt).padStart(5), r.errors.length].join(' '));
  console.log('\nSHIFTS (median-cls run of each case)');
  for (const r of rows) { const pick = r.runs.slice().sort((a, b2) => a.cls - b2.cls)[Math.floor(r.runs.length / 2)]; console.log(r.width, r.layers, r.state, 'cls', pick.cls, JSON.stringify(pick.shifts)); }
  return rows;
}

async function functional() {
  let ok = true; const say = (pass, msg) => { ok = ok && pass; console.log((pass ? 'PASS ' : 'FAIL ') + msg); };
  for (const layers of LAYERS) for (const width of [390, 1440]) {
    console.log(`-- layers ${layers}, ${width}px`);
    const { b, p, errors } = await open(width, layers, 'after', { fast: true }); await p.waitForTimeout(3000);
    const s = await p.evaluate(() => { const inner = document.querySelector('.tll-library-filters .tll-filters-inner[data-tll-merged]'); const bar = document.querySelector('.tllsb-bar'); return { merged: !!(inner && inner.querySelector('.tllsb-form')), slot: !!(inner && inner.querySelector('.tll-lib-searchslot .tllsb-form')), barHidden: !!bar && getComputedStyle(bar).display === 'none', clearInSlot: !!(inner && inner.querySelector('.tll-lib-searchslot #tll-lib-clear')), mergedAt: window.__m.mergedAt, dclAt: window.__m.dclAt, lead: (() => { const g = document.querySelector('.tll-lib-grid'); if (!g) return 'no grid'; const kids = [].slice.call(g.children); const first = kids.find((k) => getComputedStyle(k).display !== 'none'); return first && first.hasAttribute('data-tll-lead') && kids.filter((k) => k.hasAttribute('data-tll-lead')).length === 1; })() }; });
    say(s.merged && s.slot, `${width}: search form merged into .tll-filters-inner[data-tll-merged] (slot ${s.slot})`);
    say(s.barHidden, `${width}: .tllsb-bar hidden`);
    say(s.clearInSlot, `${width}: #tll-lib-clear moved into the slot`);
    say(s.mergedAt > 0 && (s.dclAt === 0 || s.mergedAt <= s.dclAt), `${width}: merged at ${s.mergedAt} ms, DOMContentLoaded at ${s.dclAt} ms`);
    say(s.lead === true, `${width}: [data-tll-lead] on the first visible card only (${s.lead})`);
    // place chip
    await p.click('[data-tll-place="Europe"]'); await p.waitForTimeout(800);
    const c = await p.evaluate(() => { const g = document.querySelector('.tll-lib-grid'); const kids = [].slice.call(g.children); const region = (k) => { const n = k.querySelector('[data-tll-region]'); return n ? n.textContent.trim() : ''; };
      const shown = kids.filter((k) => getComputedStyle(k).display !== 'none'), hidden = kids.filter((k) => getComputedStyle(k).display === 'none');
      const chip = document.querySelector('[data-tll-place="Europe"]'), all = document.querySelector('[data-tll-place="all"]');
      const first = shown[0]; return { shown: shown.length, hidden: hidden.length, shownOk: shown.every((k) => region(k) === 'Europe'), hiddenOk: hidden.every((k) => region(k) !== 'Europe'), chipOn: chip.classList.contains('tll-filter-chip-on') && !chip.classList.contains('tll-shelf-chip') && chip.getAttribute('aria-pressed') === 'true', allOff: all.classList.contains('tll-shelf-chip') && !all.classList.contains('tll-filter-chip-on'), leadOk: !!first && first.hasAttribute('data-tll-lead') && kids.filter((k) => k.hasAttribute('data-tll-lead')).length === 1 }; });
    say(c.shown > 0 && c.hidden > 0 && c.shownOk && c.hiddenOk, `${width}: Europe chip shows ${c.shown} Europe cards and hides ${c.hidden} others`);
    say(c.chipOn && c.allOff, `${width}: active chip has tll-filter-chip-on, All places back to tll-shelf-chip`);
    say(c.leadOk, `${width}: [data-tll-lead] re-marked on the first visible Europe card`);
    // search: type a word, press Enter, expect /stories?q=word
    const iw = await p.evaluate(() => { const i = document.getElementById('tll-lib-q'); const r = i.getBoundingClientRect(); const bt = i.form.querySelector('[type=submit]').getBoundingClientRect(); return { input: Math.round(r.width), button: Math.round(bt.width), form: Math.round(i.form.getBoundingClientRect().width) }; });
    console.log((iw.input > 100 ? 'PASS ' : 'WARN ') + `${width}: search input is ${iw.input}px wide (button ${iw.button}px, form ${iw.form}px)` + (iw.input > 100 ? '' : '; the live page has this too, with every layers pin, so it is not from these files (a phone-width button rule makes the Search button fill the form)'));
    // focus plus keyboard rather than fill(): fill() refuses a zero-width field, and the keydown handler is what the page wires
    await p.focus('#tll-lib-q'); await p.keyboard.type('train'); await Promise.all([p.waitForURL((u) => u.pathname === PAGE && u.searchParams.get('q') === 'train', { timeout: 30000 }), p.keyboard.press('Enter')]);
    await p.waitForTimeout(2500);
    const q = await p.evaluate(() => { const cards = [].slice.call(document.querySelectorAll('.tll-lib-grid > *')); const miss = cards.filter((k) => k.hasAttribute('data-tll-q-miss')); const clr = document.getElementById('tll-lib-clear'); return { url: location.pathname + location.search, value: document.getElementById('tll-lib-q').value, missHidden: miss.every((k) => getComputedStyle(k).display === 'none'), misses: miss.length, cards: cards.length, clearShown: !!clr && getComputedStyle(clr).display !== 'none', merged: !!document.querySelector('.tll-filters-inner[data-tll-merged] .tllsb-form'), note: !!document.getElementById('tll-q-note') }; });
    say(q.url === PAGE + '?q=train', `${width}: Enter navigated to ${q.url}`);
    say(q.value === 'train' && q.merged, `${width}: ?q page keeps the word in the input and the merged slot`);
    say(q.missHidden, `${width}: ?q page hides ${q.misses} of ${q.cards} cards as misses (clear link shown ${q.clearShown}, no-results note ${q.note})`);
    say(errors.length === 0, `${width}: page errors: ${JSON.stringify(errors)}`);
    await b.close();
  }
  console.log(ok ? 'FUNCTIONAL OK' : 'FUNCTIONAL FAILED'); return ok;
}

async function shots() {
  const res = [];
  for (const width of [390, 1440]) for (const layers of LAYERS) {
    const files = {};
    for (const state of ['before', 'after']) { const { b, p } = await open(width, layers, state); await p.waitForTimeout(12000); files[state] = path.join(OUT, `shot-${state}-${width}-${layers}.png`); await p.screenshot({ path: files[state] }); await b.close(); }
    const d = await pngDiff(files.before, files.after, path.join(OUT, `shot-diff-${width}-${layers}.png`));
    res.push({ width, layers, ...d }); console.log(JSON.stringify({ width, layers, ...d }));
  }
  fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify(res, null, 1)); return res;
}
async function pngDiff(a, b2, outFile) {
  const b = await chromium.launch(); const p = await b.newPage();
  const r = await p.evaluate(async ([da, db, tol]) => {
    const load = (src) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
    const A = await load(da), B = await load(db); const w = Math.max(A.width, B.width), h = Math.max(A.height, B.height);
    const cv = (img) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.drawImage(img, 0, 0); return x.getImageData(0, 0, w, h).data; };
    const pa = cv(A), pb = cv(B); const out = document.createElement('canvas'); out.width = w; out.height = h; const ox = out.getContext('2d'); const od = ox.createImageData(w, h);
    let diff = 0, minX = w, minY = h, maxX = -1, maxY = -1; const rowsHit = {};
    for (let i = 0; i < w * h; i++) { const k = i * 4; const dd = Math.max(Math.abs(pa[k] - pb[k]), Math.abs(pa[k + 1] - pb[k + 1]), Math.abs(pa[k + 2] - pb[k + 2])); const hit = dd > tol;
      od.data[k] = hit ? 255 : pa[k] >> 2 | 192; od.data[k + 1] = hit ? 0 : pa[k + 1] >> 2 | 192; od.data[k + 2] = hit ? 0 : pa[k + 2] >> 2 | 192; od.data[k + 3] = 255;
      if (hit) { diff++; const x = i % w, y = (i / w) | 0; if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; rowsHit[y] = (rowsHit[y] || 0) + 1; } }
    ox.putImageData(od, 0, 0);
    const bands = []; let cur = null; for (const y of Object.keys(rowsHit).map(Number).sort((p1, p2) => p1 - p2)) { if (cur && y - cur.to <= 2) { cur.to = y; cur.px += rowsHit[y]; } else { cur = { from: y, to: y, px: rowsHit[y] }; bands.push(cur); } }
    return { w, h, total: w * h, diff, pct: +(100 * diff / (w * h)).toFixed(3), box: maxX < 0 ? null : [minX, minY, maxX, maxY], bands: bands.slice(0, 12), png: out.toDataURL('image/png') };
  }, ['data:image/png;base64,' + fs.readFileSync(a).toString('base64'), 'data:image/png;base64,' + fs.readFileSync(b2).toString('base64'), Math.round(255 * 0.02)]);
  fs.writeFileSync(outFile, Buffer.from(r.png.split(',')[1], 'base64')); delete r.png; await b.close(); r.diffPng = outFile; return r;
}

/* Cascade: 1. static, which selectors in the moved blocks also appear in blocks whose order against them changed; 2. empirical, the
   computed style of every element before and after, same layers, same width, at rest. */
function parseCss(css) { // rules as {sel, decls:{prop:[value,important]}, media}
  css = css.replace(/\/\*[\s\S]*?\*\//g, ''); const rules = []; let i = 0; const stack = [];
  while (i < css.length) { const j = css.indexOf('{', i); if (j < 0) break; const head = css.slice(i, j).trim();
    if (head.startsWith('@')) { stack.push(head); i = j + 1; continue; }
    const k = css.indexOf('}', j); const body = css.slice(j + 1, k); const decls = {};
    for (const d of body.split(';')) { const c = d.indexOf(':'); if (c < 0) continue; const prop = d.slice(0, c).trim(); let val = d.slice(c + 1).trim(); const imp = /!important$/.test(val); val = val.replace(/\s*!important$/, ''); if (prop) decls[prop] = [val, imp]; }
    for (const sel of head.split(',')) rules.push({ sel: sel.trim().replace(/\s+/g, ' '), decls, media: stack.join(' ') });
    i = k + 1; while (css[i] === '}' || /\s/.test(css[i] || '')) { if (css[i] === '}') stack.pop(); i++; } }
  return rules;
}
function specificity(sel) { const s = sel.replace(/::?[a-z-]+(\([^)]*\))?/gi, (m) => (/^::/.test(m) ? ' e' : /^:(not|is|where|has)\(/.test(m) ? ' ' + m.slice(m.indexOf('(') + 1, -1) : ' c')); const ids = (s.match(/#[\w-]+/g) || []).length; const cls = (s.match(/\.[\w-]+|\[[^\]]+\]|(^|\s)c(\s|$)/g) || []).length; const els = (s.match(/(^|[\s>+~])[a-z][\w-]*/gi) || []).length + (s.match(/(^|\s)e(\s|$)/g) || []).length; return [ids, cls, els]; }
function keyTokens(sel) { const last = sel.split(/[\s>+~]+(?![^(]*\))/).pop(); return (last.match(/[.#][\w-]+|\[[\w-]+/g) || []).map((t) => t.replace(/^\[/, '')); }
async function cascade() {
  const live = fetchPage(ORIGIN + PAGE); const headBefore = fs.readFileSync(path.join(BEFORE, 'stories-head.html'), 'utf8'), footBefore = fs.readFileSync(path.join(BEFORE, 'stories-footer.html'), 'utf8');
  const blocksOf = (html, tag) => { const out = []; const re = /<style(?:\s+id="([^"]*)")?[^>]*>([\s\S]*?)<\/style>/g; let m; while ((m = re.exec(html))) out.push({ id: m[1] || ('(no id) ' + m[2].trim().slice(0, 40).replace(/\s+/g, ' ')), css: m[2], tag }); return out; };
  const moved = blocksOf(footBefore, 'moved').filter((b) => ['tll-lib-fixfirst-v1', 'tll-s3-stories-v1'].includes(b.id));
  // blocks whose order against the moved blocks flips: static styles between the page head block and the page footer block in the served
  // HTML (site footer custom code, the page footer's own remaining blocks), plus the styles scripts append to <head> at run time
  const hb = live.indexOf(headBefore.trim()), fb = live.indexOf(footBefore.trim()); if (hb < 0 || fb < 0) throw new Error('saved blocks not found in the served page');
  const between = blocksOf(live.slice(hb + headBefore.trim().length, fb), 'static-between').concat(blocksOf(footBefore, 'page-footer').filter((b) => !['tll-lib-fixfirst-v1', 'tll-s3-stories-v1'].includes(b.id)));
  const { b, p } = await open(1440, LAYERS.includes('new') ? 'new' : LAYERS[0], 'after', { fast: true }); await p.waitForTimeout(6000);
  const injected = await p.evaluate(() => [].map.call(document.head.querySelectorAll('style'), (s) => ({ id: s.id || ('(no id) ' + (s.textContent || '').trim().slice(0, 40).replace(/\s+/g, ' ')), css: s.textContent, tag: 'head-injected' })).filter((s) => !/^tll-(lib-search-v2|lib-filters-mobile-v1|flow-v1|v9-j12-v1|lib-fixfirst-v1|s3-stories-v1)$/.test(s.id)));
  await b.close();
  const flipped = between.concat(injected.filter((s) => !between.some((x) => x.id === s.id)));
  console.log('Moved blocks:', moved.map((m) => m.id).join(', ')); console.log('Blocks whose order against them flips (' + flipped.length + '):', flipped.map((f) => f.id + ' [' + f.tag + ']').join('; '));
  const movedRules = moved.flatMap((m) => parseCss(m.css).map((r) => ({ ...r, block: m.id }))); let orderDependent = 0; const seen = new Set();
  for (const f of flipped) for (const r of parseCss(f.css)) { const kr = keyTokens(r.sel); if (!kr.length) continue;
    for (const m of movedRules) { const km = keyTokens(m.sel); if (!km.some((t) => kr.includes(t))) continue; const props = Object.keys(m.decls).filter((pr) => r.decls[pr]); if (!props.length) continue;
      for (const pr of props) { const [mv, mi] = m.decls[pr], [rv, ri] = r.decls[pr]; const sm = specificity(m.sel), sr = specificity(r.sel); const cmp = sm.join() === sr.join() ? 'equal' : (sm[0] - sr[0] || sm[1] - sr[1] || sm[2] - sr[2]) > 0 ? 'moved wins' : 'other wins';
        const verdict = mi !== ri ? (mi ? 'moved !important wins' : 'other !important wins') : cmp === 'equal' ? (mv === rv ? 'same value' : 'ORDER DEPENDENT') : cmp;
        const key = [m.block, m.sel, pr, f.id, r.sel].join('|'); if (seen.has(key)) continue; seen.add(key); if (verdict === 'ORDER DEPENDENT') orderDependent++;
        if (verdict === 'ORDER DEPENDENT' || process.env.VERBOSE) console.log(`  ${verdict}: ${m.block} "${m.sel}" {${pr}:${mv}${mi ? ' !important' : ''}} vs ${f.id} "${r.sel}" {${pr}:${rv}${ri ? ' !important' : ''}} spec ${sm}/${sr}${m.media || r.media ? ' media ' + (m.media || '-') + ' / ' + (r.media || '-') : ''}`); } } }
  console.log('Static: ' + orderDependent + ' order-dependent (same specificity, same importance, different value) declaration pairs; everything else is decided by importance or specificity, not by order. VERBOSE=1 lists every pair.');
  // exact selector strings that appear in both a moved block and a flipped block
  const flippedSel = new Map(); for (const f of flipped) for (const r of parseCss(f.css)) flippedSel.set(r.sel, (flippedSel.get(r.sel) || new Set()).add(f.id));
  const shared = [...new Set(movedRules.map((r) => r.sel))].filter((s) => flippedSel.has(s)); console.log('Selectors appearing verbatim in a moved block and a flipped block: ' + (shared.length ? shared.map((s) => `"${s}" (${[...flippedSel.get(s)].join(', ')})`).join('; ') : 'none'));
  // empirical: computed styles of every element, before vs after, at rest
  const layers = LAYERS.includes('new') ? 'new' : LAYERS[0]; const report = [];
  for (const width of [390, 1440]) { const snaps = {};
    for (const state of ['before', 'after']) { const { b: bb, p: pp } = await open(width, layers, state, { fast: true }); await pp.waitForTimeout(8000);
      snaps[state] = await pp.evaluate(() => { const skip = /^(transition|animation|--|-webkit-locale$)/; const out = {}; const pathOf = (e) => { const parts = []; while (e && e.nodeType === 1 && e !== document.documentElement) { let i = 1, s = e; while ((s = s.previousElementSibling)) if (!/^(IFRAME|SCRIPT|STYLE|LINK|NOSCRIPT)$/.test(s.tagName)) i++; parts.unshift(e.tagName.toLowerCase() + (e.id && !/^cf-chl/.test(e.id) ? '#' + e.id : '') + ':' + i); e = e.parentNode; } return parts.join('>'); };
        for (const e of document.querySelectorAll('body *')) { if (e.closest('#cc-main,#tll-note,script,style,iframe') || /^(IFRAME|SCRIPT|STYLE|LINK|NOSCRIPT)$/.test(e.tagName)) continue; const cs = getComputedStyle(e); const o = {}; for (const pr of cs) { if (skip.test(pr)) continue; o[pr] = cs.getPropertyValue(pr); } out[pathOf(e)] = o; } return out; });
      await bb.close(); }
    const diffs = []; for (const k of Object.keys(snaps.before)) { const a = snaps.before[k], c = snaps.after[k]; if (!c) { diffs.push([k, 'missing after']); continue; } for (const pr of Object.keys(a)) if (a[pr] !== c[pr]) diffs.push([k, pr, a[pr], c[pr]]); }
    const onlyAfter = Object.keys(snaps.after).filter((k) => !snaps.before[k]);
    console.log(`Computed-style diff at ${width}: ${Object.keys(snaps.before).length} elements, ${diffs.length} differing declarations, ${onlyAfter.length} elements only after`);
    for (const d of diffs.slice(0, 40)) console.log('   ', d.join(' | ').slice(0, 220)); report.push({ width, elements: Object.keys(snaps.before).length, diffs: diffs.slice(0, 200), onlyAfter: onlyAfter.slice(0, 20) }); }
  fs.writeFileSync(path.join(OUT, 'cascade.json'), JSON.stringify(report, null, 1));
}

function diffHunks() {
  for (const f of FILES) { let out = ''; try { out = execFileSync('diff', ['-u', path.join(BEFORE, f), path.join(AFTER, f)]).toString(); } catch (e) { out = e.stdout.toString(); }
    const hunks = out.split('\n').filter((l) => l.startsWith('@@')); console.log(`${f}: ${hunks.length} hunk(s)`); for (const h of hunks) console.log('  ' + h);
    const plus = out.split('\n').filter((l) => /^\+[^+]/.test(l)).length, minus = out.split('\n').filter((l) => /^-[^-]/.test(l)).length; console.log(`  +${plus} -${minus} lines`); }
  // the moved blocks are byte for byte identical
  const fb = fs.readFileSync(path.join(BEFORE, 'stories-footer.html'), 'utf8'), ha = fs.readFileSync(path.join(AFTER, 'stories-head.html'), 'utf8'), fa = fs.readFileSync(path.join(AFTER, 'stories-footer.html'), 'utf8'), hb = fs.readFileSync(path.join(BEFORE, 'stories-head.html'), 'utf8');
  for (const id of ['tll-lib-fixfirst-v1', 'tll-s3-stories-v1']) { const open2 = `<style id="${id}">`; const i = fb.indexOf(open2), j = fb.indexOf('</style>', i) + 8; const block = fb.slice(i, j); console.log(`${id}: ${block.length} chars, in after head ${ha.split(block).length - 1} time(s), in after footer ${fa.split(open2).length - 1} time(s)`); }
  console.log('after head = before head + moved blocks' + (ha.startsWith(hb) ? ' (before head is a byte-for-byte prefix of after head)' : ' (NOT a prefix)'));
  // nothing dropped: every selector, id, data attribute, form and input name of the before files is still in the after files
  const toks = (s) => new Set((s.match(/(?:\.|#)[A-Za-z_][\w-]+|data-[\w-]+|name=['"][^'"]+['"]|id=['"][^'"]+['"]|\bid:['"][^'"]+['"]/g) || []));
  const beforeT = new Set([...toks(hb), ...toks(fb)]), afterT = new Set([...toks(ha), ...toks(fa)]); const lost = [...beforeT].filter((t) => !afterT.has(t)); const added = [...afterT].filter((t) => !beforeT.has(t));
  console.log('Tokens (selectors, ids, data attributes, names) in before but not after: ' + (lost.length ? lost.join(', ') : 'none')); console.log('Tokens new in after: ' + (added.length ? added.join(', ') : 'none'));
}

(async () => {
  const mode = process.argv[2] || 'all'; const runs = +process.argv[3] || 3;
  if (mode === 'diff' || mode === 'all') diffHunks();
  if (mode === 'cascade' || mode === 'all') await cascade();
  if (mode === 'functional' || mode === 'all') await functional();
  if (mode === 'shots' || mode === 'all') await shots();
  if (mode === 'measure' || mode === 'all') await measure(runs);
})().catch((e) => { console.error('FATAL', e.stack || e.message); process.exit(1); });
