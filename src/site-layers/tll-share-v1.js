// TLL share layer v1 (REQUIREMENTS G09 share flow, G10 privacy panel; boards shareables/06 and 07).
// Bundled with the counting engine (src/shareables) by scripts/build-share-layer.mjs into
// dist/tll-share-v1.min.js, which the /the-map and /account pages load from an HTML embed.
// Everything is additive: it mounts after the map's own share bar and never touches the map engine,
// the Memberstack forms or tllStates. Member data is read from localStorage (synced by the map) and
// Memberstack custom fields; writes go only to the four share-* custom fields.

import { cleanStates, countFor } from '../shareables/count.js';
import { renderPercentCard } from '../shareables/percent-card.js';

const ORIGIN = 'https://thatlayover.life';
const CDN = {
  screenshot: 'https://cdn.jsdelivr.net/npm/modern-screenshot@4.7.0/dist/index.js',
  qr: 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js',
};
const SLUG_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';
const SHARE_TEXT = "You didn't ask to see my travel stats but here they are: ";
const LEVELS = [
  ['off', 'Just me (the default, obviously)', 'No public link. You can still download your own card.'],
  ['unlisted', 'Anyone with the link', 'A random link, not indexed. Revoke or swap it anytime.'],
  ['public', 'The whole internet. Bold.', 'Your handle URL. Search engines can find it.'],
];
const ITEMS = [
  ['count', 'Country count', 'The big number.'],
  ['pct', 'Percent of the world', 'The arguable one.'],
  ['map', 'Map', 'Rose and blank.'],
];
const DEFAULT_ITEMS = ['count', 'pct', 'map', 'pet'];

