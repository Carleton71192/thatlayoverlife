/* Inline SVG adapter: an SVG export whose parts are named <g id="..."> groups, animated with the Web Animations API.
   No library and no requestAnimationFrame of its own. Every group animation sits on one shared clock of
   totalFrames / fps seconds; seeking sets currentTime on all of them, playing a segment plays them all and stops
   them at the segment's last frame. Paused animations cost nothing.

   config.svg: the SVG markup (string) or config.assetUrl (same-origin .svg).
   config.timeline: [{ target: '#stamp-1', from: 46, to: 70, keyframes: [{opacity:0, transform:'scale(1.6)'}, {opacity:1, transform:'none'}], easing: 'ease-out' }]
   Frames are the export's frames; from/to say when each group moves on the shared clock. */
import { Emitter } from './player-base.js';

/**
 * @param {HTMLElement} mount
 * @param {{svg?:string, assetUrl?:string, timeline?:Array<{target:string, from:number, to:number, keyframes:Keyframe[], easing?:string}>, fps?:number, totalFrames?:number}} cfg
 * @returns {import('./player-base.js').Player}
 */
export function createSvgPlayer(mount, cfg) {
  const em = new Emitter();
  const fps = cfg.fps || 30, total = cfg.totalFrames || 150;
  const ms = (f) => f / fps * 1000;
  /** @type {Animation[]} */ let anims = [];
  let frame = 0, speed = 1, destroyed = false, timer = 0, segTo = 0, segStartedAt = 0, segStartFrame = 0, isPaused = false;
  /** @type {null|((how:'complete'|'interrupted')=>void)} */ let done = null;

  function settle(how) { clearTimeout(timer); timer = 0; const d = done; done = null; if (d) d(how); }
  function seekAll(f) { frame = f; anims.forEach(a => { a.pause(); a.currentTime = ms(f); }); em.emit('frame', f); }
  function liveFrame() {
    if (!done || isPaused) return frame;
    return Math.min(segTo, segStartFrame + (performance.now() - segStartedAt) / 1000 * fps * speed);
  }
  function arm() {
    const left = ms(segTo - frame) / speed;
    segStartedAt = performance.now(); segStartFrame = frame;
    timer = setTimeout(() => { seekAll(segTo); settle('complete'); }, Math.max(0, left));
  }

  return {
    kind: 'svg', fps, totalFrames: total,
    async load() {
      let markup = cfg.svg || '';
      if (!markup && cfg.assetUrl) {
        const r = await fetch(cfg.assetUrl);
        if (!r.ok) throw new Error('The SVG export did not load (' + r.status + ')');
        markup = await r.text();
      }
      if (destroyed) throw new Error('destroyed');
      if (!/<svg[\s>]/i.test(markup)) throw new Error('No SVG export configured: set svg or assetUrl');
      mount.innerHTML = markup;
      const svg = mount.querySelector('svg');
      if (svg) { svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false'); svg.style.width = '100%'; svg.style.height = '100%'; }
      if (typeof Element.prototype.animate !== 'function') throw new Error('This browser has no Web Animations API');
      anims = [];
      (cfg.timeline || []).forEach((t) => {
        mount.querySelectorAll(t.target).forEach((el) => {
          /** @type {any} */ (el).style.transformBox = 'fill-box';
          /** @type {any} */ (el).style.transformOrigin = 'center';
          const a = el.animate(t.keyframes, {
            delay: ms(t.from), duration: Math.max(1, ms(t.to - t.from)),
            /* endDelay keeps every effect "active" to the end of the shared clock, so play() never auto-rewinds a finished one */
            endDelay: ms(total - t.to) + 1000, fill: 'both', easing: t.easing || 'linear'
          });
          a.pause();
          anims.push(a);
        });
      });
      seekAll(0);
      em.emit('loaded');
    },
    playSegment(from, to, opts) {
      settle('interrupted');
      if (opts && opts.speed) speed = opts.speed;
      seekAll(from); segTo = to; isPaused = false;
      return new Promise((res) => {
        done = res;
        anims.forEach(a => { a.playbackRate = speed; a.play(); });
        arm();
      });
    },
    goToFrame(n) { settle('interrupted'); seekAll(n); },
    pause() {
      if (!done || isPaused) return;
      frame = liveFrame(); isPaused = true; clearTimeout(timer); timer = 0;
      anims.forEach(a => a.pause());
      if (anims[0] && anims[0].currentTime != null) frame = Number(anims[0].currentTime) / 1000 * fps;
    },
    resume() {
      if (!done || !isPaused) return;
      isPaused = false;
      anims.forEach(a => { a.playbackRate = speed; a.play(); });
      arm();
    },
    setSpeed(s) {
      if (done && !isPaused) { frame = liveFrame(); clearTimeout(timer); }
      speed = s > 0 ? s : 1; anims.forEach(a => { a.playbackRate = speed; });
      if (done && !isPaused) arm();
    },
    currentFrame: () => Math.round(liveFrame()),
    layer(sel) { return mount.querySelector(sel); },
    destroy() { destroyed = true; settle('interrupted'); anims.forEach(a => a.cancel()); anims = []; mount.innerHTML = ''; em.clear(); },
    on(ev, fn) { return em.on(ev, fn); }
  };
}
