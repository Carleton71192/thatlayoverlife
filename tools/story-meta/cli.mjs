#!/usr/bin/env node
// Story share tags and structured data (November 12, 2026). See README.md beside this file.
//
//   node tools/story-meta/cli.mjs inject <glob...> [--dry-run] [--check] [--rule replace|skip] [--contributors <export.json>]
//                                            [--slug-from-filename]
//   node tools/story-meta/cli.mjs audit --live [--csv <file>] [--limit <n>] [--sitemap <url>]
//   node tools/story-meta/cli.mjs audit <glob...> [--csv <file>]        (local story pages)
//   node tools/story-meta/cli.mjs webflow-template [--code-only]
//   node tools/story-meta/cli.mjs print <file>                         (the block for one .md, .html or CMS .json, nothing written)
//
// Writes files only for "inject" without --dry-run or --check, and for "audit --csv". Never touches Webflow.
// inject exit codes: 0 done; 1 with --check when a file is out of date or misses a required field, and in every mode when a
// file was refused (damaged markers, a head: field it did not write); 2 for a usage error.
// Behind an HTTPS proxy, run the live audit with NODE_USE_ENV_PROXY=1 so Node's fetch uses it.

import fs from 'node:fs';
import path from 'node:path';
import {
  REQUIRED, SITE, auditStory, buildMeta, contributorsFromExport, injectStory, parseStory, renderMeta, storyUrlsFromSitemap, summarize, toCsv,
  webflowTemplate,
} from './lib.mjs';

const UA = 'Mozilla/5.0 (compatible; TLL-StoryMeta-Audit/1.0; +https://www.thatlayover.life)';

function parseArgs(argv) {
  const flags = {}, rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { rest.push(a); continue; }
    const [k, v] = a.slice(2).split('=');
    if (v !== undefined) flags[k] = v;
    else if (['csv', 'rule', 'contributors', 'limit', 'sitemap', 'concurrency'].includes(k)) flags[k] = argv[++i];
    else flags[k] = true;
  }
  return { flags, rest };
}

function expand(patterns) {
  const out = [];
  for (const p of patterns) {
    if (/[*?[{]/.test(p)) out.push(...fs.globSync(p).filter((f) => !f.split(path.sep).includes('node_modules')));
    else if (fs.existsSync(p)) out.push(p);
    else console.error(`not found: ${p}`);
  }
  return [...new Set(out)].sort();
}

const kindOf = (f) => (/\.(md|markdown)$/i.test(f) ? 'md' : /\.html?$/i.test(f) ? 'html' : '');

/** The slug a file name gives, only when --slug-from-filename is set: the name without extension, or the folder for index.*. */
function fileSlug(f, flags) {
  if (!flags['slug-from-filename']) return '';
  const base = path.basename(f).replace(/\.[^.]+$/, '');
  return base.toLowerCase() === 'index' ? path.basename(path.dirname(path.resolve(f))) : base;
}

function loadContributors(file) {
  if (!file) return undefined;
  const j = JSON.parse(fs.readFileSync(file, 'utf8'));
  return j.items ? contributorsFromExport(j) : j;
}

function cmdInject(files, flags) {
  if (!files.length) { console.error('inject: give one or more .md or .html files (a glob is fine)'); return 2; }
  const contributors = loadContributors(flags.contributors);
  if (flags.rule !== undefined && flags.rule !== 'replace' && flags.rule !== 'skip') { console.error(`inject: --rule must be replace or skip, not "${flags.rule}"`); console.error(USAGE); return 2; }
  const rule = flags.rule === 'skip' ? 'skip' : 'replace';
  let changed = 0, skipped = 0, incomplete = 0, refused = 0;
  for (const f of files) {
    const kind = kindOf(f);
    if (!kind) { console.error(`skip (not .md or .html): ${f}`); skipped++; continue; }
    const text = fs.readFileSync(f, 'utf8');
    const { text: out, story, missing: required, error } = injectStory(text, { kind, rule, contributors, slug: fileSlug(f, flags) });
    if (error) { console.error(`refused  ${f}: ${error}`); refused++; continue; }
    if (required.length) {
      console.log(`missing  ${f}  (needs ${required.join(', ')}; nothing written${required.includes('slug') && !flags['slug-from-filename'] ? '; --slug-from-filename takes the slug from the file name' : ''})`);
      incomplete++;
      continue;
    }
    const missing = ['excerpt'].filter((k) => !story[k]).concat(story.author?.name ? [] : ['author'], story.image?.url ? [] : ['image']);
    const note = missing.length ? `  (not found in the file: ${missing.join(', ')})` : '';
    if (out === text) { console.log(`unchanged  ${f}${note}`); continue; }
    changed++;
    if (flags.check) { console.log(`out of date  ${f}${note}`); continue; }
    if (flags['dry-run']) { console.log(`would update  ${f}${note}`); continue; }
    fs.writeFileSync(f, out);
    console.log(`updated  ${f}${note}`);
  }
  if (skipped) console.error(`${skipped} file(s) skipped: not .md or .html`);
  if (refused) { console.error(`${refused} file(s) refused and left as they are`); return 1; }
  if (flags.check && (changed || incomplete)) {
    console.error(`${changed} file(s) need "inject", ${incomplete} file(s) miss a required field`);
    return 1;
  }
  return 0;
}

async function get(url, tries = 3) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'text/html,application/xml' }, signal: AbortSignal.timeout(30000) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.text();
    } catch (e) { last = e; await new Promise((res) => setTimeout(res, 800 * (i + 1))); }
  }
  const code = last?.cause?.code || last?.message;
  if (/ENOTFOUND|EAI_AGAIN|ECONNREFUSED/.test(String(code)) && (process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
    throw new Error(`${code} for ${url}. An HTTPS proxy is set: run again with NODE_USE_ENV_PROXY=1`);
  }
  throw new Error(`${code} for ${url}`);
}

