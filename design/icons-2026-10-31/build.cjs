// Builds the TLL stamp icon set: individual SVGs, sprite.svg, and index.html.
// Run: node build.cjs   (from this folder)
const fs = require('fs');
const path = require('path');
const OUT = __dirname;

// Each icon: name, label, body (SVG children drawn on a 24x24 grid, ~2px padding).
// Outline attributes live on the root: fill none, stroke currentColor, 1.5 stroke, round caps/joins.
const ICONS = [
  { name: 'layover-clock', label: 'Layover clock', body: `
    <circle cx="12" cy="13.5" r="7.5"/>
    <path d="M10 2.75h4M12 2.75V6M18.25 6.75l1.25-1.25"/>
    <path d="M12 9.5v4l2.75 1.75"/>` },
  { name: 'gate-floor', label: 'Gate floor', body: `
    <path d="M3 10V5.5A1.5 1.5 0 0 1 4.5 4h2.5a1.5 1.5 0 0 1 1.5 1.5V10M9.25 10V5.5A1.5 1.5 0 0 1 10.75 4h2.5a1.5 1.5 0 0 1 1.5 1.5V10M15.5 10V5.5A1.5 1.5 0 0 1 17 4h2.5A1.5 1.5 0 0 1 21 5.5V10"/>
    <path d="M2.5 10h19M5 10v3M19 10v3"/>
    <circle cx="4.75" cy="17.5" r="1.75"/>
    <path d="M8 18.75h4.25l2.75-2.75 2.75 2.75h2.75"/>
    <path d="M2.5 21.25h19"/>` },
  { name: 'passport-stamp', label: 'Passport stamp', body: `
    <rect x="5" y="2.75" width="14" height="18.5" rx="2"/>
    <circle cx="12" cy="10.5" r="3.75"/>
    <path d="M8.25 10.5h7.5M12 6.75c-1.25 1-1.75 2.25-1.75 3.75s.5 2.75 1.75 3.75c1.25-1 1.75-2.25 1.75-3.75s-.5-2.75-1.75-3.75z"/>
    <path d="M9.5 17.5h5"/>` },
  { name: 'lived-in-key', label: 'Lived-in key', body: `
    <path d="M2.75 15.75 7.5 11.5l4.75 4.25v5.5h-9.5z"/>
    <circle cx="7.5" cy="17" r="1.25"/>
    <path d="M10.25 13 19.75 3.5M16.5 6.75l2.25 2.25M14 9.25l1.75 1.75"/>` },
  { name: 'briefcase', label: 'Work trip briefcase', body: `
    <rect x="2.75" y="7" width="18.5" height="13" rx="2"/>
    <path d="M8.75 7V5.25a1.5 1.5 0 0 1 1.5-1.5h3.5a1.5 1.5 0 0 1 1.5 1.5V7"/>
    <path d="M2.75 12.5h18.5M10.5 11.25v2.5h3v-2.5"/>` },
  { name: 'running-shoe', label: 'Running shoe', body: `
    <path d="M2.75 7.75h2.5l2.25 2.5 3-1.5h1.25l3.5 4.25 4.75 1.5a2.5 2.5 0 0 1 1.75 2.4V18H2.75z"/>
    <path d="M2.75 15.25h18.75"/>
    <path d="M9.5 12.25l1.5-1M11.75 14l1.5-1.25"/>` },
  { name: 'cookie', label: 'Cookie', body: `
    <path d="M12 3a9 9 0 1 0 9 9 3.25 3.25 0 0 1-4-4 3.25 3.25 0 0 1-5-5z"/>
    <path d="M8.5 9h.01M8.75 14.75h.01M13.5 16.25h.01M12.25 11.75h.01M16.75 13.25h.01"/>` },
  { name: 'paw', label: 'Paw', body: `
    <path d="M12 12.5c-2.6 0-5.25 2.9-5.25 5.1 0 1.45 1.05 2.15 2.3 2.15 1.15 0 1.85-.6 2.95-.6s1.8.6 2.95.6c1.25 0 2.3-.7 2.3-2.15 0-2.2-2.65-5.1-5.25-5.1z"/>
    <ellipse cx="9.25" cy="6.5" rx="1.75" ry="2.5"/>
    <ellipse cx="14.75" cy="6.5" rx="1.75" ry="2.5"/>
    <ellipse cx="4.75" cy="11" rx="1.6" ry="2.2" transform="rotate(-30 4.75 11)"/>
    <ellipse cx="19.25" cy="11" rx="1.6" ry="2.2" transform="rotate(30 19.25 11)"/>` },
  { name: 'library-book', label: 'Library book', body: `
    <path d="M4.75 19V5a2 2 0 0 1 2-2h12.5v15H6.75a2 2 0 0 0-2 2 2 2 0 0 0 2 2h12.5v-4"/>
    <path d="M10 3v7l2.25-1.5L14.5 10V3"/>` },
  { name: 'labyrinth', label: 'Labyrinth', body: `
    <path d="M10.5 3.13A9 9 0 1 0 13.5 3.13"/>
    <path d="M10.5 17.81A6 6 0 1 1 13.5 17.81"/>
    <path d="M10.5 9.4A3 3 0 1 0 13.5 9.4"/>
    <path d="M13.5 3.13v2.95M10.5 17.81v3.06M12 12h.01"/>` },
  { name: 'bridge', label: 'Bridge', body: `
    <path d="M7 4.5V19M17 4.5V19M2.5 15h19"/>
    <path d="M7 5c1.5 4 3 5.5 5 5.5s3.5-1.5 5-5.5M2.5 10.5C4.5 9.5 6 7.75 7 5M17 5c1 2.75 2.5 4.5 4.5 5.5"/>
    <path d="M9.5 9.1V15M12 10.5V15M14.5 9.1V15"/>` },
  { name: 'hiking-boot', label: 'Hiking boot', body: `
    <path d="M5.5 3h5.75l.5 6.5 4.75 2a4.75 4.75 0 0 1 3 4.4v1.6H5V3.5a.5.5 0 0 1 .5-.5z"/>
    <path d="M5 17.5h15v2.25a.75.75 0 0 1-.75.75H5.75a.75.75 0 0 1-.75-.75z"/>
    <path d="M11.4 5.75H13M11.6 8.5h1.6M14.5 12.25l-1 1.5"/>` },
  { name: 'fork-and-knife', label: 'Fork and knife', body: `
    <path d="M5 3v5a2.75 2.75 0 0 0 5.5 0V3M7.75 3v18"/>
    <path d="M18.5 21V3c-2.25 1.25-3.5 4-3.5 7.5v3.5h3.5"/>` },
  { name: 'ferry', label: 'Ferry', body: `
    <path d="M2.75 13.5h18.5l-2.5 4.5H5.25z"/>
    <path d="M5.5 13.5V9.75h13v3.75M9 9.75v-3.5h5.25v3.5M11.5 6.25V3.5"/>
    <path d="M8.75 11.75h.01M12 11.75h.01M15.25 11.75h.01"/>
    <path d="M2.5 21c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0"/>` },
  { name: 'train', label: 'Train', body: `
    <rect x="5.25" y="3" width="13.5" height="14" rx="3"/>
    <path d="M5.25 10h13.5M12 3v7"/>
    <path d="M8.75 13.5h.01M15.25 13.5h.01"/>
    <path d="M8.5 17l-2 4M15.5 17l2 4M7.5 19h9"/>` },
  // Additional stamps for TLL pursuits and the map
  { name: 'plane', label: 'Plane', body: `
    <path d="M12 2.75c.8 0 1.4 1.05 1.4 2.5v4.5l7.35 4.25v2.15l-7.35-2.15v3.95l2.1 1.6v1.7L12 20.25l-3.5 1v-1.7l2.1-1.6V14l-7.35 2.15V14l7.35-4.25v-4.5c0-1.45.6-2.5 1.4-2.5z"/>` },
  { name: 'suitcase', label: 'Suitcase', body: `
    <rect x="5.5" y="7" width="13" height="12.5" rx="2"/>
    <path d="M9.75 7V3.75h4.5V7"/>
    <path d="M9.5 10.25v6M14.5 10.25v6"/>
    <path d="M8.5 21.25h.01M15.5 21.25h.01"/>` },
  { name: 'map-pin', label: 'Map pin', body: `
    <path d="M12 21.25s-6.75-5.75-6.75-11.25a6.75 6.75 0 0 1 13.5 0c0 5.5-6.75 11.25-6.75 11.25z"/>
    <circle cx="12" cy="10" r="2.5"/>` },
  { name: 'mountain', label: 'Mountain', body: `
    <path d="M2.5 20 9 7.5l3.75 6.75 2.5-3.75L21.5 20z"/>
    <path d="M6.75 11.85 8 12.75l1.5-1.25 1.6 1.4"/>
    <circle cx="18" cy="5.5" r="1.75"/>` },
  { name: 'camera', label: 'Camera', body: `
    <path d="M4.25 7.5h2.75l1.75-2.75h6.5L17 7.5h2.75a1.5 1.5 0 0 1 1.5 1.5v8.75a1.5 1.5 0 0 1-1.5 1.5H4.25a1.5 1.5 0 0 1-1.5-1.5V9a1.5 1.5 0 0 1 1.5-1.5z"/>
    <circle cx="12" cy="13" r="3.5"/>` },
  { name: 'coffee-cup', label: 'Coffee cup', body: `
    <path d="M3.75 9.5h12.5v5.5a5.5 5.5 0 0 1-5.5 5.5h-1.5a5.5 5.5 0 0 1-5.5-5.5z"/>
    <path d="M16.25 11h1.5a2.5 2.5 0 0 1 0 5h-1.75"/>
    <path d="M8 3c-.75.75-.75 1.5 0 2.25s.75 1.5 0 2.25M12 3c-.75.75-.75 1.5 0 2.25s.75 1.5 0 2.25"/>` },
  { name: 'postcard', label: 'Postcard', body: `
    <rect x="2.75" y="5" width="18.5" height="14" rx="1.5"/>
    <path d="M12.5 8v8"/>
    <path d="M5.75 10.5h4M5.75 13.5h3"/>
    <rect x="15" y="8" width="3.5" height="4" rx=".5"/>` },
  { name: 'shot-glass', label: 'Shot glass', body: `
    <path d="M5.75 9h12.5l-1.45 10.1a1 1 0 0 1-1 .9H8.2a1 1 0 0 1-1-.9z"/>
    <path d="M6.5 13h11M7.6 17h8.8"/>
    <path d="M12 3.25v2.5M8 4.25l1 1.75M16 4.25l-1 1.75"/>` },
  { name: 'compass', label: 'Compass', body: `
    <circle cx="12" cy="12" r="9"/>
    <path d="m15.75 8.25-2.25 5.25-5.25 2.25 2.25-5.25z"/>` },
];

