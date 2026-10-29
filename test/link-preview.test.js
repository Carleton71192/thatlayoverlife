import { describe, expect, it } from 'vitest';
import { imageVerdict, isSafeUrl, parseMeta, previewLink, readImageSize, handleLinkPreview } from '../src/link-preview.js';
import worker from '../src/index.js';

function png(w, h) {
  const b = new Uint8Array(32);
  b.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52]);
  const dv = new DataView(b.buffer);
  dv.setUint32(16, w);
  dv.setUint32(20, h);
  return b;
}
function jpeg(w, h) {
  // SOI, an APP0 segment, then SOF0 with the size.
  return new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 4, 0, 0, 0xff, 0xc0, 0, 11, 8, h >> 8, h & 255, w >> 8, w & 255, 3, 0, 0, 0]);
}
const PAGE = (img, extra = '') => `<!doctype html><html><head>
<title>Fallback title</title>
<meta property="og:title" content="The Art of Wellbeing: Why Thailand Is the Luxury Health Destination of 2026">
<meta content="Thailand is emerging as a leading luxury wellness destination &amp; more." property="og:description">
<meta property="og:site_name" content="The Noise">
${img ? `<meta property="og:image" content="${img}">` : ''}
<link rel="canonical" href="https://thenoise.me/2025/12/art-of-wellbeing/">
${extra}</head><body>body</body></html>`;

function fakeFetch(routes) {
  const calls = [];
  const fn = async (url, init = {}) => {
    calls.push({ url, init });
    const r = routes[url];
    if (!r) return new Response('nope', { status: 404 });
    if (r.redirect) return new Response(null, { status: 302, headers: { Location: r.redirect } });
    return new Response(r.body, { status: r.status || 200, headers: { 'Content-Type': r.type } });
  };
  fn.calls = calls;
  return fn;
}

describe('isSafeUrl', () => {
  it('allows public https and http pages', () => {
    expect(isSafeUrl('https://thenoise.me/a/b')).toBe(true);
    expect(isSafeUrl('http://example.org.uk/x')).toBe(true);
  });
  it('refuses local, internal, IP literal, odd port and non-web addresses', () => {
    for (const u of ['http://localhost/', 'http://127.0.0.1/', 'http://10.0.0.5/x', 'http://[::1]/', 'http://169.254.169.254/latest',
      'https://intranet.corp/', 'https://metadata.google.internal/', 'ftp://a.com/', 'file:///etc/passwd', 'https://a.com:8080/',
      'https://user:pw@a.com/', 'javascript:alert(1)', 'https://nodots/']) {
      expect(isSafeUrl(u), u).toBe(false);
    }
  });
});

describe('parseMeta', () => {
  it('reads Open Graph tags in any attribute order and decodes entities', () => {
    const m = parseMeta(PAGE('/img/hero.jpg'), 'https://thenoise.me/post');
    expect(m.title).toBe('The Art of Wellbeing: Why Thailand Is the Luxury Health Destination of 2026');
    expect(m.description).toBe('Thailand is emerging as a leading luxury wellness destination & more.');
    expect(m.siteName).toBe('The Noise');
    expect(m.image).toBe('https://thenoise.me/img/hero.jpg');
    expect(m.canonical).toBe('https://thenoise.me/2025/12/art-of-wellbeing/');
  });
  it('falls back to Twitter tags and the title tag', () => {
    const m = parseMeta('<head><title>Plain &amp; simple</title><meta name="twitter:image" content="https://cdn.x.com/p.jpg"></head>', 'https://x.com/');
    expect(m.title).toBe('Plain & simple');
    expect(m.image).toBe('https://cdn.x.com/p.jpg');
  });
});

describe('readImageSize', () => {
  it('reads PNG and JPEG sizes', () => {
    expect(readImageSize(png(1200, 630))).toEqual({ type: 'png', width: 1200, height: 630 });
    expect(readImageSize(jpeg(1600, 900))).toEqual({ type: 'jpeg', width: 1600, height: 900 });
  });
});

