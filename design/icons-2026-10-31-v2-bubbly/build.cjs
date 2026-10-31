// That Layover Life, bubbly icon set v2.
// Builds 48 SVGs (color + muted), sprite.svg, and index.html.
// Run: node build.cjs   (from this folder)
const fs = require('fs');
const path = require('path');
const OUT = __dirname;

// ---------- palette ----------
const P = {
  rose: '#F0507A', rose2: '#D63859',
  teal: '#00C9C8', teal2: '#067A79',
  amber: '#D98A2B', yellow: '#FFD36E',
  sky: '#8FD3FF', mint: '#B8F2E6',
  cream: '#FDF9F3', ink: '#0A0B14',
  white: '#FFFFFF',
};
const MUTED = { light: '#FDF9F3', grey: '#E0DACE' };
// Default muted tone per color token. Light tints go cream, strong colors go grey.
const MUTED_TONE = {
  rose: 'grey', rose2: 'grey', teal: 'grey', teal2: 'grey', amber: 'grey', ink: 'grey',
  yellow: 'light', sky: 'light', mint: 'light', cream: 'light', white: 'light',
};
const STROKE = 2;

// ---------- shape helpers ----------
// Every shape: { el, attrs..., f: color token | 'none', s: stroke? (default true), m: muted tone override }
const path_ = (d, f, o = {}) => ({ el: 'path', d, f, ...o });
const circle = (cx, cy, r, f, o = {}) => ({ el: 'circle', cx, cy, r, f, ...o });
const rect = (x, y, w, h, rx, f, o = {}) => ({ el: 'rect', x, y, width: w, height: h, rx, f, ...o });
const ellipse = (cx, cy, rx, ry, f, o = {}) => ({ el: 'ellipse', cx, cy, rx, ry, f, ...o });
// kawaii bits
const shine = (cx, cy, r = 1.4) => circle(cx, cy, r, 'white', { s: false, kind: 'shine' });
const pillShine = (x, y, w, h) => rect(x, y, w, h, Math.min(w, h) / 2, 'white', { s: false, kind: 'shine' });
const eyes = (lx, rx, y, w = 3) => path_(`M${lx} ${y}q${w / 2} -${w / 2} ${w} 0M${rx} ${y}q${w / 2} -${w / 2} ${w} 0`, 'none', { kind: 'face' });
const blush = (lx, rx, y, f = 'rose', r = 1.2) => [
  circle(lx, y, r, f, { s: false, kind: 'blush' }),
  circle(rx, y, r, f, { s: false, kind: 'blush' }),
];
const smile = (x, y, w = 2.4) => path_(`M${x} ${y}q${w / 2} ${w / 2} ${w} 0`, 'none', { kind: 'face' });

// Archimedean spiral polyline from radius r0 (at angle a0 degrees) down to r1 over `turns` turns.
function spiral(cx, cy, r0, r1, turns, a0) {
  const steps = Math.round(turns * 36);
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const r = r0 + (r1 - r0) * t;
    const a = (a0 + t * turns * 360) * Math.PI / 180;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return 'M' + pts.join('L');
}

