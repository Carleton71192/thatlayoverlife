"""Story hero sizes for the story layer (13 Nov 2026, the story hero photo jump).
Run: python3 src/site-layers/build-hero-ratios-v1.py [--cache DIR] PAGE.html [PAGE.html ...]
  PAGE.html  saved story pages (plain GET snapshots); the hero is <img class="tll-story-hero-img" src=...> in each.
  --cache    a directory of cached Webflow files (sha1(url).b + .json, as the bandwidth-rule harnesses write them), read first.
What it writes: the size of each story's hero photo, as the browser will see it (EXIF orientation applied), into
  src/site-layers/story-hero-sizes-v1.json  {first CMS file id: [width, height]}, sorted, kept between runs, and
  the /*HERO*/ table in src/design/magazine-2026-10/story-build/tll-mag-story-v1.html (last 8 hex digits of the id: "w/h").
Bandwidth (Webflow plan over its limit, 13 Nov 2026): a photo already in the JSON or in --cache costs nothing; any other photo is read
with ONE ranged GET of its first 16 KB (64 KB if the size marker sits further in), never the whole file. Prints the bytes it fetched.
The hero box is reserved from this table before the photo arrives; once it arrives the photo's own ratio is used (aspect-ratio: auto r),
so a missing or stale entry can only cost a shift, never a different final look."""
import re, os, sys, json, glob, hashlib, struct, ssl, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SIZES = os.path.join(ROOT, 'src/site-layers/story-hero-sizes-v1.json')
MAG = os.path.join(ROOT, 'src/design/magazine-2026-10/story-build/tll-mag-story-v1.html')
HERO = re.compile(r'<img class="tll-story-hero-img"[^>]*?\ssrc="([^"]+)"')
CMS = re.compile(r'^https://cdn\.prod\.website-files\.com/6a0b29c6d081332e921900d8/([0-9a-f]{24})_')

def exif_orientation(b, i):
    # APP1 Exif segment starting at i (after the marker and length); returns 1..8 or 1
    if b[i:i + 6] != b'Exif\0\0': return 1
    t = i + 6; e = '<' if b[t:t + 2] == b'II' else '>'
    try:
        off = struct.unpack(e + 'I', b[t + 4:t + 8])[0]; n = struct.unpack(e + 'H', b[t + off:t + off + 2])[0]
        for k in range(n):
            p = t + off + 2 + 12 * k
            if struct.unpack(e + 'H', b[p:p + 2])[0] == 0x0112: return struct.unpack(e + 'H', b[p + 8:p + 10])[0]
    except struct.error: pass
    return 1

def size(b):
    """(w, h) as displayed, or None when the bytes stop before the size marker."""
    if b[:8] == b'\x89PNG\r\n\x1a\n' and len(b) >= 24: return struct.unpack('>II', b[16:24])
    if b[:2] != b'\xff\xd8': raise ValueError('not a JPEG or PNG')
    i, orient = 2, 1
    while i + 4 <= len(b):
        if b[i] != 0xFF: i += 1; continue
        m = b[i + 1]
        if m in (0xD8, 0x01) or 0xD0 <= m <= 0xD7: i += 2; continue
        L = struct.unpack('>H', b[i + 2:i + 4])[0]
        if m == 0xE1: orient = exif_orientation(b, i + 4)
        if m in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
            if i + 9 > len(b): return None
            h, w = struct.unpack('>HH', b[i + 5:i + 9])
            return (h, w) if orient in (5, 6, 7, 8) else (w, h)
        i += 2 + L
    return None

def main(argv):
    cache = None
    if argv[:1] == ['--cache']: cache, argv = argv[1], argv[2:]
    sizes = json.load(open(SIZES)) if os.path.exists(SIZES) else {}
    ctx = ssl.create_default_context(cafile=os.environ.get('SSL_CERT_FILE') or ('/root/.ccr/ca-bundle.crt' if os.path.exists('/root/.ccr/ca-bundle.crt') else None))
    fetched = 0
    for f in argv:
        m = HERO.search(open(f, encoding='utf-8').read())
        if not m: print('no hero  ', os.path.basename(f)); continue
        u = m.group(1); c = CMS.match(u)
        if not c: print('not CMS  ', os.path.basename(f), u); continue
        k = c.group(1)
        if k in sizes: continue
        b, src = None, 'cache'
        if cache:
            p = os.path.join(cache, hashlib.sha1(u.encode()).hexdigest() + '.b')
            if os.path.exists(p): b = open(p, 'rb').read()
        s = size(b) if b else None
        for n in ((16384, 65536) if s is None else ()):
            q = urllib.request.Request(u, headers={'Range': 'bytes=0-%d' % (n - 1), 'User-Agent': 'tll-hero-sizes/1'})
            b = urllib.request.urlopen(q, context=ctx, timeout=60).read(); fetched += len(b); src = 'header %dB' % len(b)
            s = size(b)
            if s: break
        if not s: print('no size  ', os.path.basename(f), u); continue
        sizes[k] = list(s); print('%-12s %s %dx%d' % (src, k, s[0], s[1]))
    json.dump(dict(sorted(sizes.items())), open(SIZES, 'w'), indent=0); open(SIZES, 'a').write('\n')
    assert len({k[-8:] for k in sizes}) == len(sizes), 'two heroes share the last 8 hex digits of their id; lengthen the key'
    tab = ','.join('"%s":"%d/%d"' % (k[-8:], w, h) for k, (w, h) in sorted(sizes.items()))
    mag = open(MAG, encoding='utf-8').read()
    new, n = re.subn(r'/\*HERO\*/var HR=\{[^}]*\};', '/*HERO*/var HR={%s};' % tab, mag)
    assert n == 1, 'the /*HERO*/ table must occur once in the story layer'
    open(MAG, 'w', encoding='utf-8').write(new)
    print(len(sizes), 'hero sizes;', fetched, 'bytes fetched from Webflow')

if __name__ == '__main__': main(sys.argv[1:])
