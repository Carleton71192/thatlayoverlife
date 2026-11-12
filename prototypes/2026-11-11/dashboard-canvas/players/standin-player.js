/* STAND-IN ANIMATION: replace with the Fable export.
   Draws the same 150-frame timeline (30 fps, three segments) on a 2D canvas so every state and trigger can be clicked
   through before the export exists. It runs behind the canvas adapter, so it uses the same clock, pause and seek path a
   Fable WebGL/canvas export would.
     0 to 45    The Blank Map: the land grid sweeps in west to east, no stamps.
     46 to 90   The Stamp Drop: the newest stamp drops in and settles; earlier stamps are already there.
     91 to 150  The Connected Route: a fast line trace joins the stamps in the order they were added.
   Stamps come from setData({stamps}); the stand-in never draws a place it was not given. */
import { createCanvasPlayer } from './canvas-player.js';
import { STANDIN_MASK } from './standin-mask.js';

const C_DOT = 'rgba(247,241,232,0.30)', C_SWEEP = 'rgba(0,201,200,0.55)', C_STAMP = '#F0507A', C_ROUTE = '#00C9C8', C_HEAD = '#F7F1E8';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const easeOut3 = (t) => 1 - Math.pow(1 - t, 3);
const easeOut4 = (t) => 1 - Math.pow(1 - t, 4);

/** Decode the hex rows into a list of land cells [col,row]. */
function landCells() {
  const m = STANDIN_MASK, out = [];
  m.rowsHex.forEach((hex, r) => {
    for (let i = 0; i < hex.length; i++) {
      const n = parseInt(hex[i], 16);
      for (let b = 0; b < 4; b++) if (n & (8 >> b)) { const c = i * 4 + b; if (c < m.cols) out.push([c, r]); }
    }
  });
  return out;
}

/**
 * @param {{simulatedLoadMs?:number, failMode?:'none'|'error'|'timeout', sampleRoute?:Array<{x:number,y:number}>}} opts
 */
