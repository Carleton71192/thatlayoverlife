/* Independent leftover check (leftover-check, 21 Nov 2026): h3c.cjs with (a) a cache miss aborted and recorded, never fetched; (b) scenario upgrade: visit 1 on the live footer (a real blank-visit leftover), later visits on the variant; (c) local-draft scenarios. Earlier header: c3 build check (leftover-build, 21 Nov 2026): h3b.cjs plus variant c3 = webflow-c3-after.html. Original header: Independent check, 21 Nov 2026: /submit account read waits for Memberstack (webflow-c2-after.html).
   Built on reports/evidence/submit-save-2026-11-17/check-final-run/h2.cjs (same stand-ins).
   Document: one plain GET of www /submit (21 Nov 09:05:53 UTC), saved to html/submit.html, served from disk for every load.
   - live: the saved HTML as served (footer block = webflow-c-after.html = webflow-c2-before.html).
   - new:  the footer block swapped for webflow-c2-after.html in the routed HTML only.
   Core and photo clean from git objects at the pins in the HTML (SRI on). Memberstack, Turnstile: local fakes. Cloudinary upload,
   Webflow form post, Worker /intake: local stubs. Every other non-GET is aborted. No www request leaves the browser.
   Memberstack timing (ms): early (before DOMContentLoaded, init script), real (the fake runs when the header script loads it),
   N (N ms after DOMContentLoaded), never (the script loads but $memberstackDom never appears).
   node h3.cjs <variant> <scen> <ms> <w>x<h> <outfile> */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), cp = require('child_process');
const { chromium } = require('playwright');
const D = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/acct-check';
const WT = path.join(D, 'wt'), IMG = path.join(D, 'img'), REPO = '/home/user/thatlayoverlife';
const EV = path.join(WT, 'reports/evidence');
const OWNC = path.join(D, 'cache'); fs.mkdirSync(OWNC, { recursive: true });
const IDX = new Map();
for (const f of fs.readdirSync(OWNC)) if (f.endsWith('.json')) { const m = JSON.parse(fs.readFileSync(path.join(OWNC, f))); if (m.u) IDX.set(m.u, path.join(OWNC, f.slice(0, -5))); }
const key = u => crypto.createHash('sha1').update(u).digest('hex');
function load(u) { const k = IDX.get(u); if (!k || !fs.existsSync(k + '.json')) return null; const m = JSON.parse(fs.readFileSync(k + '.json')); return { status: m.status, headers: m.headers, body: fs.readFileSync(k + '.b') }; }
function store(u, status, headers, body) { const k = path.join(OWNC, key(u)); fs.writeFileSync(k + '.b', body); fs.writeFileSync(k + '.json', JSON.stringify({ u, status, headers })); IDX.set(u, k); }
const GITC = new Map();
function git(sha, p) { const k = sha + ':' + p; if (GITC.has(k)) return GITC.get(k); let b = null; try { b = cp.execFileSync('git', ['-C', REPO, 'show', k], { maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'ignore'] }); } catch (e) { } GITC.set(k, b); return b; }
const JS = 'application/javascript; charset=utf-8';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const O = 'https://www.thatlayover.life';
const ADS = /googletagmanager\.com|google-analytics\.com|analytics\.ahrefs\.com|googlesyndication\.com|doubleclick\.net|adservice\.google|pagead2|googleadservices|fundingchoicesmessages\.google\.com/;
const MEDIA = /\.(jpe?g|png|gif|webp|avif|svg|mp4|webm|mov|m4v|woff2?|ttf|otf|eot)(\?|$)/i;
const CLOUD = 'https://api.cloudinary.com/v1_1/idonvlow/image/upload';
const WORKER = 'https://tll-travel-wire.thatlayoverlife.workers.dev/intake';
const FORMPOST = /^https:\/\/(webflow\.com|formdata\.webflow\.com)\/api\/v1\/form\//;
const FORM = 'submit-story';

/* test values only */
const DRAFT_FIELDS = { country: 'Testland', city: 'Account City', name: 'Account draft title', excerpt: 'Account excerpt for the card.', body: 'Account body text for the check.', region: 'asia', 'credit-mode=pen-name': 1, 'theme-salty-air=salty-air': 1 };
const SEEDS = {
  none: {},
  acct: { tllStoryDraft: { at: '2026-11-20T10:00:00.000Z', fields: DRAFT_FIELDS } },
  sent: { tllStoryDraft: { at: '2026-11-20T10:00:00.000Z', fields: DRAFT_FIELDS, sent: '2026-11-20T10:05:00.000Z' } },
  links: { tllLinks: { website: 'https://example.invalid/site', instagram: '@test_handle' } },
};

