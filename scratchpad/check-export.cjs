// Download everything, Phase 1B (two steps): the /account card against a mocked Worker. Confirms that "Download everything"
// posts the member's map to POST /export/prepare and then navigates to the records zip link (window.location.assign, a real
// download in Chromium), that the card then offers "Download your photos", that the photo step fetches every photo through
// GET /export/photo?t=&u= four at a time, packs them with JSZip (served here from the local copy of 3.10.1) in parts of 25,
// and saves every part, the first included, only on its own "Save part N of K" tap (nothing is fetched while a part waits, and
// the tap-here link is hidden while the step runs), with the progress, waiting and done strings, the gtag events, the styled card
// with no blank lines, a stalled photo cut off and listed as a link, a packing failure that stops the run, JSZip that never
// arrives, the link ending (ready goes back to idle; done and error keep their lines), duplicate names kept apart per run, the
// K estimate for a run whose parts fill by bytes, and the error states.
// Run from the repo root: node scratchpad/check-export.cjs   (screenshots land in scratchpad/shots-1031/export_*.png)
const { chromium } = require('playwright');
const fs = require('fs');

const layer = fs.readFileSync('src/site-layers/tll-export-v1.js', 'utf8');
const jszip = fs.readFileSync('/opt/node-tools/node_modules/jszip/dist/jszip.min.js', 'utf8');
const WORKER = 'https://tll-travel-wire.thatlayoverlife.workers.dev';
const TOKEN = 'ab'.repeat(16);
const ZIP_URL = `${WORKER}/export/zip?t=${TOKEN}`;
const CDN = 'https://cdn.prod.website-files.com';
const PAGE = '<main><section><h1>Account</h1></section></main>';
const MS = 'window.$memberstackDom={getMemberCookie:()=>"tok",getMemberJSON:()=>Promise.resolve({data:{tllStates:{v:2,travelers:[{id:"me",name:"Nancy"}],states:{"392":{me:"lived"}}}}})};'
  + 'window.gtag=function(){(window.__ev=window.__ev||[]).push([arguments[1],arguments[2]]);};';
const WORKER_ERROR = 'That is ten downloads in an hour. Try again a little later.';
const FALLBACK = 'The download did not finish. Try again.';
const ON_ITS_WAY = 'Your copy is on its way.';
const READY = `${ON_ITS_WAY} If nothing happened, tap here. The link works for 15 minutes.`;
const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0xff, 0xd9]);
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4]);
// Some cases run the layer with one limit shortened; the source itself must still carry the real value (checked below).
// The stalled-photo case: the 90 s per photo becomes 1.5 s.
const SHORT = layer.replace('PHOTO_MS=90*1000', 'PHOTO_MS=1500');
// JSZip that never arrives: the 60 s it gets becomes 1.5 s.
const SLOW_LIB = layer.replace('LIB_MS=60*1000', 'LIB_MS=1500');
// The link ending: 15 minutes become 2.5 s, and a photo step still running is looked at again every 300 ms instead of every minute.
const EXPIRY = layer.replace('LINK_MS=15*60*1000', 'LINK_MS=2500').replace('RECHECK_MS=60*1000', 'RECHECK_MS=300');
// Parts that fill by bytes: 80 MB become 36 bytes, so three of the 12-byte PNGs fill a part.
const SMALL_PARTS = layer.replace('PART_BYTES=80*1024*1024', 'PART_BYTES=36');
// The packing-failure case serves JSZip with generateAsync rejecting, as it would when a phone runs out of memory.
const NO_MEMORY = `${jszip};JSZip.prototype.generateAsync=function(){return Promise.reject(new Error('no memory'));};`;

let failures = 0;
const check = (name, ok, detail) => { console.log(`${ok ? 'ok   ' : 'FAIL '}${name}${detail ? `: ${detail}` : ''}`); if (!ok) failures += 1; };
const photoList = (n) => Array.from({ length: n }, (_, i) => (i === 0 ? { folder: 'profile', name: 'avatar', url: `${CDN}/avatar.jpg` }
  : { folder: 'stories/bulgaria', name: `photo-${String(i).padStart(2, '0')}`, url: `${CDN}/p${i}.png` }));
// All PNGs, all 12 bytes, for the byte-first run.
const pngList = (n) => Array.from({ length: n }, (_, i) => ({ folder: 'stories/bulgaria', name: `photo-${String(i + 1).padStart(2, '0')}`, url: `${CDN}/p${i + 1}.png` }));
// The Photos lines of a run: every number from 0 to total, in order, each step 0 or 1 (a tap repeats the current count once).
const countedInOrder = (lines, total) => { const ns = lines.filter((l) => /^Photos \d+ of /.test(l)).map((l) => Number(/^Photos (\d+)/.exec(l)[1]));
  return ns[0] === 0 && ns[ns.length - 1] === total && ns.every((n, i) => i === 0 || n === ns[i - 1] || n === ns[i - 1] + 1); };

