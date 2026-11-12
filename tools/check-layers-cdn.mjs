// CDN check for the site layers release (11 November 2026, hardened 12 November). Reads only; changes nothing.
//   node tools/check-layers-cdn.mjs [pin] [--rounds N] [--live [origin]]
//   node tools/check-layers-cdn.mjs --local <dir>
// pin      a layers-release commit (default: origin/layers-release). Every file in that commit is fetched from jsDelivr
//          N times (default 2) and compared byte for byte with git. Then the core's embedded chunk hashes are checked
//          against the chunk bytes jsDelivr serves (and their count against the loader rules and the chunk files), the
//          story search index must sit beside the core and be loaded from there, and any URL of this repository written
//          into the core or a chunk is fetched and must be on a pin under the limit.
// --live   also reads every page in the live site's sitemap plus the member pages (default origin
//          https://www.thatlayover.life) and lists every file they load from this repository on jsDelivr: its pin, the
//          tree size at that pin (over 50 MB means jsDelivr can refuse it), the response, and the SRI on the tag.
//          Map embeds are read from their data-tll-version pin. A page or file that does not load is a failure.
// --local  checks a release folder on disk before it is pushed (tools/release-layers.sh runs this): chunk hashes and
//          counts, the search index, and no pinned URL of this repository in the core or chunks. No network, no git.
// Exit code: 0 all good; 1 something failed; 2 the release is fine but a live page still loads from an over-limit pin.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const REPO = 'Carleton71192/thatlayoverlife';
const LIMIT = 50 * 1048576;
const CORE = 'src/site-layers/tll-site-layers-v16.js';
const INDEX = 'src/data/story-search-index.json';
const INDEX_FROM_BASE = "'../data/story-search-index.json',window.__tllLayersBase";
const MEMBER_PAGES = ['/account', '/edit-profile', '/submit', '/share-photos', '/my-pets', '/login', '/signup', '/support', '/the-map'];
const isUrl = (s) => /^https?:\/\//.test(s || '');

// Arguments: --rounds N, --local DIR, --live [URL]; the first other bare argument is the pin.
const args = process.argv.slice(2);
let rounds = 2, local = null, live = false, origin = 'https://www.thatlayover.life', pinArg = null;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--rounds') rounds = Number(args[++i]) || 2;
  else if (a === '--local') local = args[++i];
  else if (a === '--live') { live = true; if (isUrl(args[i + 1])) origin = args[++i]; }
  else if (a.startsWith('--')) { console.error(`unknown option ${a}`); process.exit(1); }
  else if (!pinArg) pinArg = a;
  else { console.error(`unexpected argument ${a}`); process.exit(1); }
}
origin = origin.replace(/\/$/, '');

const git = (...a) => execFileSync('git', a, { maxBuffer: 1 << 28 });
const cdn = (rev, path) => `https://cdn.jsdelivr.net/gh/${REPO}@${rev}/${path}`;
const sha = (alg, b) => createHash(alg).update(b).digest('base64');
const mb = (n) => (n / 1048576).toFixed(1) + ' MB';
const repoUrlRx = () => new RegExp(`https://cdn\\.jsdelivr\\.net/gh/${REPO}@([0-9a-f]{7,40})/[^"'\\s)<>\`]+`, 'gi');

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
    const r = await fetch(url, { cache: 'no-store', redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (layers CDN check)' } });
    const b = Buffer.from(await r.arrayBuffer());
    return { status: r.status, body: b, note: r.status === 200 ? '' : b.toString('utf8', 0, 120).replace(/\s+/g, ' ') };
  } catch (e) { return { status: 0, body: Buffer.alloc(0), note: String(e.message || e) }; }
}

async function pool(items, n, fn) {
  const out = new Array(items.length); let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); } }));
  return out;
}

let failed = 0;
const fail = (msg) => { console.log(`    FAIL ${msg}`); failed = 1; };