const SCALE = 0.68;                 // icon scale inside the earned disc
const KNOCK_W = (1.5 / SCALE).toFixed(2); // keeps the knocked-out line visually 1.5px

const rootAttrs = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';

function outlineSvg(ic) {
  const id = `tll-${ic.name}-title`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" ${rootAttrs} role="img" aria-labelledby="${id}">
  <title id="${id}">${ic.label}</title>${ic.body}
</svg>
`;
}

// Earned: a solid stamp disc with the icon knocked out of it (mask), so it stays one color via currentColor.
function earnedInner(ic, maskId) {
  return `
  <defs>
    <mask id="${maskId}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
      <circle cx="12" cy="12" r="11" fill="#fff"/>
      <g fill="none" stroke="#000" stroke-width="${KNOCK_W}" stroke-linecap="round" stroke-linejoin="round" transform="translate(12 12) scale(${SCALE}) translate(-12 -12)">${ic.body}
      </g>
    </mask>
  </defs>
  <circle cx="12" cy="12" r="11" fill="currentColor" stroke="none" mask="url(#${maskId})"/>`;
}
function earnedSvg(ic) {
  const id = `tll-${ic.name}-earned-title`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" role="img" aria-labelledby="${id}">
  <title id="${id}">${ic.label} (earned)</title>${earnedInner(ic, `tll-${ic.name}-earned-file-mask`)}
</svg>
`;
}