const CSS = `
#tllShare{font-family:'IBM Plex Sans Condensed','IBM Plex Sans',system-ui,sans-serif;color:#0A0B14;max-width:960px;margin:28px auto 0;padding:0 16px;box-sizing:border-box}
#tllShare *{box-sizing:border-box}
#tllShare .tsh-eyebrow{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:2px;font-weight:700;color:#6B6660;text-transform:uppercase}
#tllShare h3{font-family:'Playfair Display',serif;font-weight:800;font-size:clamp(26px,4vw,40px);line-height:1;margin:6px 0 16px;letter-spacing:-.5px}
#tllShare .tsh-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px;align-items:start}
@media (max-width:760px){#tllShare .tsh-grid{grid-template-columns:1fr}}
#tllShare .tsh-stage{position:relative;background:#F7F1E8;border:1px solid #E0DACE;border-radius:14px;padding:14px;overflow:hidden}
#tllShare .tsh-frame{position:relative;width:100%;margin:0 auto;overflow:hidden;border-radius:10px}
#tllShare .tsh-frame>.tll-card{position:absolute;left:0;top:0;transform-origin:0 0}
#tllShare .tsh-seg{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px}
#tllShare .tsh-seg button{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:1px;font-weight:700;padding:8px 12px;border-radius:999px;border:1.5px solid #0A0B14;background:transparent;color:#0A0B14;cursor:pointer}
#tllShare .tsh-seg button[aria-pressed="true"]{background:#0A0B14;color:#F7F1E8}
#tllShare .tsh-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-family:'IBM Plex Sans Condensed',sans-serif;font-weight:700;font-size:16px;letter-spacing:.2px;padding:14px 22px;border-radius:999px;border:1.5px solid #0A0B14;background:#F0507A;color:#0A0B14;cursor:pointer;text-decoration:none}
#tllShare .tsh-btn.ghost{background:transparent;color:#0A0B14}
#tllShare .tsh-btn[disabled]{opacity:.45;cursor:default}
#tllShare .tsh-menu{display:grid;gap:8px;margin-top:12px}
#tllShare .tsh-menu button{display:flex;justify-content:space-between;align-items:center;gap:12px;width:100%;text-align:left;padding:12px 14px;border-radius:12px;border:1.5px solid #E0DACE;background:#FDF9F3;color:#0A0B14;font:600 15px 'IBM Plex Sans Condensed',sans-serif;cursor:pointer}
#tllShare .tsh-menu button.primary{background:#F0507A;border-color:#0A0B14}
#tllShare .tsh-menu button small{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:1px;color:#6B6660;white-space:nowrap}
#tllShare .tsh-note{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:1px;color:#6B6660;text-transform:uppercase;margin-top:10px;line-height:1.5}
#tllShare .tsh-msg{font-family:'Playfair Display',serif;font-weight:800;font-size:22px;line-height:1.15;margin:10px 0 4px}
#tllShare .tsh-msg+p{margin:0 0 8px;font-size:15px;color:#3b3833}
#tllShare .tsh-panel{background:#FDF9F3;border:1px solid #E0DACE;border-radius:14px;padding:18px}
#tllShare .tsh-lv{display:grid;gap:8px;margin:12px 0}
#tllShare .tsh-lv button{display:grid;grid-template-columns:18px 1fr;gap:12px;align-items:start;text-align:left;padding:12px 14px;border-radius:12px;border:1.5px solid #E0DACE;background:transparent;cursor:pointer;color:#0A0B14;font-family:inherit}
#tllShare .tsh-lv button[aria-checked="true"]{border-color:#0A0B14;background:#fff}
#tllShare .tsh-lv i{display:block;width:16px;height:16px;border-radius:50%;border:1.5px solid #0A0B14;margin-top:2px;position:relative}
#tllShare .tsh-lv button[aria-checked="true"] i:after{content:"";position:absolute;inset:3px;border-radius:50%;background:#0A0B14}
#tllShare .tsh-lv b{display:block;font-size:16px}
#tllShare .tsh-lv span{display:block;font-size:13px;color:#6B6660;margin-top:2px}
#tllShare .tsh-link{display:flex;flex-wrap:wrap;gap:8px;align-items:center;background:#F7F1E8;border:1px dashed #c9b89a;border-radius:10px;padding:10px 12px;margin:10px 0}
#tllShare .tsh-link code{font-family:'JetBrains Mono',monospace;font-size:12px;flex:1 1 auto;word-break:break-all}
#tllShare .tsh-mini{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:1px;font-weight:700;padding:6px 10px;border-radius:999px;border:1.5px solid #0A0B14;background:transparent;color:#0A0B14;cursor:pointer}
#tllShare .tsh-handle{display:flex;gap:8px;align-items:center;margin:8px 0}
#tllShare .tsh-handle input{flex:1;font:600 14px 'JetBrains Mono',monospace;padding:8px 10px;border:1.5px solid #E0DACE;border-radius:8px;background:#fff;color:#0A0B14;min-width:0}
#tllShare .tsh-sw{display:grid;gap:6px;margin:8px 0 12px}
#tllShare .tsh-sw label{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 12px;border-radius:10px;border:1px solid #E0DACE;cursor:pointer}
#tllShare .tsh-sw label b{display:block;font-size:15px}
#tllShare .tsh-sw label span{display:block;font-size:12px;color:#6B6660}
#tllShare .tsh-sw input{width:18px;height:18px;accent-color:#0A0B14;flex:none}
#tllShare .tsh-fine{font-size:13px;color:#6B6660;line-height:1.5;margin:10px 0 0}
#tllShare .tsh-save{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:12px}
#tllShare .tsh-saved{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:1px;color:#067A79;font-weight:700}
#tllShare .tsh-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#0A0B14;color:#F7F1E8;padding:12px 18px;border-radius:999px;font:600 14px 'IBM Plex Sans Condensed',sans-serif;z-index:99999;box-shadow:0 8px 24px rgba(0,0,0,.3)}
`;

function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const k in attrs || {}) {
    if (k === 'class') el.className = attrs[k];
    else if (k === 'html') el.innerHTML = attrs[k];
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), attrs[k]);
    else if (attrs[k] != null) el.setAttribute(k, attrs[k]);
  }
  kids.flat().forEach((c) => c != null && el.append(c.nodeType ? c : document.createTextNode(String(c))));
  return el;
}

