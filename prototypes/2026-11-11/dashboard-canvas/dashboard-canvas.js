/* That Layover Life · 02 · Your travel dashboard · animation controller (prototype, November 12, 2026).
   Plays an animation exported from Fable inside the dashboard chapter, driven by an explicit state machine.
   Until the export arrives it plays the STAND-IN ANIMATION (players/standin-player.js), behind the same player interface.
   Plain ES module, no build step. Types: dashboard-canvas.d.ts. How to drop the export in: README.md. */

/* =====================================================================================================
   FABLE_CONFIG: paste the export keys here. Everything else in this file reads from this object.
   ===================================================================================================== */
export const FABLE_CONFIG = {
  /* 1. The kind of export. Keep 'standin' until the Fable file is here.
        'lottie' : Lottie JSON (lottie-web is loaded from cdnjs only in this case)
        'svg'    : an interactive SVG with named <g id> groups (animated with the Web Animations API, no library)
        'canvas' : a canvas or WebGL wrapper that exposes seek(frame)
        'standin': the stand-in drawn by players/standin-player.js */
  type: 'standin',

  /* 2. Where the export is. Pass it inline: animationData for Lottie, svg for SVG. The page then fetches nothing.
        assetUrl (Lottie only) makes lottie-web load the JSON from a URL. Leave it empty unless the owner approves
        that load for the real site. */
  assetUrl: '',          /* Lottie only, owner decision: a pinned URL to the Lottie JSON */
  animationData: null,   /* type 'lottie': paste the Lottie JSON object (or string) here */
  svg: '',               /* type 'svg' only: paste the SVG markup here (the SVG adapter never fetches) */
  timeline: [],          /* type 'svg' only: [{ target:'#group-id', from, to, keyframes:[...], easing }] */
  create: null,          /* type 'canvas' only: (mount) => ({ seek(frame), resize?, setData?, destroy? }) */
  moduleUrl: '',         /* type 'canvas' only: or a same-origin ES module exporting createScene(mount) */

  /* 3. Player settings. */
  renderer: 'svg',       /* Lottie: 'svg' (lottie_light, smallest) or 'canvas' (lottie_light_canvas) */
  lottieBuild: 'light',  /* 'light', or 'full' only if the export uses expressions */
  fps: 30,
  totalFrames: 150,
  aspectRatio: [960, 470], /* the export's width and height; locks the stage. 960x470 matches the live map. */
  speed: 1,
  loadTimeoutMs: 8000,   /* after this the error state shows and the still map stays */

  /* 4. Markers. Frame numbers from the brief. If the export carries markers with these names
        (Lottie "markers", cm = name), their frames win over the numbers here. */
  markers: {
    A:      { name: 'The Blank Map',       from: 0,  to: 45 },
    B:      { name: 'The Stamp Drop',      from: 46, to: 90 },
    C:      { name: 'The Connected Route', from: 91, to: 150 },
    /* Played on signup:success. A marker named 'Map Unfold' in the export replaces the default sequence (A then C). */
    UNFOLD: { name: 'Map Unfold', sequence: ['A', 'C'] }
  },

  /* 5. The Paw Passport Stamp micro-interaction (pointer or focus on the €9 pet guide).
        'css'  : a separate small element [data-dc-paw] rotates and shifts color with CSS (the stand-in)
        'layer': a named layer inside the main export (its id, e.g. Lottie layer "ln") gets the same CSS class
        'asset': a second small export with its own player; plays enter on pointer/focus in, leave on out */
  paw: {
    mode: 'css',
    layer: 'paw-passport-stamp',
    asset: { type: 'lottie', assetUrl: '', animationData: null, renderer: 'svg', fps: 30, totalFrames: 24, enter: [0, 12], leave: [12, 24] }
  },

  /* 6. Airport hubs for the pointer layer and the keyboard list. lat/lon are the airports' published coordinates.
        x/y (0 to 1 across the canvas) are worked out with the live map's projection when left out;
        set them by hand if the Fable art is drawn on a different projection. */
  hubs: [
    { code: 'CPH', name: 'Copenhagen', lat: 55.6181, lon: 12.6561, note: 'Live layover guide' },
    { code: 'SOF', name: 'Sofia', lat: 42.6952, lon: 23.4062, note: 'Live layover guide' },
    { code: 'FRA', name: 'Frankfurt', lat: 50.0333, lon: 8.5706 },
    { code: 'IST', name: 'Istanbul', lat: 41.2622, lon: 28.7428 },
    { code: 'DOH', name: 'Doha', lat: 25.2731, lon: 51.6081 },
    { code: 'SIN', name: 'Singapore Changi', lat: 1.3592, lon: 103.9894 },
    { code: 'GRU', name: 'São Paulo Guarulhos', lat: -23.4356, lon: -46.4731 },
    { code: 'JFK', name: 'New York JFK', lat: 40.6398, lon: -73.7789 }
  ],
  /* The C segment needs two places. With fewer than two stamps it traces this SAMPLE route (the two live guides). */
  sampleRoute: ['CPH', 'SOF'],

  /* 7. Stand-in only. */
  standin: { simulatedLoadMs: 700, failMode: 'none' }
};

