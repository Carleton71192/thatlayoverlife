import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs';
let html = fs.readFileSync('fixture-home-current.html', 'utf8').replace('<!--BUNDLE-->', '<script>' + fs.readFileSync('../../../../site-layers/tll-site-layers-v13.js', 'utf8') + '</script>');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.route('**/*', r => { const u = r.request().url();
  if (u.startsWith('http://tll.test/css/')) return r.fulfill({ body: fs.readFileSync('../../../../../handoff/claude-design-source/webflow-export-2026-10-13/css/' + u.split('/').pop()), contentType: 'text/css' });
  if (u === 'http://tll.test/') return r.fulfill({ body: html, contentType: 'text/html' }); return r.abort(); });
await p.goto('http://tll.test/').catch(() => {}); await p.waitForTimeout(1000);
const out = await p.evaluate(() => { document.querySelectorAll('.w-form-done').forEach(e => e.style.display = 'block'); document.getElementById('tll-note')?.setAttribute('data-open', 'true');
  const sels = { noteDoneBox: '#tll-note .w-form-done', newsDoneBox: '[data-h3="news"] .w-form-done' };
  const res = {};
  for (const [k, s] of Object.entries(sels)) { const el = document.querySelector(s); if (!el) { res[k] = 'none'; continue; }
    const cs = getComputedStyle(el); let bg = 'transparent', x = el; while (x) { const c = getComputedStyle(x).backgroundColor; if (c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') { bg = c + ' @' + (x.className || x.tagName).toString().slice(0, 30); break; } x = x.parentElement; }
    const rules = []; for (const ss of document.styleSheets) { let rs; try { rs = ss.cssRules; } catch (e) { continue; } const walk = list => { for (const r of list) { if (r.cssRules && !r.selectorText) { if (!r.media || matchMedia(r.media.mediaText).matches) walk(r.cssRules); continue; } if (!r.selectorText) continue; try { if (el.matches(r.selectorText) && /color|background|opacity/.test(r.style.cssText)) rules.push(r.selectorText.slice(0, 70) + ' {' + r.style.cssText.slice(0, 90) + '} ' + (ss.ownerNode && ss.ownerNode.id || ss.href || '').toString().slice(-30)); } catch (e) {} } }; walk(rs); }
    res[k] = { text: el.textContent.trim().slice(0, 40), color: cs.color, opacity: cs.opacity, fs: cs.fontSize, bg, rules: rules.slice(-6) }; }
  return res; });
console.log(JSON.stringify(out, null, 1)); await b.close();
