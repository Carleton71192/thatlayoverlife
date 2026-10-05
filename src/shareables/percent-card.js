// TLL shareables · percent card renderer (REQUIREMENTS G03; board frames 02A to 02D, 09A to 09C).
// Returns HTML strings. Works in Node (previews, tests) and in the browser (share flow, G09).
// Layouts are separate, never crops: master 540×960 (1080×1920 @2x), feed 540×675, link 600×315.
// Only kit tokens. Ink on Rose for chips (5.7:1). Grain overlay: multiply on light, screen on dark.

import { countFor } from './count.js';
import { percentAlt, percentCopy } from './copy.js';

const GRAIN_LIGHT = "url('data:image/svg+xml;utf8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27180%27 height=%27180%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.85%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3CfeColorMatrix values=%270 0 0 0 .04 0 0 0 0 .04 0 0 0 0 .08 0 0 0 .55 0%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E')";
const GRAIN_DARK = "url('data:image/svg+xml;utf8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27180%27 height=%27180%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.85%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3CfeColorMatrix values=%270 0 0 0 .97 0 0 0 0 .95 0 0 0 0 .9 0 0 0 .4 0%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E')";

export const THEMES = Object.freeze({
  light: { bg: '#FAF7F2', paper: '#FDF9F3', ink: '#0A0B14', mute: '#6B6660', line: '#E0DACE', teal: '#067A79', land: '#E4DCCD', edge: '#FAF7F2', chip: '#FFFFFF', tick: '#DAD1C1', blend: 'multiply', grain: '.3', grainimg: GRAIN_LIGHT },
  dark: { bg: '#0B1220', paper: '#121A2C', ink: '#F7F1E8', mute: '#9AA3B8', line: '#26324D', teal: '#00C9C8', land: '#1E2944', edge: '#0B1220', chip: '#141E36', tick: '#2A3654', blend: 'screen', grain: '.45', grainimg: GRAIN_DARK },
});
export const SIZES = Object.freeze({ master: [540, 960], feed: [540, 675], link: [600, 315] });

const MONO = "'JetBrains Mono',monospace";
const SERIF = "'Playfair Display',serif";
const BODY = "'IBM Plex Sans Condensed',sans-serif";

export function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function vars(theme) {
  const t = THEMES[theme] || THEMES.light;
  return `--bg:${t.bg};--paper:${t.paper};--ink:${t.ink};--mute:${t.mute};--line:${t.line};--teal:${t.teal};--land:${t.land};--edge:${t.edge};--chip:${t.chip};--tick:${t.tick};--rose:#F0507A;--lived:#D63859;--pet:#7C5CBF;--blend:${t.blend};--grain:${t.grain};--grainimg:${t.grainimg}`;
}

/** Luggage-tag bar: one tick per base state, the first n rose. Ranges round down to the ten. */
export function ticks(stats, height) {
  const vis = stats.ranges ? Math.floor(stats.n / 10) * 10 : stats.n;
  let out = '';
  for (let i = 0; i < stats.den; i++) out += `<span style="flex:1;background:${i < vis ? 'var(--rose)' : 'var(--tick)'};border-radius:.5px"></span>`;
  return `<div style="position:relative;background:var(--chip);border:1px solid var(--line);border-radius:8px 20px 20px 8px;padding:10px 18px 8px 30px"><span style="position:absolute;left:10px;top:50%;width:10px;height:10px;margin-top:-5px;border-radius:50%;background:var(--bg);box-shadow:inset 0 0 0 1.5px var(--line)"></span><div style="display:flex;gap:1px;height:${height}px">${out}</div><div style="display:flex;justify-content:space-between;font-family:${MONO};font-size:8px;letter-spacing:1px;color:var(--mute);margin-top:6px;font-weight:700"><span>${esc(stats.chips.tickLeft)}</span><span>${esc(stats.chips.tickRight)}</span></div></div>`;
}

function chip(text, kind) {
  if (!text) return '';
  const base = `display:inline-flex;align-items:center;font-family:${MONO};font-size:10px;letter-spacing:1px;border-radius:14px;white-space:nowrap;`;
  if (kind === 'rose') return `<span style="${base}font-weight:800;padding:6px 10px;background:var(--rose);color:#0A0B14">${esc(text)}</span>`;
  if (kind === 'air') return `<span style="${base}font-weight:700;padding:5px 10px;border:1.5px dashed var(--ink);color:var(--ink)">${esc(text)}</span>`;
  return `<span style="${base}font-weight:700;padding:5px 10px;background:var(--chip);border:1px solid var(--line);color:var(--ink)">${esc(text)}</span>`;
}

