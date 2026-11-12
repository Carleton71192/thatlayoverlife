/* Canvas / WebGL wrapper adapter. For an export that draws itself and exposes a seek(frame) function.
   The wrapper owns the clock (FrameClock, the one rAF loop), so the export never runs its own loop:
   when the controller pauses, nothing draws and nothing is scheduled.

   config.create(mount) must return (or resolve to) a "scene":
     { seek(frame:number): void, resize?(cssWidth:number, cssHeight:number, dpr:number): void,
       setData?(data:any): void, totalFrames?: number, fps?: number, destroy?(): void }
   or config.moduleUrl: a same-origin ES module whose export createScene(mount) returns the same. */
import { Emitter, FrameClock } from './player-base.js';

/**
 * @typedef {Object} CanvasScene
 * @property {(frame:number) => void} seek
 * @property {(w:number, h:number, dpr:number) => void} [resize]
 * @property {(data:any) => void} [setData]
 * @property {number} [totalFrames]
 * @property {number} [fps]
 * @property {() => void} [destroy]
 */

/**
 * @param {HTMLElement} mount
 * @param {{create?:(mount:HTMLElement)=>CanvasScene|Promise<CanvasScene>, moduleUrl?:string, fps?:number, totalFrames?:number, kind?:string}} cfg
 * @returns {import('./player-base.js').Player}
 */
export function createCanvasPlayer(mount, cfg) {
  const em = new Emitter();
  /** @type {CanvasScene|null} */ let scene = null;
  /** @type {ResizeObserver|null} */ let ro = null;
  let destroyed = false;
  const clock = new FrameClock({ fps: cfg.fps || 30, seek: (f) => { if (scene) scene.seek(f); }, onFrame: (f) => em.emit('frame', f) });

  const player = {
    kind: cfg.kind || 'canvas', fps: cfg.fps || 30, totalFrames: cfg.totalFrames || 150,
    async load() {
      let make = cfg.create;
      if (!make && cfg.moduleUrl) { const m = await import(cfg.moduleUrl); make = m.createScene; }
      if (typeof make !== 'function') throw new Error('No canvas export configured: set create or moduleUrl');
      scene = await make(mount);
      if (destroyed) { if (scene && scene.destroy) scene.destroy(); throw new Error('destroyed'); }
      if (!scene || typeof scene.seek !== 'function') throw new Error('The canvas export has no seek(frame) function');
      if (scene.fps) { player.fps = scene.fps; clock.fps = scene.fps; }
      if (scene.totalFrames) player.totalFrames = scene.totalFrames;
      /* Resizing redraws the current frame once; it never starts a loop. */
      if (scene.resize && 'ResizeObserver' in window) {
        ro = new ResizeObserver((entries) => {
          const r = entries[0].contentRect;
          if (!scene || !r.width) return;
          scene.resize(r.width, r.height, Math.min(2, window.devicePixelRatio || 1));
          scene.seek(clock.frame);
        });
        ro.observe(mount);
      }
      clock.goTo(0);
      em.emit('loaded');
    },
    playSegment(from, to, opts) { if (opts && opts.speed) clock.setSpeed(opts.speed); return clock.play(from, to); },
    goToFrame(n) { clock.goTo(n); },
    pause() { clock.pause(); },
    resume() { clock.resume(); },
    setSpeed(s) { clock.setSpeed(s); },
    currentFrame: () => Math.round(clock.frame),
    setData(d) { if (scene && scene.setData) { scene.setData(d); scene.seek(clock.frame); } },
    layer(sel) { return mount.querySelector(sel); },
    destroy() { destroyed = true; clock.destroy(); if (ro) ro.disconnect(); if (scene && scene.destroy) scene.destroy(); scene = null; em.clear(); },
    on(ev, fn) { return em.on(ev, fn); }
  };
  return player;
}