/* ===================================================================================================== */

import { Emitter, RAF_STATS } from './players/player-base.js';
import { createLottiePlayer } from './players/lottie-player.js';
import { createSvgPlayer } from './players/svg-player.js';
import { createCanvasPlayer } from './players/canvas-player.js';
import { createStandInPlayer } from './players/standin-player.js';
import { STANDIN_MASK } from './players/standin-mask.js';

/** Equal Earth, fitted exactly as the live chapter's h3-dash-js fits it (960x470, 8px inset, no Antarctica).
 *  @param {number} lat @param {number} lon @returns {{x:number,y:number}} normalized 0..1 */
export function projectToCanvas(lat, lon) {
  const A1 = 1.340264, A2 = -0.081106, A3 = 0.000893, A4 = 0.003796, M = Math.sqrt(3) / 2;
  const lam = lon * Math.PI / 180, phi = lat * Math.PI / 180;
  const l = Math.asin(M * Math.sin(phi)), l2 = l * l, l6 = l2 * l2 * l2;
  const X = lam * Math.cos(l) / (M * (A1 + 3 * A2 * l2 + l6 * (7 * A3 + 9 * A4 * l2)));
  const Y = l * (A1 + A2 * l2 + l6 * (A3 + A4 * l2));
  const m = STANDIN_MASK;
  return { x: (m.translate[0] + m.scale * X) / m.w, y: (m.translate[1] - m.scale * Y) / m.h };
}

/** "55.62° N · 12.66° E" @param {number} lat @param {number} lon */
export function formatCoords(lat, lon) {
  return Math.abs(lat).toFixed(2) + '° ' + (lat >= 0 ? 'N' : 'S') + ' · ' + Math.abs(lon).toFixed(2) + '° ' + (lon >= 0 ? 'E' : 'W');
}
/** @param {number} lat @param {number} lon */
function spokenCoords(lat, lon) {
  return Math.abs(lat).toFixed(2) + ' degrees ' + (lat >= 0 ? 'north' : 'south') + ', ' + Math.abs(lon).toFixed(2) + ' degrees ' + (lon >= 0 ? 'east' : 'west');
}
const WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];
/** "Three places on your map." @param {number} n */
export function placesSentence(n) {
  if (!n) return 'No places on your map yet.';
  return (WORDS[n] || String(n)) + (n === 1 ? ' place' : ' places') + ' on your map.';
}

/* The queue rule, in one place (README, "Queued transitions"):
   1. A segment that is playing always finishes, except when signup:success arrives: Map Unfold replaces it at once
      and clears the queue (it replays the whole map, so nothing queued is lost).
   2. Any other trigger during playback goes into a one-slot queue. A newer trigger takes the slot if its priority
      is the same or higher (C over B); a lower one is dropped. Many quick ticks therefore replay B once more, not N times.
      Counts and the spoken announcement update at once for every tick; only the animation is coalesced.
   3. Retriggering the segment that is playing: B queues one replay (each tick replays it), C is ignored (hover jitter).
   4. A plays once. A trigger before A has played first plays A, then the trigger. Map Unfold opens with A itself,
      so a signup that comes first plays Map Unfold once, with no separate A before it.
   5. While loading, off screen or in a hidden tab, triggers wait in the same slot and play on return.
   6. With reduced motion nothing plays: each trigger jumps to its segment's end frame.
   7. A ends on the blank map. If places are already stamped when A ends, B follows to drop them in (or, with reduced
      motion, A jumps to B's end frame), so the resting frame never shows fewer places than the reader has.
   8. A queued B waits for the stamps added since the last B or Map Unfold began (pendingDrops). If every one of them
      is removed before B plays, the queued B is dropped, so a tick then untick never replays an empty Stamp Drop. */
const PRIORITY = { A: 0, B: 1, C: 2, UNFOLD: 3 };
const RETRIGGER = { A: 'ignore', B: 'queue', C: 'ignore', UNFOLD: 'ignore' };

/** @typedef {'idle'|'loading'|'ready'|'playing:A'|'playing:B'|'playing:C'|'playing:unfold'|'paused:offscreen'|'reduced-motion'|'error'} DashState */
/** @typedef {{label:string, from:number, to:number}} Step */
/** @typedef {{id:string, label:string, x:number, y:number}} Stamp */