const fakeMS = (seed, o) => `(function(){if(window.$memberstackDom)return;var json=${JSON.stringify(seed || {})},calls=window.__msCalls=window.__msCalls||[];window.__msJSON=function(){return JSON.parse(JSON.stringify(json));};
var out=${o.signedOut ? 'true' : 'false'};
var member={id:'mem_test',auth:{email:'tester@example.invalid'},customFields:${JSON.stringify(o.cf || {})},planConnections:[],metaData:{}};
function rm(){if(out)return;[].forEach.call(document.querySelectorAll('[data-ms-content="anonymous"]'),function(e){e.remove();});}
var api={getCurrentMember:function(){calls.push([Date.now(),'getCurrentMember']);return Promise.resolve({data:out?null:member});},
getMemberJSON:function(){calls.push([Date.now(),'getMemberJSON']);if(out)return Promise.reject(new Error('No member is logged in (test)'));return new Promise(function(r){setTimeout(function(){r({data:JSON.parse(JSON.stringify(json))});},150);});},
updateMemberJSON:function(o){var j=JSON.parse(JSON.stringify((o&&o.json)||{}));calls.push([Date.now(),'updateMemberJSON',Object.keys(j).join(','),!!(j.tllStoryDraft&&j.tllStoryDraft.sent)]);if(out)return Promise.reject(new Error('No member is logged in (test)'));return new Promise(function(r){setTimeout(function(){json=j;r({data:json});},250);});},
getMemberCookie:function(){return out?'':'tok_test_only';},getMemberToken:function(){return out?'':'tok_test_only';},
onAuthChange:function(cb){setTimeout(function(){cb(out?null:member);},0);return{unsubscribe:function(){}};}};
function go(){if(window.$memberstackDom)return;window.__msAt=Date.now();if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',rm);else rm();
window.$memberstackDom=new Proxy(api,{get:function(t,k){if(k in t)return t[k];if(typeof k!=='string')return undefined;return function(){calls.push([Date.now(),'other:'+k]);return Promise.resolve({data:null});};}});}
var d=${JSON.stringify(o.delay)};
if(d==='never'){window.__msNever=1;return;}
if(d==='early'||d==='real')return go();
function after(){setTimeout(go,d);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',after);else{var dc=(window.__L&&window.__L.dcl)||Date.now();setTimeout(go,Math.max(0,dc+d-Date.now()));}
})();`;
const FAKE_TS = `window.turnstile={render:function(el,o){var i=document.createElement('input');i.type='hidden';i.name='cf-turnstile-response';i.value='test-token';el.appendChild(i);setTimeout(function(){o.callback('test-token');},100);return 'w1';},reset:function(){},remove:function(){},getResponse:function(){return 'test-token';}};`;

const INIT = (args) => {
  const [FORM, TYPE, LS] = args;
  if (LS) { try { localStorage.setItem('tllStoryDraft', LS); } catch (e) { } }
  const L = window.__L = { tl: [], errs: [], typedAt: null };
  addEventListener('DOMContentLoaded', () => { L.dcl = Date.now();
    if (TYPE) setTimeout(() => { const f = document.querySelector('form[data-tll-form="' + FORM + '"]'); if (!f) return;
      for (const [n, v] of Object.entries(TYPE)) {
        if (n.includes('=')) { const [nm, val] = n.split('='); const e = f.querySelector('input[name="' + nm + '"][value="' + val + '"]'); if (e) e.click(); continue; }
        const e = f.querySelector('[name="' + n + '"]'); if (!e) continue; const d = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(e), 'value'); d.set.call(e, v); e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); }
      L.typedAt = Date.now(); }, 100);
  });
};