export function createStandInScene(opts) {
  return async function create(/** @type {HTMLElement} */ mount) {
    if (opts.simulatedLoadMs) await new Promise(r => setTimeout(r, opts.simulatedLoadMs));
    if (opts.failMode === 'error') throw new Error('Simulated load error (demo control)');
    if (opts.failMode === 'timeout') await new Promise(() => {}); /* never resolves: the controller's timeout takes over */

    const cv = document.createElement('canvas');
    cv.setAttribute('aria-hidden', 'true');
    cv.className = 'tll-dc__canvas';
    mount.appendChild(cv);
    const ctx = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d'));
    const cells = landCells();
    const M = STANDIN_MASK;
    let W = 0, H = 0, dpr = 1, cssW = 0;
    /** @type {Array<{x:number,y:number}>} */ let stamps = [];
    /** @type {Array<{x:number,y:number}>} */ const sample = opts.sampleRoute || [];

    function size(w, h, d) {
      cssW = w; dpr = d; W = Math.round(w * d); H = Math.round(h * d);
      if (cv.width !== W) cv.width = W;
      if (cv.height !== H) cv.height = H;
    }
    const r0 = mount.getBoundingClientRect();
    size(r0.width || 960, r0.height || 470, Math.min(2, window.devicePixelRatio || 1));

    /** sizes are CSS px scaled down a little on phones, never below 60% */
    const px = (v) => v * dpr * clamp(cssW / 960, 0.6, 1);

    function stamp(x, y, scale, alpha) {
      ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.scale(scale, scale);
      ctx.strokeStyle = C_STAMP; ctx.lineWidth = px(2.5);
      ctx.beginPath(); ctx.arc(0, 0, px(11), 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = alpha * 0.45; ctx.lineWidth = px(1.25);
      ctx.beginPath(); ctx.arc(0, 0, px(16), 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = alpha; ctx.fillStyle = C_STAMP;
      ctx.beginPath(); ctx.arc(0, 0, px(3.5), 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    /** sampled points along curved hops between the given places (in device px), with running length */
    function routePoints(list) {
      const pts = []; let len = 0;
      for (let i = 0; i < list.length - 1; i++) {
        const a = { x: list[i].x * W, y: list[i].y * H }, b = { x: list[i + 1].x * W, y: list[i + 1].y * H };
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
        let nx = -dy / d, ny = dx / d; if (ny > 0) { nx = -nx; ny = -ny; } /* bow the arc north */
        const cx = mx + nx * d * 0.22, cy = my + ny * d * 0.22;
        for (let s = (i === 0 ? 0 : 1); s <= 28; s++) {
          const t = s / 28, x = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * cx + t * t * b.x, y = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * cy + t * t * b.y;
          if (pts.length) len += Math.hypot(x - pts[pts.length - 1].x, y - pts[pts.length - 1].y);
          pts.push({ x, y, len });
        }
      }
      return { pts, len };
    }

    function draw(f) {
      ctx.clearRect(0, 0, W, H);
      /* 0 to 45: the land grid sweeps in */
      const cw = W / M.cols, ch = H / M.rows, r = Math.max(0.6 * dpr, Math.min(cw, ch) * 0.22);
      ctx.fillStyle = C_DOT;
      if (f >= 45) {
        ctx.beginPath();
        for (const [c, rw] of cells) { const x = (c + 0.5) * cw, y = (rw + 0.5) * ch; ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, Math.PI * 2); }
        ctx.fill();
      } else {
        for (const [c, rw] of cells) {
          const a = clamp((f - (c / M.cols) * 30) / 15, 0, 1);
          if (!a) continue;
          ctx.globalAlpha = a; ctx.beginPath(); ctx.arc((c + 0.5) * cw, (rw + 0.5) * ch, r, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
        if (f < 32) { const x = (f / 30) * W; ctx.fillStyle = C_SWEEP; ctx.fillRect(x, 0, Math.max(1, dpr), H); }
      }
      /* 46 to 90: the stamp drop (earlier stamps sit still) */
      if (f >= 46 && stamps.length) {
        const last = stamps.length - 1;
        stamps.forEach((s, i) => {
          const x = s.x * W, y = s.y * H;
          if (i < last || f >= 90) { stamp(x, y, 1, 1); return; }
          const p = easeOut3(clamp((f - 46) / 26, 0, 1));
          stamp(x, y, 1 + 1.4 * (1 - p), p);
          const q = clamp((f - 66) / 24, 0, 1);
          if (q > 0 && q < 1) { ctx.save(); ctx.globalAlpha = (1 - q) * 0.6; ctx.strokeStyle = C_STAMP; ctx.lineWidth = px(1.5); ctx.beginPath(); ctx.arc(x, y, px(11) * (1 + q * 1.4), 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
        });
      }
      /* 91 to 150: the connected route, a fast trace */
      if (f >= 91) {
        const list = stamps.length >= 2 ? stamps : sample;
        if (list.length >= 2) {
          const { pts, len } = routePoints(list);
          const p = easeOut4(clamp((f - 91) / 40, 0, 1)), upto = len * p;
          ctx.save(); ctx.strokeStyle = C_ROUTE; ctx.lineWidth = px(2); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          if (stamps.length < 2) ctx.setLineDash([px(6), px(5)]); /* SAMPLE route between the two live guides: dashed */
          ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
          let head = pts[0];
          for (let i = 1; i < pts.length && pts[i - 1].len < upto; i++) {
            const a = pts[i - 1], b = pts[i];
            if (b.len <= upto) { ctx.lineTo(b.x, b.y); head = b; }
            else { const t = (upto - a.len) / ((b.len - a.len) || 1); head = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, len: upto }; ctx.lineTo(head.x, head.y); }
          }
          ctx.stroke(); ctx.restore();
          const fade = 1 - clamp((f - 131) / 15, 0, 1);
          if (fade > 0) { ctx.save(); ctx.globalAlpha = fade; ctx.fillStyle = C_HEAD; ctx.beginPath(); ctx.arc(head.x, head.y, px(3.5), 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
        }
      }
    }

    return {
      fps: 30, totalFrames: 150,
      seek: draw,
      resize: (w, h, d) => size(w, h, d),
      setData: (d) => { stamps = (d && d.stamps) ? d.stamps.slice() : []; },
      destroy: () => { cv.remove(); }
    };
  };
}

/** @param {HTMLElement} mount @param {{fps?:number,totalFrames?:number,simulatedLoadMs?:number,failMode?:any,sampleRoute?:any}} cfg */
export function createStandInPlayer(mount, cfg) {
  return createCanvasPlayer(mount, { kind: 'standin', fps: 30, totalFrames: 150, create: createStandInScene(cfg) });
}
