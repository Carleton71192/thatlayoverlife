// The "Tell the editor" pill on a phone: 44px round button, hidden while typing in a page field, not while typing the note.
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const R = path.resolve(DIR, '../../../..');
const note = fs.readFileSync(R + '/src/site/tll-note-v1.html', 'utf8');
const css = fs.readFileSync(R + '/src/site-layers/tll-note-phone-v1.html', 'utf8');
const js = fs.readFileSync(R + '/src/site-layers/tll-note-typing-v1.js', 'utf8');
const markup = `<div id="tll-note"><button type="button" class="tll-note-pill" aria-expanded="false">Tell the editor</button><div class="tll-note-card"><p class="tll-note-eyebrow">Tell the editor</p><button type="button" class="tll-note-close" aria-label="Close">x</button><form><input type="hidden" name="page"><textarea name="note"></textarea><input type="submit" value="Send"></form></div></div>`; // stand-in for the Webflow component markup
const html = `<!doctype html><html><head>${css}</head><body><label>Languages <input id="lang"></label><div style="height:2000px"></div>${markup}${note}<script>${js}</script></body></html>`;
const b = await chromium.launch(); let bad = 0;
for (const w of [390, 1280]) {
  const p = await b.newPage({ viewport: { width: w, height: 800 } });
  await p.setContent(html); await p.waitForTimeout(300);
  const pill = async () => p.evaluate(() => { const e = document.querySelector('#tll-note .tll-note-pill'); if (!e) return 'none'; const r = e.getBoundingClientRect(); const s = getComputedStyle(document.getElementById('tll-note')); return s.display === 'none' || !r.width ? 'hidden' : Math.round(r.width) + 'x' + Math.round(r.height) + ' "' + e.textContent.trim() + '"'; });
  const a = await pill(); await p.focus('#lang'); const b2 = await pill(); await p.evaluate(() => document.activeElement.blur()); const c = await pill();
  let d = 'n/a'; if (await p.$('#tll-note .tll-note-pill')) { await p.click('#tll-note .tll-note-pill').catch(() => {}); await p.waitForTimeout(100); const ta = await p.$('#tll-note textarea'); if (ta) { await ta.focus(); d = await p.evaluate(() => getComputedStyle(document.getElementById('tll-note')).display); } }
  const ok = (w < 960 ? /^44x44/.test(a) : /^\d{3}x44/.test(a)) && b2 === 'hidden' && c === a && d !== 'none';
  console.log(w, ok ? 'PASS' : 'FAIL', { idle: a, typing: b2, after: c, noteOpenTyping: d }); if (!ok) bad++;
  await p.close();
}
await b.close(); process.exit(bad);
