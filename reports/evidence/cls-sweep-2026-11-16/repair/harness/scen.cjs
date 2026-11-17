/* Scenario lists for adv.cjs. Sizes: 390x844 (phone), 1440x900 (desktop), 320x568, 768x1024 and others where named. */
const SZ = { 320: [320, 568], 360: [360, 780], 390: [390, 844], 768: [768, 1024], 1440: [1440, 900] };
const EIGHT = ['travelers', 'map', 'expats', 'about', 'account', 'submit', 'profile', 'stories'];
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/* the page's own inline script <script id=...>: its code replaced by a throw, or the element left out */
const inl = (id, mode) => (k, h) => { const re = new RegExp('(<script[^>]*\\bid="' + esc(id) + '"[^>]*>)([\\s\\S]*?)(</script>)'); if (!re.test(h)) throw new Error('inline script not found: ' + id);
  return h.replace(re, mode === 'missing' ? '' : '$1throw new Error("adv: forced throw in ' + id + '");$3'); };
const cell = (id, page, w, extra) => Object.assign({ id, page, w: SZ[w] ? SZ[w][0] : w, h: SZ[w] ? SZ[w][1] : 900 }, extra || {});
const S = {};

S.smoke = [cell('travelers-390', 'travelers', 390), cell('account-1440', 'account', 1440), cell('map-1440', 'map', 1440)];

/* ---- script failures, one at a time ---- */
S.fail = [];
const COMMON = [
  ['jq404', { fail: [{ re: /jquery-3\.5\.1/, mode: '404' }] }],
  ['ms404', { fail: [{ re: /static\.memberstack\.com\/scripts/, mode: '404' }] }],
  ['mnav-throw', { html: inl('tll-mobile-nav-js-v1', 'throw') }],
  ['mnav-missing', { html: inl('tll-mobile-nav-js-v1', 'missing') }],
  ['parity-throw', { html: inl('tll-proto-parity-js-v1', 'throw') }],
  ['sitechunk404', { fail: [{ re: /site-layers\/chunks\/site\.js/, mode: '404' }] }],
  ['pagechunk404', { fail: [{ re: /site-layers\/chunks\/(?!site\.js)[a-z-]+\.js/, mode: '404' }] }],
  ['pagechunk-throw', { fail: [{ re: /site-layers\/chunks\/(?!site\.js)[a-z-]+\.js/, mode: 'throw' }] }],
];
for (const p of EIGHT) for (const [n, opts] of COMMON) S.fail.push(cell(p + '-' + n + '-390', p, 390, { opts }));
const OWN = {
  travelers: [['tv-v2-js', 'throw'], ['tll-trav-v2-js', 'throw'], ['tll-trav-dir-js', 'throw'], ['tll-trav-search-js', 'throw'], ['tll-trav-cms-cards-js-v1', 'throw']],
  map: [['tll-map-invite-js-v1', 'throw'], ['tll-map-invite-js-v1', 'missing'], ['tll-mp3-passport-js-v1', 'throw'], ['tll-map-snapshot-v1', 'throw'], ['tll-v91-map-clusters-v2', 'throw']],
  expats: [['tll-expats-js-v1', 'throw']],
  about: [],
  account: [['tll-a3-account-js-v1', 'throw'], ['tll-acct-gate-v2-js', 'throw'], ['tll-apc-js-v1', 'throw'], ['tll-acct-counts-v1', 'throw']],
  submit: [['tll-form-steps-js-v2', 'throw'], ['tll-share-fork-js-v1', 'throw'], ['tll-story-extras-js-v1', 'throw']],
  profile: [['tll-pf5-profile-js-v1', 'throw'], ['tll-pf5-n-v1', 'throw'], ['tll-pf5-n-v1', 'missing'], ['tll-pf5-visibility-v1', 'throw']],
  stories: [['tll-lib-lead-v1', 'throw'], ['tll-lib-lead-v1', 'missing'], ['tll-lib-chips-v1', 'throw'], ['tll-lib-search-v4', 'throw'], ['tll-s3-stories-js-v1', 'throw']],
};
const EXT = {
  map: [['mapcode404', [{ re: /map-2\.0\/dist\/tll-map-layers\.js/, mode: '404' }], 6000], ['mapcode-throw', [{ re: /map-2\.0\/dist\/tll-map-layers\.js/, mode: 'throw' }], 6000],
    ['mapcode-empty', [{ re: /map-2\.0\/dist\/tll-map-layers\.js/, mode: 'empty' }], 13000], ['mapcss404', [{ re: /map-2\.0\/dist\/tll-map-layers\.css/, mode: '404' }], 6000],
    ['mapdata404', [{ re: /map-2\.0\/(data\/|collections)/, mode: '404' }], 23000], ['mapembed404', [{ re: /tllmapembedv1/, mode: '404' }], 6000], ['reveal404', [{ re: /tllreveal/, mode: '404' }], 6000]],
  account: [['gateflash404', [{ re: /tllgateflashv1/, mode: '404' }]]], submit: [['gateflash404', [{ re: /tllgateflashv1/, mode: '404' }]]],
  profile: [['pf3guard404', [{ re: /tllpf3guardv1/, mode: '404' }]]],
  stories: [['shareyours404', [{ re: /tll_library_share_yours/, mode: '404' }]], ['gsap404', [{ re: /gsap\.min\.js/, mode: '404' }]]],
  travelers: [['reveal404', [{ re: /tllreveal/, mode: '404' }]]],
};
for (const p of EIGHT) for (const w of [390, 1440]) {
  for (const [sid, mode] of OWN[p]) S.fail.push(cell(p + '-' + sid + '-' + mode + '-' + w, p, w, { opts: { html: inl(sid, mode) } }));
  for (const [n, fail, wait] of (EXT[p] || [])) S.fail.push(cell(p + '-' + n + '-' + w, p, w, { opts: { fail }, wait: wait || 0 }));
}