export class DashboardCanvas {
  /**
   * @param {HTMLElement} root  the chapter element holding the [data-dc-*] parts
   * @param {typeof FABLE_CONFIG} [config]
   */
  constructor(root, config = FABLE_CONFIG) {
    this.root = root;
    this.config = config;
    this.em = new Emitter();
    /** @type {DashState} */ this.state = 'idle';
    /** @type {import('./players/player-base.js').Player|null} */ this.player = null;
    /** @type {import('./players/player-base.js').Player|null} */ this.pawPlayer = null;
    this.loaded = false;
    this.frame = 0; this.restFrame = 0;
    this.aPlayed = false; this.wantA = false;
    /** @type {null|{id:number,key:string,steps:Step[],i:number}} */ this.run = null;
    /** @type {string|null} */ this.queue = null;
    /** Stamps added since the last Stamp Drop (B) or Map Unfold started. A queued B is only worth playing while this is not empty. */
    /** @type {string[]} */ this.pendingDrops = [];
    this.inView = false; this.pageVisible = !document.hidden; this.nearScreen = false;
    this.reduced = false;
    /** @type {DashState} */ this.resumeTo = 'ready';
    this.runId = 0; this.loadId = 0;
    /** @type {Stamp[]} */ this.stamps = [];
    this.lastSaid = '';
    this.stats = RAF_STATS;
    /** @type {Array<() => void>} */ this._off = [];
    const q = (s) => /** @type {HTMLElement|null} */ (root.querySelector(s));
    this.el = {
      stage: q('[data-dc-stage]'), mount: q('[data-dc-player]'), overlay: q('[data-dc-pointer]'), tip: q('[data-dc-tip]'),
      paw: q('[data-dc-paw]'), live: q('[data-dc-live]'), desc: q('[data-dc-desc]'), hubs: q('[data-dc-hubs]'),
      count: q('[data-dc-count]'), note: q('[data-dc-note]')
    };
    this.hubs = config.hubs.map((h) => Object.assign({}, h, (h.x == null || h.y == null) ? projectToCanvas(h.lat, h.lon) : {}));
    this.segments = this._resolveSegments([]);
  }

  /* ------------------------------------------------------------------ public API */

  /** Wire observers and listeners. Nothing heavy loads until the chapter is near the screen. */
  start() {
    const r = this.root, st = this.el.stage;
    r.setAttribute('data-js', '');
    r.setAttribute('data-type', this.config.type);
    if (st) st.style.setProperty('--tll-dc-ratio', this.config.aspectRatio[0] + ' / ' + this.config.aspectRatio[1]);
    this._renderHubs();
    this._renderText();
    this._setState('idle', 'start');

    const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    if (mq) {
      this.reduced = mq.matches;
      const onMq = () => this._setReduced(mq.matches);
      mq.addEventListener ? mq.addEventListener('change', onMq) : mq.addListener(onMq);
      this._off.push(() => mq.removeEventListener ? mq.removeEventListener('change', onMq) : mq.removeListener(onMq));
    }
    const onVis = () => { this.pageVisible = !document.hidden; this._emit('visibility', { pageVisible: this.pageVisible }); this._activity('page ' + (this.pageVisible ? 'visible' : 'hidden')); };
    document.addEventListener('visibilitychange', onVis);
    this._off.push(() => document.removeEventListener('visibilitychange', onVis));

    if (!st || !('IntersectionObserver' in window)) { this.inView = true; this.nearScreen = true; this._load(); this.trigger('view'); return this; }
    /* Lazy load: start loading the player and the export when the stage is within 600px of the screen (as h3-dash-js does). */
    const near = new IntersectionObserver((en) => {
      if (en.some(e => e.isIntersecting)) { near.disconnect(); this.nearScreen = true; this._load(); }
    }, { rootMargin: '600px 0px' });
    near.observe(st);
    /* Activity: any pixel on screen counts as in view; 35% on screen counts as "seen", which plays A once. */
    const seen = new IntersectionObserver((en) => {
      const e = en[en.length - 1];
      const was = this.inView;
      this.inView = e.isIntersecting;
      r.setAttribute('data-inview', String(this.inView));
      if (was !== this.inView) { this._emit('visibility', { inView: this.inView }); this._activity(this.inView ? 'on screen' : 'off screen'); }
      if (e.isIntersecting && e.intersectionRatio >= 0.35) this.trigger('view');
    }, { threshold: [0, 0.35] });
    seen.observe(st);
    this._off.push(() => { near.disconnect(); seen.disconnect(); });
    return this;
  }

