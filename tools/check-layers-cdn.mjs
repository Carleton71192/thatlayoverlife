// CDN check for the site layers release (11 November 2026). Reads only; changes nothing.
//   node tools/check-layers-cdn.mjs [pin] [--rounds N] [--live [origin]]
// pin      a layers-release commit (default: origin/layers-release). Every file in that commit is fetched from jsDelivr
//          N times (default 2) and compared byte for byte with git. The core's embedded chunk hashes are checked against
//          the chunk bytes jsDelivr serves, and the commit's tree size against jsDelivr's 50 MB package limit.
// --live   also reads pages on the live site (default https://www.thatlayover.life) and lists every file they load from
//          this repository on jsDelivr: its pin, the tree size at that pin (over 50 MB means jsDelivr can refuse it),
//          the response, and the SRI on the tag when there is one. Map embeds are read from their data-tll-version pin.
// Exit code: 0 all good; 1 a release file failed; 2 the release is fine but a live page still loads from an over-limit pin.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const REPO = 'Carleton71192/thatlayoverlife';
const LIMIT = 50 * 1048576;
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); if (i < 0) return d; const v = args[i + 1]; return v && !v.startsWith('--') ? v : true; };
const rounds = Number(opt('--rounds', 2)) || 2;
const live = opt('--live', false);
const origin = (typeof live === 'string' ? live : 'https://www.thatlayover.life').replace(/\/$/, '');
const git = (...a) => execFileSync('git', a, { maxBuffer: 1 << 28 });
const pinArg = args.find((a, i) => !a.startsWith('--') && !['--rounds', '--live'].includes(args[i - 1]));
const pin = git('rev-parse', pinArg || 'origin/layers-release').toString().trim();
const cdn = (rev, path) => `https://cdn.jsdelivr.net/gh/${REPO}@${rev}/${path}`;
const sha = (alg, b) => createHash(alg).update(b).digest('base64');
const mb = (n) => (n / 1048576).toFixed(1) + ' MB';

const treeCache = new Map();
function treeBytes(rev) {
  if (!treeCache.has(rev)) {
    let n = null;
    try { n = git('ls-tree', '-r', '-l', rev).toString().split('\n').reduce((s, l) => s + (Number(l.split(/\s+/)[3]) || 0), 0); } catch {}
    treeCache.set(rev, n);
  }
  return treeCache.get(rev);
}

async function get(url) {
  try {
    const r = await fetch(url, { cache: 'no-store' });
    const b = Buffer.from(await r.arrayBuffer());
    return { status: r.status, body: b, note: r.status === 200 ? '' : b.toString('utf8', 0, 120).replace(/\s+/g, ' ') };
  } catch (e) { return { status: 0, body: Buffer.alloc(0), note: String(e.message || e) }; }
}

async function pool(items, n, fn) {
  const out = new Array(items.length); let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); } }));
  return out;
}

// 1. The release commit.
const files = git('ls-tree', '-r', '-l', pin).toString().trim().split('\n').map((l) => {
  const [meta, path] = l.split('\t'); const [, , blob, size] = meta.split(/\s+/); return { path, blob, size: Number(size) };
});
const total = files.reduce((s, f) => s + f.size, 0);
console.log(`Release ${pin}: ${files.length} files, ${mb(total)} (jsDelivr limit 50 MB)${total > LIMIT ? '  OVER THE LIMIT' : ''}`);
let failed = total > LIMIT ? 1 : 0;
const served = new Map();
for (let round = 1; round <= rounds; round++) {
  const res = await pool(files, 8, async (f) => {
    const want = git('cat-file', 'blob', f.blob);
    const r = await get(cdn(pin, f.path));
    const same = r.status === 200 && r.body.equals(want);
    if (same) served.set(f.path, r.body);
    return { f, r, same };
  });
  const bad = res.filter((x) => !x.same);
  console.log(`  round ${round}: ${res.length - bad.length} of ${res.length} files served with the right bytes`);
  for (const x of bad) console.log(`    FAIL ${x.r.status} ${x.f.path} ${x.r.status === 200 ? '(bytes differ from git)' : x.r.note}`);
  if (bad.length) failed = 1;
}

