/* classb-check (27 Nov 2026): A/B of the class B page code drafts on cached pages.
   Top-frame HTML: today's plain-GET copies (live27/), with the before block swapped for an after block.
   Core and photo-clean from git at the pinned commits. Webflow-host assets from the shared sweep cache only; a miss is aborted
   (images get a 1x1 stand-in). Every non-GET aborted. Memberstack replaced by a local stub (made-up member, no name).
   The webflow.schunk of today's HTML is not in the cache; the 21 Nov schunk is served in its place (same for both variants).
   Usage: NODE_PATH=/opt/node22/lib/node_modules node cb.cjs <set> */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), cp = require('child_process');
const { chromium } = require('playwright');
const S = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad';
const ME = path.join(S, 'nov25/classb-check'), WT = path.join(ME, 'wt'), EV = path.join(WT, 'reports/evidence/classb-2026-11-25');
const AS = path.join(S, 'nov21/sweep-cache/assets'), OUT = path.join(ME, 'results'); fs.mkdirSync(path.join(OUT, 'shots'), { recursive: true });
const REPO = '/home/user/thatlayoverlife';
const rd = p => fs.readFileSync(p, 'utf8');
const sha = s => crypto.createHash('sha1').update(s).digest('hex');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const gitCache = {};
function gitShow(rev, p) { const k = rev + ':' + p; if (!(k in gitCache)) { try { gitCache[k] = cp.execFileSync('git', ['-C', REPO, 'show', k], { maxBuffer: 1 << 26 }); } catch (e) { gitCache[k] = null; } } return gitCache[k]; }
const blk = (d, f) => rd(path.join(EV, d, f || 'after.html'));
const SUB_F = blk('B02-submit-autosave', 'before.html'), SUB_H = blk('B18-submit-picker-roles', 'before.html');
const VAR = {
  submit: { before: [], B02: [[SUB_F, blk('B02-submit-autosave')]], B15: [[SUB_F, blk('B15-submit-step-bar')]], B0215: [[SUB_F, blk('submit-footer-B02-B15')]],
    B18: [[SUB_H, blk('B18-submit-picker-roles')]], all: [[SUB_F, blk('submit-footer-B02-B15')], [SUB_H, blk('B18-submit-picker-roles')]] },
  'my-pets': { before: [], B08: [[blk('B08-my-pets-heading', 'before.html'), blk('B08-my-pets-heading')]] },
  'edit-profile': { before: [], B17: [[blk('B17-edit-profile-script-id', 'before.html'), blk('B17-edit-profile-script-id')]] } };
