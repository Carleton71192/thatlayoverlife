/* debug: a profile whose visibility attribute is Off (the page code sends visitors away). What is laid out before the page code runs, in each arm.
   Only lengths and counts are printed: no page text. */
const L = require('./lib.cjs'); const { chromium } = require('playwright'); const fs = require('fs');
const patch = (k, h) => { if (k !== 'profile') return h; const re = /(<[a-z]+[^>]*data-pf5="root"[^>]*?\sdata-visibility=")[^"]*(")/; if (!re.test(h)) throw new Error('no visibility attribute'); return h.replace(re, '$1Off$2'); };
const TR = () => { if (window.top !== window) return; const snap = tag => { const hero = document.querySelector('[data-pf5="hero"]'); const cols = hero ? [].slice.call(hero.querySelectorAll(':scope>[data-pf5="id"]')) : [];
    return { tag, t: Math.round(performance.now()), ghost: document.querySelectorAll('[data-tll-es-ghost]').length, cols: cols.map(c => ({ shown: c.getClientRects().length ? 1 : 0, textLen: (c.innerText || '').replace(/\s+/g, ' ').trim().length, links: c.querySelectorAll('a[href]').length })),
      esStyles: [].map.call(document.querySelectorAll('style'), s => s.id).filter(x => /^tll-es-/.test(x)).join(','), htmlClass: document.documentElement.className.replace(/wf-\S+/g, '').replace(/\s+/g, ' ').trim(), badge: document.querySelectorAll('.pf5-badge').length, initials: document.querySelectorAll('.pf5-initials').length }; };
  const S = []; let n = 0; const tick = () => { if (document.querySelector('[data-pf5="hero"]') && n < 400) { n++; const s = snap('frame'); const key = JSON.stringify([s.ghost, s.cols, s.esStyles, s.htmlClass]); if (key !== tick.last) { tick.last = key; S.push(s); try { window.__rep(JSON.stringify(s)); } catch (e) { } } } requestAnimationFrame(tick); }; requestAnimationFrame(tick);
  window.addEventListener('DOMContentLoaded', () => { try { window.__rep(JSON.stringify(snap('DCL-capture'))); } catch (e) { } }, true);
  window.addEventListener('DOMContentLoaded', () => { try { window.__rep(JSON.stringify(snap('DCL-after'))); } catch (e) { } });
  window.addEventListener('pagehide', () => { try { window.__rep(JSON.stringify(snap('pagehide'))); } catch (e) { } }); };
(async () => { const b = await chromium.launch();
  for (const [arm, w] of [['ctl', 390], ['new', 390], ['new', 1440], ['ctl', 1440]]) {
    const { ctx, page, st } = await L.openPage(b, { w, h: w < 800 ? 844 : 900, arm, html: patch, init: TR, stream: process.argv[2] ? { mode: 'rand', n: 8, gap: 150, ttfb: 50, seed: 7 } : null });
    const log = []; await page.exposeBinding('__rep', (src, s) => { log.push(s); });
    let navs = []; page.on('framenavigated', f => { if (f === page.mainFrame()) navs.push(f.url().replace(/contributors\/[^/?#]+/, 'contributors/<profile>')); });
    try { await page.goto(L.ORIGIN + L.PAGES.profile, { waitUntil: 'load', timeout: 30000 }); } catch (e) { log.push('goto: ' + String(e).slice(0, 80)); }
    await L.sleep(3500);
    console.log('==', arm, w, 'navs', JSON.stringify(navs), 'aborted', JSON.stringify(st.aborted.slice(0, 3)), 'routeFail', st.failed.length);
    for (const l of log) console.log('  ', l.slice(0, 330));
    await ctx.close(); }
  await b.close(); })();