  /**
   * Fire a trigger. Names: 'view', 'stamp:add', 'stamp:remove', 'cta:enter', 'cta:leave', 'signup:success', 'pet:enter', 'pet:leave'.
   * @param {string} name @param {any} [detail]
   */
  trigger(name, detail) {
    this._emit('trigger', { name, detail });
    switch (name) {
      case 'view': this.wantA = true; this._request('A', name); break;
      case 'stamp:add': {
        const s = this._stampFrom(detail); if (!s) return;
        if (!this.stamps.some(x => x.id === s.id)) this.stamps.push(s);
        if (!this.pendingDrops.includes(s.id)) this.pendingDrops.push(s.id);
        this._stampsChanged();
        this._say('Stamp added. ' + placesSentence(this.stamps.length));
        this._request('B', name); break;
      }
      case 'stamp:remove': {
        const id = typeof detail === 'string' ? detail : (detail && (detail.id || detail.code));
        const before = this.stamps.length;
        this.stamps = this.stamps.filter(x => x.id !== id);
        if (this.stamps.length === before) return;
        /* Tick then untick while something plays: the queued Stamp Drop would drop nothing, so take it out of the slot. */
        const waiting = this.pendingDrops.length;
        this.pendingDrops = this.pendingDrops.filter(x => x !== id);
        if (this.queue === 'B' && waiting && !this.pendingDrops.length) {
          this.queue = null;
          this._emit('queue', { key: 'B', action: 'dropped', why: 'the stamp it would drop was removed', queue: null });
        }
        this._stampsChanged();
        this._say('Stamp removed. ' + placesSentence(this.stamps.length));
        break;
      }
      case 'cta:enter': this._request('C', name); break;
      case 'cta:leave': break; /* C always finishes; leaving the CTA does not rewind the route */
      case 'signup:success': this._say('Signed up. Your map is unfolding.'); this._request('UNFOLD', name); break;
      case 'pet:enter': this._paw(true); break;
      case 'pet:leave': this._paw(false); break;
      default: console.warn('[dashboard-canvas] unknown trigger', name);
    }
  }

  /** Replace every stamp at once (the real site passes the member's saved places here). @param {Array<any>} list */
  setStamps(list) {
    this.stamps = (list || []).map(d => this._stampFrom(d)).filter(Boolean);
    this._stampsChanged();
  }

  /** @param {string} ev @param {(d:any)=>void} fn */
  on(ev, fn) { return this.em.on(ev, fn); }

  /** @param {number} s */
  setSpeed(s) { this.config.speed = s; if (this.player) this.player.setSpeed(s); }

  /** Start again from idle (used after an error, and by the demo's "Reload player"). */
  reload() {
    this._teardownPlayer();
    this.run = null; this.queue = null; this.pendingDrops = []; this.aPlayed = false; this.restFrame = 0; this.frame = 0;
    this._setState('idle', 'reload');
    if (this.nearScreen) this._load();
    if (this.inView) this.wantA = true;
  }

  /** Everything the demo inspector shows. */
  snapshot() {
    return {
      state: this.state, frame: Math.round(this.frame), restFrame: this.restFrame, queue: this.queue,
      running: this.run ? this.run.key : null, inView: this.inView, pageVisible: this.pageVisible, reduced: this.reduced,
      aPlayed: this.aPlayed, player: this.player ? this.player.kind : this.config.type, stamps: this.stamps.length,
      raf: { callbacks: RAF_STATS.callbacks, whilePaused: RAF_STATS.whilePaused }
    };
  }

  destroy() {
    this._teardownPlayer();
    this._off.forEach(f => f()); this._off = [];
    this.em.clear();
  }

  /* ------------------------------------------------------------------ state machine */

  /** @param {DashState} next @param {string} reason */
  _setState(next, reason) {
    const from = this.state;
    if (from === next && reason !== 'start') return;
    this.state = next;
    this.root.setAttribute('data-state', next);
    this._emit('statechange', { from, to: next, reason });
  }

  _canPlay() { return this.loaded && this.state !== 'error' && this.inView && this.pageVisible && !this.reduced; }

  /** @param {string} key @param {string} why */
  _request(key, why) {
    if (!this.segments[key]) return;
    if (this.state === 'error') { this._emit('queue', { key, action: 'ignored', why: 'error state' }); return; }
    if (key === 'A' && this.aPlayed) return;
    if (this.reduced) {
      if (this.loaded) this._jump(key); else this.queue = this._merge(this.queue, key);
      return;
    }
    if (this.run) {
      if (key === 'UNFOLD' && this.run.key !== 'UNFOLD') {
        this._emit('queue', { key, action: 'replaces', replaced: this.run.key });
        this.queue = null;
        if (this._canPlay()) { this._play('UNFOLD'); return; }
        const step = this.run.steps[this.run.i];
        this.run = null;
        if (this.player && step) { this.player.goToFrame(step.to); this.restFrame = step.to; }
        this.resumeTo = 'ready';
        this.queue = 'UNFOLD';
        return;
      }
      if (key === this.run.key && RETRIGGER[key] === 'ignore') { this._emit('queue', { key, action: 'dropped', why: key + ' is already playing' }); return; }
      this._enqueue(key);
      return;
    }
    if (!this._canPlay()) { this._enqueue(key); return; }
    if (!this.aPlayed && key !== 'A' && key !== 'UNFOLD') { this._enqueue(key); this._play('A'); return; }
    this._play(key);
  }

  /** @param {string} key */
  _enqueue(key) {
    if (key === 'A') return; /* A waits on wantA, not in the slot */
    const before = this.queue;
    this.queue = this._merge(this.queue, key);
    this._emit('queue', { key, action: this.queue === key ? (before && before !== key ? 'replaced ' + before : 'queued') : 'dropped', queue: this.queue });
  }

