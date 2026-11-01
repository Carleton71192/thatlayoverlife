// Download everything, Phase 1B: the /account card against a mocked Worker. Confirms the five card states (idle, preparing,
// ready, error, done), that the button sends the member's map to POST /export/prepare, that the page then navigates to the
// returned zip link (a real download in Chromium), that "tap here" repeats the same navigation, and the two gtag events.
// Run from the repo root: node scratchpad/check-export.cjs   (screenshots land in scratchpad/shots-1031/export_*.png)
const { chromium } = require('playwright');
const fs = require('fs');

const layer = fs.readFileSync('src/site-layers/tll-export-v1.js', 'utf8');
const WORKER = 'https://tll-travel-wire.thatlayoverlife.workers.dev';
const ZIP_URL = `${WORKER}/export/zip?t=${'ab'.repeat(16)}`;
const PAGE = '<main><section><h1>Account</h1></section></main>';
const MS = 'window.$memberstackDom={getMemberCookie:()=>"tok",getMemberJSON:()=>Promise.resolve({data:{tllStates:{v:2,travelers:[{id:"me",name:"Nancy"}],states:{"392":{me:"lived"}}}}})};'
  + 'window.gtag=function(){(window.__ev=window.__ev||[]).push([arguments[1],arguments[2]]);};';
const WORKER_ERROR = 'That is ten downloads in an hour. Try again a little later.';
const FALLBACK = 'That did not download. Not you, us. Try again?';

let failures = 0;
const check = (name, ok, detail) => { console.log(`${ok ? 'ok   ' : 'FAIL '}${name}${detail ? `: ${detail}` : ''}`); if (!ok) failures += 1; };

