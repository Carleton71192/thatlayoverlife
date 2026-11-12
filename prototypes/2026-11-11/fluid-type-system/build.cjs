// node build.cjs  ->  writes index.html from template.html, type-system.css,
// stories.json and antarctica-hero.jpg. Every number shown at rest is
// computed here from the CSS or the story data; nothing is typed by hand.
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const read = (f) => fs.readFileSync(path.join(dir, f), 'utf8');

const css = read('type-system.css');
const stories = JSON.parse(read('stories.json'));
const photo = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(dir, 'antarctica-hero.jpg')).toString('base64');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const URL = 'https://www.thatlayover.life/stories/';
const bySlug = (s) => { const x = stories.find((t) => t.s === s); if (!x) throw new Error('missing ' + s); return x; };

// Parse every --tll-step-* declaration from the stylesheet.
const defs = {};
for (const m of css.matchAll(/--tll-step-([a-z-]+):\s*([^;]+);/g)) {
  const v = m[2].trim();
  const c = v.match(/clamp\(([\d.]+)rem,\s*([\d.]+)rem \+ ([\d.]+)vw,\s*([\d.]+)rem\)/);
  defs[m[1]] = c ? { raw: v, min: +c[1], b: +c[2], vw: +c[3], max: +c[4] } : { raw: v, fixed: parseFloat(v) };
}
const sizeAt = (d, w) => d.fixed != null ? d.fixed * 16 : Math.min(Math.max(d.b * 16 + d.vw * w / 100, d.min * 16), d.max * 16);
const zoomReach = (d, w) => { const base = sizeAt(d, w); let best = 1; for (let z = 1; z <= 5.0001; z += 0.05) best = Math.max(best, z * sizeAt(d, w / z) / base); return best; };
const fmt = (n) => (Math.round(n * 10) / 10).toFixed(1).replace(/\.0$/, '');
const r4 = (n) => (+n.toFixed(6)).toString();

const SPECIMENS = {
  'display-xl': 'kilimanjaro-someone-was-already-awake',
  'display-l': 'sort-sol-black-sun-denmark',
  'display-m': 'el-salvador-ice-cream-over-a-lake-of-acid',
  title: 'eswatini-lesotho-how-many-goats-small-car',
};
const sortSol = bySlug('sort-sol-black-sun-denmark');
const STEPS = [
  { n: 'display-xl', as: 'cover-title', cls: 'tll-type-cover-title' },
  { n: 'display-l', as: 'story-title', cls: 'tll-type-story-title' },
  { n: 'display-m', as: 'section-title, story-subhead', cls: 'tll-type-section-title' },
  { n: 'title', as: 'card-title', cls: 'tll-type-card-title' },
  { n: 'deck', as: 'deck', html: `<p class="tll-type-deck" data-measure>A last-minute trip to the German border for Sort Sol, the marshland murmuration that only does the famous part when something tries to eat it. Plus the falcon that never showed, and the correct way to cross the Fyn bridge.</p>
        <p class="tll-type-caption src">The deck of <a href="${URL}${sortSol.s}">${esc(sortSol.t)}</a>, by ${esc(sortSol.by)}</p>` },
  { n: 'story', as: 'story-body', html: `<div class="tll-type-story-body"><p data-measure>The Drake Passage crossing was described to us as “gentle.” The waves only reached sixty feet.</p></div>
        <p class="tll-type-caption src">Quoted from <a href="${URL}antarctica-marathon">the Antarctica story</a>, by Nancy Carleton</p>` },
  { n: 'body', as: 'ui', html: `<p class="tll-type-ui" data-measure>The paperwork, in the order it happens. From someone who cried in that line.</p>
        <p class="tll-type-caption src">Lines from <a href="https://www.thatlayover.life/for-expats">/for-expats</a></p>` },
  { n: 'small', as: 'caption', html: `<p class="tll-type-caption" data-measure>Magnus · Samoyed · 35 kg</p>
        <p class="tll-type-caption src">The caption under <a href="https://www.thatlayover.life/pets/magnus-waffles">Magnus Waffles</a> on the home page</p>` },
  { n: 'meta', as: 'eyebrow, data', html: `<p class="tll-type-eyebrow" data-measure>King George Island, Antarctica</p>
        <p class="tll-type-data">Stories From the Road · September 23, 2026 · 12 min</p>
        <p class="tll-type-caption src">Place line and card meta from <a href="${URL}antarctica-marathon">the Antarctica story</a></p>` },
  { n: 'data-l', as: 'data-l', html: `<p class="tll-type-data-l" data-measure>42.2 km</p>
        <p class="tll-type-caption src">Race distance, from <a href="${URL}antarctica-marathon">the Antarctica story</a></p>` },
];

