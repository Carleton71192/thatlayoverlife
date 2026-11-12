/* TLL Motion Lab v1 (12 November 2026): dashboard component that previews the Fable hero animation states.
   Refactored from the one-page "TLL Dashboard · Motion Lab" layout: no Tailwind CDN (styles and brand tokens are in
   tll-motion-lab-v1.css), no global ids (several labs can share a page), every SVG layer is a slot.

   Use:
     import { createMotionLab } from './tll-motion-lab-v1.js';
     const lab = createMotionLab(document.querySelector('#lab'), { slots: { map: '<g>...</g>' } });
     lab.go(2); lab.play(); lab.pause(); lab.destroy();

   Slots: each layer's SVG markup can be replaced by passing options.slots[layerId] (a string of SVG markup or an
   SVG element). Animated parts are found by data-tml-part: r1, r2 (class "route"), DOH, GRU, CPH (class "pin"),
   badge, stamp, magnus. A state's show map turns them on and off: a pin is dimmed when its key is false, any other
   part gets the class "on" when its key is true. A slot without a part simply does not animate. The focus ring is
   not a layer; it moves to each state's focus.x and focus.y (SVG units, viewBox 960 x 540).
   Slot markup is inserted as is: pass only trusted markup (Fable exports), never member text. */

export const DEFAULT_DURATION = 6.0;

export const DEFAULT_STATES = [
  { id: 'idle', btn: 'Idle', tag: '00 · Idle', t: 0.0,
    head: 'Layovers are a *lifestyle.*',
    sub: 'Waiting for someone to leave the airport.',
    pct: 0, chips: ['0 UN', '0 continents'],
    focus: { code: 'CPH', name: 'Copenhagen', lat: '55.6180° N', lon: '12.6508° E', x: 612, y: 178 },
    show: { r1: false, r2: false, badge: false, stamp: false, magnus: false, DOH: false, GRU: false } },
  { id: 'signup', btn: 'Simulate signup', tag: '01 · Signup', t: 1.2,
    head: "You're in. *Customs* has been notified.",
    sub: '0 countries so far. Everybody starts somewhere. Usually an airport.',
    pct: 0, chips: ['New member', '0 UN', 'Tier: Carry-On'],
    focus: { code: 'CPH', name: 'Copenhagen', lat: '55.6180° N', lon: '12.6508° E', x: 612, y: 178 },
    show: { r1: false, r2: false, badge: true, stamp: false, magnus: false, DOH: false, GRU: false } },
  { id: 'layover', btn: 'Simulate layover', tag: '02 · Escaped', t: 2.4,
    head: 'You left the airport. *It counts.*',
    sub: 'Airside is a flex. Escaped is a stamp. Know the difference.',
    pct: 0.5, chips: ['1 UN', 'Escaped', '+1 airside'],
    focus: { code: 'DOH', name: 'Doha', lat: '25.2731° N', lon: '51.6081° E', x: 704, y: 282 },
    show: { r1: true, r2: false, badge: true, stamp: false, magnus: false, DOH: true, GRU: false } },
  { id: 'stamp', btn: 'Earn a stamp', tag: '03 · Stamp', t: 3.6,
    head: 'One more country, *then you.*',
    sub: 'Not bragging. Documenting.',
    pct: 7.3, chips: ['14 UN', '+2 bonus places', '4 continents'],
    focus: { code: 'GRU', name: 'São Paulo', lat: '23.4356° S', lon: '46.4731° W', x: 452, y: 388 },
    show: { r1: true, r2: true, badge: false, stamp: true, magnus: false, DOH: true, GRU: true } },
  { id: 'duo', btn: 'Magnus joins', tag: '04 · Duo', t: 4.8,
    head: "Me: 14. Him: 9. *He's catching up.*",
    sub: 'Travel buddy. Zero complaints about the aisle seat.',
    pct: 7.3, chips: ['Human 14', 'Dog 9', 'Paws down'],
    focus: { code: 'GRU', name: 'São Paulo', lat: '23.4356° S', lon: '46.4731° W', x: 452, y: 388 },
    show: { r1: true, r2: true, badge: false, stamp: true, magnus: true, DOH: true, GRU: true } },
];

