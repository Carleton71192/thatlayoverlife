/* /submit Send check, 17 Nov 2026. Branch claude/submit-send-wait-2026-11-17 (0a2c53d) against the live code.
   - Document: one plain GET of www /submit (html/submit.html, 15:54 UTC), served from disk for every load.
   - live:   core 3df16988 + its chunks + photo clean 22019832, from git objects at those pins (SRI intact).
   - branch: core, chunks and photo clean from the branch worktree; integrity removed in the routed HTML only for core and photo clean
             (the branch core carries the branch chunk hashes, so the chunks load with SRI on).
   - c1667:  core 50e84bf (16.67.0) + its chunks + photo clean 22019832 (to separate the fix from 16.67.0).
   - +C:     the fix.md part C block swapped into the inline steps script (HTML patch, local only).
   - Every non-GET is aborted unless a local stub answers it: Cloudinary upload (4 s each), Webflow form post (1.5 s),
     travel-wire /intake (6 s). Memberstack and Turnstile are local fakes (signed-in member, test token). Nothing leaves the machine
     except GETs of cached static files on a cache miss.
   node h.cjs <variant> <scenario> <w>x<h> [outfile]  */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), cp = require('child_process');
const { chromium } = require('playwright');
const SP = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad';
const D = path.join(SP, 'nov17/submit-check'), WT = path.join(D, 'wt'), REPO = '/home/user/thatlayoverlife';
const N16 = path.join(SP, 'nov16/b');
const IDX = new Map(Object.entries(JSON.parse(fs.readFileSync(path.join(N16, 'cache-index.json')))));
for (const f of fs.readdirSync(path.join(N16, 'cache'))) if (f.endsWith('.json')) { const m = JSON.parse(fs.readFileSync(path.join(N16, 'cache', f))); if (m.u && !IDX.has(m.u)) IDX.set(m.u, path.join(N16, 'cache', f.slice(0, -5))); }
const OWN = path.join(D, 'cache'); fs.mkdirSync(OWN, { recursive: true });
for (const f of fs.readdirSync(OWN)) if (f.endsWith('.json')) { const m = JSON.parse(fs.readFileSync(path.join(OWN, f))); if (m.u && !IDX.has(m.u)) IDX.set(m.u, path.join(OWN, f.slice(0, -5))); }
const key = u => crypto.createHash('sha1').update(u).digest('hex');
function load(u) { const k = IDX.get(u); if (!k || !fs.existsSync(k + '.json')) return null; const m = JSON.parse(fs.readFileSync(k + '.json')); return { status: m.status, headers: m.headers, body: fs.readFileSync(k + '.b') }; }
function store(u, status, headers, body) { const k = path.join(OWN, key(u)); fs.writeFileSync(k + '.b', body); fs.writeFileSync(k + '.json', JSON.stringify({ u, status, headers })); IDX.set(u, k); }
const GITC = new Map();
function git(sha, p) { const k = sha + ':' + p; if (GITC.has(k)) return GITC.get(k); let b = null; try { b = cp.execFileSync('git', ['-C', REPO, 'show', k], { maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'ignore'] }); } catch (e) { } GITC.set(k, b); return b; }
const JS = 'application/javascript; charset=utf-8';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const O = 'https://www.thatlayover.life';
const ADS = /googletagmanager\.com|google-analytics\.com|analytics\.ahrefs\.com|googlesyndication\.com|doubleclick\.net|adservice\.google|pagead2|googleadservices|fundingchoicesmessages\.google\.com/;
const WF = /^https?:\/\/([a-z0-9-]+\.)*(website-files\.com|webflow\.io|webflow\.com|thatlayover\.life|d3e54v103j8qbb\.cloudfront\.net)(\/|$)/i;
const MEDIA = /\.(jpe?g|png|gif|webp|avif|svg|mp4|webm|mov|m4v|woff2?|ttf|otf|eot)(\?|$)/i;
const CLOUD = 'https://api.cloudinary.com/v1_1/idonvlow/image/upload';
const WORKER = 'https://tll-travel-wire.thatlayoverlife.workers.dev/intake';
const FORMPOST = /^https:\/\/(webflow\.com|formdata\.webflow\.com)\/api\/v1\/form\//;

