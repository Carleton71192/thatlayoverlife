/* Release 16.68.0 behavior check (18 Nov 2026): the REAL test-site documents (that-layover-life.webflow.io: core 16.68.0 pin 0f04fabf,
   photo clean 1.2.0 pin f67f3f74, /submit footer C) against the REAL www documents (core 16.67.0 pin a254306f, photo clean pin 22019832).
   Built on the lab harness reports/evidence/submit-save-2026-11-17/check-final-run/h2.cjs. Differences from the lab:
   - the main document of every load is one real navigation to the real host (route.continue); nothing in the HTML is changed;
   - core, chunks and photo clean come from `git show <pin>:<path>` at the pin the page asks for (byte equal to jsDelivr, carry check),
     so the browser's SRI check runs for real on both hosts;
   - the Worker stub answers with the page origin in access-control-allow-origin.
   The stubs are the lab's: Cloudinary upload 4 s a photo, Webflow form post 1.5 s, travel-wire /intake 6 s (or 502, or a dropped
   connection), Memberstack and Turnstile local fakes. Every other non-GET is aborted; workers.dev, cloudinary.com and memberstack
   hosts are never reached. Images, video and fonts: local caches of earlier checks, a miss is aborted (never fetched).
   node h3.cjs <page> <www|test> <scenario> <w>x<h> [outfile] */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), cp = require('child_process');
const { chromium } = require('playwright');
const SP = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad';
const D = path.join(SP, 'nov18/check1668-behavior'), IMG = path.join(SP, 'nov17/submit-check/img'), REPO = '/home/user/thatlayoverlife';
const OWN = path.join(D, 'cache'); fs.mkdirSync(OWN, { recursive: true });
const IDX = new Map();
(function scan() {
  const dirs = [OWN];
  const walk = (d, depth) => { let ents; try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch (e) { return; }
    for (const e of ents) if (e.isDirectory()) { const p = path.join(d, e.name);
      if (/cache/i.test(e.name)) dirs.push(p); else if (depth < 4 && e.name !== 'node_modules' && e.name !== 'wt' && e.name !== 'build') walk(p, depth + 1); } };
  for (const day of ['nov18', 'nov17', 'nov16', 'nov15', 'nov14', 'nov13', 'nov12']) walk(path.join(SP, day), 0);
  for (const d of dirs) { let fl = []; try { fl = fs.readdirSync(d); } catch (e) { } for (const f of fl) if (f.endsWith('.json')) {
    try { const m = JSON.parse(fs.readFileSync(path.join(d, f), 'utf8')); const k = path.join(d, f.slice(0, -5)); if (m && m.u && fs.existsSync(k + '.b') && !IDX.has(m.u)) IDX.set(m.u, k); } catch (e) { } } }
})();
const DROP = new Set(['content-encoding', 'content-length', 'transfer-encoding', 'connection', 'keep-alive', 'alt-svc', 'set-cookie', 'report-to', 'nel']);
const key = u => crypto.createHash('sha1').update(u).digest('hex');
function load(u, O) { const k = IDX.get(u); if (!k || !fs.existsSync(k + '.json')) return null; const m = JSON.parse(fs.readFileSync(k + '.json')); const h = {}; for (const x in (m.headers || {})) if (!DROP.has(x.toLowerCase())) h[x.toLowerCase()] = String(m.headers[x]); if (h['access-control-allow-origin'] && h['access-control-allow-origin'] !== '*') h['access-control-allow-origin'] = O; return { status: m.status || 200, headers: h, body: fs.readFileSync(k + '.b') }; }
function store(u, status, headers, body) { const k = path.join(OWN, key(u)); const hd = {}; for (const x in headers) if (!DROP.has(x.toLowerCase())) hd[x] = headers[x]; fs.writeFileSync(k + '.b', body); fs.writeFileSync(k + '.json', JSON.stringify({ u, status, headers: hd })); IDX.set(u, k); }
const RE_WF = /^https?:\/\/([a-z0-9-]+\.)*(website-files\.com|webflow\.io|webflow\.com|thatlayover\.life|d3e54v103j8qbb\.cloudfront\.net)(\/|$)/i;
const BYTES = path.join(D, 'out', 'bytes.log');
const GITC = new Map();
function git(sha, p) { const k = sha + ':' + p; if (GITC.has(k)) return GITC.get(k); let b = null; try { b = cp.execFileSync('git', ['-C', REPO, 'show', k], { maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'ignore'] }); } catch (e) { } GITC.set(k, b); return b; }
const JS = 'application/javascript; charset=utf-8';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const HOSTS = { www: 'https://www.thatlayover.life', test: 'https://that-layover-life.webflow.io' };
let O = null;
const ADS = /googletagmanager\.com|google-analytics\.com|analytics\.ahrefs\.com|googlesyndication\.com|doubleclick\.net|adservice\.google|pagead2|googleadservices|fundingchoicesmessages\.google\.com/;
const MEDIA = /\.(jpe?g|png|gif|webp|avif|svg|mp4|webm|mov|m4v|woff2?|ttf|otf|eot)(\?|$)/i;
const CLOUD = 'https://api.cloudinary.com/v1_1/idonvlow/image/upload';
const WORKER = 'https://tll-travel-wire.thatlayoverlife.workers.dev/intake';
const FORMPOST = /^https:\/\/(webflow\.com|formdata\.webflow\.com)\/api\/v1\/form\//;
const FORMS = { submit: 'submit-story', 'share-photos': 'share-photos', 'my-pets': 'add-pet' };