(async () => {
  const { zipStream, collectBytes } = await import('../src/zip.js');
  const { readZip, textOf } = await import('../test/zip-read.js');
  const zipBytes = Buffer.from(await collectBytes(zipStream(async (z) => { await z.file('that-layover-life/README.txt', 'test copy'); })));
  const browser = await chromium.launch();

  async function open(width, prepare, { photoStatus = () => 200, jszipOk = true, jszipStall = false, src = layer, jszipSrc = jszip, stall = () => false } = {}) {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, acceptDownloads: true, locale: 'en-DK' });
    const page = await ctx.newPage();
    const nav = []; const bodies = []; const errs = []; const photoReqs = []; const downloads = []; const stalled = [];
    let inflight = 0; let maxInflight = 0;
    page.on('pageerror', (e) => errs.push(e.message));
    page.on('download', (d) => downloads.push(d));
    await page.route('**/*', async (route) => {
      const req = route.request(); const u = new URL(req.url());
      if (u.hostname === 'www.thatlayover.life') {
        return route.fulfill({ contentType: 'text/html; charset=utf-8', body: `<!doctype html><html><head><meta charset=utf-8><meta name=viewport content="width=device-width"></head><body style="margin:0">${PAGE}<script>${MS}<\/script><script>${src}<\/script></body></html>` });
      }
      if (u.hostname === 'cdnjs.cloudflare.com') {
        if (!jszipOk) return route.abort('failed');
        // JSZip that never answers: the layer's own limit has to give up on it.
        if (jszipStall) { stalled.push(route); return; }
        return route.fulfill({ status: 200, headers: { 'content-type': 'application/javascript', 'access-control-allow-origin': '*' }, body: jszipSrc });
      }
      if (u.pathname === '/export/prepare') { bodies.push({ method: req.method(), auth: req.headers().authorization, body: req.postData() }); await new Promise((r) => setTimeout(r, 300)); return prepare(route); }
      if (u.pathname === '/paw/waitlist/export') return route.fulfill({ status: 403, contentType: 'application/json', body: '{"error":"Owner only."}' });
      if (u.pathname === '/export/zip') {
        nav.push({ url: req.url(), navigation: req.isNavigationRequest(), method: req.method() });
        return route.fulfill({ status: 200, headers: { 'content-type': 'application/zip', 'content-disposition': 'attachment; filename="that-layover-life-nancy-2026-11-01.zip"', 'cache-control': 'no-store' }, body: zipBytes });
      }
      if (u.pathname === '/export/photo') {
        const target = u.searchParams.get('u') || '';
        photoReqs.push({ t: u.searchParams.get('t'), u: target, method: req.method(), origin: req.headers().origin });
        // A stalled photo: headers never come until the context is closed, so the layer's own limit has to cut it off.
        if (stall(target)) { stalled.push(route); return; }
        inflight += 1; maxInflight = Math.max(maxInflight, inflight);
        await new Promise((r) => setTimeout(r, 60));
        inflight -= 1;
        const status = photoStatus(target);
        if (status !== 200) return route.fulfill({ status, headers: { 'content-type': 'application/json', 'access-control-allow-origin': 'https://www.thatlayover.life' }, body: '{"error":"the photo did not download"}' });
        const png = target.endsWith('.png');
        return route.fulfill({ status: 200, headers: { 'content-type': png ? 'image/png' : 'image/jpeg', 'cache-control': 'private, no-store', 'access-control-allow-origin': 'https://www.thatlayover.life' }, body: png ? PNG : JPEG });
      }
      return route.fulfill({ status: 404, body: '' });
    });
    // href is the tap-here link only while it is shown; a hidden link reads as no link, as it does for the member.
    const read = () => page.evaluate(() => { const b = document.getElementById('tll-exp'); if (!b) return null; const ms = b.querySelectorAll('.tll-exp-msg'); const bs = b.querySelectorAll('button'); const a = ms[0].querySelector('a');
      return { state: b.getAttribute('data-state'), msg: ms[0].innerText, pmsg: ms[1].innerText, msgHidden: ms[0].hidden, pmsgHidden: ms[1].hidden, disabled: bs[0].disabled,
        photoBtn: bs[1].hidden ? null : { text: bs[1].textContent, disabled: bs[1].disabled }, save: bs[2].hidden ? null : { text: bs[2].textContent, disabled: bs[2].disabled }, href: a && !a.closest('[hidden]') ? a.href : '' }; });
    const states = []; const progress = new Set();
    const note = (s) => { if (s.pmsg) progress.add(s.pmsg); if (!states.length || states[states.length - 1].state !== s.state) states.push(s); };
    const track = async (ms) => { const end = Date.now() + ms; while (Date.now() < end) { const s = await read(); if (s) note(s); await page.waitForTimeout(25); } };
    const waitFor = async (pred, ms) => { const end = Date.now() + ms; while (Date.now() < end) { const s = await read(); if (s) { note(s); if (pred(s)) return s; } await page.waitForTimeout(25); } return read(); };
    // The next part waiting for its tap (or the run ending first).
    const waitSave = (ms = 30000) => waitFor((s) => s.save !== null || s.state !== 'photos', ms);
    await page.goto('https://www.thatlayover.life/account');
    await page.waitForSelector('#tll-exp', { timeout: 6000 });
    // Every change of the photo-step line, recorded inside the page: a poll from outside would miss the quick ones.
    await page.evaluate(() => { window.__pm = []; const node = document.querySelectorAll('#tll-exp .tll-exp-msg')[1]; new MutationObserver(() => { const t = node.textContent; if (t && window.__pm[window.__pm.length - 1] !== t) window.__pm.push(t); }).observe(node, { childList: true, characterData: true, subtree: true }); });
    await track(150);
    const lines = () => page.evaluate(() => window.__pm);
    const partsSaved = () => downloads.filter((d) => /photos-part/.test(d.suggestedFilename())).length;
    // JSZip writes a directory entry for each folder, as the old browser build did; only the files matter here.
    const parts = async () => { const out = []; for (const d of downloads) { const name = d.suggestedFilename(); if (!/photos-part/.test(name)) continue; const bytes = fs.readFileSync(await d.path()); out.push({ name, entries: readZip(new Uint8Array(bytes)).filter((e) => !e.name.endsWith('/')) }); } return out; };
    const close = async () => { for (const r of stalled) await r.abort('failed').catch(() => {}); await ctx.close(); };
    return { ctx, page, nav, bodies, errs, photoReqs, downloads, states, progress, track, read, waitFor, waitSave, parts, partsSaved, lines, close, max: () => maxInflight };
  }
  const prepared = (list) => (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, url: ZIP_URL, token: TOKEN, expiresAt: '2026-11-01T10:15:00.000Z', stories: 2, photos: list.length, photoList: list }) });
  const BUTTON = '#tll-exp button';
  const PHOTOS = '#tll-exp button:nth-of-type(2)';
  const SAVE = '#tll-exp button:nth-of-type(3)';
  // The records step up to the ready line, then the photo button.
  const toReady = async (t) => { await t.page.click(BUTTON); await t.waitFor((s) => s.state === 'ready', 4000); };
  const startPhotos = async (t) => { await toReady(t); await t.page.click(PHOTOS); };

  // 1. The two steps at phone and desktop widths: three photos, one of which the proxy refuses; the one part waits for its tap.
  for (const width of [390, 1440]) {
    const list = photoList(3);
    const t = await open(width, prepared(list), { photoStatus: (u) => (u.endsWith('/p2.png') ? 502 : 200) });
    const idle = await t.read();
    await t.page.screenshot({ path: `scratchpad/shots-1031/export_idle_${width}.png` });
    check(`${width} the card is styled: the style element is in the head and the card shows its border and button colors`, await t.page.evaluate(() => { const s = document.getElementById('tll-export-v1'); const b = document.getElementById('tll-exp'); const cs = getComputedStyle(b); const bt = getComputedStyle(b.querySelector('button'));
      return !!s && s.tagName === 'STYLE' && document.querySelectorAll('#tll-export-v1').length === 1 && cs.borderTopColor === 'rgb(224, 218, 206)' && cs.maxWidth === '760px' && bt.backgroundColor === 'rgb(200, 50, 91)' && bt.minHeight === '44px'; }));
    check(`${width} idle: both message lines are hidden, no blank space`, idle.state === 'idle' && idle.msgHidden && idle.pmsgHidden && idle.save === null, JSON.stringify(idle));
    const download = t.page.waitForEvent('download', { timeout: 8000 }).then((d) => d.suggestedFilename()).catch(() => null);
    await t.page.click(BUTTON);
    const ready = await t.waitFor((s) => s.state === 'ready', 4000);
    await t.page.screenshot({ path: `scratchpad/shots-1031/export_ready_${width}.png` });
    check(`${width} states idle, preparing, ready`, t.states.map((s) => s.state).join(' > ') === 'idle > preparing > ready', t.states.map((s) => s.state).join(' > '));
    const by = Object.fromEntries(t.states.map((s) => [s.state, s]));
    check(`${width} preparing copy, disabled button, no photo button yet`, by.preparing && by.preparing.msg === 'Gathering your stories and records…' && !by.preparing.msgHidden && by.preparing.disabled && by.preparing.photoBtn === null, JSON.stringify(by.preparing));
    check(`${width} ready copy with the tap-here link and the photo button; the photo line still hidden`, ready.msg === READY && ready.href === ZIP_URL && !ready.disabled && ready.photoBtn && ready.photoBtn.text === 'Download your photos' && !ready.photoBtn.disabled && ready.pmsgHidden && ready.save === null, JSON.stringify(ready));
    // The message rule wins over ".tll-exp p": smaller gray text, no bottom margin, and the button after it sits 12 px below.
    const style = await t.page.evaluate(() => { const b = document.getElementById('tll-exp'); const ms = b.querySelectorAll('.tll-exp-msg'); const bs = b.querySelectorAll('button'); const m = getComputedStyle(ms[0]);
      return { size: m.fontSize, color: m.color, bottom: m.marginBottom, top: m.marginTop, link: getComputedStyle(ms[0].querySelector('a')).color, gap: Math.round(bs[1].getBoundingClientRect().top - ms[0].getBoundingClientRect().bottom) }; });
    check(`${width} ready: the message line is 13 px gray with no bottom margin, the link teal, and the photo button 12 px below it`, style.size === '13px' && style.color === 'rgb(95, 90, 84)' && style.bottom === '0px' && style.top === '8px' && style.link === 'rgb(6, 122, 121)' && style.gap === 12, JSON.stringify(style));
    check(`${width} prepare was a POST with the Bearer token and the map`, t.bodies.length === 1 && t.bodies[0].method === 'POST' && t.bodies[0].auth === 'Bearer tok' && JSON.parse(t.bodies[0].body).states.v === 2, JSON.stringify(t.bodies));
    check(`${width} location.assign navigated to the zip url`, t.nav.length === 1 && t.nav[0].url === ZIP_URL && t.nav[0].navigation && t.nav[0].method === 'GET', JSON.stringify(t.nav));
    check(`${width} the browser got the records zip as a file download`, (await download) === 'that-layover-life-nancy-2026-11-01.zip', String(await download));
    check(`${width} no JSZip before the photo button is pressed`, await t.page.evaluate(() => !document.querySelector('script[src*="jszip"]') && !window.JSZip));
    let ev = await t.page.evaluate(() => window.__ev);
    check(`${width} gtag download_everything then download_complete (no photos parameter) when the link is followed`, JSON.stringify(ev) === JSON.stringify([['download_everything', { division: 'tll' }], ['download_complete', { division: 'tll' }]]), JSON.stringify(ev));

    // Step two: one part, which waits for its own tap like any other; the tap-here link is hidden meanwhile.
    await t.page.click(PHOTOS);
    const waiting = await t.waitSave(15000);
    await t.page.waitForTimeout(500);
    if (width === 390) await t.page.screenshot({ path: 'scratchpad/shots-1031/export_part_390.png' });
    check(`${width} part 1 of 1 waits for its tap: save button, waiting line, both buttons disabled, nothing saved yet`, waiting.state === 'photos' && waiting.save && waiting.save.text === 'Save part 1 of 1' && !waiting.save.disabled && waiting.pmsg === 'Part 1 of 1 is ready to save.' && waiting.disabled && waiting.photoBtn && waiting.photoBtn.disabled && t.partsSaved() === 0, JSON.stringify(waiting));
    check(`${width} the tap-here link is hidden while the photo step runs; the ready line itself stays`, waiting.msg === ON_ITS_WAY && waiting.href === '' && await t.page.evaluate(() => !!document.querySelector('#tll-exp .tll-exp-msg a')), JSON.stringify(waiting));
    await t.page.click(SAVE);
    const done = await t.waitFor((s) => s.state === 'done' || s.state === 'error', 15000);
    await t.page.waitForTimeout(500);
    await t.page.screenshot({ path: `scratchpad/shots-1031/export_done_${width}.png` });
    check(`${width} states then photos, done`, t.states.map((s) => s.state).join(' > ') === 'idle > preparing > ready > photos > done', t.states.map((s) => s.state).join(' > '));
    const seen = await t.lines();
    check(`${width} progress Photos 0 of 3… through Photos 3 of 3…, the waiting line, then the parts line`, seen.join(' | ') === 'Photos 0 of 3… | Photos 1 of 3… | Photos 2 of 3… | Photos 3 of 3… | Part 1 of 1 is ready to save. | 2 photos in 1 part.', seen.join(' | '));
    check(`${width} done line and parts line, both lines shown, no save button`, done.state === 'done' && done.msg === 'Done. 2 stories, 2 photos (1 listed as links).' && done.pmsg === '2 photos in 1 part.' && !done.msgHidden && !done.pmsgHidden && done.save === null && !done.disabled && done.photoBtn && !done.photoBtn.disabled, JSON.stringify(done));
    check(`${width} every photo went through the proxy with the token`, t.photoReqs.length === 3 && t.photoReqs.every((r) => r.t === TOKEN && r.method === 'GET' && r.origin === 'https://www.thatlayover.life') && t.photoReqs.map((r) => r.u).sort().join() === list.map((p) => p.url).sort().join(), JSON.stringify(t.photoReqs));
    check(`${width} JSZip loaded from cdnjs on demand`, await t.page.evaluate(() => !!document.querySelector('script[src^="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/"]') && !!window.JSZip));
    const parts = await t.parts();
    const names = parts.length === 1 ? parts[0].entries.map((e) => e.name).sort() : [];
    check(`${width} one part saved with the two photos and the not-downloaded list`, parts.length === 1 && parts[0].name === 'that-layover-life-photos-part-1.zip'
      && names.join() === ['that-layover-life/photos/not-downloaded.txt', 'that-layover-life/photos/profile/avatar.jpg', 'that-layover-life/photos/stories/bulgaria/photo-01.png'].join()
      && parts[0].entries.every((e) => e.crcOk), JSON.stringify(parts.map((p) => [p.name, p.entries.map((e) => e.name)])));
    if (parts.length === 1) {
      const avatar = parts[0].entries.find((e) => e.name.endsWith('avatar.jpg'));
      const missing = parts[0].entries.find((e) => e.name.endsWith('not-downloaded.txt'));
      check(`${width} the photo bytes are the proxy's bytes`, avatar && Buffer.from(avatar.data).equals(JPEG));
      check(`${width} the not-downloaded list names the refused photo`, missing && textOf(missing) === `These photos could not be downloaded, so here are their links:\nstories/bulgaria/photo-02: ${CDN}/p2.png\n`, missing && textOf(missing));
    }
    await t.page.click('#tll-exp .tll-exp-msg a', { timeout: 1000 }).catch(() => {});
    await t.page.waitForTimeout(400);
    check(`${width} the done line has no link; the tap-here link was only in the ready state`, t.nav.length === 1 && done.href === '', JSON.stringify(t.nav));
    ev = await t.page.evaluate(() => window.__ev);
    check(`${width} photos_complete with the real counts when the photo step ends`, ev.length === 3 && JSON.stringify(ev[2]) === JSON.stringify(['photos_complete', { division: 'tll', photos: 2, parts: 1, links: 1 }]), JSON.stringify(ev));
    check(`${width} no page errors`, t.errs.length === 0, t.errs.join(' | '));
    await t.close();
  }

  // 2. Parts: 30 photos become part 1 (25) and part 2 (5); each waits for its own tap, and four fetches at a time at most.
  {
    const list = photoList(30);
    const t = await open(390, prepared(list));
    await startPhotos(t);
    const first = await t.waitSave();
    const reqsAtFirst = t.photoReqs.length;
    await t.page.waitForTimeout(700);
    const still = await t.read();
    check('30 photos: part 1 of 2 waits for its tap with the save button, the waiting line, no done line and nothing saved', first.state === 'photos' && first.save && first.save.text === 'Save part 1 of 2' && !first.save.disabled && first.pmsg === 'Part 1 of 2 is ready to save.' && first.msg === ON_ITS_WAY && first.href === '' && first.disabled && first.photoBtn && first.photoBtn.disabled && t.partsSaved() === 0, JSON.stringify(first));
    check('30 photos: at most three photos fetched ahead while part 1 waits, and nothing changes while it waits', still.state === 'photos' && still.save && still.pmsg === 'Part 1 of 2 is ready to save.' && reqsAtFirst >= 25 && reqsAtFirst <= 28 && t.photoReqs.length === reqsAtFirst, `${reqsAtFirst} then ${t.photoReqs.length} requests, ${JSON.stringify(still)}`);
    await t.page.click(SAVE);
    const resumed = await t.waitFor((s) => s.pmsg !== 'Part 1 of 2 is ready to save.', 4000);
    check('30 photos: after the tap part 1 is saved, the progress line is back and fetching resumes', resumed.state === 'photos' && /^Photos \d+ of 30…$/.test(resumed.pmsg) && resumed.save === null && t.partsSaved() === 1 && t.downloads.some((d) => d.suggestedFilename() === 'that-layover-life-photos-part-1.zip'), JSON.stringify(resumed));
    const second = await t.waitSave();
    await t.page.waitForTimeout(400);
    check('30 photos: part 2 of 2 waits in turn, every photo fetched, one part saved', second.state === 'photos' && second.save && second.save.text === 'Save part 2 of 2' && second.pmsg === 'Part 2 of 2 is ready to save.' && t.photoReqs.length === 30 && t.partsSaved() === 1, JSON.stringify(second));
    await t.page.click(SAVE);
    const done = await t.waitFor((s) => s.state === 'done' || s.state === 'error', 10000);
    await t.page.waitForTimeout(800);
    check('30 photos: done line after the second tap, save button gone', done.state === 'done' && done.msg === 'Done. 2 stories, 30 photos.' && done.pmsg === '30 photos in 2 parts.' && done.save === null, JSON.stringify(done));
    check('30 photos: four at a time at most, never more', t.max() <= 4 && t.max() >= 2, String(t.max()));
    const seen = await t.lines();
    check('30 photos: progress counted every photo in order around the two waiting lines, then the parts line', countedInOrder(seen, 30) && seen.filter((l) => /^Part /.test(l)).join('|') === 'Part 1 of 2 is ready to save.|Part 2 of 2 is ready to save.' && seen[seen.length - 1] === '30 photos in 2 parts.', `${seen.length} lines, tail ${seen.slice(-4).join('|')}`);
    const parts = await t.parts();
    check('30 photos: two parts of 25 and 5, named in order, every CRC right', parts.length === 2 && parts.map((p) => p.name).join() === 'that-layover-life-photos-part-1.zip,that-layover-life-photos-part-2.zip'
      && parts.map((p) => p.entries.length).join() === '25,5' && parts.every((p) => p.entries.every((e) => e.crcOk)), JSON.stringify(parts.map((p) => [p.name, p.entries.length])));
    const all = parts.flatMap((p) => p.entries.map((e) => e.name)).sort();
    check('30 photos: every photo is in exactly one part', all.length === 30 && new Set(all).size === 30 && all.every((n) => /^that-layover-life\/photos\/(profile\/avatar\.jpg|stories\/bulgaria\/photo-\d\d\.png)$/.test(n)), all.slice(0, 3).join());
    const ev = await t.page.evaluate(() => window.__ev);
    check('30 photos: photos_complete reports 30 photos in 2 parts, no links', JSON.stringify(ev[2]) === JSON.stringify(['photos_complete', { division: 'tll', photos: 30, parts: 2, links: 0 }]), JSON.stringify(ev));
    check('30 photos: no page errors', t.errs.length === 0, t.errs.join(' | '));
    await t.close();
  }

  // 3. Three parts: 55 photos. Each part waits for its tap, K reads 3 throughout, and fetching pauses while a part waits.
  {
    const list = photoList(55);
    const t = await open(390, prepared(list));
    await startPhotos(t);
    const offers = [];
    for (let n = 1; n <= 3; n += 1) {
      const w = await t.waitSave();
      const reqs = t.photoReqs.length;
      await t.page.waitForTimeout(400);
      offers.push({ save: w.save && w.save.text, line: w.pmsg, reqs, reqsLater: t.photoReqs.length, saved: t.partsSaved() });
      await t.page.click(SAVE);
    }
    const done = await t.waitFor((s) => s.state === 'done' || s.state === 'error', 10000);
    await t.page.waitForTimeout(800);
    check('55 photos: parts 1, 2 and 3 of 3 wait in turn, with at most three photos fetched ahead and nothing fetched while a part waits', offers.map((o) => o.save).join() === 'Save part 1 of 3,Save part 2 of 3,Save part 3 of 3' && offers.map((o) => o.line).join() === 'Part 1 of 3 is ready to save.,Part 2 of 3 is ready to save.,Part 3 of 3 is ready to save.'
      && offers[0].reqs >= 25 && offers[0].reqs <= 28 && offers[1].reqs >= 50 && offers[1].reqs <= 53 && offers[2].reqs === 55 && offers.every((o) => o.reqsLater === o.reqs), JSON.stringify(offers));
    check('55 photos: no part saved before its tap', offers.map((o) => o.saved).join() === '0,1,2', JSON.stringify(offers.map((o) => o.saved)));
    check('55 photos: done after the third tap', done.state === 'done' && done.msg === 'Done. 2 stories, 55 photos.' && done.pmsg === '55 photos in 3 parts.' && done.save === null, JSON.stringify(done));
    const parts = await t.parts();
    check('55 photos: three parts of 25, 25 and 5, every CRC right', parts.map((p) => [p.name, p.entries.length].join(':')).join() === 'that-layover-life-photos-part-1.zip:25,that-layover-life-photos-part-2.zip:25,that-layover-life-photos-part-3.zip:5' && parts.every((p) => p.entries.every((e) => e.crcOk)), JSON.stringify(parts.map((p) => [p.name, p.entries.length])));
    const all = parts.flatMap((p) => p.entries.map((e) => e.name));
    check('55 photos: every photo is in exactly one part', all.length === 55 && new Set(all).size === 55, String(all.length));
    const ev = await t.page.evaluate(() => window.__ev);
    check('55 photos: photos_complete reports 3 parts', JSON.stringify(ev[2]) === JSON.stringify(['photos_complete', { division: 'tll', photos: 55, parts: 3, links: 0 }]), JSON.stringify(ev));
    check('55 photos: no page errors', t.errs.length === 0, t.errs.join(' | '));
    await t.close();
  }

  // 4. No photos: the card stops at the ready line and never shows the photo button.
  {
    const t = await open(390, prepared([]));
    await t.page.click(BUTTON);
    const ready = await t.waitFor((s) => s.state === 'ready', 4000);
    await t.track(600);
    check('no photos: ready line without a photo button', ready.state === 'ready' && ready.msg === READY && ready.photoBtn === null && ready.pmsgHidden && t.states.map((s) => s.state).join(' > ') === 'idle > preparing > ready', JSON.stringify(ready));
    await t.close();
  }

  // 5. The Worker says no: its message shows, the button is free again, nothing navigates.
  {
    const t = await open(390, (route) => route.fulfill({ status: 429, contentType: 'application/json', body: JSON.stringify({ error: WORKER_ERROR }) }));
    await t.page.click(BUTTON);
    await t.track(1000);
    await t.page.screenshot({ path: 'scratchpad/shots-1031/export_error_390.png' });
    const seq = t.states.map((s) => s.state);
    const last = t.states[t.states.length - 1];
    check('error state after a Worker error', seq.join(' > ') === 'idle > preparing > error', seq.join(' > '));
    check('error shows the Worker message and frees the button', last.msg === WORKER_ERROR && !last.disabled && last.href === '' && last.photoBtn === null, JSON.stringify(last));
    check('no navigation on error', t.nav.length === 0 && t.errs.length === 0, JSON.stringify(t.nav) + t.errs.join(' | '));
    await t.close();
  }

  // 6. The network fails: the old fallback copy, not the browser's own words; a second press starts over.
  {
    const t = await open(390, (route) => route.abort('failed'));
    await t.page.click(BUTTON);
    await t.track(1000);
    const last = t.states[t.states.length - 1];
    check('fallback copy after a network failure', last.state === 'error' && last.msg === FALLBACK && !last.disabled, JSON.stringify(last));
    await t.page.click(BUTTON);
    await t.track(600);
    check('the button can be pressed again', t.states.filter((s) => s.state === 'preparing').length === 2 && t.bodies.length === 2, t.states.map((s) => s.state).join(' > '));
    await t.close();
  }

  // 7. JSZip does not load: the photo step shows the fallback, the link is back and its button free; the records step is untouched.
  //    Then the link ends: the error card keeps its lines and loses only the link and the photo button.
  {
    check('the source gives the link 15 minutes and looks again every minute while a photo step runs', /LINK_MS=15\*60\*1000/.test(layer) && /RECHECK_MS=60\*1000/.test(layer) && EXPIRY !== layer);
    const t = await open(390, prepared(photoList(2)), { jszipOk: false, src: EXPIRY });
    await startPhotos(t);
    const last = await t.waitFor((s) => s.state === 'error', 6000);
    check('photo step error when JSZip fails to load', last.state === 'error' && last.pmsg === FALLBACK && last.msg === READY && last.href === ZIP_URL && last.photoBtn && !last.photoBtn.disabled && !last.disabled && last.save === null, JSON.stringify(last));
    check('no photo was fetched without JSZip', t.photoReqs.length === 0 && t.errs.length === 0, JSON.stringify(t.photoReqs) + t.errs.join(' | '));
    const ended = await t.waitFor((s) => s.photoBtn === null, 4000);
    await t.track(400);
    check('the link ends: the error card keeps both lines, the tap-here link and the photo button are gone', ended.state === 'error' && ended.pmsg === FALLBACK && ended.msg === ON_ITS_WAY && ended.href === '' && ended.photoBtn === null && !ended.disabled && t.states.map((s) => s.state).join(' > ') === 'idle > preparing > ready > photos > error', JSON.stringify(ended));
    await t.close();
  }

  // 8. A photo whose answer never comes: the layer's own limit cuts it off, it is listed as a link, and the run finishes.
  {
    check('the source gives each photo fetch 90 s', /PHOTO_MS=90\*1000/.test(layer) && SHORT !== layer);
    const list = photoList(3);
    const t = await open(390, prepared(list), { src: SHORT, stall: (u) => u.endsWith('/p2.png') });
    await toReady(t);
    const t0 = Date.now();
    await t.page.click(PHOTOS);
    const waiting = await t.waitSave(10000);
    const took = Date.now() - t0;
    await t.page.click(SAVE);
    const done = await t.waitFor((s) => s.state === 'done' || s.state === 'error', 10000);
    await t.page.waitForTimeout(400);
    check('stalled photo: cut off after the limit and listed as a link, the other two packed', waiting.save && waiting.save.text === 'Save part 1 of 1' && done.state === 'done' && done.msg === 'Done. 2 stories, 2 photos (1 listed as links).' && done.pmsg === '2 photos in 1 part.' && took >= 1400 && took < 6000, `${took} ms, ${JSON.stringify(done)}`);
    const parts = await t.parts();
    const missing = parts.length === 1 && parts[0].entries.find((e) => e.name.endsWith('not-downloaded.txt'));
    check('stalled photo: named in the not-downloaded list', missing && textOf(missing) === `These photos could not be downloaded, so here are their links:\nstories/bulgaria/photo-02: ${CDN}/p2.png\n`, missing && textOf(missing));
    check('stalled photo: no page errors', t.errs.length === 0, t.errs.join(' | '));
    await t.close();
  }

  // 9. Packing fails (no memory): the run stops, the fallback shows, and workers still in flight do not write over it.
  {
    const list = photoList(30);
    const t = await open(390, prepared(list), { jszipSrc: NO_MEMORY });
    await startPhotos(t);
    const err = await t.waitFor((s) => s.state === 'error', 15000);
    const reqsAtError = t.photoReqs.length;
    await t.page.waitForTimeout(1200);
    const later = await t.read();
    check('packing failure: error state with the fallback line, the link back, buttons free, no save button', err.state === 'error' && err.pmsg === FALLBACK && err.msg === READY && err.href === ZIP_URL && !err.disabled && err.photoBtn && !err.photoBtn.disabled && err.save === null, JSON.stringify(err));
    check('packing failure: the line stays, no worker wrote a progress line over it, no more fetches', later.state === 'error' && later.pmsg === FALLBACK && t.photoReqs.length === reqsAtError && reqsAtError <= 28, `${reqsAtError} then ${t.photoReqs.length} requests, ${JSON.stringify(later)}`);
    const seen = await t.lines();
    check('packing failure: the fallback is the last line recorded', seen[seen.length - 1] === FALLBACK, seen.slice(-3).join('|'));
    check('packing failure: nothing saved, no page errors', t.partsSaved() === 0 && t.errs.length === 0, t.errs.join(' | '));
    await t.close();
  }

  // 10. JSZip never arrives: after its 60 s the script element is removed, the fallback shows and the buttons are free again.
  {
    check('the source gives JSZip 60 s to load', /LIB_MS=60\*1000/.test(layer) && SLOW_LIB !== layer);
    const t = await open(390, prepared(photoList(2)), { jszipStall: true, src: SLOW_LIB });
    await toReady(t);
    const t0 = Date.now();
    await t.page.click(PHOTOS);
    const running = await t.waitFor((s) => s.state === 'photos', 2000);
    const scriptWhileWaiting = await t.page.evaluate(() => !!document.querySelector('script[src*="jszip"]'));
    const last = await t.waitFor((s) => s.state === 'error', 6000);
    const took = Date.now() - t0;
    check('slow JSZip: the step waits with its buttons disabled and the script element in the head', running.state === 'photos' && running.disabled && running.photoBtn && running.photoBtn.disabled && scriptWhileWaiting, JSON.stringify(running));
    check('slow JSZip: after the limit the fallback shows, the link is back and the buttons are free', last.state === 'error' && last.pmsg === FALLBACK && last.msg === READY && last.href === ZIP_URL && !last.disabled && last.photoBtn && !last.photoBtn.disabled && last.save === null && took >= 1400 && took < 6000, `${took} ms, ${JSON.stringify(last)}`);
    check('slow JSZip: the script element was removed, no photo fetched, no page errors', await t.page.evaluate(() => !document.querySelector('script[src*="jszip"]') && !window.JSZip) && t.photoReqs.length === 0 && t.errs.length === 0, t.errs.join(' | '));
    await t.close();
  }

  // 11. The link ends. A ready card goes back to idle. A photo step waiting for its tap is left alone; after the tap the done line
  //     survives the next tick, the photo button is gone, and "Download everything" works again.
  {
    const t = await open(390, prepared(photoList(3)), { src: EXPIRY });
    await toReady(t);
    const idle = await t.waitFor((s) => s.state === 'idle', 5000);
    check('link ended on a ready card: back to idle, both lines hidden, no photo button', idle.state === 'idle' && idle.msgHidden && idle.pmsgHidden && idle.photoBtn === null && !idle.disabled && t.states.map((s) => s.state).join(' > ') === 'idle > preparing > ready > idle', JSON.stringify(idle));
    await t.close();
  }
  {
    const t = await open(390, prepared(photoList(3)), { src: EXPIRY });
    await startPhotos(t);
    const waiting = await t.waitSave(10000);
    // Past the 2.5 s link and a few 300 ms looks while the part waits for its tap.
    await t.page.waitForTimeout(3200);
    const stillWaiting = await t.read();
    check('link ended while a part waits for its tap: the step is left alone, the save button stays', waiting.save && waiting.save.text === 'Save part 1 of 1' && stillWaiting.state === 'photos' && stillWaiting.save && stillWaiting.save.text === 'Save part 1 of 1' && stillWaiting.pmsg === 'Part 1 of 1 is ready to save.' && stillWaiting.disabled, JSON.stringify(stillWaiting));
    await t.page.click(SAVE);
    const done = await t.waitFor((s) => s.state === 'done' || s.state === 'error', 10000);
    const ended = await t.waitFor((s) => s.photoBtn === null, 3000);
    await t.track(500);
    check('after the tap: the done line, then the next look removes the photo button and leaves both lines', done.state === 'done' && done.msg === 'Done. 2 stories, 3 photos.' && done.photoBtn !== null && ended.state === 'done' && ended.msg === 'Done. 2 stories, 3 photos.' && ended.pmsg === '3 photos in 1 part.' && !ended.msgHidden && !ended.pmsgHidden && ended.photoBtn === null && ended.href === '' && ended.save === null && !ended.disabled, JSON.stringify(ended));
    check('the done line survived the tick and the states never went back to idle', t.states.map((s) => s.state).join(' > ') === 'idle > preparing > ready > photos > done' && t.partsSaved() === 1, t.states.map((s) => s.state).join(' > '));
    await t.page.click(BUTTON);
    const again = await t.waitFor((s) => s.state === 'ready', 4000);
    check('a new press starts over: preparing, then ready with the photo button again', again.state === 'ready' && again.msg === READY && again.photoBtn && !again.photoBtn.disabled && again.pmsgHidden && t.bodies.length === 2 && t.nav.length === 2 && t.errs.length === 0, JSON.stringify(again) + t.errs.join(' | '));
    await t.close();
  }

  // 12. Duplicate names inside a part are kept apart as the Worker keeps them (photo-01, photo-01-2, photo-01-3), counted per run:
  //     a second run of the photo step starts the names over.
  {
    const list = [{ folder: 'stories/bulgaria', name: 'photo-01', url: `${CDN}/p1.png` }, { folder: 'stories/bulgaria', name: 'photo-01', url: `${CDN}/p1-again.png` },
      { folder: 'stories/bulgaria', name: 'photo-01', url: `${CDN}/p1-third.png` }, { folder: 'profile', name: 'avatar', url: `${CDN}/avatar.jpg` }];
    const expected = ['that-layover-life/photos/profile/avatar.jpg', 'that-layover-life/photos/stories/bulgaria/photo-01-2.png', 'that-layover-life/photos/stories/bulgaria/photo-01-3.png', 'that-layover-life/photos/stories/bulgaria/photo-01.png'];
    const t = await open(390, prepared(list));
    await startPhotos(t);
    for (let run = 1; run <= 2; run += 1) {
      await t.waitSave(10000);
      await t.page.click(SAVE);
      await t.waitFor((s) => s.state === 'done' || s.state === 'error', 10000);
      await t.page.waitForTimeout(500);
      if (run === 1) await t.page.click(PHOTOS);
    }
    const parts = await t.parts();
    check('duplicate names: two runs, one part each, every CRC right', parts.length === 2 && parts.every((p) => p.name === 'that-layover-life-photos-part-1.zip' && p.entries.every((e) => e.crcOk)), JSON.stringify(parts.map((p) => [p.name, p.entries.length])));
    check('duplicate names: the three photo-01 files are photo-01, photo-01-2 and photo-01-3 in the first run', parts.length === 2 && parts[0].entries.map((e) => e.name).sort().join() === expected.join(), parts.length === 2 ? parts[0].entries.map((e) => e.name).sort().join() : '');
    check('duplicate names: the second run starts the names over, nothing is lost', parts.length === 2 && parts[1].entries.map((e) => e.name).sort().join() === expected.join(), parts.length === 2 ? parts[1].entries.map((e) => e.name).sort().join() : '');
    const done = await t.read();
    const ev = await t.page.evaluate(() => window.__ev);
    check('duplicate names: both runs count four photos, no page errors', done.state === 'done' && done.msg === 'Done. 2 stories, 4 photos.' && ev.length === 4 && JSON.stringify(ev[3]) === JSON.stringify(['photos_complete', { division: 'tll', photos: 4, parts: 1, links: 0 }]) && t.errs.length === 0, JSON.stringify(done) + t.errs.join(' | '));
    await t.close();
  }

  // 13. Parts that fill by bytes: ten 12-byte photos with a 36-byte part make parts of 3, 3, 3 and 1, and K reads 4 from the first
  //     part on (the average photo so far says three fit), instead of growing by one at every part.
  {
    check('the source packs a part at 80 MB', /PART_BYTES=80\*1024\*1024/.test(layer) && SMALL_PARTS !== layer);
    const t = await open(390, prepared(pngList(10)), { src: SMALL_PARTS });
    await startPhotos(t);
    const offers = [];
    for (let n = 1; n <= 4; n += 1) {
      const w = await t.waitSave(10000);
      offers.push({ save: w.save && w.save.text, line: w.pmsg });
      if (w.save) await t.page.click(SAVE);
    }
    const done = await t.waitFor((s) => s.state === 'done' || s.state === 'error', 10000);
    await t.page.waitForTimeout(500);
    check('byte-first run: K reads 4 on every part', offers.map((o) => o.save).join() === 'Save part 1 of 4,Save part 2 of 4,Save part 3 of 4,Save part 4 of 4' && offers.map((o) => o.line).join() === 'Part 1 of 4 is ready to save.,Part 2 of 4 is ready to save.,Part 3 of 4 is ready to save.,Part 4 of 4 is ready to save.', JSON.stringify(offers));
    const parts = await t.parts();
    check('byte-first run: four parts of 3, 3, 3 and 1, every CRC right', parts.map((p) => p.entries.length).join() === '3,3,3,1' && parts.every((p) => p.entries.every((e) => e.crcOk)), JSON.stringify(parts.map((p) => [p.name, p.entries.length])));
    const all = parts.flatMap((p) => p.entries.map((e) => e.name));
    check('byte-first run: every photo is in exactly one part, done after the fourth tap', all.length === 10 && new Set(all).size === 10 && done.state === 'done' && done.pmsg === '10 photos in 4 parts.' && t.errs.length === 0, `${all.length} files, ${JSON.stringify(done)} ${t.errs.join(' | ')}`);
    await t.close();
  }

  await browser.close();
  console.log(failures ? `${failures} check(s) failed` : 'all checks passed');
  process.exitCode = failures ? 1 : 0;
})();