export const DEFAULT_TRACKS = [
  { label: 'Headline', at: [0, 1, 2, 3, 4] },
  { label: 'Stats', at: [1, 2, 3, 4] },
  { label: 'Route', at: [2, 3] },
  { label: 'Stamp', at: [1, 3] },
  { label: 'Magnus', at: [4] },
];

/* Placeholder vectors. {{uid}} is replaced with a per-instance prefix so pattern and filter ids never collide. */
export const DEFAULT_LAYERS = [
  { id: 'grid', label: 'Grid', on: true,
    svg: '<rect width="960" height="540" fill="url(#{{uid}}-grid)"/>' },
  { id: 'map', label: 'World map slot', on: true,
    svg: '<rect x="300" y="110" width="620" height="330" rx="10" fill="url(#{{uid}}-dots)"/>'
      + '<rect x="300" y="110" width="620" height="330" rx="10" fill="none" stroke="var(--slot)" stroke-dasharray="4 6"/>'
      + '<text x="312" y="430" font-family="JetBrains Mono" font-size="9" letter-spacing="1.4" fill="currentColor" opacity=".35">FABLE VECTOR SLOT · world-equal-earth.svg</text>' },
  { id: 'route', label: 'Routes + pins', on: true,
    svg: '<g fill="none" stroke-linecap="round">'
      + '<path data-tml-part="r1" class="route" pathLength="1" d="M612 178 Q 680 200 704 282" stroke="var(--tml-rose)" stroke-width="2.5"/>'
      + '<path data-tml-part="r2" class="route" pathLength="1" d="M704 282 Q 560 420 452 388" stroke="var(--teal)" stroke-width="2.5"/>'
      + '</g>'
      + '<g data-tml-part="CPH" class="pin"><circle cx="612" cy="178" r="5" fill="var(--tml-rose)"/><text x="622" y="174" font-family="JetBrains Mono" font-size="10" fill="currentColor">CPH</text></g>'
      + '<g data-tml-part="DOH" class="pin dim"><circle cx="704" cy="282" r="5" fill="var(--tml-rose)"/><text x="714" y="278" font-family="JetBrains Mono" font-size="10" fill="currentColor">DOH</text></g>'
      + '<g data-tml-part="GRU" class="pin dim"><circle cx="452" cy="388" r="5" fill="var(--teal)"/><text x="400" y="408" font-family="JetBrains Mono" font-size="10" fill="currentColor">GRU · São Paulo</text></g>' },
  { id: 'stamps', label: 'Badge + stamps', on: true,
    svg: '<g data-tml-part="badge" class="badge">'
      + '<rect x="320" y="132" width="196" height="92" rx="8" fill="var(--bg)" stroke="currentColor" stroke-opacity=".3"/>'
      + '<rect x="320" y="132" width="6" height="92" rx="3" fill="var(--tml-rose)"/>'
      + '<text x="338" y="154" font-family="JetBrains Mono" font-size="8.5" letter-spacing="1.4" fill="currentColor" opacity=".55">NEW MEMBER · SAMPLE</text>'
      + '<text x="338" y="184" font-family="Playfair Display" font-weight="800" font-size="22" fill="currentColor">@layoverlife</text>'
      + '<text x="338" y="208" font-family="JetBrains Mono" font-size="8.5" letter-spacing="1.2" fill="var(--teal)">SINCE 2026 · 0 OF 193</text>'
      + '</g>'
      + '<g data-tml-part="stamp" class="stamp">'
      + '<rect x="770" y="330" width="118" height="84" rx="4" fill="none" stroke="var(--tml-rose)" stroke-width="2.5" opacity=".85"/>'
      + '<rect x="776" y="336" width="106" height="72" rx="2" fill="none" stroke="var(--teal)" stroke-width="1" opacity=".7"/>'
      + '<text x="829" y="362" text-anchor="middle" font-family="JetBrains Mono" font-weight="600" font-size="10" letter-spacing="1.6" fill="var(--tml-rose)">QATAR · QAT</text>'
      + '<text x="829" y="388" text-anchor="middle" font-family="Playfair Display" font-weight="800" font-size="20" fill="var(--tml-rose)">2026</text>'
      + '<text x="829" y="402" text-anchor="middle" font-family="JetBrains Mono" font-size="8" letter-spacing="1.6" fill="var(--teal)">ESCAPED ✈</text>'
      + '</g>' },
  { id: 'magnus', label: 'Magnus', on: true,
    svg: '<line x1="40" y1="500" x2="920" y2="500" stroke="currentColor" stroke-opacity=".12" stroke-dasharray="2 5"/>'
      + '<g data-tml-part="magnus" class="magnus"><g transform="translate(330 0)">'
      + '<rect x="-38" y="470" width="44" height="20" rx="10" fill="var(--tml-violet)"/>'
      + '<circle cx="10" cy="468" r="10" fill="var(--tml-violet)"/>'
      + '<rect class="leg" x="-32" y="486" width="5" height="12" rx="2" fill="var(--tml-violet)"/>'
      + '<rect class="leg" x="-4" y="486" width="5" height="12" rx="2" fill="var(--tml-violet)" style="animation-delay:-110ms"/>'
      + '<text x="-38" y="460" font-family="JetBrains Mono" font-size="8.5" letter-spacing="1.4" fill="var(--tml-violet)">MAGNUS</text>'
      + '</g></g>' },
  { id: 'grain', label: 'Riso grain', on: true, className: 'grain', opacity: '.12',
    svg: '<rect width="960" height="540" filter="url(#{{uid}}-noise)"/>' },
  { id: 'safe', label: 'Safe zones', on: false,
    svg: '<g fill="none" stroke="var(--tml-teal-dark)" stroke-opacity=".55" stroke-dasharray="6 6">'
      + '<rect x="48" y="27" width="864" height="486"/>'
      + '<rect x="96" y="54" width="768" height="432" stroke="var(--tml-rose)" stroke-opacity=".45"/>'
      + '<text x="54" y="42" font-family="JetBrains Mono" font-size="8" fill="var(--tml-teal-dark)" opacity=".8" stroke="none">ACTION SAFE 90%</text>'
      + '<text x="102" y="69" font-family="JetBrains Mono" font-size="8" fill="var(--tml-rose)" opacity=".8" stroke="none">TITLE SAFE 80%</text>'
      + '</g>' },
];

