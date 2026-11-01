// Times the records zip the Worker writes for "Download everything" (src/export.js writeExportZip through src/zip.js), in Node,
// for a member with 10, 20, 40 and 60 stories of 15 KB each and four photos per story. Reports the median and best of 30 runs,
// the zip size and how many chunks the stream saw. Each case runs in its own process, so one case's garbage does not land in
// the next case's figures. Run from the repo root: node scratchpad/time-export.mjs   (or with one count: node ... 40)
// The numbers in the src/export.js header come from this script. Node is not workerd, so they are a guide, not a guarantee.
import { performance } from 'node:perf_hooks';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { buildExport, writeExportZip, checkStates } from '../src/export.js';
import { ZipWriter, zipStream, collectBytes } from '../src/zip.js';

const ME = 'a'.repeat(24);
const CDN = 'https://cdn.prod.website-files.com';
const para = '<p>' + 'Sofia in May is warm and slow, and the tram bells carry over the square while the bakeries open one by one. '.repeat(3) + '</p>';
const body = (n) => { let s = ''; while (s.length < 15 * 1024) s += para; return s.slice(0, 15 * 1024) + ` <span hidden>${n}</span>`; };

function member(stories) {
  const me = { id: ME, fieldData: { name: 'Nancy Carleton', slug: 'nancy-carleton', 'memberstack-id': 'mem_a', avatar: { url: `${CDN}/avatar.jpg` }, desks: '[{"c":"dk","years":"2019-","now":true},{"c":"jp","years":"2010-2012"}]', 'map-snapshot': '{"countries":89}' } };
  const list = Array.from({ length: stories }, (_, i) => ({ id: `s${i}`, isDraft: i % 7 === 0, fieldData: { contributor: ME, slug: `story-${i}`, name: `Story ${i}`, body: body(i), excerpt: 'A short excerpt for the list.', 'byline-location': 'Sofia, Bulgaria', 'trip-when': 'May 2026',
    'hero-image': { url: `${CDN}/hero-${i}.jpg`, alt: 'Hero' }, 'photo-gallery': [1, 2, 3].map((k) => ({ url: `${CDN}/s${i}-g${k}.jpg`, alt: `Photo ${k}` })) } }));
  const items = Array.from({ length: 10 }, (_, i) => ({ id: `i${i}`, fieldData: { owner: ME, name: 'Japan', category: 'c1', city: 'Tokyo', year: 2019, caption: 'A magnet', photo: { url: `${CDN}/m${i}.jpg` } } }));
  const stamps = Array.from({ length: 5 }, (_, i) => ({ id: `st${i}`, fieldData: { owner: ME, pursuit: 'p1', what: 'Marathon', name: 'Denmark', city: 'Copenhagen', year: 2020, photo: { url: `${CDN}/st${i}.jpg` } } }));
  const pets = [{ id: 'p1', fieldData: { owner: ME, name: 'Rex', slug: 'rex', breed: 'Beagle', avatar: { url: `${CDN}/rex.jpg` } } }];
  const data = buildExport({ me, stories: list, items, stamps, pets, cats: [{ id: 'c1', fieldData: { name: 'Magnets' } }], pursuits: [{ id: 'p1', fieldData: { name: 'Marathons' } }], now: Date.parse('2026-11-01T10:00:00Z') });
  const states = {}; for (let n = 4; n < 244; n += 4) states[String(n).padStart(3, '0')] = { me: n % 3 ? 'visited' : 'layover' };
  const { map } = checkStates({ v: 2, travelers: [{ id: 'me', name: 'Nancy' }], states });
  return { data, map };
}

async function once(data, map) {
  let chunks = 0, bytes = 0;
  const zip = new ZipWriter((c) => { chunks += 1; bytes += c.length; }, { now: Date.now() });
  const t0 = performance.now();
  await writeExportZip(zip, data, map);
  await zip.finish();
  return { ms: performance.now() - t0, chunks, bytes };
}

async function streamed(data, map) {
  const t0 = performance.now();
  const out = await collectBytes(zipStream((zip) => writeExportZip(zip, data, map), { now: Date.now() }));
  return { ms: performance.now() - t0, bytes: out.length };
}

const median = (a) => { const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const only = Number(process.argv[2] || 0);
for (const n of only ? [only] : [10, 20, 40, 60]) {
  if (!only) { process.stdout.write(execFileSync(process.execPath, [fileURLToPath(import.meta.url), String(n)], { encoding: 'utf8' })); continue; }
  const { data, map } = member(n);
  for (let i = 0; i < 5; i += 1) await once(data, map);
  const runs = []; let last = null;
  for (let i = 0; i < 30; i += 1) { last = await once(data, map); runs.push(last.ms); }
  const sruns = [];
  for (let i = 0; i < 30; i += 1) sruns.push((await streamed(data, map)).ms);
  console.log(`${String(n).padStart(2)} stories, ${data.photos.length} photos: sink median ${median(runs).toFixed(1)} ms, best ${Math.min(...runs).toFixed(1)} ms, ${last.chunks} chunks, ${(last.bytes / 1024 / 1024).toFixed(2)} MB; through zipStream median ${median(sruns).toFixed(1)} ms`);
}