function loadScript(src, test) {
  return new Promise((resolve, reject) => {
    if (test()) return resolve(test());
    const s = document.createElement('script');
    s.src = src; s.async = true; s.crossOrigin = 'anonymous';
    s.onload = () => (test() ? resolve(test()) : reject(new Error('script loaded without global')));
    s.onerror = () => reject(new Error('script failed: ' + src));
    document.head.appendChild(s);
  });
}

function readStates() {
  try { return JSON.parse(localStorage.getItem('tllStates') || 'null'); } catch (e) { return null; }
}

export function randomSlug(n = 6) {
  let out = '';
  const buf = new Uint32Array(n);
  (window.crypto || {}).getRandomValues ? crypto.getRandomValues(buf) : buf.forEach((_, i) => (buf[i] = Math.floor(Math.random() * 1e9)));
  for (let i = 0; i < n; i++) out += SLUG_ALPHABET[buf[i] % SLUG_ALPHABET.length];
  return out;
}

export function slugifyHandle(s) {
  return String(s || '').toLowerCase().replace(/ø/g, 'o').replace(/æ/g, 'ae').replace(/å/g, 'a').replace(/ß/g, 'ss').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 24);
}

export function shareUrlFor(prefs) {
  if (!prefs || prefs.level === 'off' || !prefs.slug) return null;
  return ORIGIN + '/p/' + prefs.slug;
}

/** Reads the four share-* fields into a prefs object. New members start Off (G10). */
export function prefsFrom(customFields) {
  const cf = customFields || {};
  const level = ['off', 'unlisted', 'public'].includes(cf['share-level']) ? cf['share-level'] : 'off';
  const items = String(cf['share-items'] || '').split(',').map((s) => s.trim()).filter(Boolean);
  return {
    level,
    slug: String(cf['share-slug'] || '').trim(),
    items: items.length ? items : DEFAULT_ITEMS.slice(),
    ranges: String(cf['share-ranges'] || '') === 'true',
  };
}

export function prefsToFields(prefs) {
  return {
    'share-level': prefs.level,
    'share-slug': prefs.level === 'off' ? '' : prefs.slug,
    'share-items': prefs.items.join(','),
    'share-ranges': prefs.ranges ? 'true' : 'false',
  };
}

async function currentMember() {
  const ms = window.$memberstackDom;
  if (!ms) return null;
  try { const r = await ms.getCurrentMember(); return r && r.data ? r.data : null; } catch (e) { return null; }
}

function toast(text) {
  const t = h('div', { class: 'tsh-toast', role: 'status' }, text);
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

function qrSvg(url) {
  try {
    const q = window.qrcode(0, 'M'); q.addData(url); q.make();
    const n = q.getModuleCount(); let rects = '';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) rects += `<rect x="${c}" y="${r}" width="1" height="1"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" width="100%" height="100%" fill="var(--ink)">${rects}</svg>`;
  } catch (e) { return ''; }
}