for (const ic of ICONS) {
  fs.writeFileSync(path.join(OUT, `${ic.name}.svg`), outlineSvg(ic));
  fs.writeFileSync(path.join(OUT, `${ic.name}-earned.svg`), earnedSvg(ic));
}

function symbols() {
  return ICONS.map(ic => `
<symbol id="tll-${ic.name}" ${rootAttrs}>
  <title>${ic.label}</title>${ic.body}
</symbol>
<symbol id="tll-${ic.name}-earned" viewBox="0 0 24 24" fill="none">
  <title>${ic.label} (earned)</title>${earnedInner(ic, `tll-${ic.name}-earned-mask`)}
</symbol>`).join('\n');
}

const sprite = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">
<!--
  That Layover Life stamp icons, sprite (outline + earned).
  Usage:
    <svg class="tll-icon" width="24" height="24" role="img" aria-label="Paw">
      <use href="/icons/sprite.svg#tll-paw"/>
    </svg>
    <svg class="tll-icon" width="48" height="48" role="img" aria-label="Paw, earned">
      <use href="/icons/sprite.svg#tll-paw-earned"/>
    </svg>
  Color comes from CSS: .tll-icon { color: #0A0B14 } (ink on light), #00C9C8 (teal on dark), #F0507A (rose, active).
-->
${symbols()}
</svg>
`;
fs.writeFileSync(path.join(OUT, 'sprite.svg'), sprite);

// ---------- usage sheet ----------
const LUCIDE = [
  ['Search', 'search'],
  ['Map', 'map'],
  ['Share', 'share-2'],
  ['Download', 'download'],
  ['Upload', 'upload'],
  ['Menu', 'menu'],
  ['Close', 'x'],
  ['Chevron', 'chevron-down, chevron-right, chevron-left, chevron-up'],
  ['Filter', 'funnel (older alias: filter), or sliders-horizontal for multi-filter panels'],
  ['User', 'user (circle-user for avatars)'],
  ['Heart / save', 'heart (favorite), bookmark (save for later)'],
  ['Play', 'play (circle-play for video thumbnails)'],
  ['External link', 'external-link'],
  ['Plus', 'plus'],
  ['Check', 'check'],
  ['Info', 'info'],
  ['Settings', 'settings'],
  ['Camera (UI action)', 'camera'],
];

const use = (id, size) => `<svg width="${size}" height="${size}" aria-hidden="true"><use href="#tll-${id}"/></svg>`;
function panel(cls, title, note) {
  const cells = ICONS.map(ic => `
      <figure class="cell">
        <div class="row big">${use(ic.name, 48)}${use(ic.name + '-earned', 48)}</div>
        <div class="row small">${use(ic.name, 24)}${use(ic.name + '-earned', 24)}</div>
        <figcaption>${ic.name}</figcaption>
      </figure>`).join('');
  return `
  <section class="panel ${cls}">
    <header><h2>${title}</h2><p>${note}</p></header>
    <div class="grid">${cells}
    </div>
  </section>`;
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>TLL stamp icons, usage sheet</title>
<style>
  :root { --ink:#0A0B14; --cream:#FDF9F3; --teal:#00C9C8; --rose:#F0507A; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--cream); color:var(--ink);
    font: 15px/1.5 -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
  .wrap { max-width: 1360px; margin: 0 auto; padding: 48px 40px 64px; }
  h1 { font-size: 34px; margin: 0 0 6px; letter-spacing: -.01em; }
  .lede { margin: 0 0 8px; max-width: 760px; }
  .meta { font-size: 13px; opacity: .7; margin: 0 0 32px; }
  h2 { font-size: 20px; margin: 0; }
  .panel { border-radius: 16px; padding: 24px 24px 28px; margin: 0 0 28px; }
  .panel header { display:flex; align-items: baseline; gap: 16px; margin-bottom: 18px; }
  .panel header p { margin:0; font-size: 13px; opacity: .75; }
  .grid { display:grid; grid-template-columns: repeat(8, 1fr); gap: 10px; }
  .cell { margin:0; padding: 14px 8px 10px; border-radius: 10px; display:flex; flex-direction:column; align-items:center; gap: 10px; }
  .row { display:flex; gap: 14px; align-items:center; }
  .row svg { display:block; }
  figcaption { font-size: 11.5px; font-family: ui-monospace, Menlo, Consolas, monospace; text-align:center; }
  .ink   { background: var(--cream); color: var(--ink); border: 1px solid #E8E1D6; }
  .ink .cell { background: #FFFFFF; border: 1px solid #EFE9DF; }
  .dark  { background: var(--ink); color: var(--teal); }
  .dark h2, .dark header p { color: var(--cream); }
  .dark .cell { background: #14162A; }
  .dark figcaption { color: #C9CCDA; }
  .rose  { background: var(--cream); color: var(--rose); border: 1px solid #E8E1D6; }
  .rose h2, .rose header p, .rose figcaption { color: var(--ink); }
  .rose .cell { background: #FFF3F6; border: 1px solid #F8D9E2; }
  .cols { display:grid; grid-template-columns: 1.1fr 1fr; gap: 28px; margin-top: 8px; }
  .card { background:#fff; border:1px solid #E8E1D6; border-radius: 16px; padding: 24px 28px; }
  .card h2 { margin-bottom: 10px; }
  .card h3 { font-size: 15px; margin: 18px 0 6px; }
  .card p, .card li { font-size: 14px; }
  .card ul { margin: 0; padding-left: 18px; }
  pre { background: var(--ink); color: var(--cream); padding: 12px 14px; border-radius: 10px; font-size: 12.5px; overflow:auto; margin: 6px 0 0; }
  code { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 12.5px; }
  table { width:100%; border-collapse: collapse; font-size: 13.5px; }
  th, td { text-align:left; padding: 6px 8px; border-bottom: 1px solid #EFE9DF; vertical-align: top; }
  th { font-size: 12px; text-transform: uppercase; letter-spacing: .05em; opacity: .7; }
  .demo { display:flex; gap: 16px; align-items:center; margin-top: 10px; }
  .chip { display:inline-flex; align-items:center; gap:8px; padding: 6px 12px 6px 8px; border-radius: 999px; border:1px solid #E1D8CA; background: var(--cream); font-size: 13px; }
  .chip.on { color: var(--rose); border-color: var(--rose); }
  .chip.on span { color: var(--ink); }
  .badge { width: 64px; height: 64px; border-radius: 999px; display:grid; place-items:center; background: var(--ink); color: var(--teal); }
</style>
</head>
<body>
${sprite}
<div class="wrap">
  <h1>That Layover Life stamp icons</h1>
  <p class="lede">Twenty-four hand-drawn stamps for TLL pursuits and the map. Each one comes as an outline and an earned version: a solid stamp disc with the drawing pressed out of it. Phase C of the voice and visual refresh, for review before anything goes on the site.</p>
  <p class="meta">Grid 24 by 24, 1.5px stroke, round caps and joins, color from currentColor. Each cell shows outline and earned at 48px, then the same pair at 24px.</p>
  ${panel('ink', 'Ink on cream', '#0A0B14 on #FDF9F3, default for light pages')}
  ${panel('dark', 'Teal on dark', '#00C9C8 on #0A0B14, for dark sections and the map')}
  ${panel('rose', 'Rose, active', '#F0507A for the selected filter, current pursuit, or a freshly earned stamp')}

  <div class="cols">
    <div class="card">
      <h2>How to use</h2>
      <h3>Two ways to place an icon</h3>
      <p>Paste the SVG inline, or reference the sprite. Both inherit color from CSS through currentColor. Never use an icon font.</p>
<pre><code>&lt;svg class="tll-icon" width="24" height="24" role="img" aria-label="Paw"&gt;
  &lt;use href="/icons/sprite.svg#tll-paw"/&gt;
&lt;/svg&gt;

.tll-icon { color: #0A0B14; }            /* ink on light */
.dark .tll-icon { color: #00C9C8; }      /* teal on dark */
.tll-icon.is-active { color: #F0507A; }  /* rose, active */</code></pre>
      <h3>Outline or earned</h3>
      <p>Use the outline (<code>tll-paw</code>) for a pursuit that is available or in progress. Swap to the earned stamp (<code>tll-paw-earned</code>) once it is done. Earned stamps read best at 32px and up; at 24px keep them for badges, not body text.</p>
      <div class="demo">
        <span class="chip">${use('paw', 20)}<span>Dogs met</span></span>
        <span class="chip on">${use('ferry', 20)}<span>Ferries</span></span>
        <span class="badge">${use('labyrinth-earned', 44)}</span>
        <span class="chip">${use('library-book-earned', 20)}<span>Library card earned</span></span>
      </div>
      <h3>Where they go</h3>
      <ul>
        <li>Pursuit badges: outline while in progress, earned once complete.</li>
        <li>Map pins: the stamp sits inside the pin head, sized 16 to 20px.</li>
        <li>Story card markers: one stamp in the card corner names the pursuit.</li>
        <li>Filters: stamp plus label in a chip; rose when selected.</li>
        <li>Empty states: a single outline stamp at 48 to 64px above the message.</li>
        <li>Share cards: earned stamps at 64px or larger, teal on dark or ink on cream.</li>
      </ul>
      <h3>Accessibility</h3>
      <p>Each file carries a title. When an icon sits next to a visible label, add aria-hidden="true" to the svg. When it stands alone, give it role="img" and an aria-label.</p>
    </div>
    <div class="card">
      <h2>UI icons: Lucide</h2>
      <p>Interface controls are not drawn by hand. They come from Lucide, at the same 24 grid and a 1.5 stroke so they sit next to the stamps. Confirm names against the pinned Lucide version before building.</p>
      <table>
        <thead><tr><th>Need</th><th>Lucide name</th></tr></thead>
        <tbody>
${LUCIDE.map(([a, b]) => `          <tr><td>${a}</td><td><code>${b}</code></td></tr>`).join('\n')}
        </tbody>
      </table>
      <h3>License</h3>
      <p>Lucide is released under the ISC License. Keep the license text with the bundled icons. License text: <code>https://github.com/lucide-icons/lucide/blob/main/LICENSE</code>. A few Lucide icons derived from Feather also carry the Feather MIT notice, which is included in that same file.</p>
      <p>The TLL stamp icons on this sheet are original drawings made for That Layover Life.</p>
    </div>
  </div>
</div>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT, 'index.html'), html);
console.log(`wrote ${ICONS.length * 2} icon files, sprite.svg, index.html`);
