/* Shared pieces for every player adapter: the common interface (as JSDoc), a tiny event emitter, and the frame clock.
   The frame clock is the only requestAnimationFrame loop in this layer. It runs only while a segment is playing,
   and pause() cancels the pending frame, so a paused clock schedules nothing. */

/**
 * @typedef {'frame'|'loaded'|'complete'|'error'} PlayerEvent
 */

/**
 * @typedef {Object} PlayOptions
 * @property {number} [speed]  Playback rate, 1 = the export's own frame rate.
 */

/**
 * The interface every adapter implements. The controller only talks to this.
 * @typedef {Object} Player
 * @property {string} kind                           'lottie' | 'svg' | 'canvas' | 'standin'
 * @property {number} fps
 * @property {number} totalFrames
 * @property {() => Promise<void>} load               Resolves when the first frame can be shown; rejects on failure.
 * @property {(from:number, to:number, opts?:PlayOptions) => Promise<'complete'|'interrupted'>} playSegment
 * @property {(n:number) => void} goToFrame           Shows frame n and stops there.
 * @property {() => void} pause                       Freezes playback and stops any frame loop.
 * @property {() => void} resume                      Continues a paused segment from where it stopped.
 * @property {(s:number) => void} setSpeed
 * @property {() => number} currentFrame
 * @property {() => void} destroy
 * @property {(event:PlayerEvent, fn:(detail:any) => void) => () => void} on   Returns an unsubscribe function.
 * @property {(data:any) => void} [setData]           Optional: data-driven players (the stand-in) take the stamps here.
 * @property {(selector:string) => (Element|null)} [layer]  Optional: a named layer inside the export (svg and lottie-svg).
 */

export class Emitter {
  constructor() { /** @type {Map<string, Set<Function>>} */ this._h = new Map(); }
  /** @param {string} ev @param {(d:any)=>void} fn */
  on(ev, fn) {
    if (!this._h.has(ev)) this._h.set(ev, new Set());
    this._h.get(ev).add(fn);
    return () => { const s = this._h.get(ev); if (s) s.delete(fn); };
  }
  /** @param {string} ev @param {any} [detail] */
  emit(ev, detail) {
    const s = this._h.get(ev);
    if (!s) return;
    [...s].forEach(fn => { try { fn(detail); } catch (e) { console.error('[dashboard-canvas] listener for ' + ev + ' failed', e); } });
  }
  clear() { this._h.clear(); }
}

/** Counters the controller and the demo inspector read. One object for the whole page. */
export const RAF_STATS = { callbacks: 0, whilePaused: 0 };

/**
 * Drives a seek(frame) function with requestAnimationFrame, for the canvas and stand-in adapters.
 * Time-based, so a slow phone drops frames instead of slowing the animation down.
 */
export class FrameClock {
  /** @param {{fps:number, seek:(f:number)=>void, onFrame?:(f:number)=>void}} o */
  constructor(o) {
    this.fps = o.fps; this.seek = o.seek; this.onFrame = o.onFrame || (() => {});
    this.frame = 0; this.speed = 1; this.paused = false; this.running = false;
    this._id = 0; this._last = null; this._to = 0; this._done = null;
    this._tick = this._tick.bind(this);
  }
  _schedule() {
    if (this._id || this.paused || !this.running) return;
    this._id = requestAnimationFrame((t) => {
      RAF_STATS.callbacks++;
      if (this.paused) RAF_STATS.whilePaused++;
      this._id = 0;
      this._tick(t);
    });
  }
  _cancel() { if (this._id) { cancelAnimationFrame(this._id); this._id = 0; } }
  /** @param {number} t */
  _tick(t) {
    if (this.paused || !this.running) return;
    if (this._last == null) this._last = t;
    const dt = Math.min(100, t - this._last); /* a long gap (tab switch) never skips the whole segment */
    this._last = t;
    this.frame = Math.min(this._to, this.frame + dt / 1000 * this.fps * this.speed);
    this.seek(this.frame); this.onFrame(this.frame);
    if (this.frame >= this._to) { this._finish('complete'); return; }
    this._schedule();
  }
  /** @param {'complete'|'interrupted'} how */
  _finish(how) {
    this.running = false; this._cancel(); this._last = null;
    const d = this._done; this._done = null;
    if (d) d(how);
  }
  /** @param {number} from @param {number} to @returns {Promise<'complete'|'interrupted'>} */
  play(from, to) {
    this._finish('interrupted');
    this.frame = from; this._to = to; this.running = true; this.paused = false; this._last = null;
    this.seek(from); this.onFrame(from);
    return new Promise((res) => { this._done = res; this._schedule(); });
  }
  /** @param {number} f */
  goTo(f) { this._finish('interrupted'); this.frame = f; this.seek(f); this.onFrame(f); }
  pause() { this.paused = true; this._cancel(); this._last = null; }
  resume() { if (!this.paused) return; this.paused = false; this._last = null; this._schedule(); }
  /** @param {number} s */
  setSpeed(s) { this.speed = s > 0 ? s : 1; }
  destroy() { this._finish('interrupted'); this.paused = true; }
}

/** Loads a classic script once (lottie-web). Pinned URL plus optional SRI. @param {string} src @param {string} [integrity] */
export function loadScriptOnce(src, integrity) {
  /** @type {any} */ const w = window;
  w.__tllScripts = w.__tllScripts || {};
  if (w.__tllScripts[src]) return w.__tllScripts[src];
  w.__tllScripts[src] = new Promise((ok, no) => {
    const s = document.createElement('script');
    s.src = src; s.async = true;
    if (integrity) { s.integrity = integrity; s.crossOrigin = 'anonymous'; }
    s.onload = () => ok(undefined);
    s.onerror = () => { delete w.__tllScripts[src]; no(new Error('Could not load ' + src)); };
    document.head.appendChild(s);
  });
  return w.__tllScripts[src];
}
