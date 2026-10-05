// Builds a static preview of the percent card in every layout, theme and state with the board's sample data.
// Usage: node scripts/build-shareables-preview.mjs  → design-review/prototypes/shareables/percent-preview.html
import { writeFileSync } from 'node:fs';
import { renderPercentCard } from '../src/shareables/percent-card.js';

const HUMAN = ['076','276','203','703','040','008','688','100','752','807','348','616','208','704','840','499','288','392','484','152','032','578','246','528','056','250','724','620','380','300','191','705','070','642','826','372','756','233','428','440','504','818','710','404','764','116','360','702','458','608','410','036','554','124','604','170','188','192','470','442','196','356'];
const LIVED = ['208', '076', '704', '840'];
const BONUS = ['158', '540', '010', '344'];
const AIRSIDE = ['634', '352', '591', '231'];
const states = {};
for (const c of HUMAN) states[c] = { t1: LIVED.includes(c) ? 'lived' : 'visited' };
for (const c of BONUS) states[c] = { t1: 'escaped' };
for (const c of AIRSIDE) states[c] = { t1: 'airside' };
states.undefined = { t1: 'visited' };
const sample = { v: 2, travelers: [{ id: 't1', name: 'Me', pet: false }], states };
const two = { v: 2, travelers: [{ id: 't1', pet: false }], states: { '208': { t1: 'visited' }, '752': { t1: 'visited' } } };

const qr = '<svg viewBox="0 0 21 21" width="100%" height="100%" shape-rendering="crispEdges"><rect width="21" height="21" fill="#fff"/><path fill="#0A0B14" d="M0 0h7v7H0zM1 1v5h5V1zM2 2h3v3H2zM14 0h7v7h-7zM15 1v5h5V1zM16 2h3v3h-3zM0 14h7v7H0zM1 15v5h5v-5zM2 16h3v3H2zM8 0h1v1H8zM10 0h2v1h-2zM8 2h2v1H8zM11 2h1v2h-1zM8 4h1v1H8zM10 5h2v1h-2zM0 8h1v1H0zM2 8h3v1H2zM6 8h2v1H6zM9 8h1v2H9zM12 8h2v1h-2zM15 8h1v1h-1zM17 8h2v1h-2zM20 8h1v1h-1zM1 10h2v1H1zM4 10h1v1H4zM7 10h1v1H7zM11 10h1v2h-1zM13 10h2v1h-2zM16 10h1v1h-1zM18 10h3v1h-3zM0 12h2v1H0zM3 12h1v1H3zM5 12h3v1H5zM9 12h2v1H9zM14 12h1v1h-1zM16 12h2v1h-2zM19 12h1v1h-1zM8 14h1v1H8zM10 14h2v1h-2zM13 14h1v1h-1zM15 14h3v1h-3zM19 14h2v1h-2zM9 16h1v1H9zM11 16h2v1h-2zM14 16h1v1h-1zM17 16h1v1h-1zM19 16h1v1h-1zM8 18h2v1H8zM11 18h1v1h-1zM13 18h2v1h-2zM16 18h3v1h-3zM20 18h1v1h-1zM8 20h1v1H8zM10 20h3v1h-3zM14 20h2v1h-2zM17 20h1v1h-1zM19 20h2v1h-2z"/></svg>';
const url = 'https://thatlayover.life/p/sample';
const frames = [
  ['02A · master · light', sample, { layout: 'master', theme: 'light', handle: 'yourhandle', shareUrl: url, qrSvg: qr }],
  ['02B · master · dark', sample, { layout: 'master', theme: 'dark', handle: 'yourhandle', shareUrl: url, qrSvg: qr }],
  ['02C · feed 1080×1350', sample, { layout: 'feed', theme: 'light', shareUrl: url, qrSvg: qr }],
  ['02D · link 1200×630', sample, { layout: 'link', theme: 'dark', shareUrl: url }],
  ['02A · ranges on', sample, { layout: 'master', theme: 'light', handle: 'yourhandle', shareUrl: url, qrSvg: qr, ranges: true }],
  ['09A · new', null, { layout: 'master', theme: 'light', shareUrl: url, qrSvg: qr }],
  ['09B · 2 countries', two, { layout: 'master', theme: 'light', shareUrl: url, qrSvg: qr }],
  ['09C · quiet year', sample, { layout: 'master', theme: 'light', shareUrl: url, qrSvg: qr, newThisYear: 0 }],
];
let body = '';
for (const [label, data, opts] of frames) {
  const r = renderPercentCard(data, opts);
  body += `<figure><figcaption>${label} · ${r.width}×${r.height}</figcaption><div class="frame" style="width:${r.width}px;height:${r.height}px">${r.html}</div><p class="alt">alt: ${r.alt}</p></figure>`;
}
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>TLL percent card preview</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,800;1,800&family=JetBrains+Mono:wght@400;700;800&family=IBM+Plex+Sans+Condensed:wght@400;500;600&family=Syne:wght@700;800&display=swap">
<style>body{margin:0;padding:32px;background:#1A1A2E;color:#F7F1E8;font-family:'IBM Plex Sans Condensed',sans-serif;display:flex;flex-wrap:wrap;gap:36px;align-items:flex-start}figure{margin:0}figcaption{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#00C9C8;margin-bottom:10px}.frame{box-shadow:0 14px 34px rgba(0,0,0,.4);border-radius:4px;overflow:hidden}.alt{max-width:540px;font-size:12px;color:#9AA3B8}</style></head><body>${body}</body></html>`;
writeFileSync(new URL('../design-review/prototypes/shareables/percent-preview.html', import.meta.url), html);
console.log('wrote percent-preview.html with', frames.length, 'frames');
