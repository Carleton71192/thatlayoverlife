#!/usr/bin/env node
// TLL live checker · v8 · 28 September 2026
// Usage: node verify-live.mjs            (checks https://www.thatlayover.life)
//        node verify-live.mjs https://thatlayover.life
// Needs Node 18+. Writes verify-report.md next to this file and prints a summary.
// It does NOT prove a page matches the design. It catches the things that keep slipping:
// dead routes, banned words, retired copy, wrong dates, stray emails, and STATUS.md gaps.
import { readFileSync, writeFileSync } from 'node:fs';
const BASE = (process.argv[2] || 'https://www.thatlayover.life').replace(/\/$/, '');
const V = '?v=' + Date.now();
const ROUTES = ['/', '/stories', '/travelers', '/the-paw-passport', '/about', '/share', '/travel-wire', '/spotlight', '/faq', '/support',
  '/for-expats', '/for-press', '/for-affiliates', '/my-pets', '/pets', '/the-map', '/editorial-charter', '/community-guidelines',
  '/privacy', '/terms', '/forgot-password', '/contact', '/cookies', '/share-photos', '/login', '/signup', '/account', '/gallery',
  '/destinations', '/countries', '/for-brands', '/awards', '/guides/copenhagen-stopover', '/guides/ees-etias-layover',
  '/expats', '/creators', '/press', '/press-trips', '/editor-desk'];
const EXEMPT_PET = [/paw-passport/i, /chip-first/i, /\/guides\//i];
const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December';
const CHECKS = [
  ['A01 em dash', /\u2014/g],
  ['A02 vibe collection', /Sunset Mist|Desert Glow|Alpine Escape|Wild Routes|Salty Air/gi],
  ['A03 anti-AI marketing', /not chatbots|by a chatbot|chatbot bylines|written by humans, not/gi],
  ['A04 US-order date', new RegExp('\\b(' + MONTHS + ') \\d{1,2}, \\d{4}\\b', 'g')],
  ['A04 numeric date', /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g],
  ['A08 old age floor', /13 or older/gi],
  ['A13 publish promise', /publish(?:ed)? (?:with)?in 48 hours/gi],
  ['A13 byline wording', /Every byline a real name/gi],
  ['A14 old Lounge name', /Sharing Gallery/gi],
  ['A12 placeholder leftovers', /Lorem ipsum|TODO:|\[placeholder\]/gi],
  ['A18 retired slogan', /Truth over polish|No filler/gi],
  ['J15 "currently in"', /currently in\b/gi],
];
const PET = ['A09 banned pet word', /microchip|titer|titre|FAVN/gi];
const strip = h => h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
const rows = []; const emails = new Map(); let fails = 0;
for (const r of ROUTES) {
  let res, html = '';
  try { res = await fetch(BASE + r + V, { redirect: 'manual' }); html = await res.text(); } catch (e) { rows.push([r, 'FETCH ERROR', e.message]); fails++; continue; }
  const code = res.status; const hits = [];
  if (code >= 400) { rows.push([r, String(code), 'route missing or broken']); fails++; continue; }
  const body = strip(html);
  for (const [name, re] of CHECKS) { const m = body.match(re); if (m) hits.push(name + ' ×' + m.length + ' ("' + m[0] + '")'); }
  { const m = html.match(/color:\s*#(7d7f96|9a958d|4a4d63)\b/gi); if (m) hits.push('J05 retired grey ×' + m.length); }
  if (!EXEMPT_PET.some(x => x.test(r))) { const m = body.match(PET[1]); if (m) hits.push(PET[0] + ' ×' + m.length); }
  (html.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || []).forEach(e => { if (!/\.(png|jpe?g|webp|svg)$/i.test(e)) emails.set(e.toLowerCase(), (emails.get(e.toLowerCase()) || new Set()).add(r)); });
  if (!/hello@thatlayover\.life/i.test(html)) hits.push('A07 footer/contact email missing');
  const plain = body.replace(/<[^>]+>/g, ' ');
  const nReal = (plain.match(/\breal\b/gi) || []).length, nAct = (plain.match(/\bactually\b/gi) || []).length;
  if (nReal > 1) hits.push('A17 "real" ×' + nReal + ' (H1 only)');
  if (nAct > 1) hits.push('A17 "actually" ×' + nAct + ' (max 1)');
  if (!/\/(share|faq)$/.test(r) && /reviews every submission within 48 hours/i.test(plain)) hits.push('A17 48-hour line outside /share and /faq');
  if (hits.length) fails++;
  rows.push([r, String(code) + (code >= 300 ? ' → ' + res.headers.get('location') : ''), hits.join('; ') || 'ok']);
}
const stray = [...emails.keys()].filter(e => e !== 'hello@thatlayover.life');
let status = '';
try {
  const s = readFileSync(new URL('./STATUS.md', import.meta.url), 'utf8');
  const cells = [...s.matchAll(/^\| ([A-Z]\d{2}) \| .*? \| (.*?) \| (.*?) \|$/gm)];
  const tally = {}; const noEvidence = [];
  cells.forEach(c => { tally[c[2]] = (tally[c[2]] || 0) + 1; if (c[2] === 'Done' && !/https?:\/\//.test(c[3])) noEvidence.push(c[1]); });
  const req = readFileSync(new URL('./REQUIREMENTS.md', import.meta.url), 'utf8');
  const ids = [...req.matchAll(/^- \*\*([A-Z]\d{2})\*\*/gm)].map(m => m[1]);
  const missing = ids.filter(id => !cells.some(c => c[1] === id));
  status = 'STATUS.md: ' + Object.entries(tally).map(([k, v]) => k + ' ' + v).join(' · ') + '\n' +
    (missing.length ? 'IDs missing from STATUS.md: ' + missing.join(', ') + '\n' : '') +
    (noEvidence.length ? 'Marked Done without a URL as evidence: ' + noEvidence.join(', ') + '\n' : '');
} catch (e) { status = 'STATUS.md not found next to this script.\n'; }
const out = '# verify-live report · ' + new Date().toISOString() + '\nBase: ' + BASE + '\n\n| Route | HTTP | Findings |\n|---|---|---|\n' +
  rows.map(r => '| ' + r.join(' | ') + ' |').join('\n') + '\n\n' +
  (stray.length ? '**A07 other emails found:** ' + stray.map(e => e + ' (' + [...emails.get(e)].join(', ') + ')').join('; ') + '\n\n' : '**A07:** only hello@thatlayover.life found.\n\n') + status;
writeFileSync(new URL('./verify-report.md', import.meta.url), out);
console.log(out);
console.log(fails || stray.length ? '\nNOT CLEAN: ' + fails + ' route(s) with findings.' : '\nCLEAN.');
process.exit(fails || stray.length ? 1 : 0);
