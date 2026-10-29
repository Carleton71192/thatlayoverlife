// GET /link-preview?url=   Reads a submitted article's share tags (Open Graph, then Twitter, then plain HTML)
// so the /submit link-out form can show a preview and send the article's own photo, title and description.
//
// Rules (Nancy, 29 Oct 2026):
//   - The photo is always a photo or art, never an ad. An image is offered only when it is a JPEG, PNG or WebP,
//     at least 600 x 315, not banner or strip shaped, and its address does not look like an ad, logo, icon,
//     avatar, sprite or placeholder. Anything else comes back with image null and a plain reason.
//   - No AI: the title and description are the article's own words, returned as written.
// Safety: only http and https on the default ports, no IP literals, no local or internal hostnames, every redirect
// re-checked, 6 second time limit, the page read stops after 600 KB, the image read after 64 KB. Answers CORS for
// the site's own origins only, a soft limit of 60 calls an hour per IP, results cached at the edge for a day.

import { ALLOWED_ORIGINS, rateLimit } from './member-auth.js';

const PAGE_LIMIT = 600 * 1024;
const IMAGE_LIMIT = 64 * 1024;
const TIMEOUT_MS = 6000;
const MAX_REDIRECTS = 4;
const MIN_W = 600;
const MIN_H = 315;
const UA = 'Mozilla/5.0 (compatible; TLL-LinkPreview/1.0; +https://www.thatlayover.life)';
const AD_WORDS = /(^|[\/._-])(ads?|adserver|adservice|doubleclick|googlesyndication|banner|banners|sponsor(ed)?|promo|affiliate|logo|logos|icon|icons|favicon|avatar|sprite|placeholder|default[-_]?(og|share|image)|blank|pixel|spacer|badge)([\/._-]|$)/i;
const AD_HOSTS = /(doubleclick\.net|googlesyndication\.com|googleadservices\.com|adnxs\.com|amazon-adsystem\.com|taboola\.com|outbrain\.com|criteo\.(com|net)|adsrvr\.org)$/i;