const fakeMS = seed => `(function(){if(window.$memberstackDom)return;var json=${JSON.stringify(seed || {})},calls=window.__msCalls=[];window.__msJSON=function(){return JSON.parse(JSON.stringify(json));};
var member={id:'mem_test',auth:{email:'tester@example.invalid'},customFields:{},planConnections:[],metaData:{}};
function rm(){[].forEach.call(document.querySelectorAll('[data-ms-content="anonymous"]'),function(e){e.remove();});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',rm);else rm();
var api={getCurrentMember:function(){calls.push([Date.now(),'getCurrentMember']);return Promise.resolve({data:member});},
getMemberJSON:function(){calls.push([Date.now(),'getMemberJSON']);return new Promise(function(r){setTimeout(function(){r({data:JSON.parse(JSON.stringify(json))});},150);});},
updateMemberJSON:function(o){var j=JSON.parse(JSON.stringify((o&&o.json)||{}));calls.push([Date.now(),'updateMemberJSON',Object.keys(j).join(','),!!(j.tllStoryDraft&&j.tllStoryDraft.sent)]);return new Promise(function(r){setTimeout(function(){json=j;r({data:json});},250);});},
getMemberCookie:function(){return 'tok_test_only';},getMemberToken:function(){return 'tok_test_only';},
onAuthChange:function(cb){setTimeout(function(){cb(member);},0);return{unsubscribe:function(){}};}};
window.$memberstackDom=new Proxy(api,{get:function(t,k){if(k in t)return t[k];if(typeof k!=='string')return undefined;return function(){calls.push([Date.now(),'other:'+k]);return Promise.resolve({data:null});};}});
})();`;
const FAKE_TS = `window.turnstile={render:function(el,o){var i=document.createElement('input');i.type='hidden';i.name='cf-turnstile-response';i.value='test-token';el.appendChild(i);setTimeout(function(){o.callback('test-token');},100);return 'w1';},reset:function(){},remove:function(){},getResponse:function(){return 'test-token';}};`;

