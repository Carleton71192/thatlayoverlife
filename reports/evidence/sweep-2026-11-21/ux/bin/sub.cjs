/* Sweep 21 Nov 2026, lens UX: /submit journey (signed-in stand-in). Text styles and contrast, the fork, the three steps,
   empty-Next messages, reload after typing, and one stubbed send (Cloudinary and Webflow form POSTs answered in the page, nothing leaves).
   Usage: NODE_PATH=/opt/node22/lib/node_modules node sub.cjs <width> */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { load, sleep } = require('./h.cjs');
const SP = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/sweep-ux';
const SHOT = path.join(SP, 'shots');
const W = +(process.argv[2] || 390);

function STYLES() {
  const lum = c => { const m = c.match(/[\d.]+/g).map(Number); const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return { L: .2126 * f(m[0]) + .7152 * f(m[1]) + .0722 * f(m[2]), a: m[3] === undefined ? 1 : m[3], rgb: m.slice(0, 3) }; };
  const bgOf = n => { const stack = []; for (let e = n; e; e = e.parentElement) { const b = getComputedStyle(e).backgroundColor; const m = b.match(/[\d.]+/g); if (m && (m[3] === undefined || +m[3] > 0)) { stack.push(m.map(Number)); if (m[3] === undefined || +m[3] >= 1) break; } } let base = [255, 255, 255];
    for (let i = stack.length - 1; i >= 0; i--) { const s = stack[i], a = s[3] === undefined ? 1 : s[3]; base = [0, 1, 2].map(k => s[k] * a + base[k] * (1 - a)); } return 'rgb(' + base.map(Math.round).join(',') + ')'; };
  const ratio = (fg, bg) => { const F = lum(fg), B = lum(bg); let fgc = fg; if (F.a < 1) { const b = B.rgb; fgc = 'rgb(' + [0, 1, 2].map(k => Math.round(F.rgb[k] * F.a + b[k] * (1 - F.a))).join(',') + ')'; } const a = lum(fgc).L, c = B.L; return Math.round(((Math.max(a, c) + .05) / (Math.min(a, c) + .05)) * 100) / 100; };
  const root = document.querySelector('[data-tll-form="submit-story"]') ? document.querySelector('[data-tll-form="submit-story"]').closest('section') || document.body : document.body;
  const groups = {};
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let t; while ((t = walker.nextNode())) { const s = t.nodeValue.trim(); if (s.length < 2) continue; const e = t.parentElement; const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
    const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || +cs.opacity === 0) continue; let hid = false; for (let x = e; x; x = x.parentElement) if (getComputedStyle(x).display === 'none') { hid = true; break; } if (hid) continue;
    const bg = bgOf(e); const k = [cs.color, bg, cs.fontSize, cs.fontWeight, cs.fontFamily.split(',')[0].replace(/["']/g, ''), cs.textTransform, cs.letterSpacing].join(' | ');
    const g = groups[k] = groups[k] || { k, cls: new Set(), n: 0, ex: [], ratio: ratio(cs.color, bg) }; g.n++; g.cls.add((typeof e.className === 'string' ? e.className.split(' ')[0] : '') || e.tagName.toLowerCase()); if (g.ex.length < 3) g.ex.push(s.slice(0, 50)); }
  /* inputs */
  const inp = [].map.call(document.querySelectorAll('[data-tll-form="submit-story"] .tll-pen-input'), i => { const cs = getComputedStyle(i); return [cs.color, cs.backgroundColor, cs.fontSize, cs.fontWeight, cs.fontFamily.split(',')[0], cs.borderTopColor, cs.borderTopWidth].join(' | '); });
  return { groups: Object.values(groups).map(g => ({ k: g.k, cls: [...g.cls].slice(0, 6), n: g.n, ex: g.ex, ratio: g.ratio })).sort((a, b) => b.n - a.n), inputs: [...new Set(inp)], ph: getComputedStyle(document.querySelector('.tll-pen-input') || document.body, '::placeholder').color };
}

async function act(page, file, w, signed) {
  const R = { w };
  const sh = n => page.screenshot({ path: path.join(SHOT, 'submit-' + w + '-' + n + '.jpg'), type: 'jpeg', quality: 55 });
  R.styles = await page.evaluate(STYLES);
  R.locked = await page.evaluate(() => { const l = document.querySelector('.tll-pen-locked'); return l ? getComputedStyle(l).display : 'none-found'; });
  await page.evaluate(() => window.scrollTo(0, 0)); await sh('a-top');
  /* fork */
  const fork = await page.$('[data-tll-fork-pick="write"]'); if (fork) { await fork.scrollIntoViewIfNeeded(); await sh('b-fork'); }
  /* step 1 empty next */
  const next = await page.$('.tllst-next');
  R.step = await page.evaluate(() => (document.querySelector('.tllst-eb') || {}).textContent);
  if (next) { await next.scrollIntoViewIfNeeded(); await sh('c-step1'); await next.click(); await sleep(500);
    R.emptyNext = await page.evaluate(() => { const a = document.activeElement; return { focus: a && (a.name || a.tagName), msg: a && a.validationMessage, step: (document.querySelector('.tllst-eb') || {}).textContent, inlineErr: [].filter.call(document.querySelectorAll('.tll-pen-field [class*="error"],[aria-invalid="true"]'), x => x.offsetParent).length }; }); }
  /* type in step 1 then reload after 5 s */
  const f = (sel, v) => page.fill(sel, v).catch(e => R.fillErr = (R.fillErr || []).concat(sel + ' ' + String(e).slice(0, 80)));
  await f('[data-tll-form="submit-story"] input[name="country"]', 'Portugal');
  await f('[data-tll-form="submit-story"] input[name="name"]', 'Sweep test headline');
  await f('[data-tll-form="submit-story"] textarea[name="excerpt"]', 'Sweep test excerpt.');
  await f('[data-tll-form="submit-story"] textarea[name="body"]', 'Sweep test body text typed by the harness.');
  await sleep(5000);
  R.ls5 = await page.evaluate(() => localStorage.getItem('tllStoryDraft'));
  R.beforeUnload = await page.evaluate(() => typeof window.onbeforeunload);
  await page.reload({ waitUntil: 'load' }); await sleep(6000);
  R.afterReload = await page.evaluate(() => { const g = n => (document.querySelector('[data-tll-form="submit-story"] [name="' + n + '"]') || {}).value; return { country: g('country'), name: g('name'), body: (g('body') || '').slice(0, 20), save: (document.querySelector('.tllst-save') || {}).textContent }; });
  /* fill again, wait for the 20 s autosave, reload */
  await f('[data-tll-form="submit-story"] input[name="country"]', 'Portugal');
  await f('[data-tll-form="submit-story"] input[name="name"]', 'Sweep test headline');
  await f('[data-tll-form="submit-story"] textarea[name="excerpt"]', 'Sweep test excerpt.');
  await f('[data-tll-form="submit-story"] textarea[name="body"]', 'Sweep test body text typed by the harness.');
  await sleep(21500);
  R.saveLine = await page.evaluate(() => (document.querySelector('.tllst-save') || {}).textContent);
  await page.reload({ waitUntil: 'load' }); await sleep(6000);
  R.afterReload2 = await page.evaluate(() => { const g = n => (document.querySelector('[data-tll-form="submit-story"] [name="' + n + '"]') || {}).value; return { country: g('country'), name: g('name'), save: (document.querySelector('.tllst-save') || {}).textContent }; });
  /* walk the steps */
  await page.evaluate(() => { const c = document.querySelector('[data-tll-form="submit-story"] input[name="country"]'); c && c.scrollIntoView({ block: 'center' }); });
  await sh('d-step1-filled');
  await page.click('.tllst-next').catch(() => { }); await sleep(800);
  R.step2 = await page.evaluate(() => (document.querySelector('.tllst-eb') || {}).textContent);
  await page.evaluate(() => { const b = document.querySelector('.tllst-bar'); b && b.scrollIntoView(); }); await sh('e-step2');
  await page.click('.tllst-next').catch(() => { }); await sleep(600);
  R.step2empty = await page.evaluate(() => { const a = document.activeElement; return { focus: a && (a.name || a.tagName), msg: a && a.validationMessage, step: (document.querySelector('.tllst-eb') || {}).textContent }; });
  await page.selectOption('select[name="region"]', { index: 4 }).catch(e => R.selErr = String(e).slice(0, 80));
  await page.click('.tllst-next').catch(() => { }); await sleep(800);
  R.step3 = await page.evaluate(() => (document.querySelector('.tllst-eb') || {}).textContent);
  await page.evaluate(() => { const b = document.querySelector('.tllst-bar'); b && b.scrollIntoView(); }); await sh('f-step3');
  /* send with nothing in step 3 */
  R.sendBtn = await page.evaluate(() => { const b = document.querySelector('[data-tll-form="submit-story"] input[type=submit],[data-tll-form="submit-story"] button[type=submit]'); return b ? { v: b.value || b.textContent, w: b.offsetWidth, h: b.offsetHeight } : null; });
  const posts = []; await page.route('**/*', async route => { const q = route.request(); if (q.method() === 'POST') { posts.push(q.url().replace(/\?.*/, '').replace(/form\/[^/]+/, 'form/<site>'));
      if (/api\.cloudinary\.com/.test(q.url())) return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ secure_url: 'https://res.cloudinary.com/demo/image/upload/sweep-test.jpg', public_id: 'sweep-test' }) });
      if (/webflow\.com\/api\/v1\/form|\/form\//.test(q.url())) return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      return route.abort(); } return route.fallback(); });
  await page.click('[data-tll-form="submit-story"] [type=submit]').catch(e => R.clickErr = String(e).slice(0, 100)); await sleep(1200);
  R.emptySend = await page.evaluate(() => { const a = document.activeElement; const inv = [].filter.call(document.querySelectorAll('[data-tll-form="submit-story"] :invalid'), x => x.name).map(x => x.name + (x.offsetParent ? '' : ' (not shown)')); return { focus: a && (a.name || a.tagName), msg: a && a.validationMessage, invalid: inv }; });
  await sh('g-step3-empty-send');
  await f('#tll-story-contributor-name', 'Sweep Tester'); await f('#tll-story-contributor-email', 'reader@example.com');
  const hero = await page.$('[data-tll-form="submit-story"] input[name="hero-image"]'); if (hero) await hero.setInputFiles(path.join(SP, 'test-hero.jpg')).catch(e => R.heroErr = String(e).slice(0, 80));
  await page.evaluate(() => { const c = document.querySelector('[name="agree-charter"]'); if (c && !c.checked) c.click(); });
  await sleep(500);
  const t0 = Date.now(); const seen = [];
  await page.click('[data-tll-form="submit-story"] [type=submit]').catch(e => R.clickErr2 = String(e).slice(0, 100));
  for (let i = 0; i < 40; i++) { await sleep(250); const s = await page.evaluate(() => { const b = document.querySelector('[data-tll-form="submit-story"] [type=submit]'); const d = document.querySelector('[data-tll-form="submit-story"]').closest('.w-form').querySelector('.w-form-done'); const fl = document.querySelector('[data-tll-form="submit-story"]').closest('.w-form').querySelector('.w-form-fail');
      const vis = x => x && getComputedStyle(x).display !== 'none'; const note = [].map.call(document.querySelectorAll('[data-tll-form="submit-story"] [aria-live],[class*="tllpc"],[class*="send-note"]'), x => (x.textContent || '').trim()).filter(Boolean).join(' / ').slice(0, 160);
      return (b ? (b.value || b.textContent) + (b.disabled ? ' [disabled]' : '') : '-') + ' | done:' + vis(d) + ' fail:' + vis(fl) + ' | ' + note; });
    if (!seen.length || seen[seen.length - 1].s !== s) seen.push({ ms: Date.now() - t0, s }); if (/done:true|fail:true/.test(s) && i > 12) break; }
  R.send = seen; R.posts = posts;
  R.doneText = await page.evaluate(() => { const d = document.querySelector('[data-tll-form="submit-story"]').closest('.w-form').querySelector('.w-form-done'); return d && getComputedStyle(d).display !== 'none' ? d.innerText.slice(0, 300) : null; });
  await page.evaluate(() => { const d = document.querySelector('.w-form-done'); d && d.scrollIntoView({ block: 'center' }); }); await sh('h-after-send');
  return R;
}
global.__ACT = act;
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'], proxy: { server: process.env.HTTPS_PROXY || 'http://127.0.0.1:44389' } });
  try { const st = await load(browser, 'submit.html', W, true); fs.writeFileSync(path.join(SP, 'results', 'submit-' + W + '.json'), JSON.stringify(st, null, 1)); console.log(JSON.stringify(st.act, null, 1).slice(0, 6000)); }
  finally { await browser.close(); }
})();