  /** @param {string|null} pending @param {string} key */
  _merge(pending, key) {
    if (!pending || key === pending) return key;
    return PRIORITY[key] >= PRIORITY[pending] ? key : pending;
  }

  /** @param {string} key */
  _play(key) {
    const seg = this.segments[key];
    const run = { id: ++this.runId, key, steps: seg.steps, i: 0 };
    this.run = run;
    if (key === 'A' || key === 'UNFOLD') this.aPlayed = true;
    if (key === 'UNFOLD') this.queue = null;
    if (key === 'B' || key === 'UNFOLD') this.pendingDrops = [];
    this._step(run);
  }

  /** @param {{id:number,key:string,steps:Step[],i:number}} run */
  _step(run) {
    if (run !== this.run || !this.player) return;
    if (run.i >= run.steps.length) { this._finishRun(run); return; }
    const st = run.steps[run.i];
    this._setState(/** @type {DashState} */ ('playing:' + st.label), run.key);
    this._emit('segmentstart', { key: run.key, label: st.label, from: st.from, to: st.to });
    this.player.playSegment(st.from, st.to, { speed: this.config.speed }).then((how) => {
      if (run !== this.run || how !== 'complete') return; /* a newer run, or we interrupted it: ignore */
      this.restFrame = st.to;
      this._emit('segmentend', { key: run.key, label: st.label, frame: st.to });
      run.i++;
      this._step(run);
    });
  }

  /** @param {{id:number,key:string,steps:Step[],i:number}} run */
  _finishRun(run) {
    this.run = null;
    /* A ends on the blank map. If the reader already has places (a member's saved map), drop them in next,
       so the resting frame never shows fewer places than the reader has. */
    if (run.key === 'A' && this.stamps.length && !this.queue) this.queue = 'B';
    this._done(run.key);
    if (!this.inView || !this.pageVisible) { this.resumeTo = 'ready'; this._setState('paused:offscreen', 'finished off screen'); return; }
    this._setState('ready', run.key + ' finished');
    this._drain();
  }

  _drain() {
    if (this.run || !this._canPlay()) return;
    if (!this.aPlayed && this.wantA && this.queue !== 'UNFOLD') { this._play('A'); return; } /* Map Unfold already opens with A */
    if (this.queue) { const k = this.queue; this.queue = null; this._emit('queue', { key: k, action: 'dequeued' }); this._request(k, 'queue'); }
  }

  /** Reduced motion: no playback, straight to the end frame. @param {string} key */
  _jump(key) {
    /* A's end frame is the blank map; with places already stamped, rest on the Stamp Drop's end frame instead */
    const segKey = key === 'A' && this.stamps.length ? 'B' : key;
    const seg = this.segments[segKey]; if (!seg || !this.player) return;
    if (segKey === 'B' || segKey === 'UNFOLD') this.pendingDrops = [];
    const end = seg.steps[seg.steps.length - 1].to;
    this.aPlayed = true; /* every later end frame already contains A's map, so a late "view" must not jump back to 45 */
    this.player.goToFrame(end);
    this.restFrame = end; this.frame = end;
    this._emit('segmentend', { key, label: key === 'UNFOLD' ? 'unfold' : key, frame: end, jumped: true });
    this._done(key);
  }

  /** What to say when a segment is done. @param {string} key */
  _done(key) {
    if (key === 'A') this._say('The map is open. ' + placesSentence(this.stamps.length));
    else if (key === 'C') {
      if (this.stamps.length >= 2) this._say('Route drawn through your ' + (WORDS[this.stamps.length] || String(this.stamps.length)).toLowerCase() + ' places.', true);
      else this._say('Sample route drawn from ' + this._routeNames() + '.', true);
    } else if (key === 'UNFOLD') this._say('Your map is ready. ' + placesSentence(this.stamps.length));
  }

  /** Off screen or hidden tab: pause everything; back: resume exactly where it was. @param {string} why */
  _activity(why) {
    if (!this.loaded || this.state === 'error') { if (this.inView && this.pageVisible) this._drain(); return; }
    const active = this.inView && this.pageVisible;
    if (!active) {
      if (this.state !== 'paused:offscreen') {
        this.resumeTo = this.state;
        if (this.player) this.player.pause();
        if (this.pawPlayer) this.pawPlayer.pause();
        this._setState('paused:offscreen', why);
      }
      return;
    }
    if (this.state === 'paused:offscreen') {
      const to = this.reduced ? 'reduced-motion' : this.resumeTo;
      this._setState(to, why);
      if (this.run && this.player) this.player.resume();
      if (this.pawPlayer) this.pawPlayer.resume();
    }
    this._drain();
  }