// ---------- the 24 icons, drawn on a 32 x 32 grid, ~2px padding ----------
const ICONS = [
  { name: 'layover-clock', label: 'Layover clock', shapes: [
    rect(12, 2.75, 8, 5, 2.5, 'yellow'),
    circle(16, 17.5, 11.5, 'rose'),
    circle(16, 17.5, 7.25, 'cream'),
    path_('M16 13.75v3.75l3 2.25', 'none'),
    shine(9, 11.5, 1.5),
  ] },
  { name: 'gate-floor', label: 'Gate floor', shapes: [
    rect(3, 3.5, 26, 9.5, 3.5, 'teal'),
    path_('M11.5 4.5v7.5M20.5 4.5v7.5', 'none'),
    path_('M6.5 13v3M25.5 13v3', 'none'),
    rect(3, 24.5, 26, 4.5, 2.25, 'amber'),
    rect(11, 17.5, 17.5, 7.5, 3.75, 'rose'),
    circle(7.75, 21.25, 3.75, 'yellow'),
    shine(7, 6.75, 1.2),
    shine(14, 19.75, 1.1),
  ] },
  { name: 'passport-stamp', label: 'Passport stamp', shapes: [
    rect(5.5, 3, 21, 26, 4, 'rose2'),
    rect(9, 3, 17.5, 26, 4, 'rose'),
    circle(17.5, 13.5, 6, 'teal'),
    circle(17.5, 13.5, 2.25, 'cream', { s: false }),
    rect(12.5, 23, 10, 2.5, 1.25, 'cream', { s: false }),
    shine(13.75, 9.75, 1.3),
  ] },
  { name: 'lived-in-key', label: 'Lived-in key', shapes: [
    { el: 'g', transform: 'rotate(45 11 11)', f: 'yellow', children: [
      rect(16, 8.5, 15.5, 5, 2.5, 'yellow'),
      rect(26, 12, 4, 6, 2, 'yellow'),
      rect(20.5, 12, 4, 5, 2, 'yellow'),
    ] },
    circle(11, 11, 8.5, 'yellow'),
    path_('M11 6.75l-4 3.75v4.5h8v-4.5z', 'rose', { m: 'grey' }),
    shine(6.5, 7, 1.4),
  ] },
  { name: 'briefcase', label: 'Briefcase', shapes: [
    rect(11, 4, 10, 8, 3, 'cream'),
    rect(3, 9.5, 26, 18.5, 4, 'amber'),
    rect(4, 10.5, 24, 6, 0, 'amber', { s: false }),
    path_('M3 16.5h26', 'none'),
    rect(12.5, 14, 7, 5.5, 2.25, 'yellow'),
    shine(7.5, 13.25, 1.3),
  ] },
  { name: 'running-shoe', label: 'Running shoe', shapes: [
    path_('M4 23V17.5C4 12.5 7 8 12 7c3-.6 5 1.4 7 4 2.5 3.2 6 5.2 9 7.3V23z', 'rose'),
    rect(3, 21.5, 26, 6.5, 3.25, 'teal2'),
    path_('M12.5 12.25l3.5-1.5M14.5 15.5l3.5-1.5', 'none'),
    shine(8.25, 15.5, 1.4),
  ] },
  { name: 'cookie', label: 'Cookie', shapes: [
    path_('M21 5.1A12 12 0 1 0 27.4 12.4A5 5 0 0 1 21 5.1z', 'amber'),
    circle(10, 10.5, 1.4, 'ink', { s: false, m: 'grey' }),
    circle(16, 8.5, 1.4, 'ink', { s: false, m: 'grey' }),
    circle(7.5, 16.5, 1.4, 'ink', { s: false, m: 'grey' }),
    circle(23.5, 18, 1.4, 'ink', { s: false, m: 'grey' }),
    circle(11.5, 24.5, 1.4, 'ink', { s: false, m: 'grey' }),
    circle(20, 25, 1.4, 'ink', { s: false, m: 'grey' }),
    eyes(11.5, 17.5, 17.5),
    ...blush(9.75, 22.25, 20),
    smile(14.8, 20.5),
    shine(9.5, 7.5, 1.2),
  ] },
  { name: 'paw', label: 'Paw', shapes: [
    ellipse(10.5, 9, 3, 4, 'rose', { transform: 'rotate(-12 10.5 9)' }),
    ellipse(21.5, 9, 3, 4, 'rose', { transform: 'rotate(12 21.5 9)' }),
    ellipse(5.25, 16.5, 2.6, 3.5, 'rose', { transform: 'rotate(-35 5.25 16.5)' }),
    ellipse(26.75, 16.5, 2.6, 3.5, 'rose', { transform: 'rotate(35 26.75 16.5)' }),
    path_('M16 14.5c-5 0-9.5 4.5-9.5 9 0 3.2 2.5 5.5 5.5 5.5 1.6 0 2.6-1.1 4-1.1s2.4 1.1 4 1.1c3 0 5.5-2.3 5.5-5.5 0-4.5-4.5-9-9.5-9z', 'rose'),
    eyes(12, 16.75, 21.5, 3.25),
    ...blush(10.75, 21.25, 23.75, 'rose2', 1.2),
    shine(11.5, 18, 1.2),
  ] },
  { name: 'library-book', label: 'Library book', shapes: [
    rect(8, 6, 20.5, 23, 3, 'cream'),
    rect(3.5, 3, 21, 23.5, 4, 'teal2'),
    rect(7.5, 3, 17, 23.5, 4, 'teal'),
    rect(16.5, 3, 4, 10.5, 2, 'rose'),
    rect(11.5, 17.5, 9, 4, 2, 'cream'),
    shine(11.5, 8, 1.3),
  ] },
  { name: 'labyrinth', label: 'Labyrinth', shapes: [
    circle(16, 16, 13, 'sky'),
    path_(spiral(16, 16, 11, 4.5, 1.75, 200), 'none'),
    circle(16, 16, 2.4, 'rose', { s: false, m: 'grey' }),
  ] },
  { name: 'bridge', label: 'Bridge', shapes: [
    path_('M3.5 18.5C5 12 7.5 9 9.5 9c3 0 4 6 6.5 6s3.5-6 6.5-6c2 0 4.5 3 6 9.5', 'none'),
    rect(7, 6.5, 5, 17, 2.5, 'amber'),
    rect(20, 6.5, 5, 17, 2.5, 'amber'),
    rect(3, 18, 26, 6.5, 3.25, 'amber'),
    rect(3, 25.5, 26, 3.5, 1.75, 'sky'),
    shine(9.5, 9.75, 1),
    shine(7.5, 21.25, 1.1),
  ] },
  { name: 'hiking-boot', label: 'Hiking boot', shapes: [
    path_('M5 7c0-2 1.5-3.5 3.5-3.5H15c1.5 0 2.5 1 2.5 2.5v6.5c0 1 .7 1.6 1.7 1.9L24 16c2.6 1 4.5 3.4 4.5 6.2V24H5z', 'amber'),
    rect(5, 3.5, 12.5, 5.5, 2.5, 'rose'),
    rect(3, 21.5, 26, 6.5, 3.25, 'teal2'),
    path_('M9 13.25h5M9 16.75h5', 'none'),
    shine(8.5, 11.5, 1.2),
  ] },
  { name: 'fork-and-knife', label: 'Fork and knife', shapes: [
    rect(4, 3, 10, 12, 5, 'teal'),
    rect(6.5, 12, 5, 17, 2.5, 'teal'),
    path_('M7.4 5.5v4M10.6 5.5v4', 'none'),
    path_('M19.5 5.5c0-2.2 2.3-3.2 3.8-1.8C27 7 28.5 11.5 28.5 15.5c0 1.4-1.1 2.5-2.5 2.5h-4c-1.4 0-2.5-1.1-2.5-2.5z', 'cream'),
    rect(21.25, 16, 5, 13, 2.5, 'rose'),
    shine(7.25, 6.5, 1.1),
  ] },
  { name: 'ferry', label: 'Ferry', shapes: [
    rect(13, 4, 6, 7, 2.5, 'amber'),
    rect(7.5, 9.5, 17, 9, 3, 'cream'),
    circle(11.5, 14, 1.6, 'sky', { s: false }),
    circle(16, 14, 1.6, 'sky', { s: false }),
    circle(20.5, 14, 1.6, 'sky', { s: false }),
    path_('M3 18h26l-2.6 7.2c-.4 1.1-1.4 1.8-2.6 1.8H8.2c-1.2 0-2.2-.7-2.6-1.8z', 'rose'),
    eyes(11, 18, 22.5),
    ...blush(8.5, 23.5, 23.75, 'rose2', 1.1),
    shine(14.75, 6.25, 1),
  ] },
  { name: 'train', label: 'Train', shapes: [
    rect(6, 3.5, 6, 9, 2.5, 'amber'),
    rect(17.5, 3.5, 11.5, 13, 3.5, 'rose'),
    rect(20.25, 6.5, 6, 5.5, 2, 'sky'),
    rect(3, 11.5, 26, 12.5, 4, 'teal'),
    circle(9, 25.5, 3, 'rose2'),
    circle(16.5, 25.5, 3, 'rose2'),
    circle(24, 25.5, 3, 'rose2'),
    shine(7.5, 15.5, 1.2),
  ] },
  { name: 'plane', label: 'Plane', shapes: [
    path_('M3 18.5c0-1.6.9-2.7 2.6-3.3L13 12h6l7.4 3.2c1.7.6 2.6 1.7 2.6 3.3v.6c0 1.1-.9 1.8-2 1.6L19 19.5h-6l-8 1.2c-1.1.2-2-.5-2-1.6z', 'rose'),
    path_('M9.5 27.5c-1 0-1.5-1.1-.9-1.8L12.5 21h7l3.9 4.7c.6.7.1 1.8-.9 1.8z', 'rose'),
    path_('M12.75 9.25a3.25 3.25 0 0 1 6.5 0V26c0 1.2-1 2-2.1 1.8L16 27.5l-1.15.3c-1.1.2-2.1-.6-2.1-1.8z', 'sky'),
    circle(16, 8.75, 1.3, 'cream', { s: false }),
    circle(16, 14.25, 1.3, 'cream', { s: false }),
    circle(16, 19.75, 1.3, 'cream', { s: false }),
    path_('M4.75 10.5a2.6 2.6 0 0 1 1.3-4.9 3.4 3.4 0 0 1 6.5-1.1 2.75 2.75 0 0 1 2.4 6z', 'white'),
    eyes(6.5, 10.5, 8.25, 2.5),
    ...blush(6, 13.75, 9, 'rose', 0.85),
    shine(14.5, 11.75, 1),
  ] },
  { name: 'suitcase', label: 'Suitcase', shapes: [
    rect(11, 3, 10, 7, 3, 'cream'),
    circle(10.5, 27.5, 1.75, 'ink', { m: 'grey' }),
    circle(21.5, 27.5, 1.75, 'ink', { m: 'grey' }),
    rect(6, 8, 20, 18, 4, 'teal'),
    rect(7, 18, 18, 4, 0, 'rose', { s: false, m: 'light' }),
    eyes(11.5, 16.5, 14.5),
    ...blush(10, 22, 16.25),
    shine(9.5, 11, 1.2),
  ] },
  { name: 'map-pin', label: 'Map pin', shapes: [
    path_('M16 29.25c-.9 0-1.4-.6-1.7-1.2C12 24.5 5 19.5 5 13A11 11 0 0 1 27 13c0 6.5-7 11.5-9.3 15.05-.3.6-.8 1.2-1.7 1.2z', 'rose'),
    circle(16, 13, 4, 'cream'),
    shine(10.25, 8.25, 1.5),
  ] },
  { name: 'mountain', label: 'Mountain', shapes: [
    circle(25.5, 7.5, 3.25, 'yellow'),
    path_('M3.5 28c-.7 0-1.2-.8-.9-1.4L13.3 7.9c1.1-2 4.3-2 5.4 0l10.7 18.7c.3.6-.2 1.4-.9 1.4z', 'teal'),
    path_('M11.3 12.6l2-4.7c1.1-2 4.3-2 5.4 0l2 4.7c-1.6 1.6-3.1-.3-4.7 1.2-1.6-1.5-3.1.4-4.7-1.2z', 'cream'),
    eyes(11.5, 17.5, 21),
    ...blush(9.5, 22.5, 23),
    shine(22, 6.5, 0.9),
  ] },
  { name: 'camera', label: 'Camera', shapes: [
    rect(10, 5.5, 10, 7, 3, 'rose2'),
    rect(3, 9.5, 26, 18.5, 4, 'rose'),
    circle(16, 18.75, 5.75, 'teal2'),
    circle(16, 18.75, 2.5, 'sky', { s: false }),
    rect(22.5, 13, 4, 3, 1.5, 'yellow', { s: false }),
    shine(13.25, 16, 1.1),
    shine(7, 13.5, 1.1),
  ] },
  { name: 'coffee-cup', label: 'Coffee cup', shapes: [
    path_('M9.5 7c0-1.75 1.75-1.75 1.75-3.5M15.5 7c0-1.75 1.75-1.75 1.75-3.5', 'none'),
    path_('M21 13.5h1.75a3.5 3.5 0 0 1 0 7H21', 'none', { stroke: 'ink', sw: 6 }),
    path_('M21 13.5h1.75a3.5 3.5 0 0 1 0 7H21', 'none', { stroke: 'teal', sw: 2 }),
    path_('M6.5 9.5h13a2.5 2.5 0 0 1 2.5 2.5v12.5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V12a2.5 2.5 0 0 1 2.5-2.5z', 'teal'),
    eyes(9.5, 14.5, 18.5),
    ...blush(8, 18, 20.5),
    shine(7.5, 13, 1.2),
  ] },
  { name: 'postcard', label: 'Postcard', shapes: [
    rect(3, 6, 26, 20, 3.5, 'yellow'),
    rect(6.5, 9.5, 8.5, 7, 2, 'mint'),
    rect(19.5, 9.5, 6, 6, 1.75, 'rose'),
    path_('M6.5 20.5h10M6.5 23h6', 'none', { stroke: 'teal2' }),
    shine(23.5, 19.5, 1.1),
  ] },
  { name: 'shot-glass', label: 'Shot glass', shapes: [
    circle(24.5, 6.5, 3, 'mint'),
    path_('M7 5h18l-2.4 20.6c-.2 1.4-1.4 2.4-2.8 2.4h-7.6c-1.4 0-2.6-1-2.8-2.4z', 'sky'),
    path_('M8.1 14.5h15.8l-1.3 11.1c-.2 1.4-1.4 2.4-2.8 2.4h-7.6c-1.4 0-2.6-1-2.8-2.4z', 'amber', { s: false }),
    eyes(11.75, 16.75, 20.5),
    ...blush(10.5, 21.5, 22.5, 'rose', 1.1),
    pillShine(9.4, 7.5, 1.6, 4.5),
  ] },
  { name: 'compass', label: 'Compass', shapes: [
    circle(16, 16, 13, 'teal'),
    circle(16, 16, 9.25, 'cream'),
    path_('M16 7c.7 0 1.2.4 1.4 1L20 16h-8l2.6-8c.2-.6.7-1 1.4-1z', 'rose'),
    path_('M16 25c-.7 0-1.2-.4-1.4-1L12 16h8l-2.6 8c-.2.6-.7 1-1.4 1z', 'teal2'),
    circle(16, 16, 1.6, 'cream', { s: false }),
    shine(9, 9.5, 1.3),
  ] },
];