// 2. The core's embedded chunk hashes against what jsDelivr serves.
const core = served.get('src/site-layers/tll-site-layers-v16.js');
if (core) {
  const rules = [...core.toString().matchAll(/\['([a-z0-9-]+)',\/.*?\/,'(sha384-[^']+)'(?:,'([a-z0-9-]+)','(sha384-[^']+)')?\]/g)];
  const pairs = rules.flatMap((m) => [[m[1], m[2]], ...(m[3] ? [[m[3], m[4]]] : [])]);
  const wrong = pairs.filter(([n, h]) => { const b = served.get(`src/site-layers/chunks/${n}.js`); return !b || 'sha384-' + sha('sha384', b) !== h; });
  console.log(`  core chunk hashes: ${pairs.length - wrong.length} of ${pairs.length} match the served chunks`);
  for (const [n] of wrong) console.log(`    FAIL chunk ${n}.js missing or hash differs`);
  if (wrong.length || !pairs.length) failed = 1;
  console.log(`  core SRI: sha384-${sha('sha384', core)}`);
  console.log(`  story search index beside the core: ${served.has('src/data/story-search-index.json') ? 'yes' : 'MISSING'}`);
  if (!served.has('src/data/story-search-index.json')) failed = 1;
} else { console.log('  FAIL the core was not served'); failed = 1; }

// 3. Optional: what the live pages load from this repository.
let atRisk = 0;
if (live) {
  const PAGES = ['/', '/stories', '/stories/even-brave-boys-get-scared', '/travelers', '/contributors/barzy-adam', '/the-map', '/my-passport',
    '/account', '/edit-profile', '/submit', '/for-expats', '/pets', '/countries/bulgaria'];
  const found = new Map();
  const add = (raw, page, integrity) => {
    const url = raw.replace(new RegExp(`/gh/${REPO}@`, 'i'), `/gh/${REPO}@`);
    if (!found.has(url)) found.set(url, { url, pages: [], integrity });
    const f = found.get(url); if (!f.pages.includes(page)) f.pages.push(page); if (integrity) f.integrity = integrity;
  };
  for (const page of PAGES) {
    const r = await get(origin + page); const html = r.body.toString();
    const rx = new RegExp(`https://cdn\\.jsdelivr\\.net/gh/${REPO}@[0-9a-f]{7,40}/[^"'\\s)<>]+`, 'gi');
    for (const m of html.matchAll(rx)) {
      const tag = html.slice(html.lastIndexOf('<', m.index), html.indexOf('>', m.index) + 1);
      add(m[0], page, (tag.match(/integrity="([^"]+)"/) || [])[1]);
    }
    for (const m of html.matchAll(/data-tll-version="([0-9a-f]{7,40})"/g)) {
      for (const p of ['dist/tll-map-layers.js', 'dist/tll-map-layers.css', 'collections.json', 'data/countries.json']) add(cdn(m[1], 'map-2.0/' + p), page);
    }
  }
  console.log(`\nLive pages on ${origin}: ${found.size} files from ${REPO} on jsDelivr`);
  await pool([...found.values()], 6, async (f) => {
    const rev = f.url.match(/@([0-9a-f]+)\//)[1]; const n = treeBytes(rev);
    const r = await get(f.url);
    const sri = f.integrity ? (r.status === 200 && f.integrity === 'sha384-' + sha('sha384', r.body) ? 'SRI ok' : 'SRI MISMATCH') : 'no SRI';
    const risk = n === null ? 'size unknown' : n > LIMIT ? `tree ${mb(n)}, OVER 50 MB` : `tree ${mb(n)}`;
    if (n === null || n > LIMIT) atRisk++;
    if (f.integrity && sri !== 'SRI ok') failed = 1;
    f.line = `  ${r.status} ${rev.slice(0, 7)} ${risk.padEnd(22)} ${sri.padEnd(12)} ${f.url.split(rev + '/')[1]}  (${f.pages.join(' ')})`;
  });
  for (const f of [...found.values()].sort((a, b) => a.line.localeCompare(b.line))) console.log(f.line);
  console.log(atRisk ? `${atRisk} live files load from a pin over jsDelivr's limit (or unknown here): switch them to a layers-release pin.` : 'Every live file loads from a pin under the limit.');
}

console.log(failed ? '\nRESULT: FAIL' : atRisk ? '\nRESULT: release OK; live pages still use over-limit pins' : '\nRESULT: OK');
process.exit(failed ? 1 : atRisk ? 2 : 0);