  /** @param {boolean} on */
  _setReduced(on) {
    this.reduced = on;
    this._emit('reduced', { reduced: on });
    if (!this.loaded || this.state === 'error') return;
    if (on) {
      const run = this.run;
      this.run = null;
      if (run) this._jump(run.key);
      if (this.queue) { const k = this.queue; this.queue = null; this._jump(k); }
      if (this.state === 'paused:offscreen') this.resumeTo = 'reduced-motion';
      else this._setState('reduced-motion', 'reduced motion on');
    } else {
      if (this.state === 'paused:offscreen') this.resumeTo = 'ready';
      else { this._setState('ready', 'reduced motion off'); this._drain(); }
    }
  }

  /* ------------------------------------------------------------------ loading */

  _load() {
    if (this.player || this.state === 'loading') return;
    const id = ++this.loadId;
    this.loaded = false;
    this._setState('loading', 'near screen');
    const mount = this.el.mount;
    if (!mount) { this._fail(new Error('No [data-dc-player] element')); return; }
    let player;
    try { player = this._createPlayer(mount, this.config); } catch (e) { this._fail(e); return; }
    this.player = player;
    const timeout = setTimeout(() => { if (id === this.loadId && !this.loaded) this._fail(new Error('The animation took longer than ' + this.config.loadTimeoutMs + ' ms to load')); }, this.config.loadTimeoutMs);
    player.load().then(() => {
      clearTimeout(timeout);
      if (id !== this.loadId || this.player !== player || this.state === 'error') { player.destroy(); return; } /* late, after a timeout or reload */
      this._onLoaded();
    }).catch((err) => {
      clearTimeout(timeout);
      if (id !== this.loadId) return;
      this._fail(err);
    });
    if (this.config.paw.mode === 'asset') this._loadPaw();
  }

  _onLoaded() {
    const p = /** @type {any} */ (this.player);
    this.loaded = true;
    this.segments = this._resolveSegments(typeof p.markers === 'function' ? p.markers() : []);
    p.on('frame', (f) => { this.frame = f; this._emit('frame', f); });
    this.root.setAttribute('data-player', p.kind);
    if (p.setData) p.setData({ stamps: this.stamps });
    p.setSpeed(this.config.speed);
    p.goToFrame(0);
    this._emit('loaded', { kind: p.kind, segments: this.segments });
    const resting = this.reduced ? 'reduced-motion' : 'ready';
    if (!this.inView || !this.pageVisible) { this.resumeTo = resting; this._setState('paused:offscreen', 'loaded off screen'); }
    else this._setState(resting, 'loaded');
    if (this.reduced) {
      if (this.wantA) this._jump('A');
      if (this.queue) { const k = this.queue; this.queue = null; this._jump(k); }
      return;
    }
    this._drain();
  }

  /** @param {any} err */
  _fail(err) {
    this.loadId++;
    this._teardownPlayer();
    this._setState('error', String(err && err.message || err));
    if (this.el.note) this.el.note.hidden = false;
    this._emit('error', { message: String(err && err.message || err) });
    this._say('The animation did not load. The still map and this description stay in place.');
  }

  _teardownPlayer() {
    if (this.player) { this.player.destroy(); this.player = null; }
    if (this.pawPlayer) { this.pawPlayer.destroy(); this.pawPlayer = null; }
    this.loaded = false;
    if (this.el.mount) this.el.mount.innerHTML = '';
    if (this.el.note) this.el.note.hidden = true;
    this.root.removeAttribute('data-player');
  }

  /** @param {HTMLElement} mount @param {any} cfg */
  _createPlayer(mount, cfg) {
    switch (cfg.type) {
      case 'lottie': return createLottiePlayer(mount, cfg);
      case 'svg': return createSvgPlayer(mount, cfg);
      case 'canvas': return createCanvasPlayer(mount, cfg);
      case 'standin': return createStandInPlayer(mount, Object.assign({}, cfg.standin, { sampleRoute: this._routePoints() }));
      default: throw new Error('Unknown export type: ' + cfg.type);
    }
  }

  /** Marker names in the export win over the numbers in the config. @param {Array<{name:string,from:number,to:number}>} found */
  _resolveSegments(found) {
    const m = this.config.markers, byName = new Map(found.map(x => [x.name.trim().toLowerCase(), x]));
    /** @type {Record<string, {steps: Step[]}>} */ const out = {};
    ['A', 'B', 'C'].forEach((k) => {
      const hit = byName.get(String(m[k].name).toLowerCase());
      out[k] = { steps: [{ label: k, from: hit ? hit.from : m[k].from, to: hit ? hit.to : m[k].to }] };
    });
    const u = m.UNFOLD, hit = byName.get(String(u.name).toLowerCase());
    if (hit) out.UNFOLD = { steps: [{ label: 'unfold', from: hit.from, to: hit.to }] };
    else if (u.from != null && u.to != null) out.UNFOLD = { steps: [{ label: 'unfold', from: u.from, to: u.to }] };
    else out.UNFOLD = { steps: (u.sequence || ['A', 'C']).map(k => out[k].steps[0]) };
    return out;
  }

  /* ------------------------------------------------------------------ Paw Passport Stamp */

