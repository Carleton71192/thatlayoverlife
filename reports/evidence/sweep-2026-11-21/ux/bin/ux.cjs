/* Sweep 21 Nov 2026, lens UX: per page and width, tap targets, tab order, focus visibility, form labels, screenshots.
   Reuses the debug harness (h.cjs = debug d.cjs with OUT in sweep-ux/results): cached documents, cached Webflow assets, non-GET aborted,
   Memberstack stand-in. Usage: NODE_PATH=/opt/node22/lib/node_modules node ux.cjs <set> */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { load, sleep } = require('./h.cjs');
const SP = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/sweep-ux';
const OUT = path.join(SP, 'results'), SHOT = path.join(SP, 'shots');

function UXP() {
  const mask = s => String(s).replace(/contributors\/[^/?#\s"']+/g, 'contributors/<profile>');
  const one = n => { let s = n.tagName.toLowerCase(); if (n.id) s += '#' + n.id; const c = typeof n.className === 'string' ? n.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : []; return c.length ? s + '.' + c.join('.') : s; };
  const trail = n => { const a = []; for (let k = 0; n && n.nodeType === 1 && k < 2 && n !== document.body; k++, n = n.parentElement) a.unshift(one(n)); return a.join('>'); };
  const shown = n => { const r = n.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; for (let e = n; e && e.nodeType === 1; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false; } return true; };
  const name = n => mask(((n.getAttribute('aria-label') || n.innerText || n.value || n.getAttribute('placeholder') || n.getAttribute('title') || '') + '').trim().replace(/\s+/g, ' ').slice(0, 40));
  const inFooterNav = n => !!n.closest('footer,.tll-footer,[class*="footer"],nav,.w-nav,[class*="nav"]');
  const small = [];
  for (const n of document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,[role=button],summary,[tabindex]:not([tabindex="-1"])')) {
    if (!shown(n)) continue; let r = n.getBoundingClientRect();
    const t = n.type;
    if (t === 'checkbox' || t === 'radio') { const l = n.closest('label') || (n.id && document.querySelector('label[for="' + n.id + '"]')); if (l && shown(l)) r = l.getBoundingClientRect(); }
    if (r.width >= 44 && r.height >= 44) continue;
    /* inline text link inside running text: WCAG exception */
    const p = n.tagName === 'A' && n.parentElement && /^(P|LI|SPAN|EM|STRONG|DIV)$/.test(n.parentElement.tagName) && (n.parentElement.innerText || '').trim().length > (n.innerText || '').trim().length + 25;
    small.push({ s: trail(n), t: name(n), w: Math.round(r.width), h: Math.round(r.height), inline: !!p, chrome: inFooterNav(n), lt24: r.width < 24 || r.height < 24 });
  }
  /* form fields and their names */
  const fields = [];
  for (const n of document.querySelectorAll('input:not([type=hidden]),select,textarea')) {
    if (!shown(n) && !(n.type === 'file' || n.type === 'checkbox' || n.type === 'radio')) continue;
    let lab = ''; if (n.labels && n.labels.length) lab = [].map.call(n.labels, l => (l.innerText || '').trim()).join(' | ');
    const lby = n.getAttribute('aria-labelledby'); if (!lab && lby) lab = lby.split(/\s+/).map(i => (document.getElementById(i) || {}).innerText || '').join(' ');
    const cs = getComputedStyle(n);
    fields.push({ s: trail(n), type: n.type || n.tagName.toLowerCase(), name: n.name || '', label: mask(lab).slice(0, 60), aria: (n.getAttribute('aria-label') || '').slice(0, 40), ph: (n.getAttribute('placeholder') || '').slice(0, 50), req: n.required, shown: shown(n), fs: cs.fontSize, color: cs.color, bg: cs.backgroundColor });
  }
  return { small, smallN: small.length, smallLt24: small.filter(x => x.lt24 && !x.inline).length, fields, docH: document.documentElement.scrollHeight, sx: document.documentElement.scrollWidth, vw: innerWidth };
}

async function tabWalk(page, n) {
  const out = [];
  await page.evaluate(() => { window.scrollTo(0, 0); document.activeElement && document.activeElement.blur && document.activeElement.blur(); });
  await page.evaluate(() => { const b = document.body; b.setAttribute('tabindex', '-1'); b.focus(); b.removeAttribute('tabindex'); });
  for (let i = 0; i < n; i++) {
    await page.keyboard.press('Tab'); await sleep(60);
    out.push(await page.evaluate(() => {
      const a = document.activeElement; if (!a || a === document.body) return { s: 'body' };
      const mask = s => String(s).replace(/contributors\/[^/?#\s"']+/g, 'contributors/<profile>');
      const r = a.getBoundingClientRect(); const cs = getComputedStyle(a);
      let hidden = r.width < 1 || r.height < 1; for (let e = a; e && e.nodeType === 1; e = e.parentElement) { const c = getComputedStyle(e); if (c.visibility === 'hidden' || +c.opacity === 0 || c.display === 'none') hidden = true; }
      const off = r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth;
      const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none');
      let cls = typeof a.className === 'string' ? a.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
      return { s: a.tagName.toLowerCase() + (a.id ? '#' + a.id : '') + (cls ? '.' + cls : ''), t: mask(((a.getAttribute('aria-label') || a.innerText || a.value || a.getAttribute('placeholder') || '') + '').trim().replace(/\s+/g, ' ').slice(0, 36)), hidden, off, ring, y: Math.round(r.top + scrollY) };
    }));
  }
  return out;
}

async function act(page, file, w, signed) {
  const key = file.replace('.html', '') + '-' + w + '-' + (signed ? 'in' : 'out');
  const ux = await page.evaluate(UXP);
  const tabs = await tabWalk(page, w < 800 ? 30 : 40);
  await page.evaluate(() => window.scrollTo(0, 0)); await sleep(400);
  await page.screenshot({ path: path.join(SHOT, key + '-top.jpg'), type: 'jpeg', quality: 55 });
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  if (H < 16000) await page.screenshot({ path: path.join(SHOT, key + '-full.jpg'), type: 'jpeg', quality: 45, fullPage: true }).catch(() => { });
  return { ux, tabs };
}
global.__ACT = act;

(async () => {
  const SET = process.argv[2] || 'core';
  const pages = {
    core: ['home.html', 'stories.html', 'stories__lisbon-sun-sails-city-built-to-stand-back-up.html', 'travelers.html', 'profile.html', 'the-map.html', 'for-expats.html', 'submit.html', 'share-photos.html', 'my-pets.html', 'signup.html', 'login.html', 'this-page-does-not-exist-sweep.html', 'layovers.html', 'the-paw-passport.html', 'about.html', 'account.html'],
    in: ['submit.html', 'share-photos.html', 'my-pets.html', 'account.html', 'the-map.html'],
  };
  const cells = [];
  if (SET === 'core') for (const f of pages.core) for (const w of [390, 1440]) cells.push([f, w, 0]);
  else if (SET === 'in') for (const f of pages.in) for (const w of [390, 1440]) cells.push([f, w, 1]);
  else { const [f, w, s] = SET.split(':'); cells.push([f, +w, +s || 0]); }
  const RES = path.join(OUT, 'ux-' + SET.replace(/[^a-z0-9]/gi, '_') + '.jsonl');
  const done = new Set(fs.existsSync(RES) ? fs.readFileSync(RES, 'utf8').split('\n').filter(Boolean).map(l => { const j = JSON.parse(l); return j.file + ' ' + j.w + ' ' + j.signed; }) : []);
  const browser = await chromium.launch({ args: ['--no-sandbox'], proxy: { server: process.env.HTTPS_PROXY || 'http://127.0.0.1:44389' } });
  try { for (const [f, w, s] of cells) { if (done.has(f + ' ' + w + ' ' + (s ? 'in' : 'out'))) continue;
      const st = await load(browser, f, w, !!s); st.file = f;
      fs.appendFileSync(RES, JSON.stringify(st) + '\n');
      console.log(f, w, s, 'errs', st.errs.length, 'small', st.act && st.act.ux ? st.act.ux.smallN : st.act); } }
  finally { await browser.close(); }
})();