(async () => {
  const { zipStream, collectBytes } = await import('../src/zip.js');
  const zipBytes = Buffer.from(await collectBytes(zipStream(async (z) => { await z.file('that-layover-life/README.txt', 'test copy'); })));
  const browser = await chromium.launch();

  async function open(width, prepare) {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, acceptDownloads: true, locale: 'en-DK' });
    const page = await ctx.newPage();
    const nav = []; const bodies = []; const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    await page.route('**/*', async (route) => {
      const req = route.request(); const u = new URL(req.url());
      if (u.hostname === 'www.thatlayover.life') {
        return route.fulfill({ contentType: 'text/html; charset=utf-8', body: `<!doctype html><html><head><meta charset=utf-8><meta name=viewport content="width=device-width"></head><body style="margin:0">${PAGE}<script>${MS}<\/script><script>${layer}<\/script></body></html>` });
      }
      if (u.pathname === '/export/prepare') { bodies.push({ method: req.method(), auth: req.headers().authorization, body: req.postData() }); await new Promise((r) => setTimeout(r, 300)); return prepare(route); }
      if (u.pathname === '/paw/waitlist/export') return route.fulfill({ status: 403, contentType: 'application/json', body: '{"error":"Owner only."}' });
      if (u.pathname === '/export/zip') {
        nav.push({ url: req.url(), navigation: req.isNavigationRequest(), method: req.method() });
        return route.fulfill({ status: 200, headers: { 'content-type': 'application/zip', 'content-disposition': 'attachment; filename="that-layover-life-nancy-2026-11-01.zip"', 'cache-control': 'no-store' }, body: zipBytes });
      }
      return route.fulfill({ status: 404, body: '' });
    });
    const read = () => page.evaluate(() => { const b = document.getElementById('tll-exp'); if (!b) return null; const a = b.querySelector('.tll-exp-msg a');
      return { state: b.getAttribute('data-state'), msg: b.querySelector('.tll-exp-msg').innerText, disabled: b.querySelector('button').disabled, href: a ? a.href : '' }; });
    const states = [];
    const track = async (ms) => { const end = Date.now() + ms; while (Date.now() < end) { const s = await read(); if (s && (!states.length || states[states.length - 1].state !== s.state)) states.push(s); await page.waitForTimeout(40); } };
    await page.goto('https://www.thatlayover.life/account');
    await page.waitForSelector('#tll-exp', { timeout: 6000 });
    await track(150);
    return { ctx, page, nav, bodies, errs, states, track, read };
  }

  // 1. The happy path at phone and desktop widths.
  for (const width of [390, 1440]) {
    const t = await open(width, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, url: ZIP_URL, expiresAt: '2026-11-01T10:15:00.000Z', stories: 2, photos: 3 }) }));
    const download = t.page.waitForEvent('download', { timeout: 8000 }).then((d) => d.suggestedFilename()).catch(() => null);
    await t.page.click('#tll-exp button');
    await t.track(1200);
    await t.page.screenshot({ path: `scratchpad/shots-1031/export_ready_${width}.png` });
    await t.track(5000);
    await t.page.screenshot({ path: `scratchpad/shots-1031/export_done_${width}.png` });
    const seq = t.states.map((s) => s.state);
    check(`${width} states idle, preparing, ready, done`, seq.join(' > ') === 'idle > preparing > ready > done', seq.join(' > '));
    const by = Object.fromEntries(t.states.map((s) => [s.state, s]));
    check(`${width} preparing copy and disabled button`, by.preparing && by.preparing.msg === 'Gathering your stories and records…' && by.preparing.disabled, JSON.stringify(by.preparing));
    check(`${width} ready copy with the tap-here link`, by.ready && by.ready.msg === 'Your download has started. If nothing happened, tap here. The link works for 15 minutes.' && by.ready.href === ZIP_URL && by.ready.disabled, JSON.stringify(by.ready));
    check(`${width} done copy keeps the link and frees the button`, by.done && by.done.msg === 'Done. 2 stories, 3 photos. If nothing happened, tap here. The link works for 15 minutes.' && by.done.href === ZIP_URL && !by.done.disabled, JSON.stringify(by.done));
    check(`${width} prepare was a POST with the Bearer token and the map`, t.bodies.length === 1 && t.bodies[0].method === 'POST' && t.bodies[0].auth === 'Bearer tok' && JSON.parse(t.bodies[0].body).states.v === 2, JSON.stringify(t.bodies));
    check(`${width} location.assign navigated to the zip url`, t.nav.length === 1 && t.nav[0].url === ZIP_URL && t.nav[0].navigation && t.nav[0].method === 'GET', JSON.stringify(t.nav));
    check(`${width} the browser got a file download`, (await download) === 'that-layover-life-nancy-2026-11-01.zip', String(await download));
    await t.page.click('#tll-exp .tll-exp-msg a');
    await t.page.waitForTimeout(400);
    check(`${width} tap here repeats the same navigation`, t.nav.length === 2 && t.nav[1].url === ZIP_URL && t.nav[1].navigation, JSON.stringify(t.nav));
    const ev = await t.page.evaluate(() => window.__ev);
    check(`${width} gtag download_everything then download_complete`, JSON.stringify(ev) === JSON.stringify([['download_everything', { division: 'tll' }], ['download_complete', { division: 'tll', photos: 3 }]]), JSON.stringify(ev));
    check(`${width} no page errors`, t.errs.length === 0, t.errs.join(' | '));
    check(`${width} no JSZip script`, await t.page.evaluate(() => !document.querySelector('script[src*="jszip"]') && !window.JSZip));
    await t.ctx.close();
  }

  // 2. The Worker says no: its message shows, the button is free again, nothing navigates.
  {
    const t = await open(390, (route) => route.fulfill({ status: 429, contentType: 'application/json', body: JSON.stringify({ error: WORKER_ERROR }) }));
    await t.page.click('#tll-exp button');
    await t.track(1000);
    await t.page.screenshot({ path: 'scratchpad/shots-1031/export_error_390.png' });
    const seq = t.states.map((s) => s.state);
    const last = t.states[t.states.length - 1];
    check('error state after a Worker error', seq.join(' > ') === 'idle > preparing > error', seq.join(' > '));
    check('error shows the Worker message and frees the button', last.msg === WORKER_ERROR && !last.disabled && last.href === '', JSON.stringify(last));
    check('no navigation on error', t.nav.length === 0 && t.errs.length === 0, JSON.stringify(t.nav) + t.errs.join(' | '));
    await t.ctx.close();
  }

  // 3. The network fails: the fallback copy, not the browser's own words.
  {
    const t = await open(390, (route) => route.abort('failed'));
    await t.page.click('#tll-exp button');
    await t.track(1000);
    const last = t.states[t.states.length - 1];
    check('fallback copy after a network failure', last.state === 'error' && last.msg === FALLBACK && !last.disabled, JSON.stringify(last));
    // A second press starts over.
    await t.page.click('#tll-exp button');
    await t.track(600);
    check('the button can be pressed again', t.states.filter((s) => s.state === 'preparing').length === 2 && t.bodies.length === 2, t.states.map((s) => s.state).join(' > '));
    await t.ctx.close();
  }

  await browser.close();
  console.log(failures ? `${failures} check(s) failed` : 'all checks passed');
  process.exitCode = failures ? 1 : 0;
})();