const FAKE_MS = `(function(){var json={},calls=window.__msCalls=[];window.__msJSON=function(){return JSON.parse(JSON.stringify(json));};
var member={id:'mem_test',auth:{email:'tester@example.invalid'},customFields:{},planConnections:[],metaData:{}};
function rm(){[].forEach.call(document.querySelectorAll('[data-ms-content="anonymous"]'),function(e){e.remove();});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',rm);else rm();
var api={getCurrentMember:function(){calls.push([Date.now(),'getCurrentMember']);return Promise.resolve({data:member});},
getMemberJSON:function(){calls.push([Date.now(),'getMemberJSON']);return Promise.resolve({data:JSON.parse(JSON.stringify(json))});},
updateMemberJSON:function(o){calls.push([Date.now(),'updateMemberJSON',Object.keys((o&&o.json)||{}).join(',')]);json=JSON.parse(JSON.stringify((o&&o.json)||{}));return Promise.resolve({data:json});},
getMemberCookie:function(){return 'tok_test_only';},getMemberToken:function(){return 'tok_test_only';},
onAuthChange:function(cb){setTimeout(function(){cb(member);},0);return{unsubscribe:function(){}};}};
window.$memberstackDom=new Proxy(api,{get:function(t,k){if(k in t)return t[k];if(typeof k!=='string')return undefined;return function(){calls.push([Date.now(),'other:'+k]);return Promise.resolve({data:null});};}});
})();`;
const FAKE_TS = `window.turnstile={render:function(el,o){var i=document.createElement('input');i.type='hidden';i.name='cf-turnstile-response';i.value='test-token';el.appendChild(i);setTimeout(function(){o.callback('test-token');},100);return 'w1';},reset:function(){},remove:function(){},getResponse:function(){return 'test-token';}};`;

const INIT = () => {
  const L = window.__L = { tl: [], subs: [], rs: [], errs: [] };
  const vis = el => !!el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
  const desc = el => { if (!el || el === document.body) return 'body'; let s = el.tagName.toLowerCase(); if (el.type) s += '[' + el.type + ']'; if (el.className && typeof el.className === 'string') s += '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.'); return s; };
  addEventListener('submit', ev => { const t = Date.now(); const f = ev.target; setTimeout(() => L.subs.push({ t, form: f.getAttribute('data-tll-form'), prevented: ev.defaultPrevented, submitter: ev.submitter ? ev.submitter.value : null }), 0); }, true);
  const RS = HTMLFormElement.prototype.requestSubmit;
  HTMLFormElement.prototype.requestSubmit = function (s) { const t = Date.now(), n0 = L.subs.length; const r = RS.apply(this, arguments); L.rs.push({ t, form: this.getAttribute('data-tll-form') }); return r; };
  L.siv = []; const SIV = Element.prototype.scrollIntoView; Element.prototype.scrollIntoView = function (o) { L.siv.push({ t: Date.now(), el: desc(this), o: JSON.stringify(o) }); return SIV.apply(this, arguments); };
  L.foc = []; const FOC = HTMLElement.prototype.focus; HTMLElement.prototype.focus = function () { L.foc.push({ t: Date.now(), el: desc(this), vis: vis(this) }); return FOC.apply(this, arguments); };
  let last = '';
  const snap = () => {
    const f = document.querySelector('form[data-tll-form="submit-story"]'); if (!f) return;
    const b = f.querySelector('[type="submit"]'), wrap = f.closest('.w-form'), done = wrap && wrap.querySelector('.w-form-done'), fail = wrap && wrap.querySelector('.w-form-fail');
    const up = f.querySelector('.tll-up-msg'), es = f.querySelector('.tll-end-send'), eb = f.querySelector('.tll-end-body') || f.querySelector('.tll-end-note'), im = done && done.querySelector('.tll-intake-msg');
    const br = b ? b.getBoundingClientRect() : null, dr = done ? done.getBoundingClientRect() : null;
    const o = {
      btn: b ? b.value : null, dis: b ? b.disabled : null, op: b ? getComputedStyle(b).opacity : null, btnVis: vis(b),
      btnInView: br ? (br.bottom > 0 && br.top < innerHeight) : null,
      up: up ? up.textContent : null, upRole: up ? up.getAttribute('role') : null, upVis: vis(up),
      endSend: es ? (vis(es) ? 'shown' : 'hidden') : null, endSendRole: es ? es.getAttribute('role') : null, endBody: eb ? (vis(eb) ? 'shown' : 'hidden') : null,
      done: vis(done), doneInView: dr && vis(done) ? (dr.top >= -1 && dr.bottom <= innerHeight + 1) : null, doneTop: dr && vis(done) ? Math.round(dr.top) : null, doneBot: dr && vis(done) ? Math.round(dr.bottom) : null, doneVisPct: dr && vis(done) && dr.height ? Math.round(100 * Math.max(0, Math.min(dr.bottom, innerHeight) - Math.max(dr.top, 0)) / dr.height) : null, docH: document.documentElement.scrollHeight,
      fail: vis(fail), intake: im ? im.textContent : null, intakeRole: im ? im.getAttribute('role') : null,
      formVis: vis(f), active: desc(document.activeElement), sy: Math.round(scrollY),
      step: (document.querySelector('.tllst-eb') || {}).textContent || null,
    };
    const s = JSON.stringify(o); if (s !== last) { last = s; L.tl.push(Object.assign({ t: Date.now() }, o)); }
  };
  const tick = () => { try { snap(); } catch (e) { L.errs.push(String(e)); } };
  document.addEventListener('DOMContentLoaded', () => { setInterval(tick, 50); });
};

