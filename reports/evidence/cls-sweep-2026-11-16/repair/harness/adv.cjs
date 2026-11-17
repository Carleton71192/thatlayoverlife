/* Judge-adversarial runner (17 Nov 2026).
   Usage: NODE_PATH=/opt/node22/lib/node_modules node adv.cjs <set> [idRegex]
   Each scenario is loaded once per arm (ctl = live 16.66.0 core from a local file, new = the branch core), arms in alternating order.
   One record per scenario and arm is appended to results/<set>.jsonl; finished ones are skipped on a rerun. */
const L = require('./lib.cjs'); const { fs, path, J, ORIGIN, PAGES, sleep } = L;
const { chromium } = require('playwright');
const SCEN = require('./rscen.cjs');
const SET = process.argv[2], FILTER = process.argv[3] ? new RegExp(process.argv[3]) : null;
if (!SCEN[SET]) { console.error('sets: ' + Object.keys(SCEN).join(' ')); process.exit(2); }

async function stdFlow(page, s, id, rec) {
  await page.goto(ORIGIN + PAGES[s.page] + (s.query || ''), { waitUntil: 'load', timeout: 120000 });
  const a = await page.evaluate(() => [performance.now(), window.__J && window.__J.loadT]);
  const until = Math.max(s.wait || 4500, (a[1] || a[0]) + (s.after || 3000)); await sleep(Math.max(0, until - a[0]) + 50);
  rec.stages.push(await L.probe(page, id));
}
async function one(browser, set, s, arm) {
  const id = [set, s.id, arm].join('-');
  const o = Object.assign({ w: s.w, h: s.h, arm }, s.opts || {});
  const { ctx, page, st } = await L.openPage(browser, o);
  const rec = { set, id: s.id, page: s.page, w: s.w, h: s.h, arm, at: new Date().toISOString(), note: s.note || '', stages: [] };
  try { if (s.flow) await s.flow(page, s, id, rec, L); else await stdFlow(page, s, id, rec); rec.ok = 1; }
  catch (e) { rec.ok = 0; rec.fail = String(e).replace(/contributors\/[^/?# "]+/g, 'contributors/<profile>').slice(0, 300); }
  Object.assign(rec, { nonGet: st.nonGet, hooked: st.hooked.slice(0, 6), abortedN: st.aborted.length, aborted: st.aborted.slice(0, 12), errs: st.errs.slice(0, 8), errN: st.errs.length, cons: st.cons.slice(0, 8), consN: st.cons.length, routeFail: st.failed.slice(0, 3), docN: st.docN || 0, coreN: st.coreN });
  await ctx.close();
  return rec;
}
(async () => {
  const OUT = path.join(J, 'results', SET + '.jsonl');
  const done = new Set(); if (fs.existsSync(OUT)) for (const l of fs.readFileSync(OUT, 'utf8').split('\n')) if (l.trim()) { try { const r = JSON.parse(l); if (r.ok) done.add(r.id + '|' + r.arm); } catch (e) { } }
  let browser = null, n = 0, k = 0;
  const free = () => { try { return +L.cp.execSync('df -k --output=avail /tmp | tail -1', { encoding: 'utf8' }).trim() / 1048576; } catch (e) { return 99; } };
  for (const s of SCEN[SET]) {
    if (FILTER && !FILTER.test(s.id)) continue;
    k++;
    for (const arm of (s.arms || (k % 2 ? ['ctl', 'new'] : ['new', 'ctl']))) {
      if (done.has(s.id + '|' + arm)) continue;
      if (free() < 2) { console.log('STOP: disk under 2 GB'); process.exit(3); }
      if (!browser) browser = await chromium.launch();
      let rec = await one(browser, SET, s, arm);
      if (!rec.ok) { console.log('retry ' + s.id + ' ' + arm + ': ' + rec.fail); try { await browser.close(); } catch (e) { } browser = await chromium.launch(); rec = await one(browser, SET, s, arm); }
      fs.appendFileSync(OUT, JSON.stringify(rec) + '\n'); n++;
      const e = rec.stages[rec.stages.length - 1] || {};
      console.log([new Date().toISOString().slice(11, 19), SET, s.id, arm, rec.ok ? 'cls ' + e.cls + ' box ' + (e.box || '').slice(0, 6) + ' tree ' + (e.tree || '').slice(0, 6) + ' left ' + (e.left || []).length + ' err ' + rec.errN + '/' + rec.consN + ' ab ' + rec.abortedN : 'FAILED ' + rec.fail].join(' '));
    }
  }
  if (browser) await browser.close();
  fs.appendFileSync(path.join(J, 'results', 'sets-done.log'), new Date().toISOString() + ' ' + SET + (FILTER ? ' ' + FILTER.source : '') + ' ' + n + ' loads\n');
  console.log('DONE set ' + SET + ': ' + n + ' loads'); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