  /** @param {boolean} on */
  _paw(on) {
    const p = this.config.paw;
    this.root.setAttribute('data-paw', on ? 'on' : 'off');
    if (p.mode === 'css' && this.el.paw) this.el.paw.classList.toggle('is-paw-on', on);
    else if (p.mode === 'layer') {
      const el = this.player && this.player.layer ? this.player.layer('#' + p.layer) : null;
      if (el) el.classList.toggle('is-paw-on', on);
    } else if (p.mode === 'asset' && this.pawPlayer) {
      const seg = on ? p.asset.enter : p.asset.leave;
      if (this.reduced || !this.inView || !this.pageVisible) this.pawPlayer.goToFrame(on ? p.asset.enter[1] : 0);
      else this.pawPlayer.playSegment(seg[0], seg[1]);
    }
    this._emit('paw', { on, mode: p.mode });
  }

  _loadPaw() {
    const a = this.config.paw.asset, mount = this.el.paw;
    if (!mount) return;
    const pl = this._createPlayer(mount, Object.assign({ type: 'lottie' }, a));
    this.pawPlayer = pl;
    pl.load().catch(() => { if (this.pawPlayer === pl) { pl.destroy(); this.pawPlayer = null; } });
  }

  /* ------------------------------------------------------------------ stamps, text fallback, live region */

  /** @param {any} d @returns {Stamp|null} */
  _stampFrom(d) {
    if (!d) return null;
    const code = typeof d === 'string' ? d : d.code;
    const hub = code ? this.hubs.find(h => h.code === code) : null;
    if (hub) return { id: code, label: d.label || hub.name, x: hub.x, y: hub.y };
    if (d.x != null && d.y != null) return { id: String(d.id || d.label), label: String(d.label || d.id), x: d.x, y: d.y };
    if (d.lat != null && d.lon != null) { const p = projectToCanvas(d.lat, d.lon); return { id: String(d.id || d.label), label: String(d.label || d.id), x: p.x, y: p.y }; }
    return null;
  }

  _stampsChanged() {
    if (this.player && this.player.setData) this.player.setData({ stamps: this.stamps });
    /* when resting, redraw the resting frame so a removed stamp disappears at once */
    if (this.player && this.loaded && !this.run) this.player.goToFrame(this.restFrame);
    this._renderText();
    this._emit('stamps', { count: this.stamps.length });
  }

  _routePoints() {
    return (this.config.sampleRoute || []).map(c => this.hubs.find(h => h.code === c)).filter(Boolean).map(h => ({ x: h.x, y: h.y }));
  }
  _routeNames() {
    return (this.config.sampleRoute || []).map(c => { const h = this.hubs.find(x => x.code === c); return h ? h.name : c; }).join(' to ');
  }

  _renderText() {
    const n = this.stamps.length;
    if (this.el.count) this.el.count.textContent = n ? n + (n === 1 ? ' place' : ' places') + ' stamped' : 'No stamps yet';
    if (this.el.desc) {
      const kind = this.config.type === 'standin' ? 'A stand-in animation of the travel map. ' : 'An animated travel map. ';
      const places = n ? 'Stamped: ' + this.stamps.map(s => s.label).join(', ') + '. ' : 'No places stamped yet. ';
      const hubs = 'Airport hubs marked on the map, also listed below: ' + this.hubs.map(h => h.code + ' ' + h.name).join(', ') + '.';
      this.el.desc.textContent = kind + 'It starts as a blank world map, drops a stamp for each place you add, and draws a route between them. ' + places + placesSentence(n) + ' ' + hubs;
    }
  }

  /** Polite live region. The same sentence twice in a row is said once (hover can fire C often). @param {string} text @param {boolean} [dedupe] */
  _say(text, dedupe) {
    if (dedupe && text === this.lastSaid) return;
    this.lastSaid = text;
    const live = this.el.live;
    this._emit('announce', { text });
    if (!live) return;
    live.textContent = '';
    setTimeout(() => { live.textContent = text; }, 60);
  }

  /* ------------------------------------------------------------------ hubs: pointer layer, tooltip, keyboard list */

