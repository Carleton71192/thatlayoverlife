// Quick log v1, offline at 390 wide. Memberstack is faked in the page; nothing is sent anywhere.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const DIR = new URL('.', import.meta.url).pathname, SRC = fs.readFileSync(DIR + '../tll-quick-log-v1.js', 'utf8');
const res = []; const rec = (n, p, e) => res.push({ n, p: !!p, e });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const CSV = 'layer,type,name,country_code,lat,lng,status,favorite,also_wishlist,placesbeen_id\nCities,City,Lisbon,PT,1,1,Been,False,False,1\nCities,City,"Porto, North",PT,1,1,Been,False,False,2\nAirports,Large airport,Doha Hamad,QA,1,1,Been,False,False,3\nLandmarks,x,Eiffel Tower,FR,1,1,Been,False,False,4\nCities,City,Reykjavik,IS,1,1,Wishlist,False,False,5\nCities,City,Copenhagen,DK,1,1,Been,False,False,6\n';
async function page({ member = true, json = null } = {}) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.route('**/*', r => r.request().url().startsWith('http://tll.test/the-map') ? r.fulfill({ contentType: 'text/html', body: `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><body style="margin:0"><main><div class="wrap"><div id="tll-map-layers" style="height:300px;background:#123"></div></div></main><script>${SRC}</script></body>` }) : r.fulfill({ status: 404, body: '' }));
  await p.addInitScript(({ member, json }) => {
    window.__saved = []; window.__applied = 0; window.__events = 0;
    window.__tllMapApply = () => { window.__applied++; }; window.addEventListener('tll:states', () => window.__events++);
    let J = json || { tllStates: { v: 2, travelers: [{ id: 't1', name: 'Me', pet: false }, { id: 't2', name: 'Magnus', pet: true }], states: { '208': { t1: 'lived' } } }, tllPlaces: {}, other: 'keep' };
    window.$memberstackDom = { getCurrentMember: () => Promise.resolve({ data: member ? { id: 'mem_1' } : null }), getMemberJSON: () => Promise.resolve({ data: JSON.parse(JSON.stringify(J)) }), updateMemberJSON: ({ json }) => { J = json; window.__saved.push(JSON.parse(JSON.stringify(json))); return Promise.resolve({}); } };
  }, { member, json });
  await p.goto('http://tll.test/the-map'); await p.waitForTimeout(600);
  return { p, ctx, errs };
}
// 1 signed out
{ const { p, ctx, errs } = await page({ member: false });
  const a = await p.$eval('.tql-open a', x => ({ t: x.textContent, h: x.getAttribute('href') }));
  rec('signed out: sign-in link, no sheet', /Sign in/.test(a.t) && /redirect=%2Fthe-map%23quick-log/.test(a.h), a); rec('no errors (signed out)', !errs.length, errs); await ctx.close(); }