/* the form as the writer sees it (test values only) */
const VIEW = (FORM) => {
  const f = document.querySelector('form[data-tll-form="' + FORM + '"]'); const v = n => { const e = f && f.querySelector('[name="' + n + '"]'); return e ? e.value : null; };
  const save = f && f.querySelector('.tllst-save');
  const chk = [].filter.call(f.querySelectorAll('input[type=checkbox],input[type=radio]'), e => e.checked).map(e => e.name + '=' + e.value).sort();
  return { save: save ? save.textContent.trim() : null, restoredOffer: /Draft restored/.test(f ? f.textContent : ''), alreadySent: /Already sent to the editor/.test(f ? f.textContent : ''),
    name: v('name'), excerpt: v('excerpt'), body: v('body'), country: v('country'), city: v('city'), region: v('region'), web: v('credit-website'), ig: v('credit-instagram'), checked: chk,
    prefilledTags: f.querySelectorAll('.tllst-prefilled').length, trip: v('trip-code'), msAt: window.__msAt || null, dcl: window.__L && window.__L.dcl, typedAt: window.__L && window.__L.typedAt };
};
/* page signature: visible text and element structure, without script/style, without input values */
const SIG = () => {
  const h = s => { let x = 0; for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) | 0; return (x >>> 0).toString(16); };
  const walk = (el, skip) => { let s = ''; for (const c of el.children) { const t = c.tagName; if (t === 'SCRIPT' || t === 'STYLE' || t === 'NOSCRIPT' || t === 'LINK' || t === 'META') continue; if (skip && skip(c)) continue; s += '<' + t + ' ' + (typeof c.className === 'string' ? c.className : '') + (c.hidden ? ' hidden' : '') + '>' + walk(c, skip) + '</>'; } return s; };
  const skip = c => c.classList && (c.classList.contains('tllst-prefilled'));
  const txt = document.body.innerText;
  const save = (document.querySelector('.tllst-save') || {}).textContent || '';
  return { raw: walk(document.body, null), struct: h(walk(document.body, null)), structNoPrefill: h(walk(document.body, skip)), text: h(txt), textNoSave: h(txt.split(save).join('').replace(/PREFILLED/g, '')), len: txt.length };
};
const DRAFT = () => {
  const sum = d => d ? { sent: !!d.sent, keys: d.fields ? Object.keys(d.fields).sort().join(',') : '' } : null;
  let ls = null; try { const v = localStorage.getItem('tllStoryDraft'); ls = v ? JSON.parse(v) : null; } catch (e) { }
  const j = window.__msJSON ? window.__msJSON() : {};
  return { account: sum(j.tllStoryDraft), accountSent: sum(j.tllStorySent), browser: ls ? Object.keys(ls).sort().join(',') : null, msKeys: Object.keys(j).sort() };
};