/* ---- reduced motion, 320 px, JavaScript off ---- */
S.rm = []; for (const p of EIGHT) for (const w of [390, 1440]) S.rm.push(cell(p + '-rm-' + w, p, w, { opts: { ctx: { reducedMotion: 'reduce' } }, wait: p === 'travelers' ? 11000 : 0 }));
S.w320 = EIGHT.map(p => cell(p + '-320', p, 320, { wait: p === 'travelers' ? 11000 : 0 }));
S.jsoff = EIGHT.map(p => cell(p + '-jsoff-390', p, 390, { opts: { ctx: { javaScriptEnabled: false } }, flow: async (page, s, id, rec, L) => {
  await page.goto(L.ORIGIN + L.PAGES[s.page], { waitUntil: 'load', timeout: 60000 }); await L.sleep(1500);
  /* no script runs, so the probe cannot be evaluated in the page: Playwright still evaluates in an isolated world */
  rec.stages.push(await L.probe(page, id)); } }));

/* ---- the rotating title on /travelers: 10 s after load ---- */
S.trav10 = []; for (const w of [320, 390, 768, 1440]) for (const i of [1, 2]) S.trav10.push(cell('travelers-10s-' + w + '-' + i, 'travelers', w, { wait: 12000, after: 10500 }));

/* ---- the map hold on screens of other shapes: 23 s, so the 20 s release is inside the watch ---- */
S.maptall = [[390, 844], [844, 390], [768, 1024], [1024, 1366], [1440, 900], [1440, 1600], [1920, 1080], [2560, 1440]].map(([w, h]) => ({ id: 'map-' + w + 'x' + h, page: 'map', w, h, wait: 23500, after: 3000, opts: { phone: w < 800 || (w === 844) } }));