async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); }
  }));
  return out;
}

function report(results, { label }) {
  const sum = summarize(results);
  const n = results.length;
  const lines = [];
  lines.push(`Story share tags audit, ${label}`);
  lines.push(`Stories checked: ${n}. Failed to load: ${results.filter((r) => r.error).length}.`);
  lines.push('');
  lines.push('| Check | OK | Missing | Disagree | Duplicate | Entities |');
  lines.push('|---|---|---|---|---|---|');
  for (const s of sum) lines.push(`| ${s.key} | ${s.ok} | ${s.missing} | ${s.disagree} | ${s.duplicate} | ${s.entities} |`);
  lines.push('');
  const per = results.filter((r) => !r.error).map((r) => ({ slug: r.slug, gaps: r.rows.filter((x) => x.status !== 'ok').length }))
    .sort((a, b) => b.gaps - a.gaps || a.slug.localeCompare(b.slug));
  if (per.length) {
    lines.push(`Gaps per story: fewest ${per[per.length - 1].gaps}, most ${per[0].gaps} (${per.filter((p) => p.gaps === per[0].gaps).map((p) => p.slug).slice(0, 5).join(', ')}).`);
  }
  for (const r of results.filter((x) => x.error)) lines.push(`Not loaded: ${r.url} (${r.error})`);
  return lines.join('\n');
}

function csvRows(results) {
  return results.flatMap((r) => (r.error ? [{ slug: r.slug, url: r.url, key: 'page', status: 'error', expected: '', found: r.error }]
    : r.rows.map((x) => ({ slug: r.slug, url: r.url, ...x }))));
}

async function cmdAudit(files, flags) {
  let results, label;
  if (flags.live) {
    const sitemap = flags.sitemap || `${SITE.origin}/sitemap.xml`;
    let urls = storyUrlsFromSitemap(await get(sitemap));
    if (flags.limit) urls = urls.slice(0, Number(flags.limit));
    label = `${SITE.origin}, ${new Date().toISOString().slice(0, 10)} (${urls.length} story addresses in the sitemap)`;
    results = await pool(urls, Number(flags.concurrency) || 4, async (url) => {
      const slug = url.split('/').filter(Boolean).pop();
      try {
        const html = await get(url);
        const a = auditStory(html, SITE, { slug });
        process.stderr.write('.');
        return { url, ...a, slug: a.slug || slug };
      } catch (e) { return { url, slug, rows: [], error: e.message }; }
    });
    process.stderr.write('\n');
  } else {
    if (!files.length) { console.error('audit: use --live, or give local story .html files'); return 2; }
    label = `${files.length} local file(s)`;
    results = files.map((f) => {
      const a = auditStory(fs.readFileSync(f, 'utf8'), SITE, { slug: fileSlug(f, flags) });
      return { url: f, ...a, slug: a.slug || f };
    });
  }
  console.log(report(results, { label }));
  if (flags.csv) {
    fs.writeFileSync(flags.csv, toCsv(csvRows(results), ['slug', 'url', 'key', 'status', 'expected', 'found']));
    console.log(`\nCSV: ${flags.csv}`);
  }
  return results.some((r) => r.error) ? 1 : 0;
}

function cmdTemplate(flags) {
  const t = webflowTemplate(SITE);
  console.log(t.code);
  if (flags['code-only']) return 0;
  console.log('\n----- notes, not part of the head code -----');
  console.log('Webflow already writes these on the Stories template from Page settings, so the code above leaves them out:');
  for (const [k, v] of t.webflowEmits) console.log(`- ${k}: ${v}`);
  console.log('');
  for (const l of t.notes) console.log(l);
  return 0;
}

function cmdPrint(files, flags) {
  const f = files[0];
  if (!f) { console.error('print: give one .md, .html or .json file'); return 2; }
  const text = fs.readFileSync(f, 'utf8');
  const story = parseStory(text, { contributors: loadContributors(flags.contributors), slug: fileSlug(f, flags) });
  const meta = buildMeta(story, SITE);
  console.log(renderMeta(meta));
  console.log(`\nvisible byline only: ${JSON.stringify(meta.visible)}`);
  const missing = REQUIRED.filter((k) => !story[k]);
  if (missing.length) { console.error(`missing  ${f}  (needs ${missing.join(', ')}; inject would not write this file)`); return 1; }
  return 0;
}

const USAGE = `usage:
  node tools/story-meta/cli.mjs inject <glob...> [--dry-run] [--check] [--rule replace|skip] [--contributors <export.json>] [--slug-from-filename]
  node tools/story-meta/cli.mjs audit --live [--csv <file>] [--limit <n>]
  node tools/story-meta/cli.mjs audit <glob...> [--csv <file>]
  node tools/story-meta/cli.mjs webflow-template [--code-only]
  node tools/story-meta/cli.mjs print <file> [--contributors <export.json>] [--slug-from-filename]`;

async function main() {
  const [cmd, ...argv] = process.argv.slice(2);
  const { flags, rest } = parseArgs(argv);
  switch (cmd) {
    case 'inject': return cmdInject(expand(rest), flags);
    case 'audit': return cmdAudit(expand(rest), flags);
    case 'webflow-template': return cmdTemplate(flags);
    case 'print': return cmdPrint(rest, flags);
    default: console.log(USAGE); return cmd ? 2 : 0;
  }
}

main().then((code) => { process.exitCode = code; }, (e) => { console.error(e.message || e); process.exitCode = 1; });
