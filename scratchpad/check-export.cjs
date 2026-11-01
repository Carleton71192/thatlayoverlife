// Download everything, Phase 1B (two steps): the /account card against a mocked Worker. Confirms that "Download everything"
// posts the member's map to POST /export/prepare and then navigates to the records zip link (window.location.assign, a real
// download in Chromium), that the card then offers "Download your photos", that the photo step fetches every photo through
// GET /export/photo?t=&u= four at a time, packs them with JSZip (served here from the local copy of 3.10.1) in parts of 25,
// saves the first part at once and every later part only on its own "Save part N of K" tap (nothing is fetched while a part
// waits), with the progress, waiting and done strings, the gtag events, the styled card with no blank lines, a stalled photo cut
// off and listed as a link, a packing failure that stops the run, and the error states.
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
const READY = 'Your copy is on its way. If nothing happened, tap here. The link works for 15 minutes.';
const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0xff, 0xd9]);
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4]);
// The stalled-photo case runs the layer with its 90 s limit shortened to 1.5 s; the source itself must still say 90 s.
const SHORT = layer.replace('PHOTO_MS=90*1000', 'PHOTO_MS=1500');
// The packing-failure case serves JSZip with generateAsync rejecting, as it would when a phone runs out of memory.
const NO_MEMORY = `${jszip};JSZip.prototype.generateAsync=function(){return Promise.reject(new Error('no memory'));};`;

let failures = 0;
const check = (name, ok, detail) => { console.log(`${ok ? 'ok   ' : 'FAIL '}${name}${detail ? `: ${detail}` : ''}`); if (!ok) failures += 1; };
const photoList = (n) => Array.from({ length: n }, (_, i) => (i === 0 ? { folder: 'profile', name: 'avatar', url: `${CDN}/avatar.jpg` }
  : { folder: 'stories/bulgaria', name: `photo-${String(i).padStart(2, '0')}`, url: `${CDN}/p${i}.png` }));