// ---------- rendering ----------
const fmt = n => (typeof n === 'number' ? +n.toFixed(2) : n);

function shapeToSvg(sh, muted, indent = '  ') {
  const attrs = [];
  if (sh.el === 'g') {
    attrs.push(`transform="${sh.transform}"`);
    const inner = sh.children.map(c => shapeToSvg(c, muted, indent + '  ')).join('');
    return `\n${indent}<g ${attrs.join(' ')}>${inner}\n${indent}</g>`;
  }
  for (const k of ['d', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'width', 'height', 'transform']) {
    if (sh[k] !== undefined) attrs.push(`${k}="${fmt(sh[k])}"`);
  }
  // fill
  let fill;
  if (sh.f === 'none') fill = 'none';
  else if (muted) fill = MUTED[sh.m || MUTED_TONE[sh.f]];
  else fill = P[sh.f];
  attrs.push(`fill="${fill}"`);
  // stroke
  const stroked = sh.s !== false;
  if (stroked) {
    const sc = sh.stroke && sh.stroke !== 'ink' ? (muted ? MUTED[sh.m || MUTED_TONE[sh.stroke]] : P[sh.stroke]) : P.ink;
    if (sc !== P.ink) attrs.push(`stroke="${sc}"`);
    if (sh.sw) attrs.push(`stroke-width="${sh.sw}"`);
  } else {
    attrs.push('stroke="none"');
  }
  return `\n${indent}<${sh.el} ${attrs.join(' ')}/>`;
}