const INIT = (FORM) => {
  const L = window.__L = { tl: [], subs: [], rs: [], errs: [] };
  const vis = el => !!el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
  const desc = el => { if (!el || el === document.body) return 'body'; let s = el.tagName.toLowerCase(); if (el.type) s += '[' + el.type + ']'; if (el.className && typeof el.className === 'string') s += '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.'); return s; };
  addEventListener('submit', ev => { const t = Date.now(); const f = ev.target; setTimeout(() => L.subs.push({ t, form: f.getAttribute('data-tll-form'), prevented: ev.defaultPrevented, submitter: ev.submitter ? ev.submitter.value : null }), 0); }, true);
  const RS = HTMLFormElement.prototype.requestSubmit;
  HTMLFormElement.prototype.requestSubmit = function (s) { const t = Date.now(); const r = RS.apply(this, arguments); L.rs.push({ t, form: this.getAttribute('data-tll-form') }); return r; };
  L.siv = []; const SIV = Element.prototype.scrollIntoView; Element.prototype.scrollIntoView = function (o) { L.siv.push({ t: Date.now(), el: desc(this), o: JSON.stringify(o) }); return SIV.apply(this, arguments); };
  let last = '';
  const snap = () => {
    const f = document.querySelector('form[data-tll-form="' + FORM + '"]'); if (!f) return;
    const b = f.querySelector('[type="submit"]'), wrap = f.closest('.w-form'), done = wrap && wrap.querySelector('.w-form-done'), fail = wrap && wrap.querySelector('.w-form-fail');
    const up = f.querySelector('.tll-up-msg') || f.querySelector('.tll-pen-status'), es = f.querySelector('.tll-end-send'), eb = f.querySelector('.tll-end-body') || f.querySelector('.tll-end-note'), im = done && done.querySelector('.tll-intake-msg');
    const dr = done ? done.getBoundingClientRect() : null;
    const o = {
      btn: b ? (b.value || b.textContent) : null, dis: b ? b.disabled : null, btnVis: vis(b),
      up: up ? up.textContent : null, upRole: up ? up.getAttribute('role') : null,
      endSend: es ? (vis(es) ? 'shown' : 'hidden') : null, endSendRole: es ? es.getAttribute('role') : null, endBody: eb ? (vis(eb) ? 'shown' : 'hidden') : null,
      done: vis(done), doneTop: dr && vis(done) ? Math.round(dr.top) : null, doneBot: dr && vis(done) ? Math.round(dr.bottom) : null, doneVisPct: dr && vis(done) && dr.height ? Math.round(100 * Math.max(0, Math.min(dr.bottom, innerHeight) - Math.max(dr.top, 0)) / dr.height) : null,
      fail: vis(fail), intake: im ? im.textContent : null, intakeRole: im ? im.getAttribute('role') : null,
      formVis: vis(f), active: desc(document.activeElement), sy: Math.round(scrollY),
      save: (f.querySelector('.tllst-save') || {}).textContent || null,
    };
    const s = JSON.stringify(o); if (s !== last) { last = s; L.tl.push(Object.assign({ t: Date.now() }, o)); }
  };
  const tick = () => { try { snap(); } catch (e) { L.errs.push(String(e)); } };
  document.addEventListener('DOMContentLoaded', () => { L.dcl = Date.now(); setInterval(tick, 50); });
};

/* what the account and this browser hold for the story draft, without the content */
const DRAFT = () => {
  const sum = d => d ? { at: !!d.at, sent: d.sent ? true : false, fields: d.fields ? Object.keys(d.fields).length : 0, body: !!(d.fields && d.fields.body), hero: !!(d.fields && /res\.cloudinary\.com/.test(d.fields['hero-image'] || '')), gallery: d.fields && d.fields['photo-gallery'] ? String(d.fields['photo-gallery']).split('\n').filter(Boolean).length : 0, turnstileOnly: !!(d.fields && Object.keys(d.fields).every(k => /turnstile|credit-|=on$/.test(k))), keys: d.fields ? Object.keys(d.fields).sort().join(',') : '' } : null;
  let ls = null; try { const v = localStorage.getItem('tllStoryDraft'); ls = v ? JSON.parse(v) : null; } catch (e) { }
  const j = window.__msJSON ? window.__msJSON() : {};
  return { account: sum(j.tllStoryDraft), accountSent: sum(j.tllStorySent), browser: ls ? { fields: Object.keys(ls).length, body: !!ls.body, hero: /res\.cloudinary\.com/.test(ls['hero-image'] || '') } : null, msKeys: Object.keys(j).sort() };
};
/* a later visit: what the writer sees */
const VIEW = (FORM) => {
  const f = document.querySelector('form[data-tll-form="' + FORM + '"]'); const v = n => { const e = f && f.querySelector('[name="' + n + '"]'); return e ? e.value : null; };
  const save = f && f.querySelector('.tllst-save');
  return { save: save ? save.textContent.trim() : null, restoredOffer: /Draft restored/.test(f ? f.textContent : ''), alreadySent: /Already sent to the editor/.test(f ? f.textContent : ''), title: v('name'), bodyFilled: !!v('body'), country: v('country') };
};