(async () => {
  const { zipStream, collectBytes } = await import('../src/zip.js');
  const { readZip, textOf } = await import('../test/zip-read.js');
  const zipBytes = Buffer.from(await collectBytes(zipStream(async (z) => { await z.file('that-layover-life/README.txt', 'test copy'); })));
  const browser = await chromium.launch();

  async function open(width, prepare, { photoStatus = () => 200, jszipOk = true, src = layer, jszipSrc = jszip, stall = () => false } = {}) {
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
    const read = () => page.evaluate(() => { const b = document.getElementById('tll-exp'); if (!b) return null; const ms = b.querySelectorAll('.tll-exp-msg'); const bs = b.querySelectorAll('button'); const a = ms[0].querySelector('a');
      return { state: b.getAttribute('data-state'), msg: ms[0].innerText, pmsg: ms[1].innerText, msgHidden: ms[0].hidden, pmsgHidden: ms[1].hidden, disabled: bs[0].disabled,
        photoBtn: bs[1].hidden ? null : { text: bs[1].textContent, disabled: bs[1].disabled }, save: bs[2].hidden ? null : { text: bs[2].textContent, disabled: bs[2].disabled }, href: a ? a.href : '' }; });
    const states = []; const progress = new Set();
    const note = (s) => { if (s.pmsg) progress.add(s.pmsg); if (!states.length || states[states.length - 1].state !== s.state) states.push(s); };
    const track = async (ms) => { const end = Date.now() + ms; while (Date.now() < end) { const s = await read(); if (s) note(s); await page.waitForTimeout(25); } };
    const waitFor = async (pred, ms) => { const end = Date.now() + ms; while (Date.now() < end) { const s = await read(); if (s) { note(s); if (pred(s)) return s; } await page.waitForTimeout(25); } return read(); };
    await page.goto('https://www.thatlayover.life/account');
    await page.waitForSelector('#tll-exp', { timeout: 6000 });
    // Every change of the photo-step line, recorded inside the page: a poll from outside would miss the quick ones.
    await page.evaluate(() => { window.__pm = []; const node = document.querySelectorAll('#tll-exp .tll-exp-msg')[1]; new MutationObserver(() => { const t = node.textContent; if (t && window.__pm[window.__pm.length - 1] !== t) window.__pm.push(t); }).observe(node, { childList: true, characterData: true, subtree: true }); });
    await track(150);
    const lines = () => page.evaluate(() => window.__pm);
    // JSZip writes a directory entry for each folder, as the old browser build did; only the files matter here.
    const parts = async () => { const out = []; for (const d of downloads) { const name = d.suggestedFilename(); if (!/photos-part/.test(name)) continue; const bytes = fs.readFileSync(await d.path()); out.push({ name, entries: readZip(new Uint8Array(bytes)).filter((e) => !e.name.endsWith('/')) }); } return out; };
    const close = async () => { for (const r of stalled) await r.abort('failed').catch(() => {}); await ctx.close(); };
    return { ctx, page, nav, bodies, errs, photoReqs, downloads, states, progress, track, read, waitFor, parts, lines, close, max: () => maxInflight };
  }
  const prepared = (list) => (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, url: ZIP_URL, token: TOKEN, expiresAt: '2026-11-01T10:15:00.000Z', stories: 2, photos: list.length, photoList: list }) });
  const SAVE = '#tll-exp button:nth-of-type(3)';

  // 1. The two steps at phone and desktop widths: three photos, one of which the proxy refuses.
  for (const width of [390, 1440]) {
    const list = photoList(3);
    const t = await open(width, prepared(list), { photoStatus: (u) => (u.endsWith('/p2.png') ? 502 : 200) });
    const idle = await t.read();
    await t.page.screenshot({ path: `scratchpad/shots-1031/export_idle_${width}.png` });
    check(`${width} the card is styled: the style element is in the head and the card shows its border and button colors`, await t.page.evaluate(() => { const s = document.getElementById('tll-export-v1'); const b = document.getElementById('tll-exp'); const cs = getComputedStyle(b); const bt = getComputedStyle(b.querySelector('button'));
      return !!s && s.tagName === 'STYLE' && document.querySelectorAll('#tll-export-v1').length === 1 && cs.borderTopColor === 'rgb(224, 218, 206)' && cs.maxWidth === '760px' && bt.backgroundColor === 'rgb(200, 50, 91)' && bt.minHeight === '44px'; }));
    check(`${width} idle: both message lines are hidden, no blank space`, idle.state === 'idle' && idle.msgHidden && idle.pmsgHidden && idle.save === null, JSON.stringify(idle));
    const download = t.page.waitForEvent('download', { timeout: 8000 }).then((d) => d.suggestedFilename()).catch(() => null);
    await t.page.click('#tll-exp button');
    const ready = await t.waitFor((s) => s.state === 'ready', 4000);
    await t.page.screenshot({ path: `scratchpad/shots-1031/export_ready_${width}.png` });
    check(`${width} states idle, preparing, ready`, t.states.map((s) => s.state).join(' > ') === 'idle > preparing > ready', t.states.map((s) => s.state).join(' > '));
    const by = Object.fromEntries(t.states.map((s) => [s.state, s]));
    check(`${width} preparing copy, disabled button, no photo button yet`, by.preparing && by.preparing.msg === 'Gathering your stories and records…' && !by.preparing.msgHidden && by.preparing.disabled && by.preparing.photoBtn === null, JSON.stringify(by.preparing));
    check(`${width} ready copy with the tap-here link and the photo button; the photo line still hidden`, ready.msg === READY && ready.href === ZIP_URL && !ready.disabled && ready.photoBtn && ready.photoBtn.text === 'Download your photos' && !ready.photoBtn.disabled && ready.pmsgHidden && ready.save === null, JSON.stringify(ready));
    check(`${width} prepare was a POST with the Bearer token and the map`, t.bodies.length === 1 && t.bodies[0].method === 'POST' && t.bodies[0].auth === 'Bearer tok' && JSON.parse(t.bodies[0].body).states.v === 2, JSON.stringify(t.bodies));
    check(`${width} location.assign navigated to the zip url`, t.nav.length === 1 && t.nav[0].url === ZIP_URL && t.nav[0].navigation && t.nav[0].method === 'GET', JSON.stringify(t.nav));
    check(`${width} the browser got the records zip as a file download`, (await download) === 'that-layover-life-nancy-2026-11-01.zip', String(await download));
    check(`${width} no JSZip before the photo button is pressed`, await t.page.evaluate(() => !document.querySelector('script[src*="jszip"]') && !window.JSZip));
    let ev = await t.page.evaluate(() => window.__ev);
    check(`${width} gtag download_everything then download_complete (no photos parameter) when the link is followed`, JSON.stringify(ev) === JSON.stringify([['download_everything', { division: 'tll' }], ['download_complete', { division: 'tll' }]]), JSON.stringify(ev));

    // Step two: one part, saved on the tap itself.
    await t.page.click('#tll-exp button:nth-of-type(2)');
    const done = await t.waitFor((s) => s.state === 'done' || s.state === 'error', 15000);
    await t.page.waitForTimeout(500);
    await t.page.screenshot({ path: `scratchpad/shots-1031/export_done_${width}.png` });
    check(`${width} states then photos, done`, t.states.map((s) => s.state).join(' > ') === 'idle > preparing > ready > photos > done', t.states.map((s) => s.state).join(' > '));
    const seen = await t.lines();
    check(`${width} progress Photos 0 of 3… through Photos 3 of 3…, then the parts line`, seen.join(' | ') === 'Photos 0 of 3… | Photos 1 of 3… | Photos 2 of 3… | Photos 3 of 3… | 2 photos in 1 part.', seen.join(' | '));
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
    await t.page.click('#tll-exp .tll-exp-msg a').catch(() => {});
    await t.page.waitForTimeout(400);
    check(`${width} the done line has no link; the tap-here link was only in the ready state`, t.nav.length === 1, JSON.stringify(t.nav));
    ev = await t.page.evaluate(() => window.__ev);
    check(`${width} photos_complete with the real counts when the photo step ends`, ev.length === 3 && JSON.stringify(ev[2]) === JSON.stringify(['photos_complete', { division: 'tll', photos: 2, parts: 1, links: 1 }]), JSON.stringify(ev));
    check(`${width} no page errors`, t.errs.length === 0, t.errs.join(' | '));
    await t.close();
  }

  // 2. Parts: 30 photos become part 1 (25, saved at once) and part 2 (5), which waits for its own tap; four fetches at a time at most.
  {
    const list = photoList(30);
    const t = await open(390, prepared(list));
    await t.page.click('#tll-exp button');
    await t.waitFor((s) => s.state === 'ready', 4000);
    await t.page.click('#tll-exp button:nth-of-type(2)');
    const waiting = await t.waitFor((s) => s.save !== null || s.state !== 'photos', 30000);
    const reqsAtWait = t.photoReqs.length;
    await t.page.waitForTimeout(700);
    await t.page.screenshot({ path: 'scratchpad/shots-1031/export_part_390.png' });
    const still = await t.read();
    check('30 photos: part 2 waits for its tap with the save button, the waiting line and no done line', waiting.state === 'photos' && waiting.save && waiting.save.text === 'Save part 2 of 2' && !waiting.save.disabled && waiting.pmsg === 'Part 2 of 2 is ready to save.' && waiting.msg === READY && waiting.disabled && waiting.photoBtn && waiting.photoBtn.disabled, JSON.stringify(waiting));
    check('30 photos: only part 1 has been saved so far', t.downloads.filter((d) => /photos-part/.test(d.suggestedFilename())).length === 1 && t.downloads.some((d) => d.suggestedFilename() === 'that-layover-life-photos-part-1.zip'), t.downloads.map((d) => d.suggestedFilename()).join());
    check('30 photos: nothing changes while the part waits', still.state === 'photos' && still.save && still.pmsg === 'Part 2 of 2 is ready to save.' && t.photoReqs.length === reqsAtWait && reqsAtWait === 30, `${t.photoReqs.length} requests, ${JSON.stringify(still)}`);
    await t.page.click(SAVE);
    const done = await t.waitFor((s) => s.state === 'done' || s.state === 'error', 10000);
    await t.page.waitForTimeout(800);
    check('30 photos: done line after the tap, save button gone', done.state === 'done' && done.msg === 'Done. 2 stories, 30 photos.' && done.pmsg === '30 photos in 2 parts.' && done.save === null, JSON.stringify(done));
    check('30 photos: four at a time at most, never more', t.max() <= 4 && t.max() >= 2, String(t.max()));
    const seen = await t.lines();
    check('30 photos: progress counted every photo in order, then the waiting line, then the parts line', seen.slice(0, 31).join('|') === Array.from({ length: 31 }, (_, i) => `Photos ${i} of 30…`).join('|') && seen.slice(31).join('|') === 'Part 2 of 2 is ready to save.|30 photos in 2 parts.', `${seen.length} lines, tail ${seen.slice(30).join('|')}`);
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

  // 3. Three parts: 55 photos. Part 1 saves at once; parts 2 and 3 each wait for a tap, and fetching pauses while they wait.
  {
    const list = photoList(55);
    const t = await open(390, prepared(list));
    await t.page.click('#tll-exp button');
    await t.waitFor((s) => s.state === 'ready', 4000);
    await t.page.click('#tll-exp button:nth-of-type(2)');
    const second = await t.waitFor((s) => s.save !== null || s.state !== 'photos', 30000);
    const reqsAtSecond = t.photoReqs.length;
    await t.page.waitForTimeout(600);
    check('55 photos: part 2 of 3 waits, with at most three photos fetched ahead for part 3', second.state === 'photos' && second.save && second.save.text === 'Save part 2 of 3' && second.pmsg === 'Part 2 of 3 is ready to save.' && reqsAtSecond >= 50 && reqsAtSecond <= 53 && t.photoReqs.length === reqsAtSecond, `${reqsAtSecond} then ${t.photoReqs.length} requests, ${JSON.stringify(second)}`);
    check('55 photos: one part saved before the first tap', t.downloads.filter((d) => /photos-part/.test(d.suggestedFilename())).length === 1, t.downloads.map((d) => d.suggestedFilename()).join());
    await t.page.click(SAVE);
    const resumed = await t.waitFor((s) => s.pmsg !== 'Part 2 of 3 is ready to save.', 4000);
    check('55 photos: after the tap the progress line is back and fetching resumes', resumed.state === 'photos' && /^Photos \d+ of 55…$/.test(resumed.pmsg) && resumed.save === null, JSON.stringify(resumed));
    const third = await t.waitFor((s) => s.save !== null || s.state !== 'photos', 30000);
    await t.page.waitForTimeout(400);
    check('55 photos: part 3 of 3 waits in turn, every photo fetched, two parts saved', third.state === 'photos' && third.save && third.save.text === 'Save part 3 of 3' && third.pmsg === 'Part 3 of 3 is ready to save.' && t.photoReqs.length === 55 && t.downloads.filter((d) => /photos-part/.test(d.suggestedFilename())).length === 2, JSON.stringify(third));
    await t.page.click(SAVE);
    const done = await t.waitFor((s) => s.state === 'done' || s.state === 'error', 10000);
    await t.page.waitForTimeout(800);
    check('55 photos: done after the second tap', done.state === 'done' && done.msg === 'Done. 2 stories, 55 photos.' && done.pmsg === '55 photos in 3 parts.' && done.save === null, JSON.stringify(done));
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
    await t.page.click('#tll-exp button');
    const ready = await t.waitFor((s) => s.state === 'ready', 4000);
    await t.track(600);
    check('no photos: ready line without a photo button', ready.state === 'ready' && ready.msg === READY && ready.photoBtn === null && ready.pmsgHidden && t.states.map((s) => s.state).join(' > ') === 'idle > preparing > ready', JSON.stringify(ready));
    await t.close();
  }

  // 5. The Worker says no: its message shows, the button is free again, nothing navigates.
  {
    const t = await open(390, (route) => route.fulfill({ status: 429, contentType: 'application/json', body: JSON.stringify({ error: WORKER_ERROR }) }));
    await t.page.click('#tll-exp button');
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
    await t.page.click('#tll-exp button');
    await t.track(1000);
    const last = t.states[t.states.length - 1];
    check('fallback copy after a network failure', last.state === 'error' && last.msg === FALLBACK && !last.disabled, JSON.stringify(last));
    await t.page.click('#tll-exp button');
    await t.track(600);
    check('the button can be pressed again', t.states.filter((s) => s.state === 'preparing').length === 2 && t.bodies.length === 2, t.states.map((s) => s.state).join(' > '));
    await t.close();
  }

  // 7. JSZip does not load: the photo step shows the fallback and its button is free again; the records step is untouched.
  {
    const t = await open(390, prepared(photoList(2)), { jszipOk: false });
    await t.page.click('#tll-exp button');
    await t.waitFor((s) => s.state === 'ready', 4000);
    await t.page.click('#tll-exp button:nth-of-type(2)');
    const last = await t.waitFor((s) => s.state === 'error', 6000);
    check('photo step error when JSZip fails to load', last.state === 'error' && last.pmsg === FALLBACK && last.msg === READY && last.photoBtn && !last.photoBtn.disabled && !last.disabled && last.save === null, JSON.stringify(last));
    check('no photo was fetched without JSZip', t.photoReqs.length === 0 && t.errs.length === 0, JSON.stringify(t.photoReqs) + t.errs.join(' | '));
    await t.close();
  }

  // 8. A photo whose answer never comes: the layer's own limit cuts it off, it is listed as a link, and the run finishes.
  {
    check('the source gives each photo fetch 90 s', /PHOTO_MS=90\*1000/.test(layer) && SHORT !== layer);
    const list = photoList(3);
    const t = await open(390, prepared(list), { src: SHORT, stall: (u) => u.endsWith('/p2.png') });
    await t.page.click('#tll-exp button');
    await t.waitFor((s) => s.state === 'ready', 4000);
    const t0 = Date.now();
    await t.page.click('#tll-exp button:nth-of-type(2)');
    const done = await t.waitFor((s) => s.state === 'done' || s.state === 'error', 10000);
    const took = Date.now() - t0;
    await t.page.waitForTimeout(400);
    check('stalled photo: cut off after the limit and listed as a link, the other two packed', done.state === 'done' && done.msg === 'Done. 2 stories, 2 photos (1 listed as links).' && done.pmsg === '2 photos in 1 part.' && took >= 1400 && took < 6000, `${took} ms, ${JSON.stringify(done)}`);
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
    await t.page.click('#tll-exp button');
    await t.waitFor((s) => s.state === 'ready', 4000);
    await t.page.click('#tll-exp button:nth-of-type(2)');
    const err = await t.waitFor((s) => s.state === 'error', 15000);
    const reqsAtError = t.photoReqs.length;
    await t.page.waitForTimeout(1200);
    const later = await t.read();
    check('packing failure: error state with the fallback line, buttons free, no save button', err.state === 'error' && err.pmsg === FALLBACK && err.msg === READY && !err.disabled && err.photoBtn && !err.photoBtn.disabled && err.save === null, JSON.stringify(err));
    check('packing failure: the line stays, no worker wrote a progress line over it, no more fetches', later.state === 'error' && later.pmsg === FALLBACK && t.photoReqs.length === reqsAtError && reqsAtError <= 28, `${reqsAtError} then ${t.photoReqs.length} requests, ${JSON.stringify(later)}`);
    const seen = await t.lines();
    check('packing failure: the fallback is the last line recorded', seen[seen.length - 1] === FALLBACK, seen.slice(-3).join('|'));
    check('packing failure: nothing saved, no page errors', t.downloads.filter((d) => /photos-part/.test(d.suggestedFilename())).length === 0 && t.errs.length === 0, t.errs.join(' | '));
    await t.close();
  }

  await browser.close();
  console.log(failures ? `${failures} check(s) failed` : 'all checks passed');
  process.exitCode = failures ? 1 : 0;
})();