function html(page, v) { let h = rd(path.join(ME, 'live27', page + '.html'));
  for (const [a, b] of VAR[page][v]) { const n = h.split(a).length - 1; if (n !== 1) throw new Error(page + ' ' + v + ' before block found ' + n + ' times'); h = h.replace(a, () => b); }
  h = h.replace(/(webflow\.schunk\.a411e893cbf215ac\.js" type="text\/javascript") integrity="[^"]*"/, '$1'); return h; }
const RE_WF = /^https?:\/\/([a-z0-9-]+\.)*(website-files\.com|webflow\.io|webflow\.com|d3e54v103j8qbb\.cloudfront\.net)(\/|$)/i;
const RE_SITE = /^https?:\/\/(www\.)?thatlayover\.life(\/|$)/i;
const RE_ADS = /googletagmanager\.com|google-analytics\.com|analytics\.ahrefs\.com|googlesyndication\.com|doubleclick\.net|adservice\.google|pagead2|googleadservices|fundingchoicesmessages\.google\.com|adtrafficquality\.google|google\.com\/pagead|clarity\.ms/;
const RE_JSD = /^https:\/\/cdn\.jsdelivr\.net\/gh\/[^/]+\/thatlayoverlife@([0-9a-f]{40})\/(src\/.+\.js)$/;
const PNG1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
const DROP = new Set(['content-encoding', 'content-length', 'transfer-encoding', 'connection', 'keep-alive', 'alt-svc', 'set-cookie', 'report-to', 'nel']);
const SCHUNK_NEW = 'https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/js/webflow.schunk.a411e893cbf215ac.js', SCHUNK_OLD = 'https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/js/webflow.schunk.4eadd5ed11403fbe.js';
function getA(u) { if (u === SCHUNK_NEW) u = SCHUNK_OLD; const k = path.join(AS, sha(u)); if (!fs.existsSync(k + '.json')) return null; const m = JSON.parse(rd(k + '.json'));
  const h = {}; for (const x in m.headers || {}) if (!DROP.has(x.toLowerCase())) h[x.toLowerCase()] = String(m.headers[x]); h['access-control-allow-origin'] = '*';
  return { status: m.status, headers: h, body: fs.readFileSync(k + '.b') }; }
function msStub(signed, json) { return '(function(){window.__msCalls=[];var M=' + (signed ? '{id:"mem_check_test",verified:true,auth:{email:"reader@example.com",hasPassword:true,providers:[]},customFields:{},metaData:{},permissions:[],planConnections:[],createdAt:"2026-01-01T00:00:00.000Z"}' : 'null') + ';var J=' + JSON.stringify(json || {}) + ';' +
  'function later(v){return new Promise(function(r){setTimeout(function(){r(v);},300);});}' +
  'var api={getCurrentMember:function(){return later({data:M});},getMemberJSON:function(){return later({data:JSON.parse(JSON.stringify(J))});},updateMemberJSON:function(a){window.__msCalls.push(["updateMemberJSON",JSON.stringify(a).slice(0,400)]);if(a&&a.json)J=a.json;return later({data:J});},' +
  'updateMember:function(a){window.__msCalls.push(["updateMember",Object.keys((a&&a.customFields)||{}).length]);return later({data:M});},getApp:function(){return later({data:{id:"app_check",plans:[],contentGroups:[]}});},' +
  'onAuthChange:function(cb){setTimeout(function(){try{cb(M);}catch(e){}},300);return {unsubscribe:function(){}};},getMemberCookie:function(){return M?"check":null;}};' +
  'window.$memberstackDom=new Proxy(api,{get:function(t,k){if(k in t)return t[k];if(typeof k!=="string"||k==="then")return undefined;return function(){window.__msCalls.push(["other",k]);return later({data:null});};}});window.$memberstackReady=true;' +
  'try{document.dispatchEvent(new Event("memberstack.ready"));}catch(e){}})();'; }
function PERF() { window.__perf = { cls: 0, n: 0, shifts: [] };
  const one = n => { if (!n || n.nodeType !== 1) return '?'; let s = n.tagName.toLowerCase(); const c = typeof n.className === 'string' ? n.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : []; return c.length ? s + '.' + c.join('.') : s; };
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) { if (e.hadRecentInput) continue; window.__perf.cls += e.value; window.__perf.n++; if (window.__perf.shifts.length < 25) window.__perf.shifts.push([Math.round(e.startTime), +e.value.toFixed(4), (e.sources || []).slice(0, 2).map(s => one(s.node)).join(' ')]); } }).observe({ type: 'layout-shift', buffered: true }); } catch (e) { } }
function SIG() {
  const one = n => { let s = n.tagName.toLowerCase(); if (n.id && !/^w-node|^\d/.test(n.id)) s += '#' + n.id; const c = typeof n.className === 'string' ? n.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : []; return c.length ? s + '.' + c.join('.') : s; };
  const seen = {}, out = {};
  for (const e of document.body.querySelectorAll('*')) {
    if (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|LINK|META|BR|PATH|G|DEFS|USE)$/i.test(e.tagName)) continue;
    const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
    const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
    let k = one(e); const p = e.parentElement, g = p && p.parentElement; k = (g ? one(g) + '>' : '') + (p ? one(p) + '>' : '') + k; seen[k] = (seen[k] || 0) + 1; k += '#' + seen[k];
    let t = ''; for (const c of e.childNodes) if (c.nodeType === 3) t += c.nodeValue; t = t.replace(/\s+/g, ' ').trim().slice(0, 50);
    out[k] = { b: [Math.round(r.left), Math.round(r.top + scrollY), Math.round(r.width), Math.round(r.height)], s: [cs.fontSize, cs.fontWeight, cs.color, cs.backgroundColor, cs.backgroundImage.slice(0, 60), cs.borderTopLeftRadius, cs.minHeight].join('|'), t,
      a: [e.getAttribute('role') || '', e.getAttribute('aria-pressed') || ''].join('|') };
  }
  return out;
}
async function open(browser, page, v, w, signed, opt = {}) {
  const phone = w < 800, st = { page, v, w, signed: signed ? 'in' : 'out', tag: opt.tag || '', errs: [], cons: [], nonGet: 0, miss: [], wfHits: 0 };
  const ctx = opt.ctx || await browser.newContext({ viewport: { width: w, height: phone ? 844 : 900 }, isMobile: phone, hasTouch: phone, deviceScaleFactor: phone ? 2 : 1,
    userAgent: phone ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' });
  await ctx.addInitScript(PERF);
  if (signed) await ctx.addInitScript(() => { try { localStorage.setItem('_ms-mid', 'check-test'); } catch (e) { } });
  await ctx.route('**/*', async route => {
    const q = route.request(), u = q.url(), ty = q.resourceType();
    try {
      if (/^(data|blob|about):/.test(u)) return route.continue();
      if (q.method() !== 'GET') { st.nonGet++; return route.abort(); }
      const j = RE_JSD.exec(u); if (j) { const b = gitShow(j[1], j[2]); return route.fulfill({ status: b ? 200 : 404, headers: { 'content-type': 'application/javascript; charset=utf-8', 'access-control-allow-origin': '*' }, body: b || '' }); }
      if (/challenges\.cloudflare\.com/.test(u)) return route.abort();
      if (RE_ADS.test(u)) return route.fulfill({ status: 200, headers: { 'content-type': 'application/javascript', 'access-control-allow-origin': '*' }, body: '' });
      if (/^https:\/\/static\.memberstack\.com\/scripts\/v\d\/memberstack\.js/.test(u)) return route.fulfill({ status: 200, headers: { 'content-type': 'application/javascript', 'access-control-allow-origin': '*' }, body: msStub(signed, opt.json) });
      if (/memberstack\.com|workers\.dev|cloudinary\.com/.test(u)) return route.abort();
      if (RE_SITE.test(u)) { const pu = new URL(u); const pp = pu.pathname.replace(/\/+$/, '');
        if (q.isNavigationRequest() && pp === '/' + page) return route.fulfill({ status: 200, headers: { 'content-type': 'text/html; charset=utf-8' }, body: html(page, v) });
        const c = getA(u); if (c) { st.wfHits++; return route.fulfill(c); }
        st.miss.push('site ' + ty + ' ' + pp.slice(0, 60)); if (ty === 'image') return route.fulfill({ status: 200, headers: { 'content-type': 'image/png' }, body: PNG1 }); return route.abort(); }
      if (RE_WF.test(u)) { const c = getA(u); if (c) { st.wfHits++; return route.fulfill(c); }
        st.miss.push('wf ' + ty + ' ' + u.replace(/\?.*/, '').slice(-50)); if (ty === 'image') return route.fulfill({ status: 200, headers: { 'content-type': 'image/png' }, body: PNG1 }); return route.abort(); }
      return route.continue();
    } catch (e) { try { await route.abort(); } catch (e2) { } }
  });
  const pg = await ctx.newPage();
  pg.on('pageerror', e => st.errs.push(String(e && e.message || e).slice(0, 200)));
  pg.on('console', m => { if (m.type() === 'error') st.cons.push(m.text().slice(0, 200)); });
  await pg.goto('https://www.thatlayover.life/' + page, { waitUntil: 'load', timeout: 90000 }); await sleep(opt.wait || 4500);
  return { ctx, pg, st };
}
async function settle(pg, st) {
  st.clsLoad = await pg.evaluate(() => +window.__perf.cls.toFixed(4));
  await pg.evaluate(async () => { const H = document.documentElement.scrollHeight; for (let y = 0; y < H; y += innerHeight) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
  await sleep(1200);
  st.perf = await pg.evaluate(() => ({ cls: +window.__perf.cls.toFixed(4), n: window.__perf.n, shifts: window.__perf.shifts }));
}
/* ---------- behavior probes ---------- */
const P = {
  stepbar: async pg => pg.evaluate(() => { const bb = document.querySelector('.tllst-bar'); if (bb) { bb.scrollIntoView({ block: 'center' }); } const segs = [].slice.call(document.querySelectorAll('.tllst-seg')); if (!segs.length) return 'no bar';
    return { segs: segs.map(s => { const r = s.getBoundingClientRect(), c = getComputedStyle(s); const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const hit = d => { const e = document.elementFromPoint(cx, cy + d); return e === s; };
      return { cls: s.className, box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], h: c.height, minH: c.minHeight, bgc: c.backgroundColor, bgi: c.backgroundImage.slice(0, 70), bgs: c.backgroundSize, rad: c.borderTopLeftRadius,
        hit0: hit(0), hitUp15: hit(-15), hitDn15: hit(15), outline: c.outlineStyle }; }), bar: (b => { const r = b.getBoundingClientRect(); return [Math.round(r.top), Math.round(r.height)]; })(document.querySelector('.tllst-bar')) }; }),
  fork: async pg => { const o = {}; o.roles = await pg.evaluate(() => [].map.call(document.querySelectorAll('[data-tll-fork-pick]'), a => a.tagName + ' ' + a.getAttribute('data-tll-fork-pick') + ' role=' + a.getAttribute('role') + ' pressed=' + a.getAttribute('aria-pressed')));
    const state = () => pg.evaluate(() => ({ y: Math.round(scrollY), write: getComputedStyle(document.querySelector('.tll-pen-form')).display, linkHidden: document.querySelector('[data-tll-linkout]').hasAttribute('hidden'), pressed: [].map.call(document.querySelectorAll('[data-tll-fork-pick]'), a => a.getAttribute('aria-pressed')).join(',') }));
    await pg.evaluate(() => { window.scrollTo(0, 0); document.querySelector('[data-tll-fork-pick="link"]').focus({ preventScroll: true }); }); await sleep(200);
    o.s0 = await state(); await pg.keyboard.press('Space'); await sleep(600); o.afterSpaceOnLink = await state();
    await pg.evaluate(() => document.querySelector('[data-tll-fork-pick="write"]').focus({ preventScroll: true })); await pg.keyboard.press('Enter'); await sleep(600); o.afterEnterOnWrite = await state();
    await pg.evaluate(() => document.querySelector('[data-tll-fork-pick="link"]').focus({ preventScroll: true })); await pg.keyboard.press('Enter'); await sleep(600); o.afterEnterOnLink = await state();
    await pg.evaluate(() => document.querySelector('[data-tll-fork-pick="write"]').focus({ preventScroll: true })); await pg.mouse.move(1, 1); await pg.click('[data-tll-fork-pick="write"]'); await sleep(600); o.afterClickWrite = await state();
    return o; },
};
const LS = pg => pg.evaluate(() => { try { const s = localStorage.getItem('tllStoryDraft'); return s ? JSON.parse(s) : null; } catch (e) { return 'err'; } });
async function field(pg) { return pg.evaluate(() => { const f = document.querySelector('form[data-tll-form="submit-story"]'); const c = ['textarea[name="body"]', 'input[name="name"]', 'textarea[name="excerpt"]', 'input[name="excerpt"]'];
  for (const s of c) { const e = f && f.querySelector(s); if (e && e.getBoundingClientRect().height > 0) return s; } return null; }); }
async function autosave(browser, v, w) {
  const out = { v, w }; const T = 'Typed by the check ';
  /* t1: type, wait 1.3 s, reload */
  let { ctx, pg, st } = await open(browser, 'submit', v, w, true); const sel = await field(pg); out.field = sel;
  if (!sel) { out.err = 'no field'; await ctx.close(); return out; }
  await pg.click(sel); await pg.keyboard.type(T + '1'); await sleep(1300); out.t1_ls = !!(await LS(pg)); await pg.reload({ waitUntil: 'load' }); await sleep(4000);
  out.t1_back = await pg.$eval(sel, e => e.value);
  /* t2: type then leave at once (pagehide), new load */
  await pg.evaluate(s => { document.querySelector(s).value = ''; localStorage.removeItem('tllStoryDraft'); }, sel);
  await pg.click(sel); await pg.keyboard.type(T + '2'); await pg.goto('https://www.thatlayover.life/submit', { waitUntil: 'load' }); await sleep(4000); out.t2_back = await pg.$eval(sel, e => e.value);
  /* t3: visibilitychange hidden right after typing */
  await pg.evaluate(s => { document.querySelector(s).value = ''; localStorage.removeItem('tllStoryDraft'); }, sel);
  await pg.click(sel); await pg.keyboard.type(T + '3'); await pg.evaluate(() => { Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); });
  out.t3_ls = JSON.stringify(await LS(pg) || '').includes(T + '3');
  await ctx.close();
  /* t4: Send (submit event, the POST is aborted), then leave: nothing written back; then type again: written */
  ({ ctx, pg, st } = await open(browser, 'submit', v, w, true));
  await pg.click(sel); await pg.keyboard.type(T + '4'); await sleep(1300); out.t4_lsBefore = !!(await LS(pg));
  await pg.evaluate(() => { const f = document.querySelector('form[data-tll-form="submit-story"]'); f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); }); await sleep(500);
  out.t4_lsAfterSubmit = !!(await LS(pg));
  await pg.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: false }))); await sleep(200); out.t4_lsAfterLeave = !!(await LS(pg));
  out.t4_failBox = await pg.evaluate(() => { const e = document.querySelector('form[data-tll-form="submit-story"]').closest('.w-form'); const fl = e && e.querySelector('.w-form-fail'); return fl ? getComputedStyle(fl).display : 'none'; });
  await pg.click(sel).catch(() => { }); await pg.keyboard.type('x'); await sleep(1300); out.t4_lsAfterRetype = !!(await LS(pg));
  out.t4_nonGet = st.nonGet; await ctx.close();
  /* t5: done box shows (sent), then type and leave: nothing written */
  ({ ctx, pg, st } = await open(browser, 'submit', v, w, true));
  await pg.click(sel); await pg.keyboard.type(T + '5');
  await pg.evaluate(() => { const d = document.querySelector('form[data-tll-form="submit-story"]').closest('.w-form').querySelector('.w-form-done'); d.style.display = 'block'; }); await sleep(300);
  await pg.evaluate(s => { const e = document.querySelector(s); e.value += ' more'; e.dispatchEvent(new Event('input', { bubbles: true })); }, sel); await sleep(1300);
  await pg.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: false }))); out.t5_lsAfterSent = !!(await LS(pg));
  await ctx.close();
  /* t6: the account copy still goes on the 20 s timer */
  ({ ctx, pg, st } = await open(browser, 'submit', v, w, true));
  await pg.click(sel); await pg.keyboard.type(T + '6'); await sleep(1300); await sleep(21000);
  out.t6_calls = await pg.evaluate(() => window.__msCalls.filter(c => c[0] === 'updateMemberJSON').map(c => c[1].includes('Typed by the check 6')));
  out.t6_save = await pg.evaluate(() => (document.querySelector('.tllst-save') || {}).textContent || '');
  out.errs = st.errs; out.cons = st.cons; await ctx.close();
  return out;
}
async function pets(browser, v, w, n) {
  const list = [{ id: 'p1', name: 'Check Pet One', species: 'Dog', countries: [] }, { id: 'p2', name: 'Check Pet Two', species: 'Cat', countries: [] }].slice(0, n);
  const { ctx, pg, st } = await open(browser, 'my-pets', v, w, true, { json: { pets: list } });
  const o = await pg.evaluate(() => { const t = document.querySelector('.tll-mypets-grid-title'), a = document.querySelector('.tll-mypets-card-add-title'); return { title: t && t.textContent.trim(), add: a && a.textContent.trim(), rows: document.querySelectorAll('.tpe-row').length }; });
  await settle(pg, st); await ctx.close(); return Object.assign({ v, w, n, cls: st.perf.cls, errs: st.errs, cons: st.cons, miss: st.miss.length }, o);
}
async function edit(browser, v, w) {
  const { ctx, pg, st } = await open(browser, 'edit-profile', v, w, true);
  const o = await pg.evaluate(() => ({ ids: [].map.call(document.querySelectorAll('[id^="tll-edit-dir"]'), e => e.tagName + '#' + e.id), byId: (document.getElementById('tll-edit-dir-v1') || {}).tagName,
    app: (document.querySelector('[data-tll-edit="dir-app"]') || { children: [] }).children.length, toggles: document.querySelectorAll('[data-tll-edit="dir-app"] .tlled-toggle').length,
    dup: (() => { const m = {}; document.querySelectorAll('[id]').forEach(e => m[e.id] = (m[e.id] || 0) + 1); return Object.keys(m).filter(k => m[k] > 1); })() }));
  await pg.evaluate(() => { const b = document.querySelector('[data-save]'); b && b.click(); }); await sleep(1200);
  o.status = await pg.evaluate(() => (document.querySelector('[data-tll-edit="dir-app"] [data-status]') || {}).textContent);
  o.calls = await pg.evaluate(() => window.__msCalls.map(c => c[0]));
  await settle(pg, st); await ctx.close(); return Object.assign({ v, w, cls: st.perf.cls, errs: st.errs, cons: st.cons, nonGet: st.nonGet, miss: st.miss.length }, o);
}
async function sigRun(browser, page, v, w, signed, run) {
  const { ctx, pg, st } = await open(browser, page, v, w, signed);
  await settle(pg, st); const sig = await pg.evaluate(SIG);
  if (page === 'submit') { st.stepbar = await P.stepbar(pg); st.fork = await P.fork(pg).catch(e => 'fork error ' + String(e).slice(0, 120));
    if (run === 0 && signed) { const b = await pg.$('.tllst-bar'); if (b) { await pg.evaluate(() => document.querySelector('.tllst-bar').scrollIntoView({ block: 'center' })); await sleep(300); await b.screenshot({ path: path.join(OUT, 'shots', `stepbar_${v}_${w}.png`) }); } } }
  fs.writeFileSync(path.join(OUT, `sig_${page}_${v}_${w}_${st.signed}_${run}.json`), JSON.stringify(sig));
  await ctx.close(); st.sigN = Object.keys(sig).length; st.run = run; st.miss = [...new Set(st.miss)]; return st;
}
(async () => {
  const SET = process.argv[2] || 'smoke';
  const browser = await chromium.launch({ args: ['--no-sandbox'], proxy: { server: process.env.HTTPS_PROXY || 'http://127.0.0.1:44389' } });
  const res = path.join(OUT, SET + '.jsonl'); const W = o => { fs.appendFileSync(res, JSON.stringify(o) + '\n'); console.log(JSON.stringify(o).slice(0, 400)); };
  try {
    if (SET === 'smoke') { W(await sigRun(browser, 'submit', 'before', 1440, true, 99)); }
    if (SET === 'sig') { for (let run = 0; run < 2; run++) for (const w of [390, 1440]) {
        for (const v of ['before', 'B02', 'B15', 'B0215', 'B18', 'all']) for (const s of [true, false]) W(await sigRun(browser, 'submit', v, w, s, run));
        for (const v of ['before', 'B08']) W(await sigRun(browser, 'my-pets', v, w, true, run));
        for (const v of ['before', 'B17']) W(await sigRun(browser, 'edit-profile', v, w, true, run)); } }
    if (SET === 'autosave') { for (const w of [390, 1440]) for (const v of ['before', 'B02', 'all']) W(await autosave(browser, v, w)); }
    if (SET === 'pets') { for (const w of [390, 1440]) for (const v of ['before', 'B08']) for (const n of [0, 1, 2]) W(await pets(browser, v, w, n)); }
    if (SET === 'edit') { for (const w of [390, 1440]) for (const v of ['before', 'B17']) W(await edit(browser, v, w)); }
  } finally { await browser.close(); }
})();