/* ---- unexpected markup: the served HTML changed before it reaches the browser (both arms get the same change) ---- */
const rep = (a, b, n) => (k, h) => { const parts = h.split(a); if (parts.length < 2) throw new Error('markup patch: not found: ' + String(a).slice(0, 50)); if (n === 1) return parts[0] + b + parts.slice(1).join(a); return parts.join(b); };
const rex = (re, b) => (k, h) => { if (!re.test(h)) throw new Error('markup patch: no match ' + re); return h.replace(re, b); };
const chain = (...fs) => (k, h) => fs.reduce((x, f) => f(k, x), h);
const rootAttr = (name, val) => rex(new RegExp('(<[a-z]+[^>]*data-pf5="root"[^>]*?\\sdata-' + name + '=")[^"]*(")'), '$1' + val + '$2');
S.markup = [];
const MK = (id, page, ws, html, extra) => { for (const w of ws) S.markup.push(cell(id + '-' + w, page, w, Object.assign({ opts: html ? { html } : {} }, extra || {}))); };
MK('trav-noem', 'travelers', [390], rep('<em class="tll-text-rose">live</em>', 'live', 1), { wait: 8000 });
MK('trav-notitle', 'travelers', [390], rep('tll-text-bone tll-travelers-title"', 'tll-text-bone tll-travelers-titlex"', 1));
MK('trav-nochips', 'travelers', [390], rep(' data-tv-chips>', '>', 1));
MK('trav-chipword', 'travelers', [390], rep('aria-pressed="true">Everyone<span', 'aria-pressed="true">All of us<span', 1));
MK('trav-list-expats', 'travelers', [390, 1440], null, { query: '?list=expats' });
MK('trav-q', 'travelers', [390, 1440], null, { query: '?q=den' });
MK('trav-list-pets', 'travelers', [390, 1440], null, { query: '?list=pets', wait: 6500 });
MK('map-hash-passport', 'map', [390, 1440], null, { query: '#tll-passport', wait: 8000, after: 6000 });
MK('trav-nosearchwrap', 'travelers', [390], rep('data-tll-trav-search-wrap="1"', 'data-x="1"', 1));
MK('trav-newverb', 'travelers', [390, 1440], rep("var W=['are','live','photograph','were']", "var W=['are','live','circumnavigated','were']", 1), { wait: 14500, after: 13000, note: 'the page verbs changed without a core release' });
MK('map-nomount', 'map', [390, 1440], rep('<div id="tll-map-layers"', '<div id="tll-map-layersx"', 1), { wait: 8000 });
MK('map-nocounter', 'map', [390, 1440], rex(/class="([^"]*)\btll-map-hero-counter\b/, 'class="$1tll-map-hero-counterx'));
MK('map-noboot', 'map', [1440], rep('<p id="tllm-boot"', '<p id="tllm-bootx"', 1));
MK('expats-nodir', 'expats', [390, 1440], rex(/data-tll-x="dir"/, 'data-tll-x="dirx"'));
MK('about-nohero', 'about', [390], rex(/class="([^"]*)\btll-about-final-hero\b/, 'class="$1tll-about-final-herox'));
MK('account-navplain', 'account', [390, 1440], rep('<div data-ms-content="members"><nav class="tll-nav-v1">', '<div><nav class="tll-nav-v1">', 1));
MK('submit-navplain', 'submit', [390, 1440], rep('<div data-ms-content="members"><nav class="tll-nav-v1">', '<div><nav class="tll-nav-v1">', 1));
MK('account-nocta', 'account', [390], rep('<div class="tll-nav-cta-row">', '<div class="tll-nav-cta-rowx">', 1));
MK('stories-nocta', 'stories', [390], rep('<div class="tll-nav-cta-row">', '<div class="tll-nav-cta-rowx">', 1));
MK('pf-off', 'profile', [390], rootAttr('visibility', 'Off'), { wait: 6000 });
MK('pf-unlisted', 'profile', [390], rootAttr('visibility', 'Unlisted'));
MK('pf-pen', 'profile', [390, 1440], chain(rootAttr('credit', 'Pen'), rootAttr('pen', 'Night Owl')));
MK('pf-pen-empty', 'profile', [390], chain(rootAttr('credit', 'Pen'), rootAttr('pen', '')));
MK('pf-first', 'profile', [390], rootAttr('credit', 'First'));
MK('pf-contact-off', 'profile', [390], rootAttr('contact', 'Off'));
MK('pf-contact-relay', 'profile', [390, 1440], rootAttr('contact', 'Relay'));
MK('pf-contact-instagram', 'profile', [390], rootAttr('contact', 'Instagram'));
MK('pf-badsnap', 'profile', [390], rootAttr('snapshot', '{oops'));
MK('pf-nosnap', 'profile', [390, 1440], rootAttr('snapshot', ''));
MK('pf-noid', 'profile', [390], rep('<div data-pf5="id">', '<div data-pf5="idx">', 1));
MK('pf-nolinks', 'profile', [390], rootAttr('links-shown', 'none'));
MK('pf-noflags', 'profile', [390], chain(rootAttr('flags', ''), rootAttr('badge', '')));
MK('pf-partners', 'profile', [390, 1440], rootAttr('partners', '{&quot;open&quot;:true,&quot;store&quot;:&quot;https://example.com/s&quot;,&quot;portfolio&quot;:&quot;https://example.com/p&quot;,&quot;links&quot;:[{&quot;name&quot;:&quot;Gear&quot;,&quot;url&quot;:&quot;https://example.com/g&quot;}]}'));
MK('pf-nophoto', 'profile', [390], rex(/(<div data-pf5="photo"><img) src="[^"]*"/, '$1 class="w-dyn-bind-empty"'));
const PICK = '<div data-tll-pick="1" hidden="" aria-hidden="true"></div>';
const moveTo = n => (k, h) => { let x = h.split(PICK); if (x.length !== 2) throw new Error('pick not found once'); h = x.join(''); let at = -1, i = 0; for (let c = 0; c < n; c++) { at = h.indexOf('<div data-tll-facts="card"', i); i = at + 10; } if (at < 0) throw new Error('card ' + n + ' not found'); return h.slice(0, at) + PICK + h.slice(at); };
MK('st-pick5', 'stories', [390, 1440], moveTo(5));
MK('st-pick40', 'stories', [390, 1440], moveTo(40));
MK('st-nopick', 'stories', [390], rep(PICK, '', 1));
MK('st-oldfirst', 'stories', [390, 1440], chain(rep(PICK, '', 1), rep('data-tll-date="1" hidden="">October 29, 2026<', 'data-tll-date="1" hidden="">January 2, 2020<', 1)));
MK('st-firsthidden', 'stories', [390, 1440], rep('<div role="list" class="tll-lib-grid w-dyn-items"><div role="listitem" class="w-dyn-item">', '<div role="list" class="tll-lib-grid w-dyn-items"><div role="listitem" class="w-dyn-item" style="display:none">', 1));
MK('st-noform', 'stories', [390, 1440], rep('<div class="tllsb-form w-form">', '<div class="tllsb-formx w-form">', 1));
MK('st-nofilters', 'stories', [390], rep('<div class="tll-container tll-filters-inner">', '<div class="tll-container tll-filters-innerx">', 1));
MK('st-notitle', 'stories', [1440], rep('class="tll-display-xl tll-library-title"', 'class="tll-display-xl tll-library-titlex"', 1));
MK('st-q', 'stories', [390, 1440], null, { query: '?q=lisbon' });
MK('st-q-none', 'stories', [390, 1440], null, { query: '?q=zzzzqqq' });
MK('st-q-two', 'stories', [390], null, { query: '?utm_source=x&q=italy' });

/* ---- slow: the document arrives in pieces from a local server, every other file is held back (300 ms + 1 ms per 250 bytes), CPU 4x ---- */
const slowDelay = (u, len, kind) => (kind === 'doc' ? 0 : 300 + Math.min(4000, Math.round(len / 250)));
S.slow = [];
for (const p of EIGHT) for (const w of [390, 1440]) {
  S.slow.push(cell(p + '-even-' + w, p, w, { opts: { cpu: 4, delay: slowDelay, stream: { mode: 'even', size: 24000, gap: 110, ttfb: 300 } }, wait: 7000, after: 4000 }));
  S.slow.push(cell(p + '-cut1-' + w, p, w, { opts: { cpu: 4, delay: slowDelay, stream: { mode: 'rand', n: 10, gap: 220, ttfb: 300, seed: 11 } }, wait: 7000, after: 4000 }));
  if (w === 390) S.slow.push(cell(p + '-cut2-' + w, p, w, { opts: { cpu: 4, delay: slowDelay, stream: { mode: 'rand', n: 10, gap: 220, ttfb: 300, seed: 29 } }, wait: 7000, after: 4000 }));
}
/* the same pieces at normal CPU and without the held files: only the document is slow */
S.cuts = [];
for (const p of EIGHT) for (const w of [390, 1440]) for (const seed of [3]) S.cuts.push(cell(p + '-cut' + seed + '-' + w, p, w, { opts: { stream: { mode: 'rand', n: 12, gap: 180, ttfb: 50, seed } }, wait: 6500 }));

/* ---- reload after scroll, back and forward ---- */
const settle = async (page, L, ms) => { const a = await page.evaluate(() => [performance.now(), window.__J && window.__J.loadT]); await L.sleep(Math.max(0, (a[1] || a[0]) + ms - a[0]) + 50); };
const reloadFlow = where => async (page, s, id, rec, L) => {
  await page.goto(L.ORIGIN + L.PAGES[s.page], { waitUntil: 'load', timeout: 120000 }); await settle(page, L, 2500);
  const y = await page.evaluate(w => { const max = document.documentElement.scrollHeight - innerHeight; const y = w === 'bottom' ? max : Math.min(max, Math.round(innerHeight * 1.6)); window.scrollTo(0, y); return y; }, where);
  await L.sleep(700); const before = await L.probe(page, id, 'scrolled'); rec.stages.push(before);
  await page.reload({ waitUntil: 'load', timeout: 120000 }); await settle(page, L, 3500);
  const e = await L.probe(page, id, 'reloaded'); e.wantY = y; rec.stages.push(e); };
S.reload = [];
for (const p of EIGHT) { S.reload.push(cell(p + '-reload-mid-390', p, 390, { flow: reloadFlow('mid') })); S.reload.push(cell(p + '-reload-bottom-390', p, 390, { flow: reloadFlow('bottom') })); if (['map', 'travelers', 'stories'].includes(p)) S.reload.push(cell(p + '-reload-mid-1440', p, 1440, { flow: reloadFlow('mid') })); }
/* repeats (17 Nov 03:33): reload at the bottom of /for-expats and /about read higher with the new core in one load each */
S.reload2 = [];
for (const i of [1, 2, 3]) for (const p of ['expats', 'about']) S.reload2.push(cell(p + '-reload-bottom-390-r' + i, p, 390, { flow: reloadFlow('bottom') }));
const backFlow = async (page, s, id, rec, L) => {
  await page.goto(L.ORIGIN + L.PAGES[s.page], { waitUntil: 'load', timeout: 120000 }); await settle(page, L, 2500);
  const y = await page.evaluate(() => { const y = Math.min(document.documentElement.scrollHeight - innerHeight, Math.round(innerHeight * 1.2)); window.scrollTo(0, y); return y; }); await L.sleep(600);
  const other = s.page === 'about' ? '/stories' : '/about';
  await Promise.all([page.waitForNavigation({ waitUntil: 'load', timeout: 120000 }), page.evaluate(o => { location.href = o; }, other)]); await L.sleep(1500);
  await page.goBack({ waitUntil: 'load', timeout: 120000 }); await L.sleep(4000);
  const e = await L.probe(page, id, 'back'); e.wantY = y; rec.stages.push(e);
  await page.goForward({ waitUntil: 'load', timeout: 120000 }); await L.sleep(2500);
  await page.goBack({ waitUntil: 'load', timeout: 120000 }); await L.sleep(4000);
  const e2 = await L.probe(page, id, 'back2'); e2.wantY = y; rec.stages.push(e2); };
S.back = []; for (const p of EIGHT) S.back.push(cell(p + '-back-390', p, 390, { flow: backFlow })); for (const p of ['map', 'travelers', 'stories', 'account']) S.back.push(cell(p + '-back-1440', p, 1440, { flow: backFlow }));

/* ---- resize and rotation after load ---- */
const sizeFlow = (w2, h2) => async (page, s, id, rec, L) => {
  await page.goto(L.ORIGIN + L.PAGES[s.page], { waitUntil: 'load', timeout: 120000 }); await settle(page, L, 3000);
  rec.stages.push(await L.probe(page, id, 'a'));
  await page.setViewportSize({ width: w2, height: h2 }); await L.sleep(1500); rec.stages.push(await L.probe(page, id, 'b'));
  await page.setViewportSize({ width: s.w, height: s.h }); await L.sleep(1500); rec.stages.push(await L.probe(page, id, 'c')); };
S.resize = [];
for (const p of EIGHT) { S.resize.push(cell(p + '-rotate-390', p, 390, { flow: sizeFlow(844, 390) })); S.resize.push(cell(p + '-resize-1440-768', p, 1440, { flow: sizeFlow(768, 1024) })); }
S.resize.push(cell('travelers-resize-1440-500', 'travelers', 1440, { flow: sizeFlow(500, 900) }));
S.resize.push(cell('map-resize-1440-390', 'map', 1440, { flow: sizeFlow(390, 844) }));

/* ---- signed in (Memberstack stand-in answers a member; nothing uncached is fetched) ---- */
S.signedin = [];
for (const p of ['account', 'submit']) for (const w of [390, 1440]) for (const [n, d] of [['fast', 20], ['late', 1500]]) S.signedin.push(cell(p + '-in-' + n + '-' + w, p, w, { opts: { ms: 'in', msDelay: d }, wait: 6500, after: 4500 }));
for (const p of ['travelers', 'map', 'stories', 'profile', 'about', 'expats']) for (const w of [390, 1440]) S.signedin.push(cell(p + '-in-fast-' + w, p, w, { opts: { ms: 'in', msDelay: 20 }, wait: p === 'map' ? 9000 : 6500, after: 4500 }));
for (const w of [390, 1440]) S.signedin.push(cell('account-in-hash-settings-' + w, 'account', w, { opts: { ms: 'in', msDelay: 20 }, query: '#settings', wait: 6500, after: 4500 }));
/* signed in and slow: the document in pieces, so paints land while the nav piece is on */
for (const p of ['account', 'submit']) for (const w of [390, 1440]) for (const [n, d] of [['fast', 20], ['late', 1500]])
  S.signedin.push(cell(p + '-in-' + n + '-cut-' + w, p, w, { opts: { ms: 'in', msDelay: d, stream: { mode: 'rand', n: 10, gap: 200, ttfb: 50, seed: 5 } }, wait: 7500, after: 4500 }));

/* ---- repeats of three signed-in scenarios whose two arms ended differently in one load each (17 Nov 02:35) ---- */
S.signedin2 = [];
for (const i of [1, 2, 3, 4]) S.signedin2.push(cell('account-in-late-390-r' + i, 'account', 390, { opts: { ms: 'in', msDelay: 1500 }, wait: 6500, after: 4500 }));
for (const i of [1, 2, 3]) { S.signedin2.push(cell('account-in-fast-cut-1440-r' + i, 'account', 1440, { opts: { ms: 'in', msDelay: 20, stream: { mode: 'rand', n: 10, gap: 200, ttfb: 50, seed: 5 } }, wait: 7500, after: 4500 }));
  S.signedin2.push(cell('submit-in-fast-cut-390-r' + i, 'submit', 390, { opts: { ms: 'in', msDelay: 20, stream: { mode: 'rand', n: 10, gap: 200, ttfb: 50, seed: 5 } }, wait: 7500, after: 4500 })); }

/* ---- repeats of /stories with a search term (17 Nov 02:55): one load of markup st-q-1440 read 0.71 with the new core ---- */
S.stq2 = [];
for (const i of [1, 2, 3, 4, 5, 6, 7, 8]) S.stq2.push(cell('st-q-1440-r' + i, 'stories', 1440, { query: '?q=lisbon' }));
for (const i of [1, 2, 3, 4]) S.stq2.push(cell('st-q-390-r' + i, 'stories', 390, { query: '?q=lisbon' }));

/* ---- the Menu button: open, Escape, and a tap on the stand-in before the page is parsed ---- */
const menuFlow = async (page, s, id, rec, L) => {
  await page.goto(L.ORIGIN + L.PAGES[s.page], { waitUntil: 'load', timeout: 120000 }); await settle(page, L, 2500);
  const b = page.locator('.tll-nav-v1 .tllmm-btn'); rec.menu = { n: await b.count() };
  if (rec.menu.n) { await b.first().click(); await L.sleep(500); rec.stages.push(await L.probe(page, id, 'open')); await page.keyboard.press('Escape'); await L.sleep(400); }
  rec.stages.push(await L.probe(page, id, 'closed')); };
S.menu = EIGHT.map(p => cell(p + '-menu-390', p, 390, { flow: menuFlow })).concat([cell('account-menu-768', 'account', 768, { flow: menuFlow }), cell('stories-menu-768', 'stories', 768, { flow: menuFlow })]);
const earlyTap = async (page, s, id, rec, L) => {
  const nav = page.goto(L.ORIGIN + L.PAGES[s.page], { waitUntil: 'load', timeout: 120000 });
  rec.tap = { standIn: 0 };
  try { const b = page.locator('.tll-nav-v1 .tllmm-btn'); await b.first().waitFor({ state: 'visible', timeout: 8000 });
    rec.tap.at = await page.evaluate(() => ({ t: Math.round(performance.now()), rs: document.readyState, hidden: document.querySelector('.tllmm-btn').getAttribute('aria-hidden'), ti: document.querySelector('.tllmm-btn').tabIndex }));
    await b.first().click({ timeout: 3000 }); rec.tap.clicked = 1; } catch (e) { rec.tap.err = String(e).slice(0, 120); }
  await nav; await settle(page, L, 2500);
  rec.tap.end = await page.evaluate(() => ({ open: document.querySelector('.tll-nav-v1').classList.contains('tllmm-open'), ex: (document.querySelector('.tllmm-btn') || { getAttribute() { } }).getAttribute('aria-expanded'), n: document.querySelectorAll('.tllmm-btn').length }));
  rec.stages.push(await L.probe(page, id)); };
S.menu.push(cell('stories-earlytap-390', 'stories', 390, { flow: earlyTap, opts: { stream: { mode: 'even', size: 16000, gap: 250, ttfb: 50 } } }));
S.menu.push(cell('account-earlytap-390', 'account', 390, { flow: earlyTap, opts: { stream: { mode: 'even', size: 16000, gap: 250, ttfb: 50 } } }));

/* ---- /stories: chips toggled after load ---- */
const chipFlow = async (page, s, id, rec, L) => {
  await page.goto(L.ORIGIN + L.PAGES[s.page] + (s.query || ''), { waitUntil: 'load', timeout: 120000 }); await settle(page, L, 2500);
  rec.stages.push(await L.probe(page, id, 'loaded'));
  for (const pl of ['Africa', 'Antarctica', 'all']) { await page.locator('[data-tll-place="' + pl + '"]').first().click(); await L.sleep(700); rec.stages.push(await L.probe(page, id, 'place-' + pl)); } };
S.storiesuse = [cell('stories-chips-390', 'stories', 390, { flow: chipFlow }), cell('stories-chips-1440', 'stories', 1440, { flow: chipFlow }), cell('stories-chips-q-1440', 'stories', 1440, { flow: chipFlow, query: '?q=story' })];

/* ---- /travelers: the search box and the chips used ---- */
const travFlow = async (page, s, id, rec, L) => {
  await page.goto(L.ORIGIN + L.PAGES[s.page], { waitUntil: 'load', timeout: 120000 }); await settle(page, L, 2500);
  const q = page.locator('input[data-tll-trav-search]');
  await q.fill('den'); await L.sleep(600); rec.stages.push(await L.probe(page, id, 'q-den'));
  await q.fill('zzzzqq'); await L.sleep(600); rec.stages.push(await L.probe(page, id, 'q-none'));
  await q.fill(''); await L.sleep(600); rec.stages.push(await L.probe(page, id, 'q-clear'));
  for (const f of ['expats', 'creators', 'press', 'everyone']) { const c = page.locator('[data-tv-filter="' + f + '"]'); if (await c.isVisible()) { await c.click(); await L.sleep(600); rec.stages.push(await L.probe(page, id, 'chip-' + f)); } } };
S.travuse = [cell('travelers-use-390', 'travelers', 390, { flow: travFlow }), cell('travelers-use-1440', 'travelers', 1440, { flow: travFlow }), cell('travelers-use-320', 'travelers', 320, { flow: travFlow })];

/* ---- /the-map: the map used ---- */
const mapFlow = async (page, s, id, rec, L) => {
  await page.goto(L.ORIGIN + L.PAGES[s.page], { waitUntil: 'load', timeout: 120000 }); await settle(page, L, 3500);
  rec.stages.push(await L.probe(page, id, 'loaded')); rec.map = [];
  await page.evaluate(() => { const m = document.getElementById('tll-map-layers'); if (m) m.scrollIntoView({ block: 'start' }); }); await L.sleep(700);
  rec.stages.push(await L.probe(page, id, 'at-map'));
  const btns = page.locator('#tll-map-layers .tllm-bar-btn'); const nb = await btns.count(); rec.map.push('bar-btn ' + nb);
  for (let i = 0; i < Math.min(nb, 3); i++) { try { if (await btns.nth(i).isVisible()) { await btns.nth(i).click({ timeout: 3000 }); await L.sleep(700);
    rec.map.push('btn' + i + ' drawer=' + await page.evaluate(() => { const d = document.querySelector('#tll-map-layers .tllm-drawer'); return d ? (d.getAttribute('data-open') || '0') + '/' + getComputedStyle(d).display + '/' + Math.round(d.getBoundingClientRect().top) : 'none'; }));
    rec.stages.push(await L.probe(page, id, 'btn' + i)); } } catch (e) { rec.map.push('btn' + i + ' ERR ' + String(e).slice(0, 60)); } }
  const chips = page.locator('#tll-map-layers .tllm-chip'); const nc = await chips.count(); rec.map.push('chips ' + nc);
  for (let i = 0; i < Math.min(nc, 2); i++) { try { if (await chips.nth(i).isVisible()) { await chips.nth(i).click({ timeout: 3000 }); await L.sleep(700); rec.stages.push(await L.probe(page, id, 'chip' + i)); } } catch (e) { rec.map.push('chip' + i + ' ERR ' + String(e).slice(0, 60)); } }
  try { const st = page.locator('#tll-map-layers svg').first(); const bb = await st.boundingBox(); if (bb) { await page.mouse.click(bb.x + bb.width * 0.52, bb.y + bb.height * 0.38); await L.sleep(700); rec.stages.push(await L.probe(page, id, 'tap-map')); } } catch (e) { rec.map.push('tap ERR ' + String(e).slice(0, 60)); }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await L.sleep(900); rec.stages.push(await L.probe(page, id, 'bottom')); };
S.mapuse = [cell('map-use-390', 'map', 390, { flow: mapFlow }), cell('map-use-1440', 'map', 1440, { flow: mapFlow }), cell('map-use-768', 'map', 768, { flow: mapFlow })];

module.exports = S;
module.exports.__h = { SZ, EIGHT, inl, cell, esc };