export function createShareUI({ mount, member, states, prefs, onPrefs }) {
  const style = h('style', { id: 'tll-share-css' }, CSS);
  if (!document.getElementById('tll-share-css')) document.head.appendChild(style);
  const root = h('section', { id: 'tllShare', 'aria-label': 'Make a card' });
  const ui = { theme: 'light', layout: 'master', step: 'idle', blob: null, url: null, fails: 0, prefs };
  const handle = (() => {
    const cf = (member && member.customFields) || {};
    const name = cf['first-name'] || (cf.name || '').split(' ')[0];
    return name ? slugifyHandle(name) : null;
  })();
  const petTraveler = ((states && states.travelers) || []).find((t) => t && t.pet);
  const stats = () => countFor(states, { ranges: ui.prefs.ranges });

  // ---- card stage -------------------------------------------------------------------------------
  const frame = h('div', { class: 'tsh-frame' });
  const stage = h('div', { class: 'tsh-stage' }, frame);
  let cardEl = null;
  function renderCard() {
    const link = shareUrlFor(ui.prefs);
    const out = renderPercentCard(states, {
      layout: ui.layout, theme: ui.theme, handle, ranges: ui.prefs.ranges,
      shareUrl: link ? link.replace('https://', '') : 'thatlayover.life',
      qrSvg: link && window.qrcode ? qrSvg(link) : '',
    });
    frame.innerHTML = out.html;
    cardEl = frame.firstElementChild;
    const fit = () => {
      const w = frame.clientWidth || out.width;
      const s = Math.min(1, w / out.width);
      cardEl.style.transform = `scale(${s})`;
      frame.style.height = Math.round(out.height * s) + 'px';
    };
    fit(); window.addEventListener('resize', fit, { passive: true });
    return out;
  }

  // ---- share flow (06A to 06H) ------------------------------------------------------------------
  const segTheme = h('div', { class: 'tsh-seg', role: 'group', 'aria-label': 'Which card' },
    ...[['light', 'PERCENT · LIGHT'], ['dark', 'PERCENT · DARK']].map(([v, l]) =>
      h('button', { type: 'button', 'aria-pressed': String(ui.theme === v), onclick: (e) => { ui.theme = v; [...segTheme.children].forEach((b) => b.setAttribute('aria-pressed', String(b === e.currentTarget))); reset(); renderCard(); } }, l)));
  const segLayout = h('div', { class: 'tsh-seg', role: 'group', 'aria-label': 'Layout' },
    ...[['master', 'STORY 1080×1920'], ['feed', 'GRID 1080×1350']].map(([v, l]) =>
      h('button', { type: 'button', 'aria-pressed': String(ui.layout === v), onclick: (e) => { ui.layout = v; [...segLayout.children].forEach((b) => b.setAttribute('aria-pressed', String(b === e.currentTarget))); reset(); renderCard(); } }, l)));
  const flow = h('div', {});
  const makeBtn = h('button', { type: 'button', class: 'tsh-btn', onclick: () => make() }, 'Make my card');

  function fileName() { return `that-layover-life-${ui.layout}.png`; }
  function revokePreview() { if (ui.url) URL.revokeObjectURL(ui.url); ui.url = null; ui.blob = null; }
  function reset() { revokePreview(); ui.step = 'idle'; paint(); }

  async function make() {
    ui.step = 'printing'; paint();
    try {
      if (shareUrlFor(ui.prefs)) await loadScript(CDN.qr, () => window.qrcode).catch(() => null);
      renderCard();
      const ms = await loadScript(CDN.screenshot, () => window.modernScreenshot);
      await (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve());
      const blob = await ms.domToBlob(cardEl, { scale: 2, width: cardEl.offsetWidth, height: cardEl.offsetHeight, style: { transform: 'none' }, type: 'image/png' });
      if (!blob || blob.size < 2000) throw new Error('empty render');
      ui.blob = blob; ui.url = URL.createObjectURL(blob); ui.fails = 0;
      ui.step = 'ready'; paint();
    } catch (e) {
      ui.fails += 1; ui.step = 'failed'; paint();
    }
  }
  function download() {
    if (!ui.url) return;
    const a = h('a', { href: ui.url, download: fileName() }); document.body.appendChild(a); a.click(); a.remove();
  }
  async function copyLink(btn) {
    const url = shareUrlFor(ui.prefs); if (!url) return;
    try { await navigator.clipboard.writeText(url); } catch (e) { /* clipboard blocked */ }
    const old = btn.textContent; btn.textContent = 'LINK COPIED'; setTimeout(() => { btn.textContent = old; }, 2000);
  }
  async function share() {
    const url = shareUrlFor(ui.prefs);
    const text = url ? SHARE_TEXT + url : 'My travel stats, from That Layover Life.';
    try {
      if (ui.blob && navigator.canShare) {
        const file = new File([ui.blob], fileName(), { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text }); ui.step = 'sent'; paint(); return; }
      }
      if (navigator.share && url) { await navigator.share({ text, url }); ui.step = 'linkonly'; paint(); return; }
      ui.step = 'noshare'; paint();
    } catch (e) {
      if (e && e.name === 'AbortError') return;
      ui.step = 'noshare'; paint();
    }
  }
  async function shareLink() {
    const url = shareUrlFor(ui.prefs); if (!url) return;
    try { if (navigator.share) { await navigator.share({ text: SHARE_TEXT + url, url }); ui.step = 'sent'; paint(); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
    ui.step = 'noshare'; paint();
  }

  function paint() {
    flow.innerHTML = '';
    const link = shareUrlFor(ui.prefs);
    const linkNote = link ? null : h('p', { class: 'tsh-note' }, 'PRIVATE UNTIL YOU SHARE IT. ALWAYS. TURN ON A LINK BELOW TO PUT A QR ON THE CARD.');
    if (ui.step === 'idle') {
      flow.append(makeBtn, h('p', { class: 'tsh-note' }, 'TAP ONE MAKES IT. TAP TWO SHARES IT. RENDERS THE REAL ', ui.layout === 'master' ? '1080×1920' : '1080×1350', ' CARD IN YOUR BROWSER, NO SERVER.'), linkNote);
    } else if (ui.step === 'printing') {
      flow.append(h('p', { class: 'tsh-msg' }, 'Printing your passport.'), h('p', {}, 'Customs is reading it.'));
    } else if (ui.step === 'ready') {
      const menu = h('div', { class: 'tsh-menu' },
        h('button', { type: 'button', class: 'primary', onclick: share }, ui.layout === 'master' ? 'Flex it (Story)' : 'Grid it', h('small', {}, ui.layout === 'master' ? '1080×1920 · SHARE SHEET' : '1080×1350 · OWN LAYOUT, NOT A CROP')),
        h('button', { type: 'button', onclick: shareLink, disabled: link ? null : '' }, 'Send the link. Be subtle.', h('small', {}, link ? 'LINK ONLY' : 'NEEDS A LINK BELOW')),
        h('button', { type: 'button', onclick: download }, 'Save it for strategic bragging later', h('small', {}, 'PNG')),
        h('button', { type: 'button', onclick: share }, 'Drop in the group chat', h('small', {}, 'SHARE SHEET')),
        h('button', { type: 'button', onclick: reset }, 'Not today, Instagram', h('small', {}, 'CANCEL')));
      flow.append(menu, h('p', { class: 'tsh-note' }, "A WEBSITE CAN'T POST STRAIGHT INTO INSTAGRAM STORIES. THE PHONE'S SHARE SHEET IS THE ROUTE, SO THE SHORT LINK AND QR ARE PRINTED ON THE IMAGE IN CASE AN APP DROPS THE CAPTION."));
    } else if (ui.step === 'sent') {
      flow.append(h('p', { class: 'tsh-msg' }, '✓ Sent.'), h('p', {}, 'Your mutuals have been notified. Emotionally.'), h('button', { type: 'button', class: 'tsh-btn ghost', onclick: reset }, 'Make another →'));
    } else if (ui.step === 'linkonly') {
      flow.append(h('p', { class: 'tsh-msg' }, 'Your browser shares links, not images.'), h('p', {}, 'The link went instead. The card is printed on it, so the preview still shows.'), h('button', { type: 'button', class: 'tsh-btn ghost', onclick: reset }, 'Start over →'));
    } else if (ui.step === 'noshare') {
      const copyBtn = h('button', { type: 'button', class: 'tsh-mini', disabled: link ? null : '' }, 'COPY LINK');
      copyBtn.addEventListener('click', () => copyLink(copyBtn));
      flow.append(h('p', { class: 'tsh-note' }, 'NO SHARE SHEET ON THIS BROWSER'), h('p', { class: 'tsh-msg' }, "Your browser won't share."), h('p', {}, 'Download it like it\'s 2009.'),
        h('div', { class: 'tsh-save' }, h('button', { type: 'button', class: 'tsh-btn', onclick: download }, 'Download PNG'), copyBtn, h('button', { type: 'button', class: 'tsh-mini', onclick: reset }, 'START OVER')));
    } else if (ui.step === 'failed') {
      const again = h('button', { type: 'button', class: 'tsh-btn', onclick: make }, 'Try again');
      const extra = ui.fails >= 2 && link ? h('button', { type: 'button', class: 'tsh-btn ghost', onclick: shareLink }, 'Send the link instead') : null;
      flow.append(h('p', { class: 'tsh-msg' }, "Card didn't render."), h('p', {}, 'Even images need a layover. Try again.'), h('div', { class: 'tsh-save' }, again, extra));
    }
  }

  // ---- privacy panel (07A) ----------------------------------------------------------------------
  const panel = h('div', { class: 'tsh-panel', id: 'tllSharePrivacy' });
  let saving = false;
  function paintPanel() {
    panel.innerHTML = '';
    const p = ui.prefs;
    panel.append(h('p', { class: 'tsh-eyebrow' }, 'Privacy · everything starts off'), h('h3', {}, 'Who gets to see this?'));
    const lv = h('div', { class: 'tsh-lv', role: 'radiogroup', 'aria-label': 'Who gets to see this' },
      ...LEVELS.map(([v, label, sub]) => h('button', { type: 'button', role: 'radio', 'aria-checked': String(p.level === v), onclick: () => setLevel(v) }, h('i'), h('div', {}, h('b', {}, label), h('span', {}, sub)))));
    panel.append(lv);
    if (p.level === 'public') {
      const inp = h('input', { type: 'text', value: p.slug || handle || '', maxlength: '24', 'aria-label': 'Your handle', placeholder: 'your-handle', spellcheck: 'false' });
      inp.addEventListener('input', () => { p.slug = slugifyHandle(inp.value); });
      panel.append(h('div', { class: 'tsh-handle' }, h('span', { class: 'tsh-note', style: 'margin:0' }, 'THATLAYOVER.LIFE/P/'), inp));
    }
    if (p.level !== 'off') {
      const url = shareUrlFor(p);
      const copyBtn = h('button', { type: 'button', class: 'tsh-mini' }, 'COPY LINK');
      copyBtn.addEventListener('click', () => copyLink(copyBtn));
      const row = h('div', { class: 'tsh-link' }, h('span', { class: 'tsh-note', style: 'margin:0;flex-basis:100%' }, p.level === 'public' ? 'PUBLIC · INDEXABLE' : 'UNLISTED · NOT INDEXED'), h('code', {}, (url || '').replace('https://', '')), copyBtn);
      if (p.level === 'unlisted') row.append(h('button', { type: 'button', class: 'tsh-mini', onclick: () => { p.slug = randomSlug(); paintPanel(); renderCard(); } }, 'NEW LINK'));
      row.append(h('button', { type: 'button', class: 'tsh-mini', onclick: () => setLevel('off') }, 'REVOKE'));
      panel.append(row);
      panel.append(h('p', { class: 'tsh-eyebrow', style: 'margin-top:14px' }, 'What the link shows'));
      const sw = h('div', { class: 'tsh-sw' });
      const items = ITEMS.slice();
      if (petTraveler) items.push(['pet', petTraveler.name || 'Your pet', 'Your pet inherits this whole setting.']);
      items.forEach(([k, label, sub]) => {
        const cb = h('input', { type: 'checkbox' }); cb.checked = p.items.includes(k);
        cb.addEventListener('change', () => { p.items = cb.checked ? [...new Set([...p.items, k])] : p.items.filter((x) => x !== k); });
        sw.append(h('label', {}, h('div', {}, h('b', {}, label), h('span', {}, sub)), cb));
      });
      const rg = h('input', { type: 'checkbox' }); rg.checked = p.ranges;
      rg.addEventListener('change', () => { p.ranges = rg.checked; renderCard(); });
      sw.append(h('label', {}, h('div', {}, h('b', {}, 'Show ranges, not exact numbers. Mysterious.'), h('span', {}, '62 becomes 60+. Rewrites every card.')), rg));
      panel.append(sw);
    }
    panel.append(h('p', { class: 'tsh-fine' }, 'Never shown, whatever you pick: dates, your current city, "currently in". Stamps show years only. Photo location data is stripped on upload. ', petTraveler ? `${petTraveler.name || 'Your pet'} inherits your setting, because a pet page can point to its human. ` : '', 'Turning anything off also clears the cached link preview.'));
    const saveBtn = h('button', { type: 'button', class: 'tsh-btn', disabled: saving ? '' : null, onclick: save }, saving ? 'Saving…' : 'Save');
    panel.append(h('div', { class: 'tsh-save' }, saveBtn, h('span', { class: 'tsh-saved', id: 'tllShareSaved' })));
  }
  function setLevel(v) {
    const p = ui.prefs; p.level = v;
    if (v === 'unlisted' && (!p.slug || p.slug === handle)) p.slug = randomSlug();
    if (v === 'public') p.slug = handle || p.slug;
    if (v === 'off') { p.slug = ''; revokePreview(); if (ui.step !== 'idle') { ui.step = 'idle'; paint(); } }
    paintPanel(); renderCard();
  }
  async function save() {
    const p = ui.prefs;
    if (p.level === 'public' && !/^[a-z0-9][a-z0-9-]{1,23}$/.test(p.slug || '')) { toast('Pick a handle: letters, numbers and dashes.'); return; }
    saving = true; paintPanel();
    try {
      await onPrefs(prefsToFields(p));
      const el = panel.querySelector('#tllShareSaved'); if (el) el.textContent = 'SAVED';
      setTimeout(() => { const e2 = panel.querySelector('#tllShareSaved'); if (e2) e2.textContent = ''; }, 2500);
    } catch (e) { toast('Could not save. Try again in a moment.'); }
    saving = false; paintPanel();
  }

  root.append(
    h('p', { class: 'tsh-eyebrow' }, 'Make a card'),
    h('h3', {}, 'Two taps. Then everyone knows.'),
    h('div', { class: 'tsh-grid' }, h('div', {}, segTheme, segLayout, stage), h('div', {}, flow, h('div', { style: 'height:20px' }), panel)),
  );
  mount.appendChild(root);
  renderCard(); paint(); paintPanel();
  return { root, ui, renderCard };
}

/** Boot on /the-map (after the map's own share bar) and on /account (panel host). */
export async function boot() {
  if (window.__tllShareBooted) return; window.__tllShareBooted = 1;
  const member = await new Promise((res) => { let n = 0; const iv = setInterval(async () => { if (window.$memberstackDom || ++n > 40) { clearInterval(iv); res(await currentMember()); } }, 250); });
  if (!member) return; // public view: nothing to make
  const raw = readStates();
  const { states, dropped } = cleanStates(raw);
  if (dropped.length) console.info('[tll-share] ignored keys', dropped);
  const prefs = prefsFrom(member.customFields);
  const onPrefs = (customFields) => window.$memberstackDom.updateMember({ customFields });
  const host = document.getElementById('tll-share-host');
  const mountAfter = document.getElementById('tllShareBar') || document.getElementById('tllLegend');
  let mount = host;
  if (!mount && mountAfter) { mount = document.createElement('div'); mountAfter.parentNode.insertBefore(mount, mountAfter.nextSibling); }
  if (!mount) {
    let n = 0; await new Promise((res) => { const iv = setInterval(() => { const m = document.getElementById('tllShareBar') || document.getElementById('tllLegend'); if (m || ++n > 60) { clearInterval(iv); if (m) { mount = document.createElement('div'); m.parentNode.insertBefore(mount, m.nextSibling); } res(); } }, 400); });
  }
  if (!mount) return;
  createShareUI({ mount, member, states: raw ? { ...raw, states } : null, prefs, onPrefs });
}

if (typeof document !== 'undefined' && !window.__tllShareNoBoot) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
}
