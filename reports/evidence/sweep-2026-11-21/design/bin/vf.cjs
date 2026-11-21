/* Sweep 21 Nov 2026, lens DESIGN: targeted checks on single elements (computed styles, boxes) to confirm findings.
   Reuses h.cjs (cached documents and assets, non-GET aborted). Usage: NODE_PATH=/opt/node22/lib/node_modules node vf.cjs */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { load } = require('./h.cjs');
const OUT = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/sweep-design/results/vf.jsonl';
function Q() {
  const mask = s => String(s).replace(/contributors\/[^/?#\s"']+/g, 'contributors/<profile>');
  const pick = (sel, props, lim) => [].slice.call(document.querySelectorAll(sel), 0, lim || 4).map(n => { const cs = getComputedStyle(n), r = n.getBoundingClientRect(); const o = { sel, t: mask((n.innerText || n.value || '').trim().replace(/\s+/g, ' ')).slice(0, 40), x: Math.round(r.left), r: Math.round(r.right), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) }; for (const p of props) o[p] = cs[p]; const pb = n.parentElement && getComputedStyle(n.parentElement).backgroundColor; o.parentBg = pb; return o; });
  const out = [];
  const P = ['fontFamily', 'fontSize', 'fontWeight', 'color', 'backgroundColor', 'borderTopColor', 'borderTopWidth', 'borderTopStyle', 'borderTopLeftRadius', 'textDecorationLine', 'textDecorationColor', 'textTransform', 'letterSpacing', 'overflow', 'whiteSpace'];
  const p = location.pathname;
  if (p === '/for-expats') { out.push(...pick('a', P, 400).filter(o => /Find an expat group|Become a Location Expert|Claim your desk|FIND/.test(o.t))); out.push(...pick('input[placeholder="Example text"]', ['fontSize'], 20).map(o => ({ placeholderExampleText: true, y: o.y }))); }
  if (p === '/support' || p === '/contact') out.push(...pick('h3.tll-support-direct-title, h3.tll-support-direct-title em, h1, h2', P, 10));
  if (p === '/stories') { out.push(...pick('a', P, 999).filter(o => o.color === 'rgb(58, 58, 58)').slice(0, 8)); }
  if (p === '/layovers' || p === '/') { out.push(...pick('.tllcf-more, .h3g-all, a.tllcf-card, .tllcf-card', P, 8)); out.push(...pick('footer h4, .inline-h4-0', P, 4)); }
  if (p === '/about') out.push(...pick('.tll-about-final-li, .tll-about-final-cite, .tll-about-final-button, .tll-about-final-button-secondary, .tll-about-final-quote, .tll-about-final-signoff, .tll-about-final-p', P, 12));
  if (p.indexOf('/contributors/') === 0) out.push(...pick('.tll-alb-tape, .tll-alb-tape small, .tll-alb-mount', ['width', 'overflow', 'whiteSpace', 'fontSize'], 6).map(o => Object.assign(o, { sw: null })), ...[].slice.call(document.querySelectorAll('.tll-alb-tape small'), 0, 4).map(n => ({ tape: true, sw: n.scrollWidth, cw: n.clientWidth, tw: n.parentElement.getBoundingClientRect().width, mount: n.closest('.tll-alb-mount') ? n.closest('.tll-alb-mount').getBoundingClientRect().width : null, right: Math.round(n.getBoundingClientRect().right), mountRight: n.closest('.tll-alb-mount') ? Math.round(n.closest('.tll-alb-mount').getBoundingClientRect().right) : null })));
  if (p === '/the-map') out.push(...pick('#tllm-sample, #tllm-sample a, #tllm-sample span', P, 6));
  if (p === '/this-page-does-not-exist-sweep') out.push(...pick('.tll404-btn, .tll404-eyebrow, .tll404-em', P, 6));
  out.push({ imgRadiusVar: getComputedStyle(document.documentElement).getPropertyValue('--_sizes---image--image-radius') });
  return out;
}
global.__ACT = async (page) => page.evaluate(Q);
(async () => {
  const cells = [['for-expats.html', 1440], ['support.html', 390], ['contact.html', 390], ['stories.html', 1440], ['layovers.html', 1440], ['home.html', 1440], ['home.html', 390], ['about.html', 390], ['profile.html', 390], ['the-map.html', 1440], ['this-page-does-not-exist-sweep.html', 1440]];
  const browser = await chromium.launch({ args: ['--no-sandbox'], proxy: { server: process.env.HTTPS_PROXY || 'http://127.0.0.1:44389' } });
  try { for (const [f, w] of cells) { const st = await load(browser, f, w, false); fs.appendFileSync(OUT, JSON.stringify({ f, w, act: st.act }) + '\n'); console.log(f, w, typeof st.act === 'string' ? st.act : 'ok'); } }
  finally { await browser.close(); }
})();