export function chips(stats, extraStyle = '') {
  const c = stats.chips;
  return `<div style="display:flex;flex-wrap:wrap;gap:7px;${extraStyle}">${chip(c.count, 'rose')}${chip(c.bonus)}${chip(c.continents)}${chip(c.airside, 'air')}</div>`;
}

function wordmark(size) {
  return `<span style="font-family:'Syne',sans-serif;font-weight:800;font-size:${size}px;letter-spacing:.2px;color:var(--ink);white-space:nowrap"><span style="font-style:italic;opacity:.65;font-weight:700">that</span>LAYOVER <span style="color:#F0507A">LIFE.</span></span>`;
}

function qrBox(qrSvg, size) {
  return `<div style="flex:none;width:${size}px;height:${size}px;padding:4px;background:var(--chip);border:1px solid var(--line);border-radius:6px;box-sizing:border-box">${qrSvg || ''}</div>`;
}

function grain() {
  return `<div style="position:absolute;inset:0;pointer-events:none;opacity:var(--grain);mix-blend-mode:var(--blend);background-image:var(--grainimg)"></div>`;
}

function shell(theme, [w, h], inner, alt) {
  return `<div class="tll-card" data-tll-card="percent" role="img" aria-label="${esc(alt)}" style="${vars(theme)};position:relative;width:${w}px;height:${h}px;background:var(--bg);color:var(--ink);overflow:hidden;font-family:${BODY}">${inner}${grain()}</div>`;
}

function hero(copy, big, small, letter, margin) {
  const suffix = copy.heroSuffix ? `<span style="font-family:${SERIF};font-weight:800;font-size:${small}px;color:var(--rose);margin:${margin}">${esc(copy.heroSuffix)}</span>` : '';
  return `<div style="display:flex;align-items:flex-start;line-height:.8;margin-top:10px"><span style="font-family:${SERIF};font-weight:800;font-size:${big}px;letter-spacing:${letter}px">${esc(copy.hero)}</span>${suffix}</div>`;
}

/**
 * @param {object} data  the member's tllStates (or null)
 * @param {object} [opts] { layout: 'master'|'feed'|'link', theme: 'light'|'dark', handle, shareUrl, qrSvg, base, ranges, travelerId, newThisYear }
 */
