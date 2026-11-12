/* Lottie adapter (lottie-web 5.12.2 from cdnjs, pinned). Loaded only when config.type is 'lottie' (or the paw stamp is a
   Lottie asset): the controller imports nothing from cdnjs until then.
   Builds: 'light' + svg renderer = lottie_light.min.js (about 46 KB gzipped); 'light' + canvas = lottie_light_canvas.min.js
   (about 54 KB); 'full' = lottie.min.js (about 76 KB), only if the export uses expressions. Sizes measured from the npm tarball. */
import { Emitter, loadScriptOnce } from './player-base.js';

export const LOTTIE_VERSION = '5.12.2';
const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/' + LOTTIE_VERSION + '/';
/* SRI computed from the npm tarball of the same version (cdnjs serves the npm files). Compare with cdnjs's listed SRI before going live. */
export const LOTTIE_BUILDS = {
  'light-svg':    { file: 'lottie_light.min.js',        integrity: 'sha384-Vtbz3QbtSBqleuQry6kQy5smig1gPZCXUoTFN7RmN9QW47xpEDsV/J1w0Pw0rDJu' },
  'light-canvas': { file: 'lottie_light_canvas.min.js', integrity: 'sha384-7smLPy87rn/83wziBl/IJ2/ijiuQpctXTpvFTe1pEG+Fzj8daB1DUrBMoCCkoO4/' },
  'full':         { file: 'lottie.min.js',              integrity: 'sha384-J8C0MvgX4WP58J4N2W99vCKd2J6z99ynOJ5bEfE6jeP7kVTW1drYtv/jzrxM5jbm' }
};

/** @param {{renderer?:string, lottieBuild?:string}} cfg */
export function lottieScriptFor(cfg) {
  const key = cfg.lottieBuild === 'full' ? 'full' : (cfg.renderer === 'canvas' ? 'light-canvas' : 'light-svg');
  const b = LOTTIE_BUILDS[key];
  return { src: CDN + b.file, integrity: b.integrity };
}

/**
 * @param {HTMLElement} mount
 * @param {{assetUrl?:string, animationData?:any, renderer?:'svg'|'canvas', lottieBuild?:'light'|'full', fps?:number, totalFrames?:number}} cfg
 * @returns {import('./player-base.js').Player & {markers:()=>Array<{name:string,from:number,to:number}>}}
 */
export function createLottiePlayer(mount, cfg) {
  const em = new Emitter();
  /** @type {any} */ let anim = null;
  let speed = 1, destroyed = false;
  /** @type {null|((how:'complete'|'interrupted')=>void)} */ let done = null;
  let segTo = 0;

  const abs = () => anim ? Math.round((anim.firstFrame || 0) + (anim.currentFrame || 0)) : 0;
  function settle(how) { const d = done; done = null; if (d) d(how); }

  const player = {
    kind: 'lottie', fps: cfg.fps || 30, totalFrames: cfg.totalFrames || 150,
    async load() {
      const s = lottieScriptFor(cfg);
      await loadScriptOnce(s.src, s.integrity);
      if (destroyed) throw new Error('destroyed');
      /** @type {any} */ const lottie = /** @type {any} */ (window).lottie || /** @type {any} */ (window).bodymovin;
      if (!lottie) throw new Error('lottie-web did not define window.lottie');
      await new Promise((ok, no) => {
        const opts = {
          container: mount, renderer: cfg.renderer === 'canvas' ? 'canvas' : 'svg', loop: false, autoplay: false,
          rendererSettings: { preserveAspectRatio: 'xMidYMid meet', progressiveLoad: true, hideOnTransparent: true }
        };
        if (cfg.animationData) opts.animationData = typeof cfg.animationData === 'string' ? JSON.parse(cfg.animationData) : cfg.animationData;
        else if (cfg.assetUrl) opts.path = cfg.assetUrl;
        else { no(new Error('No Lottie export configured: set assetUrl or animationData')); return; }
        anim = lottie.loadAnimation(opts);
        anim.addEventListener('DOMLoaded', () => ok(undefined));
        anim.addEventListener('data_failed', () => no(new Error('The Lottie file did not load')));
        anim.addEventListener('error', () => no(new Error('The Lottie file could not be read')));
        if (anim.isLoaded) ok(undefined); /* inline JSON can finish inside loadAnimation, before the listener exists */
      });
      if (destroyed) throw new Error('destroyed');
      const d = anim.animationData || {};
      if (d.fr) player.fps = d.fr;
      if (d.op != null) player.totalFrames = Math.round(d.op - (d.ip || 0));
      anim.addEventListener('enterFrame', () => em.emit('frame', abs()));
      anim.addEventListener('complete', () => {
        if (!done) return;
        anim.resetSegments(true); anim.goToAndStop(segTo, true);
        em.emit('frame', segTo);
        settle('complete');
      });
      anim.resetSegments(true); anim.goToAndStop(0, true);
      em.emit('loaded');
    },
    playSegment(from, to, opts) {
      settle('interrupted');
      if (!anim) return Promise.resolve('interrupted');
      if (opts && opts.speed) player.setSpeed(opts.speed);
      segTo = to;
      return new Promise((res) => { done = res; anim.playSegments([from, to], true); });
    },
    goToFrame(n) { settle('interrupted'); if (!anim) return; anim.resetSegments(true); anim.goToAndStop(n, true); em.emit('frame', n); },
    /* lottie-web's own loop stops scheduling frames once no animation is playing, so pause() is a full stop. */
    pause() { if (anim) anim.pause(); },
    resume() { if (anim && done) anim.play(); },
    setSpeed(s) { speed = s > 0 ? s : 1; if (anim) anim.setSpeed(speed); },
    currentFrame: abs,
    layer(sel) { return mount.querySelector(sel); },
    /** Markers the export carries (After Effects / Fable markers): [{name, from, to}]. */
    markers() {
      const list = (anim && anim.animationData && anim.animationData.markers) || [];
      return list.map((m) => {
        let name = m.cm;
        try { const j = JSON.parse(m.cm); if (j && j.name) name = j.name; } catch (e) { /* plain text comment */ }
        return { name: String(name), from: Math.round(m.tm), to: Math.round(m.tm + (m.dr || 0)) };
      });
    },
    destroy() { destroyed = true; settle('interrupted'); if (anim) { anim.destroy(); anim = null; } em.clear(); },
    on(ev, fn) { return em.on(ev, fn); }
  };
  return player;
}