async function main() {
  const [variant, scen, vp, outFile] = process.argv.slice(2);
  const [W, H] = vp.split('x').map(Number), mobile = W < 800;
  const V = new Set(variant.split('+'));
  const base = V.has('branch') ? 'branch' : V.has('c1667') ? 'c1667' : 'live';
  let html = fs.readFileSync(path.join(D, 'html', 'submit.html'), 'utf8');
  if (base !== 'live') {
    const n0 = html.length;
    html = html.replace(/(<script[^>]*tll-site-layers-v16\.js"[^>]*?) integrity="[^"]*"/, '$1');
    if (base === 'branch') html = html.replace(/(<script[^>]*tll-photo-clean-v1\.js"[^>]*?) integrity="[^"]*"/, '$1');
    if (html.length === n0) throw new Error('integrity strip failed');
  }
  if (V.has('C')) { const [a, b] = JSON.parse(fs.readFileSync(path.join(D, 'c-patch.json'), 'utf8')); if (html.split(a).length !== 2) throw new Error('C patch miss'); html = html.split(a).join(b); }
  const coreBody = base === 'branch' ? fs.readFileSync(path.join(WT, 'src/site-layers/tll-site-layers-v16.js')) : base === 'c1667' ? git('50e84bf', 'src/site-layers/tll-site-layers-v16.js') : null;
  const chunkBody = n => base === 'branch' ? fs.readFileSync(path.join(WT, 'src/site-layers/chunks', n)) : base === 'c1667' ? git('50e84bf', 'src/site-layers/chunks/' + n) : null;
  const pcBody = base === 'branch' ? fs.readFileSync(path.join(WT, 'src/components/photo-clean/tll-photo-clean-v1.js')) : null;

  /* scenario knobs */
  const S = {
    uploadFailAt: scen === 'upfail' ? 2 : 0,         /* the n-th upload answers 500 (once) */
    formFailFirst: scen === 'cached',                /* the first Webflow post answers 500: forced cancel, then a cached re-send */
    worker: scen === 'workerfail' ? 502 : scen === 'workeroff' ? 'off' : 200,
    body: scen === 'nopunct' ? 'We took the night bus to the coast and watched the sun come up over the harbor\n\nThen breakfast with the driver 🌙' : 'We took the night bus to the coast and watched the sun come up over the harbor.\n\nThen breakfast with the driver, which was the best part.',
    mash: scen === 'mash', key: scen === 'key', autosave: scen === 'one' || scen === 'key',
  };
  const R = { variant, scen, vp, uploads: [], posts: [], worker: [], preflight: 0, aborted: [], cons: [], pageErr: [], misses: [], presses: [] };
  let upN = 0, postN = 0;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1,
    userAgent: mobile ? 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' });
  await ctx.route('**/*', async rt => {
    const q = rt.request(), u = q.url(), ty = q.resourceType(), m = q.method(); let pu = null; try { pu = new URL(u); } catch (e) { }
    if (u === CLOUD && m === 'POST') {
      const n = ++upN, t = Date.now(); const body = q.postDataBuffer() || Buffer.alloc(0); const folder = (/name="folder"\r\n\r\n([^\r]*)/.exec(body.toString('latin1')) || [])[1]; const fname = (/name="file"; filename="([^"]*)"/.exec(body.toString('latin1')) || [])[1];
      R.uploads.push({ t, n, folder, fname, bytes: body.length }); await sleep(4000);
      if (S.uploadFailAt === n) { R.uploads[R.uploads.length - 1].failed = true; return rt.fulfill({ status: 500, headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }, body: '{"error":{"message":"test"}}' }); }
      return rt.fulfill({ status: 200, headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }, body: JSON.stringify({ secure_url: `https://res.cloudinary.com/idonvlow/image/upload/v1/${folder}/test${n}.jpg` }) });
    }
    if (FORMPOST.test(u) && m === 'POST') {
      const n = ++postN, t = Date.now(); const pd = q.postData() || ''; const p = new URLSearchParams(pd);
      R.posts.push({ t, n, name: p.get('name'), hero: p.get('fields[hero-image]'), gallery: (p.get('fields[photo-gallery]') || '').split('\n').filter(Boolean).length, body_end: (p.get('fields[body]') || '').slice(-12), turnstile: !!p.get('fields[cf-turnstile-response]') });
      await sleep(1500);
      if (S.formFailFirst && n === 1) { R.posts[0].failed = true; return rt.fulfill({ status: 500, headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }, body: '{"code":500,"msg":"test"}' }); }
      return rt.fulfill({ status: 200, headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }, body: '{"code":200,"msg":"ok"}' });
    }
    if (u === WORKER) {
      const cors = { 'access-control-allow-origin': O, 'access-control-allow-headers': 'content-type, authorization', 'access-control-allow-methods': 'POST, OPTIONS', 'vary': 'Origin' };
      if (m === 'OPTIONS') { R.preflight++; return rt.fulfill({ status: 204, headers: cors, body: '' }); }
      if (m === 'POST') { const t = Date.now(); let b = {}; try { b = JSON.parse(q.postData() || '{}'); } catch (e) { } R.worker.push({ t, kind: b.kind, auth: !!(q.headers().authorization || '').match(/^Bearer tok_test_only$/) }); await sleep(6000);
        if (S.worker === 'off') return rt.abort('internetdisconnected');
        if (S.worker === 502) return rt.fulfill({ status: 502, headers: Object.assign({ 'content-type': 'application/json' }, cors), body: '{"error":"Saved, and we will set it up by hand."}' });
        return rt.fulfill({ status: 200, headers: Object.assign({ 'content-type': 'application/json' }, cors), body: '{"saved":true,"held":true,"kind":"story","id":"test","slug":"test","checks":[]}' }); }
    }
    if (m !== 'GET') { R.aborted.push(m + ' ' + u.slice(0, 90)); return rt.abort(); }
    if (pu && /workers\.dev$|cloudinary\.com$/.test(pu.host)) { R.aborted.push('GET ' + u.slice(0, 90)); return rt.abort(); } /* no Worker or Cloudinary call of any kind */
    if (ADS.test(u)) return rt.fulfill({ status: 200, headers: { 'content-type': /\.js|gtag\/js/.test(u) ? 'application/javascript' : 'text/plain' }, body: '' });
    if (u === 'https://static.memberstack.com/scripts/v2/memberstack.js') return rt.fulfill({ status: 200, headers: { 'content-type': JS, 'access-control-allow-origin': '*' }, body: FAKE_MS });
    if (/memberstack/.test(pu ? pu.host : '')) { R.aborted.push('GET ' + u.slice(0, 90)); return rt.abort(); }
    if (u === 'https://challenges.cloudflare.com/turnstile/v0/api.js') return rt.fulfill({ status: 200, headers: { 'content-type': JS }, body: FAKE_TS });
    if (pu && pu.host === 'challenges.cloudflare.com') { R.aborted.push('GET ' + u.slice(0, 90)); return rt.abort(); }
    if (pu && pu.host === 'res.cloudinary.com') return rt.abort();
    if (pu && pu.origin === O) { if (q.isNavigationRequest() && pu.pathname === '/submit') return rt.fulfill({ status: 200, headers: { 'content-type': 'text/html; charset=utf-8' }, body: html }); R.aborted.push('GET ' + u.slice(0, 90)); return rt.abort(); }
    const gm = /^https:\/\/cdn\.jsdelivr\.net\/gh\/[^/]+\/thatlayoverlife@([0-9a-f]{40})\/([^?#]+)$/i.exec(u);
    if (gm) {
      const hd = { 'content-type': /\.css$/.test(gm[2]) ? 'text/css; charset=utf-8' : JS, 'access-control-allow-origin': '*' };
      if (coreBody && /tll-site-layers-v16\.js$/.test(gm[2])) return rt.fulfill({ status: 200, headers: hd, body: coreBody });
      if (pcBody && /tll-photo-clean-v1\.js$/.test(gm[2])) return rt.fulfill({ status: 200, headers: hd, body: pcBody });
      const cm = /src\/site-layers\/chunks\/([^/]+\.js)$/.exec(gm[2]); if (cm && base !== 'live') return rt.fulfill({ status: 200, headers: hd, body: chunkBody(cm[1]) });
      const b = git(gm[1], gm[2]); if (b) return rt.fulfill({ status: 200, headers: hd, body: b });
    }
    const c = load(u); if (c) return rt.fulfill({ status: c.status, headers: c.headers, body: c.body });
    if (ty === 'image' || ty === 'media' || ty === 'font' || MEDIA.test(pu ? pu.pathname : u)) return rt.abort();
    if (/^(script|stylesheet|fetch|xhr)$/.test(ty)) { /* static GET cache miss: fetch once, keep */
      try { const r = await rt.fetch(); const b = await r.body(); store(u, r.status(), r.headers(), b); R.misses.push(u.slice(0, 100)); return rt.fulfill({ status: r.status(), headers: r.headers(), body: b }); } catch (e) { R.aborted.push('miss ' + u.slice(0, 90)); return rt.abort(); }
    }
    R.aborted.push('GET ' + ty + ' ' + u.slice(0, 90)); return rt.abort();
  });
  const pg = await ctx.newPage(); await pg.addInitScript(INIT);
  pg.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') R.cons.push(m.type() + ': ' + m.text().slice(0, 200)); });
  pg.on('pageerror', e => R.pageErr.push(String(e).slice(0, 200)));
  await pg.goto(O + '/submit', { waitUntil: 'load', timeout: 60000 });
  await sleep(2500);
  const f = 'form[data-tll-form="submit-story"]';
  R.loaded = await pg.evaluate(() => ({ core: [...document.querySelectorAll('script[src*="tll-site-layers-v16"]')].map(s => s.src.replace(/^.*@/, '').slice(0, 8)), chunk: [...document.querySelectorAll('script[src*="/chunks/"]')].map(s => s.src.replace(/^.*\//, '')), pc: !!window.__tllPhotoClean, intake: !!(document.querySelector('form[data-tll-form="submit-story"]') || {}).__tllIntake, end: !!(document.querySelector('form[data-tll-form="submit-story"]') || {}).__tllEnd, steps: !!(document.querySelector('form[data-tll-form="submit-story"]') || {}).__tllSteps2 }));
  /* step 1 */
  await pg.fill(f + ' input[name="country"]', 'Testland');
  await pg.fill(f + ' input[name="name"]', 'A test story for the send check');
  await pg.fill(f + ' textarea[name="excerpt"]', 'A short test excerpt for the card.');
  await pg.fill(f + ' textarea[name="body"]', S.body);
  const city = await pg.$(f + ' input[name="city"]'); if (city && await city.isVisible()) await city.fill('Test City');
  await pg.click(f + ' .tllst-next'); await sleep(600);
  /* step 2 */
  const opts = await pg.$$eval(f + ' select[name="region"] option', os => os.map(o => o.value).filter(Boolean)); await pg.selectOption(f + ' select[name="region"]', opts[0]);
  await pg.click(f + ' .tllst-next'); await sleep(600);
  /* step 3 */
  await pg.fill(f + ' input[name="contributor-name"]', 'Test Writer');
  await pg.fill(f + ' input[name="email"]', 'tester@example.invalid');
  const img = n => path.join(D, 'img', `test-photo-${n}.jpg`);
  await pg.setInputFiles(f + ' input[type="file"][name="hero-image"]', img(1));
  const gal = await pg.$(f + ' input[type="file"][name="photo-gallery"]'); const multi = await gal.evaluate(e => e.multiple);
  R.galleryMultiple = multi;
  await gal.setInputFiles(multi ? [img(2), img(3)] : [img(2)]);
  await sleep(800);
  await pg.$eval(f + ' input[name="agree-charter"]', e => { if (!e.checked) e.click(); });
  /* other required boxes on step 3, if any */
  await pg.$$eval(f + ' [data-tll-step="3"] input[type="checkbox"][required]', es => es.forEach(e => { if (!e.checked) e.click(); }));
  R.photoCount = await pg.$$eval(f + ' input[type="file"]', es => es.reduce((a, e) => a + (e.files ? e.files.length : 0), 0));
  const btn = await pg.$(f + ' [type="submit"]');
  await btn.scrollIntoViewIfNeeded(); await sleep(700);
  R.pre = await pg.evaluate(() => { const b = document.querySelector('form[data-tll-form="submit-story"] [type="submit"]'); return { btn: b.value, dis: b.disabled, step: (document.querySelector('.tllst-eb') || {}).textContent, docH: document.documentElement.scrollHeight, sy: scrollY }; });
  const box = await btn.boundingBox(); const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  const press = async (how) => { const t = Date.now(); R.presses.push({ t, how }); if (how === 'key') { await pg.keyboard.press('Enter'); } else if (mobile) { await pg.touchscreen.tap(cx, cy); } else { await pg.mouse.click(cx, cy); } };
  const T0 = Date.now(); R.T0 = T0;
  if (S.key) { await btn.focus(); await press('key'); } else await press('tap');
  const isDone = () => pg.evaluate(() => { const d = document.querySelector('form[data-tll-form="submit-story"]').closest('.w-form').querySelector('.w-form-done'); return !!d && d.getClientRects().length > 0; });
  if (S.mash) { for (let i = 0; i < 14; i++) { await sleep(1000); if (await isDone()) break; if (S.key) await press('key'); else await press('tap'); } }
  /* persistent writer: when nothing is in flight for 1.5 s, the button is enabled and no done box shows, press again (at most 4 more) */
  let extra = 0, idleSince = null; const deadline = Date.now() + 90000;
  while (Date.now() < deadline) {
    await sleep(250);
    if (await isDone()) break;
        const st = await pg.evaluate(() => { const b = document.querySelector('form[data-tll-form="submit-story"] [type="submit"]'); return { dis: b.disabled, wait: /Copenhagen|Sending|Photos are up/.test(b.value) }; });
    const lastNet = Math.max(0, ...R.uploads.map(x => x.t + 4000), ...R.posts.map(x => x.t + 1500));
    const idle = !st.dis && !st.wait && Date.now() - lastNet > 1500;
    if (idle) { if (!idleSince) idleSince = Date.now(); if (Date.now() - idleSince > 1500) { if (extra >= 4) break; extra++; idleSince = null; if (S.key) { await btn.focus(); await press('key'); } else { await btn.scrollIntoViewIfNeeded(); const b2 = await btn.boundingBox(); if (mobile) await pg.touchscreen.tap(b2.x + b2.width / 2, b2.y + b2.height / 2); else await pg.mouse.click(b2.x + b2.width / 2, b2.y + b2.height / 2); R.presses.push({ t: Date.now(), how: 'retry' }); } } } else idleSince = null;
  }
  const doneAt = Date.now();
  await sleep(8000); /* the Worker answers after 6 s */
  if (S.autosave) await sleep(22000); /* one 20 s autosave tick after the send */
  R.end = await pg.evaluate(() => ({ L: window.__L, ls: (() => { try { return localStorage.getItem('tllStoryDraft'); } catch (e) { return 'err'; } })(), ms: window.__msCalls, msJSON: window.__msJSON ? Object.keys(window.__msJSON()) : null,
    doneRole: (() => { const d = document.querySelector('.w-form-done'); return d ? { role: d.getAttribute('role'), tabindex: d.getAttribute('tabindex'), label: d.getAttribute('aria-label') } : null; })() }));
  if (scen === 'one' || scen === 'nopunct') await pg.screenshot({ path: path.join(D, 'out', `shot-${variant}-${scen}-${vp}.png`) });
  R.end.ls = R.end.ls ? 'present (' + Object.keys(JSON.parse(R.end.ls)).length + ' fields)' : 'absent';
  await browser.close();
  fs.appendFileSync(outFile || path.join(D, 'out', 'results.jsonl'), JSON.stringify(R) + '\n');
  console.log(variant, scen, vp, 'uploads', R.uploads.length, 'posts', R.posts.length, 'worker', R.worker.length, 'presses', R.presses.length, 'errs', R.pageErr.length);
}
main().catch(e => { console.error('FAIL', e); process.exit(1); });