async function main() {
  const [page, variant, scen, vp, outFile] = process.argv.slice(2);
  const FORM = FORMS[page]; if (!FORM) throw new Error('page?');
  const [W, H] = vp.split('x').map(Number), mobile = W < 800;
  O = HOSTS[variant]; if (!O) throw new Error('host?');
  const docs = [];
  const S = {
    uploadFailAt: scen === 'upfail' ? 2 : 0,
    formFailFirst: scen === 'cached', formFailAll: scen === 'postfail',
    worker: scen === 'workerfail' ? 502 : scen === 'workeroff' ? 'off' : 200, workerDelay: scen === 'workerslow' ? 25000 : 6000,
    body: scen === 'nopunct' ? 'We took the night bus to the coast and watched the sun come up over the harbor\n\nThen breakfast with the driver 🌙' : 'We took the night bus to the coast and watched the sun come up over the harbor.\n\nThen breakfast with the driver, which was the best part.',
    mash: scen === 'mash', key: scen === 'key', revisit: scen === 'revisit' || scen === 'postfail',
    autosave: page === 'submit' && ['one', 'key', 'revisit', 'postfail', 'race'].includes(scen),
  };
  const R = { page, variant, host: variant, scen, vp, docs, jsd: [], netHosts: [], wfFetched: [], navAborted: [], uploads: [], posts: [], worker: [], preflight: 0, aborted: [], cons: [], pageErr: [], misses: [], presses: [], visits: [] };
  let upN = 0, postN = 0, msSeed = {};
  const browser = await chromium.launch();
  const mkctx = async () => {
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
        const linkf = [...p.keys()].filter(k => /res\.cloudinary\.com/.test(p.get(k) || ''));
        R.posts.push({ t, n, links: linkf.reduce((a, k) => a + (p.get(k) || '').split('\n').filter(Boolean).length, 0), linkFields: linkf, body_end: (p.get('fields[body]') || '').slice(-12), turnstile: !!p.get('fields[cf-turnstile-response]') });
        await sleep(1500);
        if ((S.formFailFirst && n === 1) || S.formFailAll) { R.posts[R.posts.length - 1].failed = true; return rt.fulfill({ status: 500, headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }, body: '{"code":500,"msg":"test"}' }); }
        return rt.fulfill({ status: 200, headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }, body: '{"code":200,"msg":"ok"}' });
      }
      if (u === WORKER) {
        const cors = { 'access-control-allow-origin': O, 'access-control-allow-headers': 'content-type, authorization', 'access-control-allow-methods': 'POST, OPTIONS', 'vary': 'Origin' };
        if (m === 'OPTIONS') { R.preflight++; return rt.fulfill({ status: 204, headers: cors, body: '' }); }
        if (m === 'POST') { const t = Date.now(); let b = {}; try { b = JSON.parse(q.postData() || '{}'); } catch (e) { } R.worker.push({ t, kind: b.kind, auth: /^Bearer tok_test_only$/.test(q.headers().authorization || '') }); await sleep(S.workerDelay);
          if (S.worker === 'off') return rt.abort('internetdisconnected');
          if (S.worker === 502) return rt.fulfill({ status: 502, headers: Object.assign({ 'content-type': 'application/json' }, cors), body: '{"error":"Saved, and we will set it up by hand."}' });
          return rt.fulfill({ status: 200, headers: Object.assign({ 'content-type': 'application/json' }, cors), body: b.kind === 'photos' ? '{"photos":[],"held":true}' : '{"saved":true,"held":true,"kind":"story","id":"test","slug":"test","checks":[]}' }); }
      }
      if (m !== 'GET') { R.aborted.push(m + ' ' + u.slice(0, 90)); return rt.abort(); }
      if (pu && /workers\.dev$|cloudinary\.com$/.test(pu.host)) { R.aborted.push('GET ' + u.slice(0, 90)); return rt.abort(); }
      if (ADS.test(u)) return rt.fulfill({ status: 200, headers: { 'content-type': /\.js|gtag\/js/.test(u) ? 'application/javascript' : 'text/plain' }, body: '' });
      if (u === 'https://static.memberstack.com/scripts/v2/memberstack.js') return rt.fulfill({ status: 200, headers: { 'content-type': JS, 'access-control-allow-origin': '*' }, body: fakeMS(msSeed) });
      if (/memberstack/.test(pu ? pu.host : '')) { R.aborted.push('GET ' + u.slice(0, 90)); return rt.abort(); }
      if (u === 'https://challenges.cloudflare.com/turnstile/v0/api.js' || /^https:\/\/challenges\.cloudflare\.com\/turnstile\/v0\/api\.js/.test(u)) return rt.fulfill({ status: 200, headers: { 'content-type': JS }, body: FAKE_TS });
      if (pu && pu.host === 'challenges.cloudflare.com') { R.aborted.push('GET ' + u.slice(0, 90)); return rt.abort(); }
      if (pu && pu.host === 'res.cloudinary.com') return rt.abort();
      if (pu && /^(www\.thatlayover\.life|thatlayover\.life|that-layover-life\.webflow\.io)$/.test(pu.host)) {
        if (q.isNavigationRequest() && pu.origin === O && pu.pathname === '/' + page && q.frame().parentFrame() === null) { docs.push({ t: Date.now(), path: pu.pathname }); return rt.continue(); } /* the one real navigation of this load */
        if (q.isNavigationRequest()) R.navAborted.push(pu.host + pu.pathname);
        R.aborted.push('GET ' + ty + ' ' + pu.host + pu.pathname.slice(0, 60)); return rt.abort(); }
      const gm = /^https:\/\/cdn\.jsdelivr\.net\/gh\/[^/]+\/thatlayoverlife@([0-9a-f]{40})\/([^?#]+)$/i.exec(u);
      if (gm) {
        const hd = { 'content-type': /\.css$/.test(gm[2]) ? 'text/css; charset=utf-8' : JS, 'access-control-allow-origin': '*' };
        const b = git(gm[1], gm[2]); R.jsd.push(gm[1].slice(0, 8) + ':' + gm[2].replace(/^.*\//, '') + (b ? '' : ' MISS')); if (b) return rt.fulfill({ status: 200, headers: hd, body: b });
      }
      const c = load(u, O); if (c) return rt.fulfill({ status: c.status, headers: c.headers, body: c.body });
      if (ty === 'image' || ty === 'media' || ty === 'font' || MEDIA.test(pu ? pu.pathname : u)) return rt.abort();
      if (/^(script|stylesheet|fetch|xhr)$/.test(ty)) {
        try { const r = await rt.fetch(); const b = await r.body(); store(u, r.status(), r.headers(), b); R.misses.push(u.slice(0, 100)); R.netHosts.push(pu.host); if (RE_WF.test(u)) { R.wfFetched.push([u.slice(0, 120), b.length]); fs.appendFileSync(BYTES, ['asset', variant, b.length, u.slice(0, 160)].join(' ') + '\n'); } return rt.fulfill({ status: r.status(), headers: r.headers(), body: b }); } catch (e) { R.aborted.push('miss ' + u.slice(0, 90)); return rt.abort(); }
      }
      R.aborted.push('GET ' + ty + ' ' + u.slice(0, 90)); return rt.abort();
    });
    return ctx;
  };
  const open = async (ctx, tag) => {
    const pg = await ctx.newPage(); await pg.addInitScript(INIT, FORM);
    pg.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') R.cons.push(tag + ' ' + m.type() + ': ' + m.text().slice(0, 200)); });
    pg.on('pageerror', e => R.pageErr.push(tag + ' ' + String(e).slice(0, 200)));
    pg.on('requestfinished', async r => { try { if (r.isNavigationRequest() && r.frame() === pg.mainFrame()) { const z = await r.sizes(); const n = z.responseBodySize + z.responseHeadersSize; R.docBytes = (R.docBytes || 0) + n; fs.appendFileSync(BYTES, ['doc', variant, n, r.url()].join(' ') + '\n'); } } catch (e) { } });
    pg.on('response', r => { const m = /thatlayoverlife@([0-9a-f]{40})\/(src\/[^?#]+)/.exec(r.url()); if (m) (R.jsResp = R.jsResp || []).push(tag + ' ' + m[1].slice(0, 8) + ':' + m[2].replace(/^.*\//, '') + ':' + r.status()); });
    pg.on('requestfailed', r => { if (r.resourceType() === 'script') (R.scriptBad = R.scriptBad || []).push(tag + ' ' + r.url().slice(0, 120) + ' ' + ((r.failure() || {}).errorText || '')); });
    const resp = await pg.goto(O + '/' + page, { waitUntil: 'load', timeout: 60000 }); (R.docStatus = R.docStatus || []).push(tag + ' ' + (resp ? resp.status() : null) + ' ' + new URL(pg.url()).host);
    return pg;
  };
  const ctx = await mkctx();
  const pg = await open(ctx, 'v1');
  await sleep(2500);
  const f = `form[data-tll-form="${FORM}"]`;
  R.loaded = await pg.evaluate((FORM) => ({ core: [...document.querySelectorAll('script[src*="tll-site-layers-v16"]')].map(s => s.src.replace(/^.*@/, '').slice(0, 8) + ' ' + (s.integrity || 'nosri').slice(0, 15)), pcTag: [...document.querySelectorAll('script[src*="tll-photo-clean"]')].map(s => s.src.replace(/^.*@/, '').slice(0, 8) + ' ' + (s.integrity || 'nosri').slice(0, 15)), selfDoc: typeof window.tllSelfDoc, chunk: [...document.querySelectorAll('script[src*="/chunks/"]')].map(s => s.src.replace(/^.*\//, '')), pc: !!window.__tllPhotoClean, send: !!window.__tllPhotoSend, intake: !!(document.querySelector('form[data-tll-form="' + FORM + '"]') || {}).__tllIntake, end: !!(document.querySelector('form[data-tll-form="' + FORM + '"]') || {}).__tllEnd, cPatched: /tllStorySent/.test(document.documentElement.innerHTML) }), FORM);
  const img = n => path.join(IMG, `test-photo-${n}.jpg`);
  if (page === 'submit') {
    await pg.fill(f + ' input[name="country"]', 'Testland');
    await pg.fill(f + ' input[name="name"]', 'A test story for the send check');
    await pg.fill(f + ' textarea[name="excerpt"]', 'A short test excerpt for the card.');
    await pg.fill(f + ' textarea[name="body"]', S.body);
    const city = await pg.$(f + ' input[name="city"]'); if (city && await city.isVisible()) await city.fill('Test City');
    await pg.click(f + ' .tllst-next'); await sleep(600);
    const opts = await pg.$$eval(f + ' select[name="region"] option', os => os.map(o => o.value).filter(Boolean)); await pg.selectOption(f + ' select[name="region"]', opts[0]);
    await pg.click(f + ' .tllst-next'); await sleep(600);
    await pg.fill(f + ' input[name="contributor-name"]', 'Test Writer');
    await pg.fill(f + ' input[name="email"]', 'tester@example.invalid');
    await pg.setInputFiles(f + ' input[type="file"][name="hero-image"]', img(1));
    const gal = await pg.$(f + ' input[type="file"][name="photo-gallery"]'); const multi = await gal.evaluate(e => e.multiple);
    await gal.setInputFiles(multi ? [img(2), img(3)] : [img(2)]);
    await sleep(800);
    await pg.$eval(f + ' input[name="agree-charter"]', e => { if (!e.checked) e.click(); });
    await pg.$$eval(f + ' [data-tll-step="3"] input[type="checkbox"][required]', es => es.forEach(e => { if (!e.checked) e.click(); }));
  } else {
    /* make the form visible if it sits behind a link, then fill every required field with test values */
    if (!(await pg.$eval(f, e => e.getClientRects().length > 0))) { const a = await pg.$('a[href="#add-pet"]'); if (a) { await a.click(); await sleep(800); } }
    const files = await pg.$$(f + ' input[type="file"]'); let k = 1;
    for (const fi of files) { const multi = await fi.evaluate(e => e.multiple); const take = multi ? [img(k), img(k + 1)].filter(fs.existsSync) : [img(k)]; await fi.setInputFiles(take); k += take.length; if (k > 3) k = 3; }
    await sleep(800);
    await pg.$$eval(f + ' input:not([type]),' + f + ' input[type="text"],' + f + ' input[type="email"],' + f + ' input[type="number"],' + f + ' textarea', es => es.forEach(e => {
      if (e.value || e.closest('[hidden]')) return; if (!(e.required || /^(country|name|contributor-name|email|caption|city|bio)$/.test(e.name))) return;
      const v = e.type === 'email' ? 'tester@example.invalid' : e.type === 'number' ? '4' : e.name === 'country' ? 'Testland' : 'Test value for the check.';
      const d = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(e), 'value'); d.set.call(e, v); e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true }));
    }));
    await pg.$$eval(f + ' select', ss => ss.forEach(s => { if (!s.value) { const o = [...s.options].find(o => o.value); if (o) { s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); } } }));
    await pg.$$eval(f + ' input[type="checkbox"][required]', es => es.forEach(e => { if (!e.checked) e.click(); }));
    await pg.$$eval(f + ' input[type="radio"]', es => { const g = {}; es.forEach(e => { if (!g[e.name]) g[e.name] = e; }); Object.values(g).forEach(e => { if (!document.querySelector('input[name="' + e.name + '"]:checked')) e.click(); }); });
  }
  R.photoCount = await pg.$$eval(f + ' input[type="file"]', es => es.reduce((a, e) => a + (e.files ? e.files.length : 0), 0));
  const btn = await pg.$(f + ' [type="submit"]');
  await btn.scrollIntoViewIfNeeded(); await sleep(700);
  R.pre = await pg.evaluate((FORM) => { const b = document.querySelector('form[data-tll-form="' + FORM + '"] [type="submit"]'); return { btn: b.value || b.textContent, dis: b.disabled }; }, FORM);
  const box = await btn.boundingBox(); const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  const press = async (how) => { const t = Date.now(); R.presses.push({ t, how }); if (how === 'key') { await pg.keyboard.press('Enter'); } else if (mobile) { await pg.touchscreen.tap(cx, cy); } else { await pg.mouse.click(cx, cy); } };
  if (page === 'submit') {
    /* the writer has been at it a while: wait for the first autosave (account write) before Send, as on a real visit */
    const t1 = Date.now(); while (Date.now() - t1 < 30000) { const ok = await pg.evaluate(() => (window.__msCalls || []).some(c => c[1] === 'updateMemberJSON')); if (ok) break; await sleep(250); }
    R.preAutosave = await pg.evaluate(() => (window.__msCalls || []).filter(c => c[1] === 'updateMemberJSON').length);
    if (scen === 'race') { /* press so the done box shows about 0.27 s after the next autosave tick starts, while its account write is on its way (read 150 ms, write 250 ms) (the send takes about 14.1 s here) */
      const dcl = await pg.evaluate(() => window.__L.dcl); let tick = dcl + 20000; while (tick - 14000 < Date.now() + 300) tick += 20000;
      await sleep(tick + 270 - 14100 - Date.now()); R.raceTick = tick; }
  }
  const T0 = Date.now(); R.T0 = T0;
  if (S.key) { await btn.focus(); await press('key'); } else await press('tap');
  const state = () => pg.evaluate((FORM) => { const f = document.querySelector('form[data-tll-form="' + FORM + '"]'), w = f.closest('.w-form'), v = e => !!e && e.getClientRects().length > 0; const b = f.querySelector('[type="submit"]'); return { done: v(w.querySelector('.w-form-done')), fail: v(w.querySelector('.w-form-fail')), dis: b.disabled, wait: /Copenhagen|Sending|Photos are up|Issuing|Uploading/.test(b.value || b.textContent) }; }, FORM);
  if (S.mash) { for (let i = 0; i < 14; i++) { await sleep(1000); if ((await state()).done) break; await press('tap'); } }
  let extra = 0, idleSince = null; const deadline = Date.now() + 90000;
  while (Date.now() < deadline) {
    await sleep(250);
    const st = await state(); if (st.done) break;
    if (S.formFailAll && st.fail) break; /* the writer gives up after Webflow's fail box */
    const lastNet = Math.max(0, ...R.uploads.map(x => x.t + 4000), ...R.posts.map(x => x.t + 1500));
    const idle = !st.dis && !st.wait && Date.now() - lastNet > 1500;
    if (idle) { if (!idleSince) idleSince = Date.now(); if (Date.now() - idleSince > 1500) { if (extra >= 4) break; extra++; idleSince = null; if (S.key) { await btn.focus(); await press('key'); } else { await btn.scrollIntoViewIfNeeded(); const b2 = await btn.boundingBox(); R.presses.push({ t: Date.now(), how: 'retry' }); if (mobile) await pg.touchscreen.tap(b2.x + b2.width / 2, b2.y + b2.height / 2); else await pg.mouse.click(b2.x + b2.width / 2, b2.y + b2.height / 2); } } } else idleSince = null;
  }
  R.doneAt = Date.now();
  await sleep(S.workerDelay + 2000);
  if (page !== 'submit' || ['one', 'workerfail', 'workeroff', 'nopunct'].includes(scen)) await pg.screenshot({ path: path.join(D, 'out', 'shots', `shot-${page}-${variant}-${scen}-${vp}.png`) });
  if (S.autosave) await sleep(22000);
  R.end = await pg.evaluate(() => ({ L: window.__L, ms: window.__msCalls, dcl: window.__L.dcl }));
  R.end.draft = await pg.evaluate(DRAFT);
  R.end.doneText = await pg.evaluate((FORM) => { const d = document.querySelector('form[data-tll-form="' + FORM + '"]').closest('.w-form').querySelector('.w-form-done'); return d ? d.innerText.replace(/\s+/g, ' ').trim().slice(0, 400) : null; }, FORM);
  if (S.revisit) {
    /* second visit, same browser, the account as the first visit left it */
    msSeed = await pg.evaluate(() => window.__msJSON ? window.__msJSON() : {}); const seed1 = msSeed;
    await pg.close();
    const p2 = await open(ctx, 'v2'); await sleep(4500);
    const v2 = { tag: 'same browser', view: await p2.evaluate(VIEW, FORM), draft: await p2.evaluate(DRAFT) };
    await p2.screenshot({ path: path.join(D, 'out', 'shots', `shot-${page}-${variant}-${scen}-${vp}-visit2.png`) });
    await sleep(21000); /* one autosave tick on the later visit, nothing typed */
    v2.after20 = { view: await p2.evaluate(VIEW, FORM), draft: await p2.evaluate(DRAFT), ms: await p2.evaluate(() => window.__msCalls.filter(c => c[1] === 'updateMemberJSON').length) };
    R.visits.push(v2);
    const seed2 = await p2.evaluate(() => window.__msJSON());
    await p2.close();
    msSeed = seed2; const p2b = await open(ctx, 'v3'); await sleep(4500); /* third visit, same browser */
    R.visits.push({ tag: 'same browser, third visit', view: await p2b.evaluate(VIEW, FORM), draft: await p2b.evaluate(DRAFT) });
    await p2b.close();
    /* third visit, a new browser (no local copy), the account as before the second visit and as after it */
    for (const [tag, seed] of [['new browser', seed1], ['new browser after visit 2', seed2]]) {
      msSeed = seed; const c3 = await mkctx(); const p3 = await open(c3, 'v4'); await sleep(4500);
      R.visits.push({ tag, view: await p3.evaluate(VIEW, FORM), draft: await p3.evaluate(DRAFT) });
      await c3.close();
    }
  }
  await browser.close();
  fs.appendFileSync(outFile || path.join(D, 'out', 'results.jsonl'), JSON.stringify(R) + '\n');
  console.log(page, variant, scen, vp, 'uploads', R.uploads.length, 'posts', R.posts.length, 'worker', R.worker.length, 'presses', R.presses.length, 'errs', R.pageErr.length);
}
main().catch(e => { console.error('FAIL', e); process.exit(1); });