async function main() {
  const [variant, scen, msArg, vp, outFile] = process.argv.slice(2);
  const [W, H] = vp.split('x').map(Number), mobile = W < 800;
  const delay = /^\d+$/.test(msArg) ? Number(msArg) : msArg;
  let html = fs.readFileSync(path.join(D, 'html', 'submit.html'), 'utf8');
  const before = fs.readFileSync(path.join(EV, 'submit-account-read-2026-11-21/webflow-c2-before.html'), 'utf8');
  const after = fs.readFileSync(path.join(EV, 'submit-account-read-2026-11-21/webflow-c2-after.html'), 'utf8');
  if (html.split(before).length !== 2) throw new Error('footer block not found once');
  const liveHtml = html;
  const c3 = fs.readFileSync('/home/user/thatlayoverlife/reports/evidence/submit-account-read-2026-11-21/webflow-c3-after.html', 'utf8');
  if (variant === 'new') html = html.split(before).join(after);
  else if (variant === 'c3') html = html.split(before).join(c3);
  else if (variant !== 'live') throw new Error('variant?');

  /* scenario setup */
  const C = { seed: 'none', signedOut: false, cf: null, type: null, send: false, postfail: false, revisit: false, wait: null };
  if (scen === 'acct') C.seed = 'acct';
  if (scen === 'typing') { C.seed = 'acct'; C.type = { name: 'Typed here first', body: 'Typed body first.' }; }
  if (scen === 'typing-country') { C.seed = 'acct'; C.type = { country: 'Typedland' }; }
  if (scen === 'typing-other') { C.seed = 'acct'; C.type = { city: 'Typed City', 'credit-mode=anonymous': 1 }; }
  if (scen === 'sent') C.seed = 'sent';
  if (scen === 'links') C.seed = 'links';
  if (scen === 'cf') { C.seed = 'none'; C.cf = { website: 'https://example.invalid/cf', instagram: '@cf_handle' }; }
  if (scen === 'links-typed') { C.seed = 'links'; C.type = { 'credit-website': 'https://example.invalid/typed' }; }
  if (scen === 'signedout') { C.signedOut = true; C.type = { country: 'Testland', name: 'Signed out draft', excerpt: 'Signed out excerpt.', body: 'Signed out body.' }; C.wait = 'autosave'; }
  if (scen === 'signedout-blank') { C.signedOut = true; C.wait = 'autosave'; C.revisit = 'blank'; }
  if (scen === 'send') { C.send = true; C.revisit = 'send'; }
  if (scen === 'postfail') { C.send = true; C.postfail = true; C.revisit = 'postfail'; }
  if (scen === 'blank') { C.wait = 'autosave'; }
  if (scen === 'leftover') { C.ls = JSON.stringify({ 'invite-link': 'https://www.thatlayover.life/submit?trip=TEST', 'lounge-photo-pick': 'hero', 'trip-code': 'TEST' }); C.wait = 'autosave'; C.revisit = 'blank'; }
  if (scen === 'upgrade') { C.firstLive = true; C.signedOut = false; C.wait = 'autosave'; C.revisit = 'blank'; }
  if (scen === 'upgrade-out') { C.firstLive = true; C.signedOut = true; C.wait = 'autosave'; C.revisit = 'blank'; }
  if (scen === 'localdraft') { C.ls = JSON.stringify({ name: 'Local draft title', body: 'Local draft body.', 'trip-code': 'TLOCAL', 'invite-link': 'https://www.thatlayover.life/submit?trip=TLOCAL' }); C.revisit = 'blank'; }
  if (scen === 'localdraft-body') { C.ls = JSON.stringify({ body: 'Only the body, typed last time.', 'trip-code': 'TLOCAL' }); }
  if (scen === 'localdraft-acct') { C.seed = 'acct'; C.ls = JSON.stringify({ name: 'Local draft title', body: 'Local draft body.', 'trip-code': 'TLOCAL' }); }
  if (scen === 'signedout-revisit') { C.signedOut = true; C.type = { country: 'Testland', name: 'Signed out draft', excerpt: 'Signed out excerpt.', body: 'Signed out body.' }; C.wait = 'autosave'; C.revisit = 'blank'; }
  if (scen === 'leftover-acct') { C.seed = 'acct'; C.ls = JSON.stringify({ 'invite-link': 'https://www.thatlayover.life/submit?trip=TEST', 'lounge-photo-pick': 'hero', 'trip-code': 'TEST' }); }

  const R = { variant, scen, ms: msArg, vp, posts: [], uploads: [], worker: [], aborted: [], cons: [], pageErr: [], misses: [], visits: [] };
  let upN = 0, postN = 0, msSeed = SEEDS[C.seed];
  const browser = await chromium.launch();
  const mkctx = async () => {
    const ctx = await browser.newContext({ viewport: { width: W, height: H }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1,
      userAgent: mobile ? 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' });
    await ctx.route('**/*', async rt => {
      const q = rt.request(), u = q.url(), ty = q.resourceType(), m = q.method(); let pu = null; try { pu = new URL(u); } catch (e) { }
      if (u === CLOUD && m === 'POST') { const n = ++upN; R.uploads.push({ t: Date.now(), n }); await sleep(4000);
        return rt.fulfill({ status: 200, headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }, body: JSON.stringify({ secure_url: `https://res.cloudinary.com/idonvlow/image/upload/v1/test/test${n}.jpg` }) }); }
      if (FORMPOST.test(u) && m === 'POST') { const n = ++postN; R.posts.push({ t: Date.now(), n }); await sleep(1500);
        if (C.postfail) { R.posts[R.posts.length - 1].failed = true; return rt.fulfill({ status: 500, headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }, body: '{"code":500,"msg":"test"}' }); }
        return rt.fulfill({ status: 200, headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }, body: '{"code":200,"msg":"ok"}' }); }
      if (u === WORKER) {
        const cors = { 'access-control-allow-origin': O, 'access-control-allow-headers': 'content-type, authorization', 'access-control-allow-methods': 'POST, OPTIONS', 'vary': 'Origin' };
        if (m === 'OPTIONS') return rt.fulfill({ status: 204, headers: cors, body: '' });
        if (m === 'POST') { R.worker.push({ t: Date.now() }); await sleep(3000); return rt.fulfill({ status: 200, headers: Object.assign({ 'content-type': 'application/json' }, cors), body: '{"saved":true,"held":true,"kind":"story","id":"test","slug":"test","checks":[]}' }); }
      }
      if (m !== 'GET') { R.aborted.push(m + ' ' + u.slice(0, 90)); return rt.abort(); }
      if (pu && /workers\.dev$|cloudinary\.com$/.test(pu.host)) { R.aborted.push('GET ' + u.slice(0, 90)); return rt.abort(); }
      if (ADS.test(u)) return rt.fulfill({ status: 200, headers: { 'content-type': /\.js|gtag\/js/.test(u) ? 'application/javascript' : 'text/plain' }, body: '' });
      if (u === 'https://static.memberstack.com/scripts/v2/memberstack.js') { R.msScript = (R.msScript || 0) + 1; return rt.fulfill({ status: 200, headers: { 'content-type': JS, 'access-control-allow-origin': '*' }, body: fakeMS(msSeed, { delay: delay === 'early' ? 'real' : delay, signedOut: C.signedOut, cf: C.cf }) }); }
      if (/memberstack/.test(pu ? pu.host : '')) { R.aborted.push('GET ' + u.slice(0, 90)); return rt.abort(); }
      if (/^https:\/\/challenges\.cloudflare\.com\/turnstile\/v0\/api\.js/.test(u)) return rt.fulfill({ status: 200, headers: { 'content-type': JS }, body: FAKE_TS });
      if (pu && pu.host === 'challenges.cloudflare.com') { R.aborted.push('GET ' + u.slice(0, 90)); return rt.abort(); }
      if (pu && pu.host === 'res.cloudinary.com') return rt.abort();
      if (pu && pu.origin === O) { if (q.isNavigationRequest() && pu.pathname === '/submit') return rt.fulfill({ status: 200, headers: { 'content-type': 'text/html; charset=utf-8' }, body: (C.firstLive && !R.firstDone) ? liveHtml : html }); R.aborted.push('GET ' + u.slice(0, 90)); return rt.abort(); }
      const gm = /^https:\/\/cdn\.jsdelivr\.net\/gh\/[^/]+\/thatlayoverlife@([0-9a-f]{40})\/([^?#]+)$/i.exec(u);
      if (gm) { const hd = { 'content-type': /\.css$/.test(gm[2]) ? 'text/css; charset=utf-8' : JS, 'access-control-allow-origin': '*' }; const b = git(gm[1], gm[2]); if (b) return rt.fulfill({ status: 200, headers: hd, body: b }); }
      const c = load(u); if (c) return rt.fulfill({ status: c.status, headers: c.headers, body: c.body });
      if (ty === 'image' || ty === 'media' || ty === 'font' || MEDIA.test(pu ? pu.pathname : u)) return rt.abort();
      if (/^(script|stylesheet|fetch|xhr)$/.test(ty)) {
        R.misses.push(u.slice(0, 100)); return rt.abort();
      }
      R.aborted.push('GET ' + ty + ' ' + u.slice(0, 90)); return rt.abort();
    });
    return ctx;
  };
  const open = async (ctx, tag, type, ls) => {
    const pg = await ctx.newPage(); await pg.addInitScript(INIT, [FORM, type || null, ls || null]);
    if (delay === 'early') await pg.addInitScript(fakeMS(msSeed, { delay: 'early', signedOut: C.signedOut, cf: C.cf }));
    pg.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') R.cons.push(tag + ' ' + m.type() + ': ' + m.text().slice(0, 200)); });
    pg.on('pageerror', e => R.pageErr.push(tag + ' ' + String(e).slice(0, 200)));
    await pg.goto(O + '/submit', { waitUntil: 'load', timeout: 60000 });
    return pg;
  };
  /* wait after load: enough for the Memberstack arrival plus the account read, or past the 15 s give-up for never */
  const settle = async pg => { const extra = delay === 'never' ? 16500 : typeof delay === 'number' ? delay + 2500 : 2500; const dcl = await pg.evaluate(() => window.__L.dcl); const until = dcl + extra; if (until > Date.now()) await sleep(until - Date.now()); };
  const msCalls = pg => pg.evaluate(() => (window.__msCalls || []).map(c => [c[0], c[1], c[3]]));
  const snapshot = async (pg, tag) => ({ tag, view: await pg.evaluate(VIEW, FORM), draft: await pg.evaluate(DRAFT), sig: await pg.evaluate(SIG), ms: await msCalls(pg) });

  const ctx = await mkctx();
  const pg = await open(ctx, 'v1', C.type, C.ls);
  await settle(pg);
  R.first = await snapshot(pg, 'first');
  if (C.wait === 'autosave') { const dcl = await pg.evaluate(() => window.__L.dcl); await sleep(Math.max(0, dcl + 21500 - Date.now())); R.firstAfter20 = await snapshot(pg, 'after one autosave tick'); }
  if (C.send) {
    const f = `form[data-tll-form="${FORM}"]`, img = n => path.join(IMG, `test-photo-${n}.jpg`);
    await pg.fill(f + ' input[name="country"]', 'Testland');
    await pg.fill(f + ' input[name="name"]', 'A test story for the send check');
    await pg.fill(f + ' textarea[name="excerpt"]', 'A short test excerpt for the card.');
    await pg.fill(f + ' textarea[name="body"]', 'We took the night bus to the coast and watched the sun come up over the harbor.\n\nThen breakfast with the driver.');
    await pg.click(f + ' .tllst-next'); await sleep(600);
    const opts = await pg.$$eval(f + ' select[name="region"] option', os => os.map(o => o.value).filter(Boolean)); await pg.selectOption(f + ' select[name="region"]', opts[0]);
    await pg.click(f + ' .tllst-next'); await sleep(600);
    await pg.fill(f + ' input[name="contributor-name"]', 'Test Writer');
    await pg.fill(f + ' input[name="email"]', 'tester@example.invalid');
    await pg.setInputFiles(f + ' input[type="file"][name="hero-image"]', img(1));
    await pg.setInputFiles(f + ' input[type="file"][name="photo-gallery"]', [img(2)]);
    await sleep(800);
    await pg.$eval(f + ' input[name="agree-charter"]', e => { if (!e.checked) e.click(); });
    await pg.$$eval(f + ' [data-tll-step="3"] input[type="checkbox"][required]', es => es.forEach(e => { if (!e.checked) e.click(); }));
    const t1 = Date.now(); while (Date.now() - t1 < 30000) { if (await pg.evaluate(() => (window.__msCalls || []).some(c => c[1] === 'updateMemberJSON'))) break; await sleep(250); }
    R.preAutosave = await pg.evaluate(() => (window.__msCalls || []).filter(c => c[1] === 'updateMemberJSON').length);
    const btn = await pg.$(f + ' [type="submit"]'); await btn.scrollIntoViewIfNeeded(); await sleep(500);
    const box = await btn.boundingBox(); if (mobile) await pg.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); else await pg.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    const st = () => pg.evaluate((FORM) => { const w = document.querySelector('form[data-tll-form="' + FORM + '"]').closest('.w-form'), v = e => !!e && e.getClientRects().length > 0; return { done: v(w.querySelector('.w-form-done')), fail: v(w.querySelector('.w-form-fail')) }; }, FORM);
    const dl = Date.now() + 90000; let s; while (Date.now() < dl) { await sleep(250); s = await st(); if (s.done || s.fail) break; }
    R.sendEnd = s; await sleep(4000 + 22000);
    R.afterSend = await snapshot(pg, 'after send + one autosave tick');
  }
  R.firstDone = true; R.firstLive = !!C.firstLive;
  if (C.revisit) {
    msSeed = await pg.evaluate(() => window.__msJSON ? window.__msJSON() : {});
    const seed1 = msSeed;
    await pg.close();
    const p2 = await open(ctx, 'v2'); await settle(p2);
    const v2 = await snapshot(p2, 'visit 2 same browser');
    const dcl = await p2.evaluate(() => window.__L.dcl); await sleep(Math.max(0, dcl + 21500 - Date.now()));
    v2.after20 = await snapshot(p2, 'visit 2 after one autosave tick, nothing typed');
    R.visits.push(v2);
    msSeed = await p2.evaluate(() => window.__msJSON ? window.__msJSON() : {}); const seed2 = msSeed;
    await p2.close();
    const p3 = await open(ctx, 'v3'); await settle(p3); R.visits.push(await snapshot(p3, 'visit 3 same browser')); await p3.close();
    for (const [tag, seed] of [['new browser, account after visit 1', seed1], ['new browser, account after visit 2', seed2]]) {
      msSeed = seed; const c3 = await mkctx(); const p4 = await open(c3, 'v4'); await settle(p4); R.visits.push(await snapshot(p4, tag)); await c3.close();
    }
  }
  await browser.close();
  fs.appendFileSync(outFile, JSON.stringify(R) + '\n');
  console.log(variant, scen, msArg, vp, 'posts', R.posts.length, 'errs', R.pageErr.length, 'cons', R.cons.length, 'misses', R.misses.length);
}
main().catch(e => { console.error('FAIL', e); process.exit(1); });