// The checks shared by --local and a pushed release. files: Map of release path -> bytes.
function checkCore(files, label) {
  const core = files.get(CORE);
  if (!core) { fail(`the core is missing from the ${label}`); return; }
  const text = core.toString();
  const block = (text.match(/var C=\[([\s\S]*?)\],h=/) || [])[1] || '';
  const rules = [...block.matchAll(/\['([^']+)',\/.*?\/,'(sha384-[^']+)'(?:,'([^']+)','(sha384-[^']+)')?\]/g)];
  const pairs = rules.flatMap((m) => [[m[1], m[2]], ...(m[3] ? [[m[3], m[4]]] : [])]);
  const hashesInBlock = (block.match(/'sha384-/g) || []).length;
  const chunkFiles = [...files.keys()].filter((p) => /^src\/site-layers\/chunks\/[^/]+\.js$/.test(p));
  const wrong = pairs.filter(([n, h]) => { const b = files.get(`src/site-layers/chunks/${n}.js`); return !b || 'sha384-' + sha('sha384', b) !== h; });
  console.log(`  core chunk hashes: ${pairs.length - wrong.length} of ${pairs.length} match the ${label} chunks (${rules.length} loader rules, ${chunkFiles.length} chunk files)`);
  for (const [n] of wrong) fail(`chunk ${n}.js missing or hash differs`);
  if (!pairs.length) fail('no chunk rules found in the core');
  if (pairs.length !== hashesInBlock) fail(`parsed ${pairs.length} chunk hashes but the loader holds ${hashesInBlock}`);
  if (pairs.length !== chunkFiles.length) fail(`${pairs.length} chunk hashes for ${chunkFiles.length} chunk files`);
  console.log(`  core SRI: sha384-${sha('sha384', core)}`);
  const beside = files.has(INDEX), fromBase = text.includes(INDEX_FROM_BASE);
  console.log(`  story search index: ${beside ? 'beside the core' : 'MISSING beside the core'}, ${fromBase ? 'loaded from the core\'s own folder' : 'NOT loaded from the core\'s folder'}`);
  if (!beside) failed = 1;
  if (!fromBase) console.log('    note: this core loads the index from a pinned URL (listed below if it is one of this repository)');
  const pinned = new Map();
  for (const [p, b] of files) if (p === CORE || p.startsWith('src/site-layers/chunks/')) for (const m of b.toString().matchAll(repoUrlRx())) pinned.set(m[0], p);
  return pinned;
}

// --local: a release folder on disk.
if (local) {
  const files = new Map();
  if (existsSync(join(local, CORE))) files.set(CORE, readFileSync(join(local, CORE)));
  const cdir = join(local, 'src/site-layers/chunks');
  if (existsSync(cdir)) for (const f of readdirSync(cdir)) if (f.endsWith('.js')) files.set(`src/site-layers/chunks/${f}`, readFileSync(join(cdir, f)));
  if (existsSync(join(local, INDEX))) files.set(INDEX, readFileSync(join(local, INDEX)));
  console.log(`Local release folder ${local}`);
  const pinned = checkCore(files, 'local') || new Map();
  for (const [u, p] of pinned) fail(`${p} loads ${u}: a pinned URL of this repository inside the layers`);
  console.log(failed ? 'RESULT: FAIL' : 'RESULT: OK (local)');
  process.exit(failed ? 1 : 0);
}

// 1. The release commit on jsDelivr.
const pin = git('rev-parse', pinArg || 'origin/layers-release').toString().trim();
const tree = git('ls-tree', '-r', '-l', pin).toString().trim().split('\n').map((l) => {
  const [meta, path] = l.split('\t'); const [, , blob, size] = meta.split(/\s+/); return { path, blob, size: Number(size) };
});
const total = tree.reduce((s, f) => s + f.size, 0);
console.log(`Release ${pin}: ${tree.length} files, ${mb(total)} (jsDelivr limit 50 MB)`);
if (total > LIMIT) fail('the release is over the limit');
const served = new Map();
for (let round = 1; round <= rounds; round++) {
  const res = await pool(tree, 8, async (f) => {
    const want = git('cat-file', 'blob', f.blob);
    const r = await get(cdn(pin, f.path));
    const same = r.status === 200 && r.body.equals(want);
    if (same) served.set(f.path, r.body);
    return { f, r, same };
  });
  const bad = res.filter((x) => !x.same);
  console.log(`  round ${round}: ${res.length - bad.length} of ${res.length} files served with the right bytes`);
  for (const x of bad) fail(`${x.r.status} ${x.f.path} ${x.r.status === 200 ? '(bytes differ from git)' : x.r.note}`);
}

// 2. The core against what jsDelivr serves, and any repository URL written into the layers.
const pinned = checkCore(served, 'served') || new Map();
for (const [u, p] of pinned) {
  const rev = u.match(/@([0-9a-f]+)\//)[1], n = treeBytes(rev), r = await get(u);
  const ok = r.status === 200 && n !== null && n <= LIMIT;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${r.status} ${rev.slice(0, 7)} ${n === null ? 'size unknown' : mb(n)}  ${u.split(rev + '/')[1]}  (written in ${p})`);
  if (!ok) failed = 1;
}

// 3. Optional: what the live pages load from this repository.
let atRisk = 0;
if (live) {
  const sm = await get(origin + '/sitemap.xml');
  if (sm.status !== 200) fail(`${sm.status} ${origin}/sitemap.xml`);
  const fromMap = [...sm.body.toString().matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => { try { return new URL(m[1]).pathname; } catch { return null; } }).filter(Boolean);
  const PAGES = [...new Set(['/', ...fromMap, ...MEMBER_PAGES])];
  const found = new Map();
  const add = (raw, page, integrity) => {
    const url = raw.replace(new RegExp(`/gh/${REPO}@`, 'i'), `/gh/${REPO}@`);
    if (!found.has(url)) found.set(url, { url, pages: [], integrity });
    const f = found.get(url); if (!f.pages.includes(page)) f.pages.push(page); if (integrity) f.integrity = integrity;
  };
  const pageFails = [];
  await pool(PAGES, 6, async (page) => {
    const r = await get(origin + page); const html = r.body.toString();
    if (r.status !== 200) { pageFails.push(`${r.status} ${page}`); return; }
    for (const m of html.matchAll(repoUrlRx())) {
      const tag = html.slice(html.lastIndexOf('<', m.index), html.indexOf('>', m.index) + 1);
      add(m[0], page, (tag.match(/integrity="([^"]+)"/) || [])[1]);
    }
    for (const m of html.matchAll(/data-tll-version="([0-9a-f]{7,40})"/g)) {
      for (const p of ['dist/tll-map-layers.js', 'dist/tll-map-layers.css', 'collections.json', 'data/countries.json']) add(cdn(m[1], 'map-2.0/' + p), page);
    }
  });
  console.log(`\nLive pages on ${origin}: ${PAGES.length} pages read, ${found.size} files from ${REPO} on jsDelivr`);
  for (const p of pageFails.sort()) fail(`page ${p}`);
  if (!found.size) fail('no file of this repository found on the live pages');
  await pool([...found.values()], 6, async (f) => {
    const rev = f.url.match(/@([0-9a-f]+)\//)[1]; const n = treeBytes(rev);
    const r = await get(f.url);
    const sri = !f.integrity ? 'no SRI' : r.status !== 200 ? 'not checked' : f.integrity === 'sha384-' + sha('sha384', r.body) ? 'SRI ok' : 'SRI MISMATCH';
    const risk = n === null ? 'size unknown' : n > LIMIT ? `tree ${mb(n)}, OVER 50 MB` : `tree ${mb(n)}`;
    if (n === null || n > LIMIT) atRisk++;
    if (r.status !== 200 || sri === 'SRI MISMATCH') failed = 1;
    const shown = f.pages.length > 4 ? `${f.pages.slice(0, 4).join(' ')} and ${f.pages.length - 4} more` : f.pages.join(' ');
    f.line = `  ${r.status} ${rev.slice(0, 7)} ${risk.padEnd(22)} ${sri.padEnd(12)} ${f.url.split(rev + '/')[1]}  (${shown})`;
  });
  for (const f of [...found.values()].sort((a, b) => a.line.localeCompare(b.line))) console.log(f.line);
  console.log(atRisk ? `${atRisk} live files load from a pin over jsDelivr's limit (or unknown here): switch them to a layers-release pin.` : 'Every live file loads from a pin under the limit.');
}

console.log(failed ? '\nRESULT: FAIL' : atRisk ? '\nRESULT: release OK; live pages still use over-limit pins' : '\nRESULT: OK');
process.exit(failed ? 1 : atRisk ? 2 : 0);