export function renderPercentCard(data, opts = {}) {
  const layout = SIZES[opts.layout] ? opts.layout : 'master';
  const theme = opts.theme === 'dark' ? 'dark' : 'light';
  const stats = countFor(data, opts);
  const copy = percentCopy(stats, { ...opts, dark: theme === 'dark' && layout === 'master' });
  const alt = percentAlt(stats, opts);
  const shareUrl = opts.shareUrl || 'thatlayover.life';
  const shortUrl = esc(shareUrl.replace(/^https?:\/\//, '').toUpperCase());
  const handle = copy.handle ? esc(copy.handle) : '';
  const full = copy.state === 'full';
  const headline = (big) => `<div style="font-family:${SERIF};font-weight:800;font-size:${big}px;line-height:1.1;margin-top:40px;text-wrap:pretty">${esc(copy.head1)} <span style="color:var(--rose);font-style:italic">${esc(copy.head2)}</span></div>`;
  const sub = copy.sub ? `<div style="font-size:15px;color:var(--mute);margin-top:12px;max-width:40ch">${esc(copy.sub)}</div>` : '';

  if (layout === 'master') {
    const inner = `<div style="position:absolute;left:28px;right:28px;top:137px">
<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;font-family:${MONO};font-size:10.5px;letter-spacing:2.2px;font-weight:700"><span style="color:var(--teal)">${esc(copy.denLabel)}</span><span style="color:var(--mute)">${handle}</span></div>
${hero(copy, 196, 88, -7, '10px 0 0 6px')}
${headline(29)}${sub}
${full ? `<div style="margin-top:20px">${ticks(stats, 34)}</div>${chips(stats, 'margin-top:14px')}<div style="margin-top:18px;display:flex;align-items:baseline;gap:10px"><span style="font-family:${MONO};font-size:9.5px;letter-spacing:2px;color:var(--mute);font-weight:700">TIER</span><span style="font-family:${SERIF};font-weight:800;font-size:25px;font-style:italic">${esc(copy.tier)}</span></div>` : ''}
</div>
<div style="position:absolute;left:28px;right:28px;bottom:137px;display:flex;align-items:flex-end;justify-content:space-between;gap:14px;border-top:1px solid var(--line);padding-top:14px"><div><div>${wordmark(17)}</div><div style="font-size:13px;color:var(--mute);margin-top:4px">Make yours at thatlayover.life</div><div style="font-family:${MONO};font-size:9px;letter-spacing:1px;color:var(--teal);margin-top:3px;font-weight:700">${shortUrl}</div></div>${qrBox(opts.qrSvg, 60)}</div>`;
    return { html: shell(theme, SIZES.master, inner, alt), alt, stats, copy, width: 540, height: 960 };
  }

  if (layout === 'feed') {
    const h1 = full ? copy.feedHead1 : copy.head1, h2 = full ? copy.feedHead2 : copy.head2;
    const inner = `<div style="position:absolute;left:36px;right:36px;top:40px;display:flex;flex-direction:column;align-items:center;text-align:center">
<div style="font-family:${MONO};font-size:10px;letter-spacing:2.5px;color:var(--teal);font-weight:700">${esc(copy.denLabel)}</div>
<div style="display:flex;align-items:flex-start;line-height:.8;margin-top:8px"><span style="font-family:${SERIF};font-weight:800;font-size:164px;letter-spacing:-6px">${esc(copy.hero)}</span>${copy.heroSuffix ? `<span style="font-family:${SERIF};font-weight:800;font-size:72px;color:var(--rose);margin:8px 0 0 4px">${esc(copy.heroSuffix)}</span>` : ''}</div>
<div style="font-family:${SERIF};font-weight:800;font-size:25px;line-height:1.12;margin-top:34px;max-width:420px">${esc(h1)} <span style="color:var(--rose);font-style:italic">${esc(h2)}</span></div>
${full ? `<div style="margin-top:18px;width:100%">${ticks(stats, 26)}</div>${chips(stats, 'margin-top:12px;justify-content:center')}` : sub}
</div>
<div style="position:absolute;left:32px;right:32px;bottom:24px;display:flex;align-items:flex-end;justify-content:space-between;gap:12px"><div>${wordmark(14)}<div style="font-family:${MONO};font-size:8.5px;letter-spacing:1px;color:var(--teal);margin-top:4px;font-weight:700">MAKE YOURS AT THATLAYOVER.LIFE</div></div>${qrBox(opts.qrSvg, 46)}</div>`;
    return { html: shell(theme, SIZES.feed, inner, alt), alt, stats, copy, width: 540, height: 675 };
  }

  // link preview 600×315: PNG or JPEG under 300 KB, never SVG (rendered by the caller)
  const inner = `<div style="position:absolute;left:60px;top:32px;width:210px">
<div style="font-family:${MONO};font-size:8.5px;letter-spacing:2px;color:var(--teal);font-weight:700">${esc(copy.denLabel)}</div>
<div style="display:flex;align-items:flex-start;line-height:.8;margin-top:8px"><span style="font-family:${SERIF};font-weight:800;font-size:116px;letter-spacing:-4px">${esc(copy.hero)}</span>${copy.heroSuffix ? `<span style="font-family:${SERIF};font-weight:800;font-size:52px;color:var(--rose);margin:6px 0 0 3px">${esc(copy.heroSuffix)}</span>` : ''}</div>
${full ? `<div style="font-family:${MONO};font-size:9px;letter-spacing:1.5px;font-weight:700;margin-top:24px">TIER · ${esc(copy.tier)}</div>` : ''}
</div>
<div style="position:absolute;left:290px;right:60px;top:38px">
<div style="font-family:${SERIF};font-weight:800;font-size:19px;line-height:1.15">${esc(copy.head1)} <span style="color:var(--rose);font-style:italic">${esc(copy.head2)}</span></div>
${full ? `<div style="margin-top:12px">${ticks(stats, 18)}</div><div style="transform:scale(.82);transform-origin:left top;width:122%;margin-top:9px">${chips(stats, 'gap:5px')}</div>` : (copy.sub ? `<div style="font-size:13px;color:var(--mute);margin-top:10px">${esc(copy.sub)}</div>` : '')}
</div>
<div style="position:absolute;left:60px;right:60px;bottom:22px;display:flex;align-items:center;justify-content:space-between"><div style="display:flex;align-items:center;gap:12px">${wordmark(12)}<span style="font-family:${MONO};font-size:7.5px;letter-spacing:1px;color:var(--teal);font-weight:700">${shortUrl}</span></div></div>`;
  return { html: shell(theme, SIZES.link, inner, alt), alt, stats, copy, width: 600, height: 315 };
}