export function linkPreviewCors(request) {
  const origin = request.headers.get('Origin') || '';
  const headers = {
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
  if (ALLOWED_ORIGINS.includes(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}

/** True for a public http(s) address on the default port with a real hostname. */
export function isSafeUrl(raw) {
  let u;
  try { u = new URL(raw); } catch { return false; }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
  if (u.username || u.password) return false;
  if (u.port && u.port !== '80' && u.port !== '443') return false;
  const host = u.hostname.toLowerCase().replace(/\.$/, '');
  if (!host || !host.includes('.')) return false;
  if (/^[\d.]+$/.test(host) || host.includes(':') || host.startsWith('[')) return false; // IPv4 or IPv6 literal
  if (/(^|\.)(localhost|local|internal|intranet|lan|home|corp|localdomain|test|invalid|example)$/.test(host)) return false;
  if (/(^|\.)(metadata\.google\.internal|instance-data)$/.test(host)) return false;
  return true;
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'", hellip: '…', mdash: '-', ndash: '-', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“' };
export function decodeEntities(s) {
  return String(s || '')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => safeChar(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => safeChar(parseInt(d, 10)))
    .replace(/&([a-z0-9#]+);/gi, (m, n) => (ENTITIES[n.toLowerCase()] ?? m));
}
function safeChar(code) {
  try { return code > 0 && code < 0x110000 ? String.fromCodePoint(code) : ''; } catch { return ''; }
}
function clean(s, max) {
  const t = decodeEntities(s).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return t.length > max ? t.slice(0, max - 1).trimEnd() + '…' : t;
}

function attrs(tag) {
  const out = {};
  const re = /([a-zA-Z:_-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
  let m;
  while ((m = re.exec(tag))) out[m[1].toLowerCase()] = m[3] ?? m[4] ?? m[5] ?? '';
  return out;
}

/** Pulls title, description, image, site name and canonical link from the page head. */
export function parseMeta(html, baseUrl) {
  const head = String(html || '').slice(0, PAGE_LIMIT);
  const meta = {};
  for (const tag of head.match(/<meta\b[^>]*>/gi) || []) {
    const a = attrs(tag);
    const key = (a.property || a.name || a.itemprop || '').toLowerCase();
    if (key && a.content != null && !(key in meta)) meta[key] = a.content;
  }
  let canonical = '';
  for (const tag of head.match(/<link\b[^>]*>/gi) || []) {
    const a = attrs(tag);
    if ((a.rel || '').toLowerCase().split(/\s+/).includes('canonical') && a.href) { canonical = a.href; break; }
  }
  const titleTag = (head.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '';
  const abs = (v) => { try { return v ? new URL(decodeEntities(v).trim(), baseUrl).href : ''; } catch { return ''; } };
  const num = (v) => { const n = parseInt(v, 10); return Number.isFinite(n) && n > 0 ? n : 0; };
  return {
    title: clean(meta['og:title'] || meta['twitter:title'] || titleTag, 200),
    description: clean(meta['og:description'] || meta['twitter:description'] || meta.description, 300),
    siteName: clean(meta['og:site_name'] || meta['application-name'] || '', 80),
    image: abs(meta['og:image:secure_url'] || meta['og:image'] || meta['og:image:url'] || meta['twitter:image'] || meta['twitter:image:src']),
    imageAlt: clean(meta['og:image:alt'] || meta['twitter:image:alt'] || '', 200),
    imageWidth: num(meta['og:image:width']),
    imageHeight: num(meta['og:image:height']),
    canonical: abs(canonical),
  };
}

/** Width and height from the first bytes of a JPEG, PNG or WebP file. */
export function readImageSize(bytes) {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes || []);
  if (b.length >= 24 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) {
    const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
    return { type: 'png', width: dv.getUint32(16), height: dv.getUint32(20) };
  }
  if (b.length >= 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
      const len = (b[i + 2] << 8) | b[i + 3];
      if ((marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) || (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf)) {
        return { type: 'jpeg', height: (b[i + 5] << 8) | b[i + 6], width: (b[i + 7] << 8) | b[i + 8] };
      }
      if (len < 2) break;
      i += 2 + len;
    }
    return { type: 'jpeg', width: 0, height: 0 };
  }
  if (b.length >= 30 && String.fromCharCode(...b.slice(0, 4)) === 'RIFF' && String.fromCharCode(...b.slice(8, 12)) === 'WEBP') {
    const kind = String.fromCharCode(...b.slice(12, 16));
    if (kind === 'VP8X') return { type: 'webp', width: 1 + (b[24] | (b[25] << 8) | (b[26] << 16)), height: 1 + (b[27] | (b[28] << 8) | (b[29] << 16)) };
    if (kind === 'VP8 ') return { type: 'webp', width: (b[26] | (b[27] << 8)) & 0x3fff, height: (b[28] | (b[29] << 8)) & 0x3fff };
    if (kind === 'VP8L') { const v = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24); return { type: 'webp', width: 1 + (v & 0x3fff), height: 1 + ((v >> 14) & 0x3fff) }; }
    return { type: 'webp', width: 0, height: 0 };
  }
  return { type: '', width: 0, height: 0 };
}

/** Why an image would not be used, or '' when it is fine. */
export function imageVerdict({ url, type, width, height }) {
  let host = '', path = '';
  try { const u = new URL(url); host = u.hostname; path = u.pathname + u.search; } catch { return 'no image address'; }
  if (AD_HOSTS.test(host)) return 'the image comes from an ad network';
  if (AD_WORDS.test(path)) return 'the image looks like an ad, logo or icon';
  if (!['jpeg', 'png', 'webp'].includes(type)) return 'the image is not a photo file (JPEG, PNG or WebP)';
  if (!width || !height) return 'the image size could not be read';
  if (width < MIN_W || height < MIN_H) return `the image is too small (${width} x ${height})`;
  const ratio = width / height;
  if (ratio > 2.6) return 'the image is a wide strip, like a banner';
  if (ratio < 0.5) return 'the image is a tall strip, like a banner';
  return '';
}

async function timed(fetchImpl, url, init) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetchImpl(url, { ...init, signal: ctrl.signal, redirect: 'manual' });
  } finally {
    clearTimeout(timer);
  }
}

/** Follows redirects by hand so every hop is checked. */
async function safeFetch(fetchImpl, url, init) {
  let current = url;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (!isSafeUrl(current)) throw new Error('address not allowed');
    const res = await timed(fetchImpl, current, init);
    if (res.status >= 300 && res.status < 400 && res.headers.get('Location')) {
      current = new URL(res.headers.get('Location'), current).href;
      continue;
    }
    return { res, finalUrl: current };
  }
  throw new Error('too many redirects');
}

async function readCapped(res, limit, stopAtHeadEnd) {
  if (!res.body || !res.body.getReader) {
    const buf = new Uint8Array(await res.arrayBuffer());
    return buf.slice(0, limit);
  }
  const reader = res.body.getReader();
  const chunks = [];
  let total = 0;
  const dec = stopAtHeadEnd ? new TextDecoder() : null;
  let text = '';
  while (total < limit) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.length;
    if (dec) { text += dec.decode(value, { stream: true }); if (/<\/head>/i.test(text)) break; }
  }
  try { await reader.cancel(); } catch { /* already closed */ }
  const out = new Uint8Array(Math.min(total, limit));
  let off = 0;
  for (const c of chunks) { const n = Math.min(c.length, out.length - off); out.set(c.subarray(0, n), off); off += n; if (off >= out.length) break; }
  return out;
}

/** Reads the article and checks its image. Never throws; problems come back as { ok:false, reason }. */
export async function previewLink(url, fetchImpl = fetch) {
  if (!isSafeUrl(url)) return { ok: false, reason: 'That link cannot be read. Check it starts with https:// and is a public page.' };
  let page;
  try {
    page = await safeFetch(fetchImpl, url, { headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml' } });
  } catch {
    return { ok: false, reason: 'The page did not answer.' };
  }
  const { res, finalUrl } = page;
  if (!res.ok) return { ok: false, reason: `The page answered ${res.status}.` };
  if (!/text\/html|application\/xhtml/i.test(res.headers.get('Content-Type') || '')) return { ok: false, reason: 'That link is not a web page.' };
  const html = new TextDecoder().decode(await readCapped(res, PAGE_LIMIT, true));
  const m = parseMeta(html, finalUrl);
  const out = {
    ok: true,
    url: m.canonical && isSafeUrl(m.canonical) ? m.canonical : finalUrl,
    title: m.title,
    description: m.description,
    siteName: m.siteName || new URL(finalUrl).hostname.replace(/^www\./, ''),
    image: null,
    imageAlt: m.imageAlt,
    imageNote: '',
  };
  if (!m.image) { out.imageNote = 'The page has no share photo.'; return out; }
  let size = { type: '', width: 0, height: 0 };
  const quick = imageVerdict({ url: m.image, type: 'jpeg', width: MIN_W, height: MIN_H });
  if (quick) { out.imageNote = `Photo skipped: ${quick}.`; return out; }
  try {
    const { res: ir, finalUrl: imgUrl } = await safeFetch(fetchImpl, m.image, { headers: { 'User-Agent': UA, Accept: 'image/jpeg,image/png,image/webp', Range: `bytes=0-${IMAGE_LIMIT - 1}` } });
    if (ir.ok || ir.status === 206) {
      size = readImageSize(await readCapped(ir, IMAGE_LIMIT, false));
      const why = imageVerdict({ url: imgUrl, ...size });
      if (why) out.imageNote = `Photo skipped: ${why}.`;
      else { out.image = imgUrl; out.imageWidth = size.width; out.imageHeight = size.height; }
    } else {
      out.imageNote = 'Photo skipped: it did not load.';
    }
  } catch {
    out.imageNote = 'Photo skipped: it did not load.';
  }
  return out;
}

/** GET /link-preview?url= */
export async function handleLinkPreview(request, env, ctx, fetchImpl = fetch) {
  const cors = linkPreviewCors(request);
  const reply = (body, status = 200, cacheSeconds = 0) => new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cacheSeconds ? `public, max-age=${cacheSeconds}` : 'no-store', ...cors },
  });
  const target = new URL(request.url).searchParams.get('url') || '';
  if (!target) return reply({ ok: false, reason: 'Add a link.' }, 400);

  const cache = typeof caches !== 'undefined' ? caches.default : null;
  const cacheKey = new Request(`https://link-preview.cache/${encodeURIComponent(target)}`);
  if (cache) {
    const hit = await cache.match(cacheKey);
    if (hit) { const body = await hit.json(); return reply(body, 200, 3600); }
  }
  if (env && env.WIRE_KV) {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (!(await rateLimit(env, 'lp', ip, 60))) return reply({ ok: false, reason: 'Too many links in an hour. Try again later.' }, 429);
  }
  const body = await previewLink(target, fetchImpl);
  if (cache && body.ok) {
    const stored = new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=86400' } });
    const put = cache.put(cacheKey, stored);
    if (ctx && ctx.waitUntil) ctx.waitUntil(put); else await put;
  }
  return reply(body, body.ok ? 200 : 422, body.ok ? 3600 : 0);
}