function mathFor(d) {
  if (d.fixed != null) return `Fixed at ${d.raw}, which is ${fmt(d.fixed * 16)}px at the default root.<br>Line height 1.65. Not fluid: the kit fixes story text at 18px.`;
  const min = d.min * 16, max = d.max * 16, slope = (max - min) / 1560, b = min - slope * 360;
  return `slope = (${fmt(max)} − ${fmt(min)}) / (1920 − 360) = ${slope.toFixed(6)} → ${r4(slope * 100)}vw<br>` +
    `intercept = ${fmt(min)} − ${slope.toFixed(6)} × 360 = ${b.toFixed(2)}px = ${r4(b / 16)}rem<br>` +
    `zoom rule: ${fmt(max)} / ${fmt(min)} = ${(max / min).toFixed(2)}, under 2.5<br><span data-live-math></span>`;
}

const stepRows = STEPS.map((st) => {
  const d = defs[st.n];
  if (!d) throw new Error('no step ' + st.n);
  const range = d.fixed != null ? `${fmt(d.fixed * 16)} px at every width` : `${fmt(d.min * 16)} → ${fmt(d.max * 16)} px · 360 → 1920`;
  let sample;
  if (st.cls) {
    const s = bySlug(SPECIMENS[st.n]);
    sample = `<p class="${st.cls}" data-measure><a data-title href="${URL}${s.s}">${esc(s.t)}</a></p>
        <p class="tll-type-data src" data-src>${esc([s.by, s.p, s.m + ' min'].join(' · '))}</p>`;
  } else sample = st.html;
  return `      <div class="step" data-step="${st.n}">
        <div class="spec mono">
          <span class="name">${st.n}</span>
          <span>Used as ${st.as}</span>
          <span>${range}</span>
          <span class="now">At this window <b data-now>${fmt(sizeAt(d, 1440))}</b> px</span>
          <code>${esc(d.raw)}</code>
          <details><summary>Show the math</summary><p class="math">${mathFor(d)}</p></details>
        </div>
        <div class="sample">
        ${sample}
        </div>
      </div>`;
}).join('\n');

const calcRows = STEPS.map((st) => {
  const d = defs[st.n]; const z = zoomReach(d, 1440);
  return `<tr><td>${st.n}</td><td class="n">${fmt(sizeAt(d, 1440))} px</td><td class="n">…</td><td class="n z ${z >= 2 ? 'ok' : 'bad'}"><span>${z.toFixed(2)}×</span> <span>${z >= 2 ? 'reaches 2×' : 'short of 2×'}</span></td></tr>`;
}).join('');

const newest = stories.slice().sort((a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : 0)).slice(0, 8);
const times = newest.map((s) => `<li><a href="${URL}${s.s}">${esc(s.t)}</a><span class="tll-type-data">${s.m} min</span></li>`).join('');
const minutes = stories.reduce((a, s) => a + s.m, 0);
const people = new Set(stories.map((s) => s.by)).size;
const lib = `The library, counted from the data in this page · <b>${stories.length}</b> stories · <b>${minutes}</b> min of reading · <b>${people}</b> contributors`;

const slim = stories.map(({ s, t, p, by, m, d }) => ({ s, t, p, by, m, d }));

let html = read('template.html')
  .replace('/*@@TYPE_SYSTEM@@*/', () => css)
  .replace('@@CSS_ESCAPED@@', () => esc(css))
  .replace('@@STEPS@@', () => stepRows)
  .replace('@@CALC_ROWS@@', () => calcRows)
  .replace('@@TIMES@@', () => times)
  .replace('@@LIB@@', () => lib)
  .replace('@@COUNT@@', () => String(stories.length))
  .replace('@@C680@@', () => '…')
  .replace('@@PHOTO@@', () => photo)
  .replace('@@STORIES@@', () => JSON.stringify(slim))
  .replace('@@SPECIMENS@@', () => JSON.stringify(SPECIMENS));
if (/@@[A-Z0-9_]+@@/.test(html)) throw new Error('unfilled placeholder: ' + html.match(/@@[A-Z0-9_]+@@/)[0]);
fs.writeFileSync(path.join(dir, 'index.html'), html);
console.log('index.html', html.length, 'bytes;', Object.keys(defs).length, 'steps;', stories.length, 'stories');