/* ---------- pure helpers (tested in test/motion-lab.test.js) ---------- */

export function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** "Plain *accent words* plain" to [{ w, acc }]; an asterisk toggles the italic rose accent. */
export function splitHeadline(str) {
  const parts = [];
  let acc = false;
  String(str || '').split(/(\*)/).forEach((chunk) => {
    if (chunk === '*') { acc = !acc; return; }
    chunk.split(/\s+/).filter(Boolean).forEach((w) => parts.push({ w, acc }));
  });
  return parts;
}

/** Seconds to "MM:SS.ss". */
export function formatTime(t) {
  const secs = Math.max(0, Number(t) || 0);
  const m = Math.floor(secs / 60);
  const s = (secs - m * 60).toFixed(2).padStart(5, '0');
  return `${String(m).padStart(2, '0')}:${s}`;
}

export function formatPct(v) {
  const n = Number(v) || 0;
  return n === 0 ? '0' : n.toFixed(1);
}

let instances = 0;
const SPEEDS = ['0.5', '1', '2'];
const EASES = [
  ['cubic-bezier(0.23, 1, 0.32, 1)', 'Ease out'],
  ['cubic-bezier(0.34, 1.56, 0.64, 1)', 'Bouncy'],
  ['linear', 'Linear'],
];