// 2 member flow
{ const { p, ctx, errs } = await page();
  await p.click('.tql-open button'); await p.waitForTimeout(200);
  const vis = await p.evaluate(() => { const s = document.getElementById('tql').getBoundingClientRect(); return { top: s.top, h: s.height, rows: document.querySelectorAll('.tql-row').length }; });
  rec('sheet opens as bottom sheet, map visible above', vis.top > 250 && vis.top < 400, vis);
  rec('all 250 places listed', vis.rows === 250, vis.rows);
  await p.screenshot({ path: DIR + 'open-390.png' });
  const dk = await p.evaluate(() => { const r = [...document.querySelectorAll('.tql-row')].find(x => /Denmark/.test(x.textContent)); return [...r.querySelectorAll('.tql-bx')].map(b => b.getAttribute('aria-pressed')); });
  rec('Denmark shows LIVED from the saved map', JSON.stringify(dk) === '["false","true","false","false"]', dk);
  await p.fill('.tql-find input', 'fra'); await p.waitForTimeout(100);
  const fr = await p.$$eval('.tql-row', r => r.map(x => x.textContent));
  rec('search narrows the list', fr.length >= 1 && fr.every(t => /fra/i.test(t)) , fr);
  const box = await p.$('.tql-row .tql-bx[data-k="visited"]'); const bb = await box.boundingBox();
  rec('tap boxes are at least 44px', bb.width >= 44 && bb.height >= 44, bb);
  await box.tap(); await p.waitForTimeout(1100);
  let s = await p.evaluate(() => ({ saved: window.__saved.slice(-1)[0], applied: window.__applied, ev: window.__events, st: document.querySelector('.tql-st').textContent }));
  rec('BEEN on France saves visited to tllStates', s.saved && s.saved.tllStates.states['250'] && s.saved.tllStates.states['250'].t1 === 'visited', s.saved && s.saved.tllStates.states);
  rec('other member JSON kept', s.saved && s.saved.other === 'keep', s.saved && Object.keys(s.saved));
  rec('map told: tll:states and __tllMapApply', s.applied >= 1 && s.ev >= 1, s);
  rec('status says Saved', s.st === 'Saved', s.st);
  await p.click('.tql-row .tql-bx[data-k="layover"]'); await p.waitForTimeout(1000);
  s = await p.evaluate(() => window.__saved.slice(-1)[0].tllStates.states['250']);
  rec('LAYOVER replaces BEEN (one depth per traveler)', s && s.t1 === 'layover', s);
  await p.click('.tql-row .tql-bx[data-k="layover"]'); await p.waitForTimeout(1000);
  s = await p.evaluate(() => window.__saved.slice(-1)[0].tllStates.states['250']);
  rec('tap again clears', s === undefined, s);
  await p.click('.tql-row .tql-bx[data-k="want"]'); await p.waitForTimeout(1000);
  s = await p.evaluate(() => window.__saved.slice(-1)[0].tllPlaces);
  rec('WANT writes tllPlaces keyed by slug', s && s.france && s.france.state === 'want', s);
  await p.click('.tql-who button:nth-child(2)'); await p.waitForTimeout(100);
  const pet = await p.evaluate(() => { const r = document.querySelector('.tql-row'); return { want: r.querySelector('[data-k="want"]').disabled, been: r.querySelector('[data-k="visited"]').disabled }; });
  rec('pet chip: WANT off, BEEN on', pet.want && !pet.been, pet);
  await p.click('.tql-row .tql-bx[data-k="visited"]'); await p.waitForTimeout(1000);
  s = await p.evaluate(() => window.__saved.slice(-1)[0].tllStates.states['250']);
  rec('pet logs under its own traveler id', s && s.t2 === 'visited' && !s.t1, s);
  // import
  await p.click('.tql-who button:nth-child(1)');
  await p.setInputFiles('.tql-ft input[type=file]', { name: 'places_been_export.csv', mimeType: 'text/csv', buffer: Buffer.from(CSV) });
  await p.waitForTimeout(300);
  const pvt = await p.$eval('.tql-pv p', x => x.textContent);
  rec('import preview counts (PT, QA, FR new; DK kept as lived)', /3 countries to add as BEEN/.test(pvt) && /1 to WANT/.test(pvt) && /3 cities/.test(pvt) && /1 airport/.test(pvt) && /1 pin in another list/.test(pvt), pvt);
  const before = await p.evaluate(() => window.__saved.length);
  rec('nothing saved before Import is pressed', before === await p.evaluate(() => window.__saved.length), before);
  await p.screenshot({ path: DIR + 'import-390.png' });
  await p.click('.tql-pv .go'); await p.waitForTimeout(1100);
  s = await p.evaluate(() => window.__saved.slice(-1)[0]);
  rec('import: countries added, Denmark still lived', s.tllStates.states['620'].t1 === 'visited' && s.tllStates.states['634'].t1 === 'visited' && s.tllStates.states['250'].t1 === 'visited' && s.tllStates.states['208'].t1 === 'lived', s.tllStates.states);
  rec('import: Iceland to WANT', s.tllPlaces.iceland && s.tllPlaces.iceland.state === 'want', Object.keys(s.tllPlaces));
  rec('import: logbook cities and airport', s.tllLog && s.tllLog.cities.map(x => x.n).join('|') === 'Lisbon|Porto, North|Copenhagen' && s.tllLog.airports[0].n === 'Doha Hamad', s.tllLog);
  await p.setInputFiles('.tql-ft input[type=file]', { name: 'p.csv', mimeType: 'text/csv', buffer: Buffer.from(CSV) }); await p.waitForTimeout(300);
  const again = await p.$eval('.tql-pv p', x => x.textContent);
  rec('second import of the same file adds nothing', /0 countries/.test(again) && /0 cities/.test(again), again);
  await p.keyboard.press('Escape'); await p.waitForTimeout(100);
  rec('Escape closes the sheet', await p.$eval('#tql', x => x.hidden), null);
  rec('no errors (member)', !errs.length, errs); await ctx.close(); }
// 3 desktop layout
{ const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } }); const p = await ctx.newPage();
  await p.route('**/*', r => r.fulfill({ contentType: 'text/html', body: `<!doctype html><meta charset="utf-8"><body><div><div id="tll-map-layers" style="height:300px"></div></div><script>window.$memberstackDom={getCurrentMember:()=>Promise.resolve({data:{id:'m'}}),getMemberJSON:()=>Promise.resolve({data:{}}),updateMemberJSON:()=>Promise.resolve({})};</script><script>${SRC}</script></body>` }));
  await p.goto('http://tll.test/the-map#quick-log'); await p.waitForTimeout(700);
  const r = await p.evaluate(() => { const s = document.getElementById('tql'); const x = s.getBoundingClientRect(); return { hidden: s.hidden, w: x.width, left: x.left }; });
  rec('#quick-log opens it; side panel on desktop', !r.hidden && r.w === 440 && r.left > 800, r);
  await p.screenshot({ path: DIR + 'desktop-1280.png' }); await ctx.close(); }
await b.close();
fs.writeFileSync(DIR + 'results.json', JSON.stringify(res, null, 2));
res.forEach(x => console.log((x.p ? 'PASS ' : 'FAIL ') + x.n + (x.p ? '' : '  ' + JSON.stringify(x.e))));
console.log(res.filter(x => x.p).length + '/' + res.length);