const rootAttrs = `viewBox="0 0 32 32" stroke="${P.ink}" stroke-width="${STROKE}" stroke-linecap="round" stroke-linejoin="round"`;

function body(ic, muted) {
  return ic.shapes.map(sh => shapeToSvg(sh, muted)).join('');
}

function fileSvg(ic, muted) {
  const id = `tll2-${ic.name}${muted ? '-muted' : ''}-title`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" ${rootAttrs} role="img" aria-labelledby="${id}">
  <title id="${id}">${ic.label}${muted ? ' (not yet earned)' : ''}</title>${body(ic, muted)}
</svg>
`;
}

for (const ic of ICONS) {
  fs.writeFileSync(path.join(OUT, `${ic.name}.svg`), fileSvg(ic, false));
  fs.writeFileSync(path.join(OUT, `${ic.name}-muted.svg`), fileSvg(ic, true));
}

function symbols() {
  return ICONS.map(ic => `
<symbol id="tll2-${ic.name}" ${rootAttrs}>
  <title>${ic.label}</title>${body(ic, false)}
</symbol>
<symbol id="tll2-${ic.name}-muted" ${rootAttrs}>
  <title>${ic.label} (not yet earned)</title>${body(ic, true)}
</symbol>`).join('\n');
}

const spriteInner = symbols();
const sprite = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">
<!--
  That Layover Life bubbly icons v2, sprite (color + muted).
  Usage:
      <use href="/icons/sprite.svg#tll2-paw"/>
      <use href="/icons/sprite.svg#tll2-paw-muted"/>
  Fills are baked in. Nothing depends on currentColor.
-->
${spriteInner}
</svg>
`;
fs.writeFileSync(path.join(OUT, 'sprite.svg'), sprite);

// ---------- usage sheet ----------
const use = (id, size) => `<svg width="${size}" height="${size}" aria-hidden="true"><use href="#tll2-${id}"/></svg>`;

const PLACES = [
  ['Pursuit badges', 'Color once the pursuit is done, muted while it is open. 48px on the profile, 32px in lists.'],
  ['Map pins', 'The icon sits inside the pin head at 24 to 32px. Use the color version only; muted reads as grey mud on the map.'],
  ['Story card markers', 'One icon in the card corner names the pursuit, 32px. Keep it to one per card.'],
  ['Filters', 'Icon plus label in a chip, 24px. The selected chip shows the color icon, the others show muted.'],
  ['Empty states', 'One icon at 64 to 96px above the message. The muted version fits a page that has nothing in it yet.'],
  ['Share cards', 'Color icons at 64px or larger, on cream or on ink. Give them room; two or three is plenty.'],
  ['Paw Passport', 'The paw, map pin, and passport stamp at 48px as section marks, muted stamps for places still on the list.'],
];

function cellsFor(ic, dark) {
  return `
      <figure class="cell">
        <div class="row big">${use(ic.name, 48)}${use(ic.name + '-muted', 48)}</div>
        <div class="row small">${use(ic.name, 32)}${use(ic.name + '-muted', 32)}</div>
        <figcaption>${ic.name}</figcaption>
      </figure>`;
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>TLL bubbly icons v2, usage sheet</title>
<style>
  :root { --ink:#0A0B14; --cream:#FDF9F3; --teal:#00C9C8; --rose:#F0507A; --line:#E8E1D6; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--cream); color:var(--ink);
    font: 15px/1.5 -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
  .wrap { max-width: 1360px; margin: 0 auto; padding: 48px 40px 64px; }
  h1 { font-family: Georgia, "Times New Roman", serif; font-weight: 600; font-size: 38px; margin: 0 0 6px; letter-spacing: -.01em; }
  .lede { margin: 0 0 8px; max-width: 780px; }
  .meta { font-size: 13px; opacity: .7; margin: 0 0 32px; }
  h2 { font-family: Georgia, "Times New Roman", serif; font-weight: 600; font-size: 22px; margin: 0; }
  .panel { border-radius: 20px; padding: 24px 24px 28px; margin: 0 0 28px; }
  .panel header { display:flex; align-items: baseline; gap: 16px; margin-bottom: 18px; }
  .panel header p { margin:0; font-size: 13px; opacity: .75; }
  .grid { display:grid; grid-template-columns: repeat(8, 1fr); gap: 10px; }
  .cell { margin:0; padding: 14px 8px 10px; border-radius: 14px; display:flex; flex-direction:column; align-items:center; gap: 10px; }
  .row { display:flex; gap: 14px; align-items:center; }
  .row svg { display:block; }
  figcaption { font-size: 11.5px; font-family: ui-monospace, Menlo, Consolas, monospace; text-align:center; }
  .light { background: var(--cream); border: 1px solid var(--line); }
  .light .cell { background: #FFFFFF; border: 1px solid #EFE9DF; }
  .dark  { background: var(--ink); color: var(--cream); }
  .dark .cell { background: #14162A; }
  .dark figcaption { color: #C9CCDA; }
  .dark .grid { grid-template-columns: repeat(12, 1fr); }
  .dark .cell .row { gap: 0; }
  .cols { display:grid; grid-template-columns: 1.1fr 1fr; gap: 28px; margin-top: 8px; }
  .card { background:#fff; border:1px solid var(--line); border-radius: 20px; padding: 24px 28px; }
  .card h2 { margin-bottom: 10px; }
  .card h3 { font-size: 15px; margin: 18px 0 6px; }
  .card p, .card li { font-size: 14px; }
  .card ul { margin: 0; padding-left: 18px; }
  .card li b { font-weight: 600; }
  pre { background: var(--ink); color: var(--cream); padding: 12px 14px; border-radius: 12px; font-size: 12.5px; overflow:auto; margin: 6px 0 0; }
  code { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 12.5px; }
  .chips { display:flex; gap: 10px; flex-wrap: wrap; margin: 10px 0 4px; align-items:center; }
  .chip { display:inline-flex; align-items:center; gap: 8px; padding: 6px 14px 6px 8px; border-radius: 999px; border: 2px solid var(--ink); background:#fff; font-size: 13px; font-weight: 600; }
  .chip.muted { border-color: #D8D1C5; color: #7E7A72; }
  .pin { width: 44px; height: 56px; position: relative; }
  .pin .head { position:absolute; left:0; top:0; width:44px; height:44px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); background: #fff; border: 2px solid var(--ink); }
  .pin svg { position:absolute; left: 10px; top: 10px; }
  .swatches { display:flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
  .sw { width: 34px; height: 34px; border-radius: 10px; border: 2px solid var(--ink); }
  .big-row { display:flex; gap: 20px; align-items: center; margin-top: 8px; }
</style>
</head>
<body>
<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">${spriteInner}
</svg>
<div class="wrap">
  <h1>That Layover Life bubbly icons, v2</h1>
  <p class="lede">Twenty-four chunky, colorful stamps for TLL pursuits and the map. Each one comes in two states: color for a pursuit that is done, and muted for one that is still open. Same drawings, same ink outline, fills swapped.</p>
  <p class="meta">Grid 32 by 32, 2px ink outline with round caps and joins, flat fills from the TLL palette. Each cell shows color and muted at 48px, then the same pair at 32px.</p>

  <section class="panel light">
    <header><h2>On cream</h2><p>#FDF9F3, the default for pages, cards, and the Paw Passport</p></header>
    <div class="grid">${ICONS.map(ic => cellsFor(ic, false)).join('')}
    </div>
  </section>

  <section class="panel dark">
    <header><h2>On ink</h2><p>#0A0B14, for dark sections, the map, and share cards. Color only, at 48px.</p></header>
    <div class="grid">${ICONS.map(ic => `
      <figure class="cell">
        <div class="row big">${use(ic.name, 48)}</div>
        <figcaption>${ic.name}</figcaption>
      </figure>`).join('')}
    </div>
  </section>

  <div class="cols">
    <div class="card">
      <h2>How to use</h2>
      <h3>Two ways to place an icon</h3>
      <p>Paste the SVG inline, or reference the sprite. The colors are baked into each file, so nothing depends on CSS color. Never use an icon font.</p>
<pre><code>&lt;svg width="32" height="32" role="img" aria-label="Paw"&gt;
  &lt;use href="/icons/sprite.svg#tll2-paw"/&gt;
&lt;/svg&gt;

&lt;svg width="32" height="32" role="img" aria-label="Paw, not yet earned"&gt;
  &lt;use href="/icons/sprite.svg#tll2-paw-muted"/&gt;
&lt;/svg&gt;</code></pre>
      <h3>Color or muted</h3>
      <p>Use the color version (<code>tll2-paw</code>) once a pursuit is done or when the icon is the selected one. Use muted (<code>tll2-paw-muted</code>) for pursuits still on the list. Both sit on cream or white. On ink, use color only: the outline melts into the background and the icon reads as a sticker, which is the point. Small ink details (cookie chips, suitcase wheels, the bridge cable) go quiet there, and that is fine.</p>
      <div class="chips">
        <span class="chip">${use('paw', 24)}Dogs met</span>
        <span class="chip muted">${use('ferry-muted', 24)}Ferries</span>
        <span class="pin"><span class="head"></span>${use('coffee-cup', 24)}</span>
        <span class="chip">${use('library-book', 24)}Library card</span>
      </div>
      <h3>Sizes</h3>
      <p>Drawn for 32px. They hold up at 24px in chips and go as large as you like. Below 24px the faces turn to fuzz, so use the smaller v1 outline set there.</p>
      <h3>Where they go</h3>
      <ul>${PLACES.map(([k, v]) => `
        <li><b>${k}.</b> ${v}</li>`).join('')}
      </ul>
      <h3>Accessibility</h3>
      <p>Each file carries a title. When an icon sits next to a visible label, add aria-hidden="true" to the svg. When it stands alone, give it role="img" and an aria-label that says what it means, not what it looks like.</p>
    </div>

    <div class="card">
      <h2>Style note</h2>
      <p>These are Japanese pop stickers, not line drawings. Every shape is inflated and rounded, the main feature is oversized, and a 2px ink outline holds it all together so the set reads as one hand. Fills are flat and come from the TLL palette only: rose, deep rose, teal, deep teal, amber, soft yellow, sky, mint, cream, and ink. Each icon uses two to four of them plus a small white shine. Eight icons carry a closed-eye face or a pair of blush dots (cookie, paw, suitcase, coffee cup, ferry, shot glass, mountain, and the cloud under the plane); the rest stay quiet so the set can sit next to Playfair Display headlines without turning the page into a sticker sheet. No gradients, no shadows, no text, no sharp corners.</p>
      <h3>Palette</h3>
      <div class="swatches">${Object.entries(P).filter(([k]) => k !== 'white').map(([k, v]) => `<span class="sw" title="${k} ${v}" style="background:${v}"></span>`).join('')}</div>
      <p class="meta" style="margin:8px 0 0">rose #F0507A, deep rose #D63859, teal #00C9C8, deep teal #067A79, amber #D98A2B, soft yellow #FFD36E, sky #8FD3FF, mint #B8F2E6, cream #FDF9F3, ink #0A0B14. Muted state: cream #FDF9F3 and soft grey #E0DACE.</p>
      <h3>At 64px and up</h3>
      <div class="big-row">${use('plane', 72)}${use('cookie', 72)}${use('map-pin', 72)}${use('compass', 72)}${use('passport-stamp', 72)}</div>
      <h3>Files</h3>
      <p>48 SVGs (<code>name.svg</code> and <code>name-muted.svg</code>), <code>sprite.svg</code> with symbols <code>tll2-name</code> and <code>tll2-name-muted</code>, and this sheet. Everything is built from <code>build.cjs</code>; edit the drawings there, not in the output.</p>
      <h3>Compared with v1</h3>
      <p>v1 is the thin single-color stamp set on a 24 grid. v2 keeps the same 24 subjects and names, so the two sets can be swapped per surface. v2 is meant for places with room and color: badges, the passport, empty states, and share cards. v1 still works for tiny UI, like 16px list markers.</p>
    </div>
  </div>
</div>
</body>
</html>
`;

// Copy rules: American English, no em dashes, no exclamation marks, no word with "ship", never "ledger".
const textOnly = html.replace(/<style>[\s\S]*?<\/style>/, '').replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, ' ');
const bad = [];
if (/—/.test(textOnly)) bad.push('em dash');
if (/!/.test(textOnly)) bad.push('exclamation mark');
if (/ship/i.test(textOnly)) bad.push('word containing "ship": ' + textOnly.match(/\w*ship\w*/gi).join(', '));
if (/ledger/i.test(textOnly)) bad.push('"ledger"');
if (bad.length) { console.error('Copy rule violations: ' + bad.join('; ')); process.exit(1); }

fs.writeFileSync(path.join(OUT, 'index.html'), html);
console.log(`Wrote ${ICONS.length * 2} SVGs, sprite.svg, index.html`);