describe('imageVerdict: photos or art, never ads', () => {
  const ok = { type: 'jpeg', width: 1200, height: 800 };
  it('accepts a normal photo', () => expect(imageVerdict({ url: 'https://thenoise.me/uploads/2025/12/spa-pool.jpg', ...ok })).toBe(''));
  it('refuses ad networks, ad, logo and icon addresses', () => {
    expect(imageVerdict({ url: 'https://tpc.googlesyndication.com/x/1.jpg', ...ok })).toMatch(/ad network/);
    expect(imageVerdict({ url: 'https://site.com/ads/summer.jpg', ...ok })).toMatch(/ad, logo or icon/);
    expect(imageVerdict({ url: 'https://site.com/img/logo.png', ...ok })).toMatch(/ad, logo or icon/);
    expect(imageVerdict({ url: 'https://site.com/default-og.png', ...ok })).toMatch(/ad, logo or icon/);
  });
  it('refuses small images, banner strips and non-photo files', () => {
    expect(imageVerdict({ url: 'https://s.com/p.jpg', type: 'jpeg', width: 300, height: 200 })).toMatch(/too small/);
    expect(imageVerdict({ url: 'https://s.com/p.jpg', type: 'jpeg', width: 2400, height: 600 })).toMatch(/wide strip/);
    expect(imageVerdict({ url: 'https://s.com/p.jpg', type: 'jpeg', width: 300, height: 1050 })).toMatch(/small|tall strip/);
    expect(imageVerdict({ url: 'https://s.com/p.gif', type: '', width: 1200, height: 800 })).toMatch(/not a photo file/);
  });
});

describe('previewLink', () => {
  const ART = 'https://thenoise.me/2025/12/art/';
  it('returns the article title, description and a real photo', async () => {
    const f = fakeFetch({
      [ART]: { body: PAGE('https://thenoise.me/wp-content/uploads/2025/12/wellbeing-room.jpg'), type: 'text/html; charset=utf-8' },
      'https://thenoise.me/wp-content/uploads/2025/12/wellbeing-room.jpg': { body: jpeg(1400, 933), type: 'image/jpeg' },
    });
    const r = await previewLink(ART, f);
    expect(r.ok).toBe(true);
    expect(r.title).toMatch(/^The Art of Wellbeing/);
    expect(r.siteName).toBe('The Noise');
    expect(r.image).toBe('https://thenoise.me/wp-content/uploads/2025/12/wellbeing-room.jpg');
    expect(r.imageWidth).toBe(1400);
    expect(f.calls.every((c) => c.init.redirect === 'manual')).toBe(true);
  });
  it('drops an ad banner image and says why', async () => {
    const f = fakeFetch({
      [ART]: { body: PAGE('https://cdn.site.com/promo/banner-728.png'), type: 'text/html' },
    });
    const r = await previewLink(ART, f);
    expect(r.ok).toBe(true);
    expect(r.image).toBeNull();
    expect(r.imageNote).toMatch(/Photo skipped/);
  });
  it('drops a wide strip found only after reading the file', async () => {
    const f = fakeFetch({
      [ART]: { body: PAGE('https://cdn.site.com/uploads/header.png'), type: 'text/html' },
      'https://cdn.site.com/uploads/header.png': { body: png(2400, 600), type: 'image/png' },
    });
    const r = await previewLink(ART, f);
    expect(r.image).toBeNull();
    expect(r.imageNote).toMatch(/wide strip/);
  });
  it('refuses a redirect into a local address', async () => {
    const f = fakeFetch({ 'https://short.ly/x': { redirect: 'http://127.0.0.1/admin' } });
    const r = await previewLink('https://short.ly/x', f);
    expect(r.ok).toBe(false);
    expect(f.calls.map((c) => c.url)).toEqual(['https://short.ly/x']);
  });
  it('refuses a page that is not HTML', async () => {
    const f = fakeFetch({ [ART]: { body: '%PDF', type: 'application/pdf' } });
    expect((await previewLink(ART, f)).ok).toBe(false);
  });
});

describe('GET /link-preview', () => {
  it('answers CORS for the site only and asks for a link', async () => {
    const req = new Request('https://w.dev/link-preview', { headers: { Origin: 'https://www.thatlayover.life' } });
    const res = await handleLinkPreview(req, {}, null, fakeFetch({}));
    expect(res.status).toBe(400);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://www.thatlayover.life');
    const other = await handleLinkPreview(new Request('https://w.dev/link-preview', { headers: { Origin: 'https://evil.example.com' } }), {}, null, fakeFetch({}));
    expect(other.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });
  it('is routed by the worker and refuses POST', async () => {
    const res = await worker.fetch(new Request('https://w.dev/link-preview?url=x', { method: 'POST' }), {}, { waitUntil() {} });
    expect(res.status).toBe(405);
  });
});