function ensureStylesheet() {
  if (typeof document === 'undefined') return;
  const href = new URL('./tll-motion-lab-v1.css', import.meta.url).href;
  if (document.querySelector('link[data-tml-css]')
    || [...document.querySelectorAll('link[rel="stylesheet"]')].some((l) => l.href === href)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.setAttribute('data-tml-css', '');
  document.head.appendChild(link);
}

function slotMarkup(layer, slots, uid) {
  const slot = slots && slots[layer.id];
  const svg = slot && typeof slot === 'object' && 'outerHTML' in slot ? slot.outerHTML : (typeof slot === 'string' ? slot : layer.svg || '');
  return svg.split('{{uid}}').join(uid);
}

/**
 * Builds the Motion Lab inside root and returns { go, play, pause, replay, setLayer, setSpeed, setEase, setTheme, destroy, current }.
 * options: states, layers, tracks, duration, slots, zOrder (drawing order of layer ids, '@focus' for the focus ring),
 * title, file, artboard {width, height}, hotkeys (default true: keys work while focus is inside this lab),
 * autoplayMs (default 2600), stylesheet (default true: links tll-motion-lab-v1.css next to this file when missing).
 */
export function createMotionLab(root, options = {}) {
  if (!root) throw new Error('createMotionLab: root element is required');
  if (options.stylesheet !== false) ensureStylesheet();

  const uid = `tml${++instances}`;
  const states = options.states || DEFAULT_STATES;
  const layers = (options.layers || DEFAULT_LAYERS).map((l) => ({ ...l }));
  const tracks = options.tracks || DEFAULT_TRACKS;
  const duration = options.duration || DEFAULT_DURATION;
  const ab = options.artboard || {};
  const artboard = { width: Number(ab.width) || 1920, height: Number(ab.height) || 1080 };
  const tOf = (s) => Number(s && s.t) || 0;
  const autoplayMs = options.autoplayMs || 2600;
  const title = options.title || 'Dashboard · Motion lab · v0.1';
  const file = options.file || 'Fable · Timeline view · dashboard-hero.fable';
  const f0 = (states[0] && states[0].focus) || {};
  /* drawing order as in the source: the focus ring right after the routes, grain on top; the panel keeps the array order */
  const zOrder = options.zOrder || ['grid', 'map', 'route', '@focus', 'stamps', 'magnus', 'safe', 'grain'];
  const drawn = zOrder.concat(layers.map((l) => l.id).filter((id) => !zOrder.includes(id)));
  if (!drawn.includes('@focus')) drawn.push('@focus');
  const ringSvg = `<g class="focusring" data-tml-part="focus" style="transform:translate(${Number(f0.x) || 0}px, ${Number(f0.y) || 0}px)">`
    + '<circle class="pulse" r="10" fill="none" stroke="var(--tml-rose)" stroke-width="1.5"/>'
    + '<circle r="16" fill="none" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="2 4"/></g>';
  const layerSvg = (l) => `<g class="layer${l.className ? ` ${escapeHtml(l.className)}` : ''}${l.on === false ? ' off' : ''}" data-layer="${escapeHtml(l.id)}"${l.opacity ? ` opacity="${escapeHtml(l.opacity)}"` : ''}>${slotMarkup(l, options.slots, uid)}</g>`;
  const byId = (id) => layers.find((l) => l.id === id);
  const canvasSvg = drawn.map((id) => (id === '@focus' ? ringSvg : (byId(id) ? layerSvg(byId(id)) : ''))).join('');

  root.classList.add('tml');
  root.innerHTML = `
  <aside class="tml-panel">
    <header class="tml-panel__head">
      <div class="tml-wordmark">That Layover Life</div>
      <div class="tml-eyebrow tml-c55">${escapeHtml(title)}</div>
    </header>
    <div class="tml-panel__body">
      <section aria-labelledby="${uid}-h-states">
        <div class="tml-sec-head">
          <h2 id="${uid}-h-states" class="tml-eyebrow tml-c55"><span class="tml-rose">01</span> · Animation state</h2>
          <span class="tml-eyebrow tml-c35">keys 1 to ${states.length}</span>
        </div>
        <div class="tml-states" role="group" aria-label="Animation states" data-tml="states"></div>
        <div class="tml-row2">
          <button type="button" class="tml-btn tml-eyebrow tml-ctl" aria-pressed="false" data-tml="autoplay"><span aria-hidden="true" data-tml="autoplay-icon">▶</span> Autoplay</button>
          <button type="button" class="tml-btn tml-eyebrow tml-ctl tml-ctl--quiet" data-tml="replay"><span aria-hidden="true">↺</span> Replay state</button>
        </div>
      </section>
      <section aria-labelledby="${uid}-h-layers">
        <h2 id="${uid}-h-layers" class="tml-eyebrow tml-c55"><span class="tml-rose">02</span> · Fable layers</h2>
        <ul class="tml-layers" data-tml="layers"></ul>
      </section>
      <section aria-labelledby="${uid}-h-motion">
        <h2 id="${uid}-h-motion" class="tml-eyebrow tml-c55"><span class="tml-rose">03</span> · Motion</h2>
        <div class="tml-fields">
          <div><div class="tml-eyebrow tml-c40 tml-field-label" id="${uid}-l-speed">Speed</div>
            <div class="tml-seg" role="group" aria-labelledby="${uid}-l-speed" data-tml="speed">
              ${SPEEDS.map((v) => `<button type="button" data-v="${v}" aria-pressed="${v === '1'}">${v}×</button>`).join('')}
            </div></div>
          <div><div class="tml-eyebrow tml-c40 tml-field-label" id="${uid}-l-ease">Easing</div>
            <div class="tml-seg" role="group" aria-labelledby="${uid}-l-ease" data-tml="ease">
              ${EASES.map(([v, l], i) => `<button type="button" data-v="${v}" aria-pressed="${i === 0}">${l}</button>`).join('')}
            </div></div>
          <div><div class="tml-eyebrow tml-c40 tml-field-label" id="${uid}-l-theme">Canvas</div>
            <div class="tml-seg" role="group" aria-labelledby="${uid}-l-theme" data-tml="theme">
              <button type="button" data-v="night" aria-pressed="true">Night</button><button type="button" data-v="paper" aria-pressed="false">Paper</button>
            </div></div>
        </div>
      </section>
      <section aria-labelledby="${uid}-h-coords">
        <h2 id="${uid}-h-coords" class="tml-eyebrow tml-c55"><span class="tml-rose">04</span> · Coordinates</h2>
        <dl class="tml-coords tml-readout">
          <dt>Focus</dt><dd><span class="tml-focus-code" data-tml="c-focus"></span> <span class="tml-c55" data-tml="c-name"></span></dd>
          <dt>Lat</dt><dd data-tml="c-lat"></dd>
          <dt>Lon</dt><dd data-tml="c-lon"></dd>
          <dt>Cursor</dt><dd data-tml="c-cursor">x ---- · y ----</dd>
          <dt>Artboard</dt><dd>${Number(artboard.width)} × ${Number(artboard.height)} @ 1x</dd>
          <dt>Timecode</dt><dd data-tml="c-time">00:00.00</dd>
        </dl>
      </section>
    </div>
    <footer class="tml-panel__foot tml-eyebrow tml-c40">Sample data · Placeholder vectors<br>Copy is draft, riff away</footer>
  </aside>

  <section class="tml-main" aria-label="Canvas preview">
    <div class="tml-topbar">
      <div class="tml-topbar__left"><span class="tml-dot" aria-hidden="true"></span><span class="tml-eyebrow tml-c70">${escapeHtml(file)}</span></div>
      <span class="tml-eyebrow tml-c50 tml-state-tag" data-tml="state-tag">State 00 · Idle</span>
    </div>

    <div class="tml-stage" data-theme="night" data-tml="stage">
      <div class="tml-frame">
        <svg class="tml-svg" viewBox="0 0 960 540" role="img" aria-label="Placeholder Fable canvas with route, stamp and dog layers" data-tml="canvas">
          <defs>
            <pattern id="${uid}-dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="currentColor" opacity=".14"/></pattern>
            <pattern id="${uid}-grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="currentColor" stroke-opacity=".06"/></pattern>
            <filter id="${uid}-noise"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .9 0"/></filter>
          </defs>
          ${canvasSvg}
        </svg>

        <div class="tml-overlay">
          <div class="tml-copy" data-tml="copy">
            <div class="tml-eyebrow fade" data-tml="eyebrow">State 00 · Idle</div>
            <p class="tml-headline" data-tml="headline"></p>
            <p class="tml-sub tml-muted fade" data-tml="sub"></p>
          </div>
          <div class="tml-stats">
            <div>
              <div class="tml-eyebrow tml-muted">Of 193 UN states</div>
              <div class="tml-pct tml-readout"><span data-tml="pct">0</span><span class="tml-rose">%</span></div>
            </div>
            <div class="tml-stats__aside">
              <div class="tml-chips" data-tml="chips"></div>
              <div class="tml-eyebrow tml-muted">Sample data · not your real count</div>
            </div>
          </div>
        </div>
      </div>
      <p class="tml-sr" aria-live="polite" data-tml="live"></p>
    </div>

    <div class="tml-timeline">
      <div class="tml-timeline__head">
        <span class="tml-eyebrow tml-c55">Timeline</span>
        <span class="tml-eyebrow tml-c40 tml-readout" data-tml="tl-time">00:00.00 / ${formatTime(duration)}</span>
      </div>
      <div class="tml-tl-grid" data-tml="tl-grid">
        <div></div>
        <div class="tml-ruler" data-tml="ruler"></div>
        <div class="tml-playhead-track"><div class="tml-playhead" data-tml="playhead"></div></div>
      </div>
    </div>
  </section>`;

  const q = (name) => root.querySelector(`[data-tml="${name}"]`);
  const part = (name) => root.querySelector(`[data-tml-part="${name}"]`);
  const stage = q('stage');
  const reducedQuery = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  const timers = new Set();
  const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; };
  const frame2 = (fn) => requestAnimationFrame(() => requestAnimationFrame(fn));
  let speed = 1;
  let current = -1;
  let autoTimer = null;
  let countRaf = null;
  let destroyed = false;
  let swapTimer = null;
  let booted = false;
  const announce = (s) => { q('live').textContent = `State ${s.tag}. ${splitHeadline(s.head).map((p) => p.w).join(' ')} ${s.sub || ''}`; };

  /* state buttons */
  const stateList = q('states');
  states.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tml-state-btn tml-btn';
    b.setAttribute('aria-pressed', 'false');
    if (i < 9) b.setAttribute('aria-keyshortcuts', String(i + 1));
    b.innerHTML = `<span class="tml-idx tml-readout" aria-hidden="true">${String(i).padStart(2, '0')}</span>`
      + `<span class="tml-state-label">${escapeHtml(s.btn)}</span>`
      + `<span class="tml-kbd tml-readout" aria-hidden="true">${i + 1}</span>`;
    b.addEventListener('click', () => { pause(); go(i); });
    stateList.appendChild(b);
  });

  /* layer toggles */
  const layerList = q('layers');
  layers.forEach((l) => {
    const li = document.createElement('li');
    li.innerHTML = `<label><input type="checkbox" class="tml-chk" ${l.on === false ? '' : 'checked'} data-l="${escapeHtml(l.id)}">`
      + `<span class="tml-layer-name">${escapeHtml(l.label)}</span><span class="tml-layer-file">${escapeHtml(l.file || `${l.id}.svg`)}</span></label>`;
    layerList.appendChild(li);
  });
  function setLayer(id, on) {
    root.querySelectorAll('.tml-svg [data-layer]').forEach((g) => { if (g.dataset.layer === id) g.classList.toggle('off', !on); });
    const box = layerList.querySelector(`input[data-l="${CSS.escape(id)}"]`);
    if (box) box.checked = !!on;
  }
  layerList.addEventListener('change', (e) => { if (e.target.dataset.l) setLayer(e.target.dataset.l, e.target.checked); });

  /* segmented controls */
  const mark = (name, v) => q(name).querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.v === String(v))));
  function seg(name, fn) {
    q(name).addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (b) fn(b.dataset.v);
    });
  }
  function setSpeed(v) {
    const n = parseFloat(v);
    speed = Number.isFinite(n) && n > 0 ? n : 1;
    root.style.setProperty('--k', String(1 / speed));
    mark('speed', speed);
    if (autoTimer) { pause(); play(); }
  }
  const setEase = (v) => { root.style.setProperty('--ease', v); mark('ease', v); };
  const setTheme = (v) => { stage.dataset.theme = v === 'paper' ? 'paper' : 'night'; mark('theme', stage.dataset.theme); };
  seg('speed', setSpeed);
  seg('ease', setEase);
  seg('theme', setTheme);

  /* timeline */
  const ruler = q('ruler');
  for (let i = 0; i * 0.6 <= duration + 1e-9; i++) {
    const s = Math.round(i * 0.6 * 10) / 10;
    const major = i % 2 === 0 && i * 0.6 < duration - 1e-9;
    const tick = document.createElement('div');
    tick.className = 'tml-tick';
    tick.style.left = `${(s / duration) * 100}%`;
    tick.style.height = `${major ? 8 : 4}px`;
    ruler.appendChild(tick);
    if (major) {
      const n = document.createElement('span');
      n.className = `tml-tick-label tml-readout${i === 0 ? ' tml-tick-label--first' : ''}`;
      n.style.left = `${(s / duration) * 100}%`;
      n.textContent = `${s.toFixed(1)}s`;
      ruler.appendChild(n);
    }
  }
  const grid = q('tl-grid');
  const playheadTrack = grid.querySelector('.tml-playhead-track');
  const keyframes = [];
  tracks.forEach((tr) => {
    const lab = document.createElement('div');
    lab.className = 'tml-eyebrow tml-c50 tml-track-label';
    lab.textContent = tr.label;
    const lane = document.createElement('div');
    lane.className = 'tml-lane';
    const at = (tr.at || []).filter((si) => states[si]);
    if (at.length > 1) {
      const a = tOf(states[at[0]]);
      const b = tOf(states[at[at.length - 1]]);
      const bar = document.createElement('div');
      bar.className = 'tml-bar';
      bar.style.left = `${(a / duration) * 100}%`;
      bar.style.width = `${((b - a) / duration) * 100}%`;
      lane.appendChild(bar);
    }
    at.forEach((si) => {
      const k = document.createElement('button');
      k.type = 'button';
      k.className = 'tml-kf';
      k.style.left = `${(tOf(states[si]) / duration) * 100}%`;
      k.setAttribute('aria-label', `${tr.label} keyframe, ${states[si].btn}`);
      k.dataset.s = String(si);
      k.addEventListener('click', () => { pause(); go(si); });
      lane.appendChild(k);
      keyframes.push(k);
    });
    grid.insertBefore(lab, playheadTrack);
    grid.insertBefore(lane, playheadTrack);
  });

  /* rendering */
  function headlineHTML(str) {
    return splitHeadline(str).map((p, i) => `<span class="w pre${p.acc ? ' acc' : ''}" style="transition-delay:calc(${i * 45}ms * var(--k))">${escapeHtml(p.w)}</span>`).join(' ');
  }

  function countTo(el, to) {
    cancelAnimationFrame(countRaf);
    const from = parseFloat(el.textContent) || 0;
    if (reducedQuery.matches || from === to) { el.textContent = formatPct(to); return; }
    const dur = 700 / speed;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = formatPct(from + (to - from) * e);
      if (p < 1 && !destroyed) countRaf = requestAnimationFrame(step);
    };
    countRaf = requestAnimationFrame(step);
  }

  function setChips(list) {
    const c = q('chips');
    c.innerHTML = (list || []).map((x, i) => `<span class="tml-chip tml-readout fade pre" style="transition-delay:calc(${120 + i * 50}ms * var(--k))">${escapeHtml(x)}</span>`).join('');
    frame2(() => c.querySelectorAll('.pre').forEach((n) => n.classList.remove('pre')));
  }

  function showParts(show) {
    Object.keys(show || {}).forEach((key) => {
      const el = part(key);
      if (!el) return;
      if (el.classList.contains('pin')) el.classList.toggle('dim', !show[key]);
      else el.classList.toggle('on', !!show[key]);
    });
  }

  function go(i, force) {
    if (typeof i === 'string' && /^\d+$/.test(i)) i = Number(i);
    if (destroyed || !Number.isInteger(i) || !states[i] || (i === current && !force)) return;
    const s = states[i];
    current = i;
    stateList.querySelectorAll('.tml-state-btn').forEach((b, j) => b.setAttribute('aria-pressed', j === i ? 'true' : 'false'));
    q('state-tag').textContent = `State ${s.tag}`;
    keyframes.forEach((k) => k.classList.toggle('lit', Number(k.dataset.s) === i));

    const copy = q('copy');
    copy.classList.add('out');
    if (swapTimer !== null) { clearTimeout(swapTimer); timers.delete(swapTimer); }
    swapTimer = later(() => {
      swapTimer = null;
      q('eyebrow').textContent = `State ${s.tag}`;
      q('headline').innerHTML = headlineHTML(s.head);
      q('sub').textContent = s.sub || '';
      q('sub').classList.add('pre');
      q('eyebrow').classList.add('pre');
      copy.classList.remove('out');
      frame2(() => copy.querySelectorAll('.pre').forEach((n) => n.classList.remove('pre')));
    }, (reducedQuery.matches ? 120 : 170) / speed);
    if (booted && !autoTimer) announce(s);

    countTo(q('pct'), Number(s.pct) || 0);
    setChips(s.chips);
    showParts(s.show);
    const focus = part('focus');
    if (focus && s.focus) focus.style.transform = `translate(${Number(s.focus.x)}px, ${Number(s.focus.y)}px)`;

    if (s.focus) {
      q('c-focus').textContent = s.focus.code || '';
      q('c-name').textContent = s.focus.name || '';
      q('c-lat').textContent = s.focus.lat || '';
      q('c-lon').textContent = s.focus.lon || '';
    }
    q('c-time').textContent = formatTime(tOf(s));
    q('tl-time').textContent = `${formatTime(tOf(s))} / ${formatTime(duration)}`;
    q('playhead').style.left = `${(tOf(s) / duration) * 100}%`;
  }

  function replay() {
    if (current < 0) return;
    Object.keys(states[current].show || {}).forEach((key) => {
      const el = part(key);
      if (el && !el.classList.contains('pin')) el.classList.remove('on');
    });
    q('pct').textContent = '0';
    frame2(() => go(current, true));
  }

  const autoBtn = q('autoplay');
  const autoIcon = q('autoplay-icon');
  function play() {
    if (autoTimer || destroyed) return;
    autoBtn.setAttribute('aria-pressed', 'true');
    autoIcon.textContent = '❚❚';
    autoTimer = setInterval(() => go((current + 1) % states.length), autoplayMs / speed);
  }
  function pause() {
    const wasPlaying = !!autoTimer;
    clearInterval(autoTimer);
    autoTimer = null;
    autoBtn.setAttribute('aria-pressed', 'false');
    autoIcon.textContent = '▶';
    if (wasPlaying && booted && !destroyed && states[current]) announce(states[current]);
  }
  autoBtn.addEventListener('click', () => { if (autoTimer) pause(); else { go((current + 1) % states.length); play(); } });
  q('replay').addEventListener('click', replay);

  /* keyboard: 1 to N pick a state, space toggles autoplay. Only while focus is inside this lab (so two labs never
     fight and the page's own keys are untouched), never while typing, and space never on a button. */
  if (!root.hasAttribute('tabindex')) root.tabIndex = -1; // a click on the panel or canvas background focuses the lab
  function onKey(e) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    if (!t || !root.contains(t)) return;
    if (t.closest && t.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]')) return;
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= states.length && String(n) === e.key) { pause(); go(n - 1); return; }
    if (e.key === ' ' && !(t.closest && t.closest('button'))) { e.preventDefault(); autoBtn.click(); }
  }
  if (options.hotkeys !== false) root.addEventListener('keydown', onKey);

  /* cursor position on the artboard */
  const svg = q('canvas');
  const cursor = q('c-cursor');
  function onMove(e) {
    const r = svg.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const x = Math.round(((e.clientX - r.left) / r.width) * artboard.width);
    const y = Math.round(((e.clientY - r.top) / r.height) * artboard.height);
    cursor.textContent = `x ${String(x).padStart(4, '0')} · y ${String(y).padStart(4, '0')}`;
  }
  const onLeave = () => { cursor.textContent = 'x ---- · y ----'; };
  svg.addEventListener('pointermove', onMove);
  svg.addEventListener('pointerleave', onLeave);

  function destroy() {
    destroyed = true;
    pause();
    cancelAnimationFrame(countRaf);
    timers.forEach((id) => clearTimeout(id));
    timers.clear();
    root.removeEventListener('keydown', onKey);
    svg.removeEventListener('pointermove', onMove);
    svg.removeEventListener('pointerleave', onLeave);
    root.innerHTML = '';
    root.classList.remove('tml');
    if (root.tabIndex === -1) root.removeAttribute('tabindex');
    root.style.removeProperty('--k');
    root.style.removeProperty('--ease');
  }

  go(0);
  booted = true;
  return { go, play, pause, replay, setLayer, setSpeed, setEase, setTheme, destroy, get current() { return current; } };
}
