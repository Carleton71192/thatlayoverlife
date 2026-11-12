/* Demo wiring for index.html only. On the real site these listeners live in the chapter's embed script;
   the controller and FABLE_CONFIG stay as they are. Everything here is a mock: SAMPLE trips, a pretend signup. */
import { FABLE_CONFIG, DashboardCanvas, projectToCanvas, formatCoords } from './dashboard-canvas.js';
import { RAF_STATS, FrameClock } from './players/player-base.js';
import { createLottiePlayer, lottieScriptFor } from './players/lottie-player.js';
import { createSvgPlayer } from './players/svg-player.js';
import { createCanvasPlayer } from './players/canvas-player.js';
import { createStandInPlayer } from './players/standin-player.js';

const root = /** @type {HTMLElement} */ (document.querySelector('[data-dc]'));
const dash = new DashboardCanvas(root, FABLE_CONFIG);

/* ---------------- Mock Memberstack. On the live site: the signup callback calls dash.trigger('signup:success'). */
const mockMemberstack = {
  /** @type {Array<(m:any)=>void>} */ _cbs: [],
  /** @param {(m:any)=>void} cb */ onSignup(cb) { this._cbs.push(cb); },
  signup() { const m = { id: 'mem_sample', sample: true }; this._cbs.forEach(cb => cb(m)); }
};
mockMemberstack.onSignup(() => dash.trigger('signup:success'));

/* ---------------- Inspector (subscribes to controller events; it never schedules frames of its own) */
const ins = /** @type {HTMLElement} */ (document.querySelector('[data-insp]'));
const f = (k) => /** @type {HTMLElement} */ (ins.querySelector('[data-i="' + k + '"]'));
const log = /** @type {HTMLElement} */ (ins.querySelector('[data-i-log]'));
let offBase = null, offCount = 0;
function paint() {
  const s = dash.snapshot();
  f('state').textContent = s.state;
  f('frame').textContent = String(s.frame);
  f('queue').textContent = s.queue || 'empty';
  f('view').textContent = s.inView ? 'yes' : 'no';
  f('page').textContent = s.pageVisible ? 'visible' : 'hidden';
  f('rm').textContent = s.reduced ? 'on' : 'off';
  if (offBase != null) offCount = RAF_STATS.callbacks - offBase;
  f('raf').textContent = String(offCount);
  f('rafall').textContent = String(RAF_STATS.callbacks);
}
/** @param {string} t */
function note(t) {
  const li = document.createElement('li');
  li.textContent = t;
  log.prepend(li);
  while (log.children.length > 6) log.lastChild && log.removeChild(log.lastChild);
}
dash.on('*', (e) => {
  const d = e.detail || {};
  if (e.type === 'statechange') {
    note(d.from + ' → ' + d.to + (d.reason ? ' (' + d.reason + ')' : ''));
    if (d.to === 'paused:offscreen') { offBase = RAF_STATS.callbacks; offCount = 0; }
    else if (d.from === 'paused:offscreen') { if (offBase != null) offCount = RAF_STATS.callbacks - offBase; offBase = null; }
  } else if (e.type === 'queue') note('queue: ' + d.key + ' ' + d.action);
  else if (e.type === 'trigger' && d.name !== 'view') note('trigger: ' + d.name);
  else if (e.type === 'announce') note('said: "' + d.text + '"');
  if (e.type !== 'frame' || (RAF_STATS.callbacks % 3 === 0)) paint();
});
const toggle = /** @type {HTMLButtonElement} */ (ins.querySelector('[data-i-toggle]'));
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? 'Hide' : 'Show';
  ins.classList.toggle('is-closed', !open);
});
/* Starts closed at every width: open, it is fixed over the bottom left of the page and would cover keyboard focus there. */
toggle.click();
const nextLoad = /** @type {HTMLSelectElement} */ (ins.querySelector('[data-i-next]'));
ins.querySelector('[data-i-reload]').addEventListener('click', () => {
  FABLE_CONFIG.standin.failMode = /** @type {any} */ (nextLoad.value);
  dash.reload();
});

/* ---------------- Triggers */
/* B: SAMPLE trips. Each tick adds a stamp and replays The Stamp Drop; unticking removes it without animation. */
document.querySelectorAll('[data-trip]').forEach((box) => {
  box.addEventListener('change', () => {
    const b = /** @type {HTMLInputElement} */ (box);
    dash.trigger(b.checked ? 'stamp:add' : 'stamp:remove', { code: b.value, label: b.dataset.label });
  });
});
/* C: hover or keyboard focus on the CTA */
const cta = /** @type {HTMLElement} */ (document.querySelector('[data-dc-cta]'));
cta.addEventListener('pointerenter', () => dash.trigger('cta:enter'));
cta.addEventListener('focus', () => dash.trigger('cta:enter'));
cta.addEventListener('pointerleave', () => dash.trigger('cta:leave'));
cta.addEventListener('blur', () => dash.trigger('cta:leave'));
/* Map Unfold: the pretend signup */
document.querySelector('[data-demo-signup]').addEventListener('click', () => mockMemberstack.signup());
/* Paw Passport Stamp: pointer or focus on the €9 pet guide */
const pet = /** @type {HTMLElement} */ (document.querySelector('[data-dc-pet]'));
pet.addEventListener('pointerenter', () => dash.trigger('pet:enter'));
pet.addEventListener('pointerleave', () => { if (!pet.contains(document.activeElement)) dash.trigger('pet:leave'); });
pet.addEventListener('focusin', () => dash.trigger('pet:enter'));
pet.addEventListener('focusout', (e) => { if (!pet.contains(/** @type {Node} */ (e.relatedTarget))) dash.trigger('pet:leave'); });
document.querySelector('[data-pet-demo]').addEventListener('click', () => {
  const n = document.getElementById('pet-demo-note');
  if (n) n.textContent = 'Demo only: no checkout here. On the site this opens the guide on Ko-fi.';
});

dash.start();
paint();

/* For the browser check (check.cjs) and for poking at it from the console. */
/** @type {any} */ (window).TLLDash = {
  dash, FABLE_CONFIG, RAF_STATS, FrameClock, projectToCanvas, formatCoords, mockMemberstack, lottieScriptFor,
  adapters: { createLottiePlayer, createSvgPlayer, createCanvasPlayer, createStandInPlayer }
};