  _renderHubs() {
    const { overlay, hubs: list, tip } = this.el;
    if (overlay) {
      overlay.querySelectorAll('.tll-dc__mark').forEach(n => n.remove());
      this.hubs.forEach((h) => {
        const m = document.createElement('span');
        m.className = 'tll-dc__mark'; m.setAttribute('aria-hidden', 'true'); m.dataset.hub = h.code;
        m.style.left = (h.x * 100).toFixed(3) + '%'; m.style.top = (h.y * 100).toFixed(3) + '%';
        overlay.appendChild(m);
      });
      const move = (/** @type {PointerEvent} */ e) => {
        const r = overlay.getBoundingClientRect();
        const px = e.clientX - r.left, py = e.clientY - r.top, rad = e.pointerType === 'touch' ? 30 : 22;
        let best = null, bd = Infinity;
        this.hubs.forEach((h) => { const d = Math.hypot(h.x * r.width - px, h.y * r.height - py); if (d < bd) { bd = d; best = h; } });
        if (best && bd <= rad) this._tip(best, 'pointer'); else this._tip(null, 'pointer');
      };
      overlay.addEventListener('pointermove', move);
      overlay.addEventListener('pointerdown', move);
      /* A finger lifting fires pointerleave at once, so a tapped tooltip stays until the next tap elsewhere or Escape. */
      overlay.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'touch') this._tip(null, 'pointer'); });
      const outside = (/** @type {PointerEvent} */ e) => { if (this._tipSrc === 'pointer' && !overlay.contains(/** @type {Node} */ (e.target))) this._tip(null, 'pointer'); };
      document.addEventListener('pointerdown', outside);
      this._off.push(() => document.removeEventListener('pointerdown', outside));
    }
    if (list) {
      list.innerHTML = '';
      this.hubs.forEach((h) => {
        const li = document.createElement('li');
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'tll-dc__hub'; b.dataset.hub = h.code;
        b.innerHTML = '<span aria-hidden="true">' + h.code + '</span><span class="tll-dc-sr">' + h.code + ', ' + h.name + ', ' + spokenCoords(h.lat, h.lon) + (h.note ? '. ' + h.note : '') + '</span>';
        b.addEventListener('focus', () => this._tip(h, 'focus'));
        b.addEventListener('blur', () => this._tip(null, 'focus'));
        b.addEventListener('mouseenter', () => this._tip(h, 'list'));
        b.addEventListener('mouseleave', () => this._tip(null, 'list'));
        li.appendChild(b); list.appendChild(li);
      });
    }
    if (tip) {
      const esc = (/** @type {KeyboardEvent} */ e) => { if (e.key === 'Escape' && !tip.hidden) this._tip(null, 'escape'); };
      document.addEventListener('keydown', esc);
      this._off.push(() => document.removeEventListener('keydown', esc));
    }
  }

  /** @param {any} h @param {string} src */
  _tip(h, src) {
    const tip = this.el.tip; if (!tip) return;
    if (!h) {
      if (src === 'escape' || this._tipSrc === src) { tip.hidden = true; this._tipSrc = null; this._mark(null); }
      return;
    }
    this._tipSrc = src;
    tip.innerHTML = '<b>' + h.code + '</b> ' + h.name + '<br>' + formatCoords(h.lat, h.lon);
    tip.style.left = (h.x * 100).toFixed(3) + '%';
    tip.style.top = (h.y * 100).toFixed(3) + '%';
    tip.classList.toggle('is-left', h.x > 0.7);
    tip.classList.toggle('is-right', h.x < 0.15);
    tip.classList.toggle('is-below', h.y < 0.3);
    tip.hidden = false;
    this._mark(h.code);
    if (src === 'focus') setTimeout(() => this._tipIntoView(), 0);
    this._emit('hub', { code: h.code, source: src });
  }
  /** The hub buttons sit under the map, so on a wide screen a focused button can be on screen while its tooltip
   *  (up on the map) is not. Scroll just enough to show both, when both fit; otherwise leave the page alone. */
  _tipIntoView() {
    const tip = this.el.tip, btn = /** @type {HTMLElement|null} */ (document.activeElement);
    if (!tip || tip.hidden || this._tipSrc !== 'focus' || !btn || !btn.classList.contains('tll-dc__hub')) return;
    const t = tip.getBoundingClientRect(), b = btn.getBoundingClientRect();
    if (t.top >= 0 && t.bottom <= window.innerHeight) return;
    const top = Math.min(t.top, b.top) - 8, bottom = Math.max(t.bottom, b.bottom) + 8;
    /* keep clear of anything fixed to the bottom edge (scroll-padding-bottom) when there is room for that too */
    const padB = parseFloat(getComputedStyle(document.documentElement).scrollPaddingBottom) || 0;
    const room = bottom - top <= window.innerHeight - padB ? window.innerHeight - padB : window.innerHeight;
    if (bottom - top > room) return;
    window.scrollBy(0, t.top < 0 ? top : bottom - room);
  }

  /** @param {string|null} code */
  _mark(code) {
    if (!this.el.overlay) return;
    this.el.overlay.querySelectorAll('.tll-dc__mark').forEach(m => m.classList.toggle('is-on', /** @type {HTMLElement} */ (m).dataset.hub === code));
  }

  /** @param {string} ev @param {any} d */
  _emit(ev, d) { this.em.emit(ev, d); this.em.emit('*', { type: ev, detail: d }); }
}

/** Helper for the real site and the demo: find the chapter and start it. @param {HTMLElement|string} [root] @param {typeof FABLE_CONFIG} [config] */
export function mountDashboardCanvas(root = '[data-dc]', config = FABLE_CONFIG) {
  const el = typeof root === 'string' ? /** @type {HTMLElement|null} */ (document.querySelector(root)) : root;
  if (!el) return null;
  return new DashboardCanvas(el, config).start();
}
