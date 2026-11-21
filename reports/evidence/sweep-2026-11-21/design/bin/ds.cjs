/* Sweep 21 Nov 2026, lens DESIGN: per page and width, rendered type, colors and contrast, buttons, cards, photos, section heads,
   eyebrows, alignment and spacing, plus a DSF 1 screenshot for the reviewer (not committed).
   Reuses the debug harness (h.cjs = debug d.cjs with OUT in sweep-design/results, DSF 1): cached documents and Webflow assets, non-GET aborted,
   Memberstack stand-in. Usage: NODE_PATH=/opt/node22/lib/node_modules node ds.cjs <set> */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { load } = require('./h.cjs');
const SP = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21';
const HTML = path.join(SP, 'sweep-cache/html'), OUT = path.join(SP, 'sweep-design/results'), SHOT = path.join(SP, 'sweep-design/shots');

function DP() {
  const mask = s => String(s).replace(/contributors\/[^/?#\s"']+/g, 'contributors/<profile>');
  const one = n => { let s = n.tagName.toLowerCase(); if (n.id) s += '#' + n.id; const c = typeof n.className === 'string' ? n.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : []; return c.length ? s + '.' + c.join('.') : s; };
  const trail = n => { const a = []; for (let k = 0; n && n.nodeType === 1 && k < 2 && n !== document.body; k++, n = n.parentElement) a.unshift(one(n)); return a.join('>'); };
  const shown = n => { const r = n.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; for (let e = n; e && e.nodeType === 1; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false; } return true; };
  const chrome = n => !!n.closest('footer,.tll-footer,[class*="footer"],.w-nav,nav,[class*="navbar"],.tll-nav');
  const P = s => { const m = String(s).match(/rgba?\(([^)]+)\)/); if (!m) return null; const a = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [a[0], a[1], a[2], a.length > 3 ? a[3] : 1]; };
  const hex = c => c ? '#' + c.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase() + (c[3] < 1 ? '@' + (+c[3]).toFixed(2) : '') : null;
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const blend = (top, bot) => { const a = top[3]; return [top[0] * a + bot[0] * (1 - a), top[1] * a + bot[1] * (1 - a), top[2] * a + bot[2] * (1 - a), 1]; };
  /* effective background: walk up, blend translucent layers; stop at an image or gradient */
  function bgOf(n) { const stack = []; let img = null;
    for (let e = n; e && e.nodeType === 1; e = e.parentElement) { const cs = getComputedStyle(e);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') { img = /gradient/.test(cs.backgroundImage) ? 'gradient' : 'image'; const c = P(cs.backgroundColor); if (c && c[3] > 0) stack.push(c); break; }
      const c = P(cs.backgroundColor); if (c && c[3] > 0) { stack.push(c); if (c[3] >= 1) break; } }
    let b = [255, 255, 255, 1]; for (let i = stack.length - 1; i >= 0; i--) b = blend(stack[i], b); return { b, img }; }
  /* is there an <img>/<video> painted under this text? (hero text over photo) */
  function overMedia(n) { const r = n.getBoundingClientRect(); const x = r.left + Math.min(r.width / 2, 20), y = r.top + r.height / 2;
    if (y < 0 || y > innerHeight || x < 0 || x > innerWidth) return null;
    const els = document.elementsFromPoint(x, y); for (const e of els) { if (e === n || n.contains(e)) continue; if (e.tagName === 'IMG' || e.tagName === 'VIDEO' || e.tagName === 'PICTURE') return e.tagName.toLowerCase(); } return null; }
  const fam = cs => cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
  const text = n => { let t = ''; for (const c of n.childNodes) if (c.nodeType === 3) t += c.textContent; return t.replace(/\s+/g, ' ').trim(); };
  const styles = {}, contrast = [], fams = {}, colors = {}, smallType = [], mono = {}, inlineLinks = {};
  const KIT = new Set(['#0A0B14', '#00C9C8', '#F0507A', '#F7F1E8', '#FDF9F3', '#1A1A1A', '#067A79', '#C8325B', '#D63859', '#FFFFFF', '#1A1A2E', '#E8E2D6', '#6B6660', '#555555']);
  const offKit = {};
  const all = document.body.querySelectorAll('*');
  let scanned = 0;
  for (const n of all) {
    if (/^(SCRIPT|STYLE|NOSCRIPT|SVG|PATH|TEMPLATE|IFRAME|BR)$/i.test(n.tagName)) continue;
    const t = text(n); if (!t || t.length < 2) continue;
    if (n.closest('[aria-hidden="true"]') && !n.closest('.tll-hero')) { /* still visual: keep */ }
    if (!shown(n)) continue;
    scanned++;
    const cs = getComputedStyle(n); const f = fam(cs); const fs_ = parseFloat(cs.fontSize), fw = +cs.fontWeight || 400;
    const key = f + '|' + fw + '|' + cs.fontStyle;
    fams[key] = (fams[key] || 0) + 1;
    const ch = chrome(n);
    const tag = n.tagName.toLowerCase();
    const role = /^h[1-6]$/.test(tag) ? tag : (tag === 'a' ? 'a' : (tag === 'button' || n.getAttribute('role') === 'button') ? 'button' : tag === 'label' ? 'label' : 'text');
    const sk = role + '|' + f + '|' + Math.round(fs_ * 10) / 10 + '|' + fw + '|' + cs.textTransform + '|' + cs.letterSpacing;
    const st = styles[sk] = styles[sk] || { n: 0, ex: [] }; st.n++; if (st.ex.length < 2) st.ex.push(trail(n) + ' "' + mask(t).slice(0, 28) + '"');
    if (/mono/i.test(f)) { const mk = Math.round(fs_ * 10) / 10 + 'px ' + fw + ' ls ' + cs.letterSpacing + ' ' + cs.textTransform; const m = mono[mk] = mono[mk] || { n: 0, ex: [] }; m.n++; if (m.ex.length < 2) m.ex.push(trail(n) + ' "' + mask(t).slice(0, 24) + '"'); }
    if (fs_ < 12 && t.length > 1) smallType.push({ s: trail(n), t: mask(t).slice(0, 30), fs: fs_, f, ch });
    const fg = P(cs.color); if (!fg) continue; { let op = 1; for (let e = n; e && e.nodeType === 1; e = e.parentElement) op *= +getComputedStyle(e).opacity; if (op < 0.99) fg[3] = fg[3] * op; }
    const { b, img } = bgOf(n);
    const fgc = fg[3] < 1 ? blend(fg, b) : fg;
    const hx = hex(fg); colors[hx] = (colors[hx] || 0) + 1;
    const hxo = hex(fg.slice(0, 3).concat([1])); if (!KIT.has(hxo)) { const o = offKit[hxo] = offKit[hxo] || { n: 0, ex: [] }; o.n++; if (o.ex.length < 3) o.ex.push(trail(n) + ' "' + mask(t).slice(0, 20) + '"'); }
    const r = ratio(fgc, b);
    const large = fs_ >= 24 || (fs_ >= 18.66 && fw >= 700);
    const need = large ? 3 : 4.5;
    const med = img ? null : overMedia(n);
    if (tag === 'a' && !ch) { const pt = n.parentElement && (n.parentElement.innerText || '').length > t.length + 25; if (pt) { const lk = hex(fg) + ' ' + cs.textDecorationLine + ' ' + hex(P(cs.textDecorationColor)); inlineLinks[lk] = (inlineLinks[lk] || 0) + 1; } }
    if (r < need && !img && !med) contrast.push({ s: trail(n), t: mask(t).slice(0, 34), fg: hex(fg), bg: hex(b), r: Math.round(r * 100) / 100, fs: fs_, fw, need, ch });
    else if ((img || med) && r < need) contrast.push({ s: trail(n), t: mask(t).slice(0, 34), fg: hex(fg), bg: (img || med) + (img ? '' : ' under'), r: null, fs: fs_, fw, need, ch, overImg: true, shadow: cs.textShadow !== 'none' });
  }
  /* buttons: things styled as buttons */
  const btns = {}, btnList = [];
  for (const n of document.querySelectorAll('a,button,input[type=submit],input[type=button],[role=button]')) {
    if (!shown(n)) continue; const cs = getComputedStyle(n); const r = n.getBoundingClientRect();
    const bg = P(cs.backgroundColor), bw = parseFloat(cs.borderTopWidth) || 0;
    const filled = bg && bg[3] > 0.5 && !(bg[0] > 240 && bg[1] > 235 && bg[2] > 225 && bw === 0);
    const outlined = bw >= 1 && cs.borderTopStyle !== 'none';
    const cls = (typeof n.className === 'string' ? n.className : '') + ' ' + (n.parentElement && typeof n.parentElement.className === 'string' ? n.parentElement.className : '');
    const looks = (filled || outlined) && r.height >= 28 && r.height <= 80 && r.width >= 50 && (n.innerText || n.value || '').trim().length > 1 && (n.innerText || n.value || '').trim().length < 40;
    if (!looks) continue; if (/chip|pill|filter|tag|tab|w-tab|toggle|swatch|dot/i.test(cls) && !/btn|button/i.test(cls)) continue;
    const lab = (n.innerText || n.value || '').trim().replace(/\s+/g, ' ');
    const k = [filled ? 'fill ' + hex(bg) : 'line', outlined ? bw + 'px ' + hex(P(cs.borderTopColor)) : '', 'rad ' + cs.borderTopLeftRadius, fam(cs), cs.fontWeight, cs.fontSize, cs.textTransform, 'ls ' + cs.letterSpacing, 'h' + Math.round(r.height), 'fg ' + hex(P(cs.color))].join(' | ');
    const e = btns[k] = btns[k] || { n: 0, ex: [], ch: 0 }; e.n++; if (chrome(n)) e.ch++; if (e.ex.length < 3) e.ex.push(trail(n) + ' "' + mask(lab).slice(0, 26) + '"');
  }
  /* cards */
  const cards = {};
  for (const n of document.querySelectorAll('[class*="card"],[class*="Card"]')) { if (!shown(n)) continue; const r = n.getBoundingClientRect(); if (r.width < 120 || r.height < 80) continue;
    const cs = getComputedStyle(n); const c0 = (typeof n.className === 'string' ? n.className.trim().split(/\s+/)[0] : '');
    const k = c0 + ' | rad ' + cs.borderTopLeftRadius + ' | sh ' + (cs.boxShadow === 'none' ? 'none' : cs.boxShadow.replace(/rgba?\([^)]*\)/, m => hex(P(m))).slice(0, 40)) + ' | bd ' + (parseFloat(cs.borderTopWidth) ? cs.borderTopWidth + ' ' + hex(P(cs.borderTopColor)) : '0') + ' | bg ' + hex(P(cs.backgroundColor));
    cards[k] = (cards[k] || 0) + 1; }
  /* photos */
  const photos = [];
  for (const i of document.images) { if (!shown(i)) continue; const r = i.getBoundingClientRect(); if (r.width < 80 || r.height < 60) continue; const cs = getComputedStyle(i);
    const nr = i.naturalWidth && i.naturalHeight ? i.naturalWidth / i.naturalHeight : null, rr = r.width / r.height;
    const distort = cs.objectFit === 'fill' && nr && Math.abs(nr / rr - 1) > 0.04;
    const up = i.naturalWidth && i.naturalWidth < r.width * 0.9;
    let rad = cs.borderTopLeftRadius; if (rad === '0px') for (let e = i.parentElement, k = 0; e && k < 3; e = e.parentElement, k++) { const c2 = getComputedStyle(e); if (c2.borderTopLeftRadius !== '0px' && c2.overflow !== 'visible') { rad = c2.borderTopLeftRadius + '(parent)'; break; } }
    photos.push({ s: trail(i), w: Math.round(r.width), h: Math.round(r.height), ar: Math.round(rr * 100) / 100, nat: i.naturalWidth + 'x' + i.naturalHeight, fit: cs.objectFit, pos: cs.objectPosition, rad, distort, up, src: (i.currentSrc || i.src || '').replace(/^.*\//, '').replace(/\?.*/, '').slice(-40), y: Math.round(r.top + scrollY) }); }
  /* section heads */
  const heads = [];
  for (const h of document.querySelectorAll('h1,h2,h3')) { if (!shown(h)) continue; const cs = getComputedStyle(h); const r = h.getBoundingClientRect();
    const em = [].filter.call(h.querySelectorAll('em,i,span'), e => { const c = getComputedStyle(e); return c.fontStyle === 'italic' && /240|214|200/.test(c.color.split(',')[0]); }).length;
    heads.push({ tag: h.tagName, t: mask((h.innerText || '').trim().replace(/\s+/g, ' ')).slice(0, 44), f: fam(cs), fs: parseFloat(cs.fontSize), fw: cs.fontWeight, lh: cs.lineHeight, ls: cs.letterSpacing, tt: cs.textTransform, color: hex(P(cs.color)), x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), roseItalic: em, ch: chrome(h) }); }
  /* sections: vertical padding and content left edge */
  const sections = [];
  for (const s of document.querySelectorAll('main > *, body > section, body > div > section, section, .w-section')) { if (!shown(s)) continue; const r = s.getBoundingClientRect(); if (r.height < 120 || r.width < innerWidth * 0.8 || chrome(s)) continue;
    const cs = getComputedStyle(s); const kids = [].filter.call(s.querySelectorAll('h2,h3,p'), shown); const lx = kids.length ? Math.round(kids[0].getBoundingClientRect().left) : null;
    const txt = (s.innerText || '').trim().length, imgs = [].filter.call(s.querySelectorAll('img'), shown).length;
    sections.push({ s: trail(s), y: Math.round(r.top + scrollY), h: Math.round(r.height), pt: cs.paddingTop, pb: cs.paddingBottom, bg: hex(P(cs.backgroundColor)), lx, empty: txt < 3 && !imgs }); }
  /* overflow and things outside the viewport */
  const wide = []; for (const n of all) { if (!(n instanceof HTMLElement)) continue; const r = n.getBoundingClientRect(); if (r.width < 2 || r.right <= innerWidth + 2) continue; const cs = getComputedStyle(n); if (cs.position === 'fixed') continue;
    let clipped = false; for (let e = n.parentElement; e && e !== document.body; e = e.parentElement) { const c = getComputedStyle(e); if (/hidden|clip|auto|scroll/.test(c.overflowX)) { clipped = true; break; } } if (!clipped && shown(n)) wide.push(trail(n) + ' r' + Math.round(r.right)); if (wide.length > 8) break; }
  /* unfinished: visible placeholder strings */
  const bt = document.body.innerText;
  const unfinished = (bt.match(/[Ll]orem ipsum|\bTODO\b|\bTBD\b|\bXXX+\b|No items found\.|\bundefined\b|\bNaN\b|\[object Object\]|\{\{[^}]{1,30}\}\}/g) || []).slice(0, 10); const soon = (bt.match(/coming soon/gi) || []).length;
  const radii = {}; for (const n of all) { if (!(n instanceof HTMLElement)) continue; const cs = getComputedStyle(n); const v = cs.borderTopLeftRadius; if (v !== '0px' && shown(n)) { const r = n.getBoundingClientRect(); if (r.width > 20 && r.height > 20) radii[v] = (radii[v] || 0) + 1; } }
  const fontsLoaded = [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/["']/g, '') + ' ' + f.weight + ' ' + f.style);
  const fontsAll = [...new Set([...document.fonts].map(f => f.family.replace(/["']/g, '') + ' ' + f.status))];
  return { scanned, styles, fams, colors, offKit, contrast, smallType: smallType.slice(0, 40), smallTypeN: smallType.length, mono, inlineLinks, btns, cards, photos, heads, sections, wide, unfinished, soon, radii, fontsLoaded: [...new Set(fontsLoaded)], fontsAll, docH: document.documentElement.scrollHeight, sx: document.documentElement.scrollWidth, vw: innerWidth, bodyBg: hex(P(getComputedStyle(document.body).backgroundColor)) };
}

/* rendered (platform) faces for one sample per family stack, via CDP */
async function platformFonts(page) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
  const marks = await page.evaluate(() => { const seen = {}, out = [];
    for (const n of document.body.querySelectorAll('*')) { if (/^(SCRIPT|STYLE|SVG|PATH)$/i.test(n.tagName)) continue; let t = ''; for (const c of n.childNodes) if (c.nodeType === 3) t += c.textContent; if (t.trim().length < 2) continue;
      const r = n.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue; const cs = getComputedStyle(n); if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      const k = cs.fontFamily + '|' + cs.fontWeight + '|' + cs.fontStyle; if (seen[k]) continue; seen[k] = 1; const id = 'tlld' + out.length; n.setAttribute('data-tlld', id); out.push({ id, k, cls: (typeof n.className === 'string' ? n.className.split(/\s+/)[0] : '') || n.tagName.toLowerCase(), t: t.trim().slice(0, 20) }); if (out.length > 60) break; }
    return out; });
  const res = [];
  for (const m of marks) { try { const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: '[data-tlld="' + m.id + '"]' }); if (!nodeId) continue;
      const pf = await cdp.send('CSS.getPlatformFontsForNode', { nodeId }); res.push({ stack: m.k, cls: m.cls, rendered: (pf.fonts || []).map(f => f.familyName + (f.isCustomFont ? '' : ' (system)') + ' x' + f.glyphCount) }); } catch (e) { res.push({ stack: m.k, err: String(e).slice(0, 60) }); } }
  await cdp.detach().catch(() => { });
  return res;
}

global.__ACT = async (page, file, w, signed) => {
  const d = await page.evaluate(DP);
  d.pf = await platformFonts(page).catch(e => 'pf ' + String(e).slice(0, 100));
  const nm = file.replace(/\.html$/, '') + '-' + w + '-' + (signed ? 'in' : 'out');
  await page.evaluate(() => window.scrollTo(0, 0));
  const H = Math.min(await page.evaluate(() => document.documentElement.scrollHeight), w < 800 ? 9000 : 7000);
  await page.screenshot({ path: path.join(SHOT, nm + '.jpg'), type: 'jpeg', quality: 55, clip: { x: 0, y: 0, width: w, height: H }, fullPage: true }).catch(() => { });
  return d;
};

if (require.main === module) (async () => {
  const SET = process.argv[2] || 'smoke';
  const SKIP = new Set(['awards.html', 'creators.html', 'spotlight.html', 'faq.html', 'contact.html', 'corrections.html', 'destinations.html', 'for-brands.html', 'support.html', 'community-guidelines.html', 'editorial-charter.html', 'privacy.html', 'terms.html', 'gallery.html']);
  const ALL = fs.readdirSync(HTML).filter(f => f.endsWith('.html') && !SKIP.has(f)).sort();
  const EXTRA = ['faq.html', 'contact.html', 'for-brands.html', 'support.html', 'editorial-charter.html', 'privacy.html', 'gallery.html', 'destinations.html', 'community-guidelines.html', 'corrections.html', 'terms.html'];
  let cells = [];
  if (SET === 'smoke') cells = [['home.html', 390, 0]];
  else if (SET === 'core') for (const f of ALL) for (const w of [390, 1440]) cells.push([f, w, 0]);
  else if (SET === 'extra') for (const f of EXTRA) for (const w of [390, 1440]) cells.push([f, w, 0]);
  else if (SET === 'in') for (const f of ['account.html', 'submit.html', 'my-pets.html', 'share-photos.html', 'edit-profile.html']) for (const w of [390, 1440]) cells.push([f, w, 1]);
  else { const [f, w, s] = SET.split(':'); cells = [[f, +w, +s || 0]]; }
  const RES = path.join(OUT, 'ds-' + SET.replace(/[^a-z0-9]/gi, '_') + '.jsonl');
  const done = new Set(fs.existsSync(RES) ? fs.readFileSync(RES, 'utf8').split('\n').filter(Boolean).map(l => { const j = JSON.parse(l); return j.file + ' ' + j.w + ' ' + j.signed; }) : []);
  const browser = await chromium.launch({ args: ['--no-sandbox'], proxy: { server: process.env.HTTPS_PROXY || 'http://127.0.0.1:44389' } });
  try { for (const [f, w, s] of cells) { const key = f + ' ' + w + ' ' + (s ? 'in' : 'out'); if (done.has(key)) continue;
      const st = await load(browser, f, w, !!s); st.file = f;
      const slim = { file: f, page: st.page, w, signed: st.signed, status: st.status, errs: st.errs.length, wf: st.wfFetched, stand: st.stand, navErr: st.navErr, d: st.act };
      fs.appendFileSync(RES, JSON.stringify(slim) + '\n');
      console.log(key, 'st', st.status, 'errs', st.errs.length, 'wf', st.wfFetched, 'stand', st.stand, typeof st.act === 'string' ? st.act : 'ok'); } }
  finally { await browser.close(); }
})();
