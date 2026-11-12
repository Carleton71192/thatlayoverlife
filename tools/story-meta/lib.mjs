// Story share tags and structured data, as pure functions (12 Nov 2026).
//
// parseStory(input)        Markdown with front matter, a story HTML page, a Webflow CMS item (JSON) or a row of
//                          src/data/story-search-index.json, into one plain story object.
// buildMeta(story, site)   The Open Graph tags, Twitter card tags and a JSON-LD Article graph for that story.
// renderMeta(meta)         The tags as HTML, between the markers <!-- tll-meta:start --> and <!-- tll-meta:end -->.
// injectHead(html, meta)   Puts that block in a page head, idempotently. injectMarkdown does the same for front matter.
// readHead(html)           The share tags and JSON-LD a page already has (used by the live audit).
// auditStory(html, site)   What a live story page is missing, or says differently, compared with buildMeta.
// webflowTemplate(site)    The same block for the Webflow Stories template, with CMS binding tokens in place of values.
//
// Nothing here reads files or the network; cli.mjs does that. No story copy is written here: every title,
// description and name comes from the story itself. No coordinates, and no place beyond the story's own byline place.

import { decodeEntities as decodeText } from '../../src/text.js';

export const SITE = Object.freeze({
  origin: 'https://www.thatlayover.life',
  name: 'That Layover Life',
  locale: 'en_US',
  language: 'en',
  storiesPath: '/stories/',
  contributorsPath: '/contributors/',
  // The 512 px web clip the site already serves as its icon (live head, 12 Nov 2026). Used as the publisher logo.
  logo: 'https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6a0dea106bf47c697c1967c3_tll-webclip.png',
});

export const MARK_START = '<!-- tll-meta:start -->';
export const MARK_END = '<!-- tll-meta:end -->';
export const WORDS_PER_MINUTE = 200;

/* ------------------------------------------------------------------ text helpers */

const clean = (s) => decodeText(String(s ?? '')).replace(/\s+/g, ' ').trim();
const plain = (html) => clean(String(html ?? '')
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<br\s*\/?>/gi, ' ')
  .replace(/<\/(p|div|li|h[1-6]|blockquote|figcaption)>/gi, ' ')
  .replace(/<[^>]*>/g, ' '));
const nonEmpty = (v) => v != null && String(v).trim() !== '';

/** Words in a text: runs of letters or digits, so punctuation, emoji and markup never count. */
export function countWords(text) {
  const m = String(text ?? '').match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu);
  return m ? m.length : 0;
}

/** Minutes at 200 words a minute, rounded up, never below one for a story that has words. */
export function readingMinutes(words, wpm = WORDS_PER_MINUTE) {
  const n = Number(words);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.max(1, Math.ceil(n / wpm));
}

/** ISO 8601 duration for whole minutes: 3 -> PT3M, 75 -> PT1H15M. A binding token passes through as PT<token>M. */
export function isoDuration(minutes) {
  if (typeof minutes === 'string' && isToken(minutes)) return `PT${minutes}M`;
  const n = Math.round(Number(minutes));
  if (!Number.isFinite(n) || n <= 0) return '';
  const h = Math.floor(n / 60), m = n % 60;
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}`;
}

/** Text for a double-quoted HTML attribute. */
export function escapeAttr(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** JSON that is safe inside <script type="application/ld+json">: no </script>, no <!--, no raw U+2028 or U+2029. */
export function jsonForScript(value, space = 0) {
  return JSON.stringify(value, null, space)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

/** A date as ISO 8601. Keeps a full timestamp when there is one; "September 19, 2026" or "19 September 2026" -> 2026-09-19. */
export function toIsoDate(v) {
  if (v == null || v === '') return '';
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? '' : v.toISOString();
  const s = clean(v);
  if (isToken(s)) return s;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(s)) {
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? '' : d.toISOString();
  }
  let m = s.match(/^([A-Za-z]+)\.? (\d{1,2}),? (\d{4})$/);
  let day, mon, year;
  if (m) { mon = m[1]; day = m[2]; year = m[3]; } else {
    m = s.match(/^(\d{1,2}) ([A-Za-z]+)\.?,? (\d{4})$/);
    if (m) { day = m[1]; mon = m[2]; year = m[3]; }
  }
  if (!m) return '';
  const i = MONTHS.findIndex((x) => x.startsWith(mon.toLowerCase().slice(0, 3)));
  if (i < 0) return '';
  return `${year}-${String(i + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const SMALL = new Set(['de', 'da', 'do', 'dos', 'das', 'del', 'la', 'le', 'les', 'el', 'of', 'and', 'the', 'y', 'e', 'van', 'von', 'di', 'du']);
const KEEP_UPPER = new Set(['USA', 'US', 'UK', 'UAE', 'DC', 'NYC', 'EU', 'DR']);

/** The byline place as written in the CMS ("PORTO JOFRE, BRAZIL") in normal case ("Porto Jofre, Brazil"). Mixed case is kept as is. */
export function placeName(raw) {
  const s = clean(raw);
  if (!s || s !== s.toUpperCase()) return s;
  let first = true;
  return s.replace(/[\p{L}\p{N}][\p{L}\p{N}'’.]*/gu, (w) => {
    const out = KEEP_UPPER.has(w) ? w : (!first && SMALL.has(w.toLowerCase())) ? w.toLowerCase() : w.charAt(0) + w.slice(1).toLowerCase();
    first = false;
    return out;
  });
}

/* ------------------------------------------------------------------ author badge */

// The badge is the label on a contributor (CMS option Contributor, Frequent, Editor, Founder; the proposed Founding member and
// Location Expert). schema.org has no property for it that produces a rich result. Roles at That Layover Life go to
// author.jobTitle; every other badge goes to author.description. Both are plain descriptive fields that search engines may
// read and do not display. The badge itself is meant for the visible byline, which is why buildMeta also returns it in
// meta.visible.authorBadge and never as a head tag.
export const ROLE_BADGES = new Set(['founder', 'editor', 'contributor']);

export function mapBadge(badge, site = SITE) {
  const b = clean(badge);
  if (!b) return { visible: '' };
  if (ROLE_BADGES.has(b.toLowerCase())) return { jobTitle: b, visible: b };
  return { description: `${b} at ${site.name}`, visible: b };
}

/* ------------------------------------------------------------------ binding tokens (webflow-template) */

// While the template is built, each CMS value is a sentinel that survives attribute escaping and JSON escaping unchanged;
// after rendering, each sentinel becomes the Webflow token, written the way the existing template head code writes them.
const TOKEN_RE = /@@wf:([a-z0-9:-]+):([A-Za-z]+)@@/g;
export const token = (path, type = 'PlainText') => `@@wf:${path}:${type}@@`;
function isToken(s) { return typeof s === 'string' && /^@@wf:[a-z0-9:-]+:[A-Za-z]+@@$/.test(s); }
export function webflowBinding(path, type) {
  return `{{wf {&quot;path&quot;:&quot;${path}&quot;,&quot;type&quot;:&quot;${type}&quot;} }}`;
}
const resolveTokens = (s) => s.replace(TOKEN_RE, (_, p, t) => webflowBinding(p, t));

/* ------------------------------------------------------------------ small HTML reader (no DOM in Node) */

function attrsOf(tag) {
  const out = {};
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  const inner = tag.replace(/^<\/?[a-zA-Z][\w-]*/, '').replace(/\/?>$/, '');
  let m;
  while ((m = re.exec(inner))) out[m[1].toLowerCase()] = decodeText(m[3] ?? m[4] ?? m[5] ?? '');
  return out;
}

function headOf(html) {
  const s = String(html ?? '');
  const a = s.search(/<head\b[^>]*>/i);
  const b = s.search(/<\/head>/i);
  if (a < 0 && b < 0) return /<body\b/i.test(s) ? '' : s;
  return s.slice(a < 0 ? 0 : a, b < 0 ? s.length : b);
}
function bodyOf(html) {
  const s = String(html ?? '');
  const a = s.search(/<body\b[^>]*>/i);
  const out = a < 0 ? s.slice(Math.max(0, s.search(/<\/head>/i))) : s.slice(a);
  return out.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<!--[\s\S]*?-->/g, '');
}

/** Every element whose open tag passes `test(tagName, attrs)`, with its inner HTML (matched by nesting depth). */
function findAll(html, test, limit = Infinity) {
  const out = [];
  const open = /<([a-zA-Z][\w-]*)\b[^>]*>/g;
  let m;
  while ((m = open.exec(html)) && out.length < limit) {
    const name = m[1].toLowerCase();
    const attrs = attrsOf(m[0]);
    if (!test(name, attrs)) continue;
    if (m[0].endsWith('/>') || /^(img|meta|link|br|hr|input|source)$/.test(name)) { out.push({ name, attrs, inner: '' }); continue; }
    const re = new RegExp(`<(/?)${name}\\b[^>]*>`, 'gi');
    re.lastIndex = m.index + m[0].length;
    let depth = 1, t, end = html.length;
    while ((t = re.exec(html))) {
      if (t[0].endsWith('/>')) continue;
      depth += t[1] ? -1 : 1;
      if (depth === 0) { end = t.index; break; }
    }
    out.push({ name, attrs, inner: html.slice(m.index + m[0].length, end) });
  }
  return out;
}
const hasClass = (a, c) => (` ${a.class || ''} `).includes(` ${c} `);
const isEmptyBind = (a) => hasClass(a, 'w-dyn-bind-empty');
function firstText(html, test) {
  for (const e of findAll(html, test)) {
    if (isEmptyBind(e.attrs)) continue;
    const t = plain(e.inner);
    if (t) return t;
  }
  return '';
}

/** Share tags and JSON-LD already in a page head: { tags: Map(key -> [values]), canonical: [hrefs], title, ld: [{raw, data}] }. */
export function readHead(html) {
  const head = headOf(html);
  const tags = new Map();
  for (const t of head.match(/<meta\b[^>]*>/gi) || []) {
    const a = attrsOf(t);
    const key = (a.property || a.name || '').toLowerCase();
    if (!key || a.content == null) continue;
    if (!tags.has(key)) tags.set(key, []);
    tags.get(key).push(a.content);
  }
  const canonical = [];
  for (const t of head.match(/<link\b[^>]*>/gi) || []) {
    const a = attrsOf(t);
    if ((a.rel || '').toLowerCase().split(/\s+/).includes('canonical') && a.href) canonical.push(a.href);
  }
  const title = clean((head.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '');
  const ld = [];
  const re = /<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(String(html ?? '')))) {
    let data = null;
    try { data = JSON.parse(m[1]); } catch { data = null; }
    ld.push({ raw: m[1], data });
  }
  return { tags, canonical, title, ld };
}

const ARTICLE_TYPES = new Set(['Article', 'BlogPosting', 'NewsArticle', 'Report', 'TechArticle']);
function nodesOf(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data.flatMap(nodesOf);
  if (Array.isArray(data['@graph'])) return data['@graph'].flatMap(nodesOf);
  return [data];
}
const typesOf = (n) => [].concat(n?.['@type'] || []);
export function articleNode(data) {
  return nodesOf(data).find((n) => typesOf(n).some((t) => ARTICLE_TYPES.has(t))) || null;
}

/* ------------------------------------------------------------------ parseStory */

/**
 * One story, whatever the source. Returns:
 * { source, slug, title, seoTitle, excerpt, seoDescription, author: { name, slug, url, badge }, readingTime,
 *   readingTimeFrom ('field' | 'meta' | 'page' | 'words' | ''), wordCount, image: { url, alt }, datePublished,
 *   dateModified, canonical, place, pillar, tags, sources, sponsor: { name, url } | null, lang }
 */
export function parseStory(input, opts = {}) {
  if (input && typeof input === 'object') {
    if (Array.isArray(input) && input.length === 2 && typeof input[1] === 'string') return parseIndexRow({ slug: input[0], text: input[1] });
    if ('text' in input && 'slug' in input && !('name' in input) && !('fieldData' in input)) return parseIndexRow(input);
    return parseCmsItem(input, opts);
  }
  const s = String(input ?? '');
  const t = s.replace(/^\uFEFF/, '').trimStart();
  if (t.startsWith('---')) return parseMarkdown(t, opts);
  if (t.startsWith('{') || t.startsWith('[')) return parseStory(JSON.parse(t), opts);
  if (t.startsWith('<')) return parseHtml(t, opts);
  return parseMarkdown(t, opts);
}

function emptyStory(source) {
  return {
    source, slug: '', title: '', seoTitle: '', excerpt: '', seoDescription: '',
    author: { name: '', slug: '', url: '', badge: '' },
    readingTime: 0, readingTimeFrom: '', wordCount: 0, image: { url: '', alt: '' },
    datePublished: '', dateModified: '', canonical: '', place: '', pillar: '', tags: [], sources: [], sponsor: null, lang: '',
  };
}

function finishReading(story, given, from, words) {
  story.wordCount = words || 0;
  const n = Number(given);
  if (Number.isFinite(n) && n > 0) { story.readingTime = Math.round(n); story.readingTimeFrom = from; }
  else if (words) { story.readingTime = readingMinutes(words); story.readingTimeFrom = 'words'; }
  return story;
}

const slugify = (s) => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const slugFromUrl = (u) => { try { return new URL(u, SITE.origin).pathname.split('/').filter(Boolean).pop() || ''; } catch { return ''; } };
const splitTags = (v) => (Array.isArray(v) ? v : String(v ?? '').split(/[,\s]+/)).map((x) => clean(x).replace(/^#/, '')).filter(Boolean);

/**
 * Sources as a list of citations. The Sources field reads like "First-hand; UNESCO World Heritage Centre (...); NOAA" or
 * "First-hand, with UNESCO, IUCN and Changi Airport", or holds one paragraph per source. Paragraphs and top-level semicolons
 * split items; a leading "First-hand" (with "with" or "plus") is dropped, because it says the writer was there and is not a
 * citation; "official sources linked below" is dropped, because it points at links, not a source. The words are the story's own.
 */
export function splitSources(v) {
  if (v == null) return [];
  const paras = Array.isArray(v) ? v.map(String) : String(v).split(/<\/p>|<br\s*\/?>|\n/i);
  const out = [];
  for (const p of paras) {
    const href = (p.match(/href\s*=\s*["']([^"']+)["']/i) || [])[1] || '';
    const text = plain(p);
    let depth = 0, cur = '';
    const parts = [];
    for (const ch of text) {
      if (ch === '(' || ch === '[') depth++;
      if (ch === ')' || ch === ']') depth = Math.max(0, depth - 1);
      if (ch === ';' && depth === 0) { parts.push(cur); cur = ''; } else cur += ch;
    }
    parts.push(cur);
    for (const raw of parts) {
      const name = raw.trim().replace(/^first[-\s]?hand\b[.,:;]?\s*(?:(?:with|plus)\s+)?/i, '').trim();
      if (!name || /^(?:the\s+)?(?:official\s+)?sources?\s+(?:are\s+)?linked\s+below\.?$/i.test(name)) continue;
      out.push({ name, url: href || (name.match(/https?:\/\/[^\s)]+/) || [])[0] || '' });
    }
  }
  return out;
}

/**
 * Sponsor from the CMS sponsor fields (as the live Reklame label reads them), or from a Disclosure that starts "Hosted by",
 * "Hosted:" or "Sponsored by". "Paid for by the travelers" is a self-funded trip, not a sponsor, so it never counts.
 */
export function sponsorOf({ name, url, disclosure } = {}) {
  if (nonEmpty(name)) return { name: clean(name), url: nonEmpty(url) ? clean(url) : '' };
  const m = clean(disclosure).match(/^(?:hosted|sponsored)\s*(?:by|:)\s*([^.;\n]+)/i);
  return m ? { name: m[1].trim().replace(/,.*$/, '').trim(), url: '' } : null;
}

function parseIndexRow({ slug, text }) {
  // The search index keeps each story's distinct words once, for search. It is not the story text, so it gives the slug
  // and a word list but no reading time (a count of distinct words would understate it).
  const s = emptyStory('index');
  s.slug = clean(slug);
  s.canonical = s.slug ? `${SITE.origin}${SITE.storiesPath}${s.slug}` : '';
  s.distinctWords = countWords(text);
  return s;
}

function parseCmsItem(item, opts) {
  const fd = item.fieldData || item;
  const s = emptyStory('cms');
  s.slug = clean(fd.slug || item.slug);
  s.title = clean(fd.name);
  s.seoTitle = clean(fd['seo-title']);
  s.excerpt = clean(fd.excerpt);
  s.seoDescription = clean(fd['seo-description']);
  const ref = fd.contributor;
  const c = (ref && typeof ref === 'object') ? ref : ((opts.contributors || {})[ref] || null);
  if (c) {
    s.author = { name: clean(c.name), slug: clean(c.slug), url: clean(c.url), badge: clean(c.badge) };
  }
  const img = fd['og-image']?.url ? fd['og-image'] : fd['hero-image'];
  if (img?.url) s.image = { url: img.url, alt: clean(img.alt) };
  s.datePublished = toIsoDate(fd['published-date']);
  s.dateModified = toIsoDate(fd['last-updated']);
  s.canonical = s.slug ? `${SITE.origin}${SITE.storiesPath}${s.slug}` : '';
  s.place = placeName(fd['byline-location']);
  s.pillar = clean(fd['pillar-name']);
  s.tags = splitTags(fd['hashtag-set']).filter((t) => t.toLowerCase() !== 'thatlayoverlife');
  s.sources = splitSources(fd.sources);
  s.sponsor = sponsorOf({ name: fd['sponsor-name-2'] ?? fd['sponsor-name'], url: fd['sponsor-url'], disclosure: fd.disclosure });
  s.lang = clean(fd.language || fd.lang);
  return finishReading(s, fd['reading-time'], 'field', countWords(plain(fd.body)));
}

// The Contributors collection's Badge option ids, from the CMS schema export of 13 Oct 2026
// (reports/evidence/webflow-export-2026-10-13/state/cms-schemas/6a0b29c7a7b1840afe9390a5.json). Used when an export has no schema.
export const BADGE_OPTIONS = Object.freeze({
  ab7ef16d027983c24537c49b36fb5070: 'Contributor',
  b7d3dd359a8309a74ae015ce5a7fb2bb: 'Frequent',
  '2c55a9352d81176a388900af4ce62012': 'Editor',
  b11d2f3f0a45d910e90369e828c64fc2: 'Founder',
});

/** Contributors by CMS item id ({ id: { name, slug, badge } }) from a Webflow collection export (items, and options from its schema). */
export function contributorsFromExport(collection, schema) {
  const fields = (schema?.fields || collection?.schema?.fields || collection?.fields || []);
  const badgeField = fields.find((f) => f.slug === 'badge');
  const options = { ...BADGE_OPTIONS, ...Object.fromEntries((badgeField?.validations?.options || []).map((o) => [o.id, o.name])) };
  const out = {};
  for (const it of collection?.items || []) {
    const fd = it.fieldData || it;
    out[it.id || it._id] = { name: clean(fd.name), slug: clean(fd.slug || it.slug), badge: options[fd.badge] || (/^[0-9a-f]{32}$/.test(fd.badge || '') ? '' : clean(fd.badge)) };
  }
  return out;
}

/* Markdown with front matter. The parser reads the subset a story file needs: key: value, quoted values, inline [a, b] lists,
   "- item" lists, one level of nested keys (author: then indented name:, badge:), and | or > blocks. */
export function parseFrontMatter(md) {
  const s = String(md ?? '').replace(/^\uFEFF/, '');
  const m = s.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
  if (!m) return { data: {}, body: s, raw: '' };
  const data = {};
  const lines = m[1].split(/\r?\n/);
  const scalar = (v) => {
    const t = v.trim();
    if (!t) return '';
    if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
      return t.startsWith('"') ? t.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\\\/g, '\\') : t.slice(1, -1).replace(/''/g, "'");
    }
    if (t.startsWith('[') && t.endsWith(']')) return t.slice(1, -1).split(',').map((x) => scalar(x)).filter((x) => x !== '');
    if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
    if (t === 'true' || t === 'false') return t === 'true';
    if (t === 'null' || t === '~') return null;
    return t.replace(/\s+#.*$/, '');
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const km = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!km) continue;
    const key = km[1], rest = km[2];
    if (rest === '|' || rest === '>' || rest === '|-' || rest === '>-') {
      const block = [];
      while (i + 1 < lines.length && (/^\s/.test(lines[i + 1]) || lines[i + 1] === '')) block.push(lines[++i].replace(/^ {2}/, ''));
      data[key] = rest.startsWith('|') ? block.join('\n').replace(/\n+$/, '') : block.join(' ').replace(/\s+/g, ' ').trim();
    } else if (rest.trim() === '') {
      const list = [], obj = {};
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) {
        const l = lines[++i];
        const li = l.match(/^\s+-\s*(.*)$/);
        if (li) { list.push(scalar(li[1])); continue; }
        const kv = l.match(/^\s+([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
        if (kv) obj[kv[1]] = scalar(kv[2]);
      }
      data[key] = list.length ? list : Object.keys(obj).length ? obj : '';
    } else {
      data[key] = scalar(rest);
    }
  }
  return { data, body: s.slice(m[0].length), raw: m[0] };
}

function markdownText(md) {
  return String(md ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/^[>#\-*+\s]+/gm, ' ')
    .replace(/[*_`~]/g, '');
}

function parseMarkdown(md, opts) {
  const { data: d, body } = parseFrontMatter(md);
  const pick = (...keys) => { for (const k of keys) if (nonEmpty(d[k]) && typeof d[k] !== 'object') return d[k]; return ''; };
  const s = emptyStory('markdown');
  const h1 = (body.match(/^#\s+(.+)$/m) || [])[1] || '';
  s.title = clean(pick('title', 'name') || h1);
  s.slug = clean(pick('slug') || slugFromUrl(pick('canonical', 'url')) || opts.slug || slugify(s.title));
  s.seoTitle = clean(pick('seo_title', 'seoTitle', 'seo-title'));
  s.excerpt = clean(pick('excerpt', 'description', 'summary'));
  s.seoDescription = clean(pick('seo_description', 'seoDescription', 'seo-description'));
  const a = d.author && typeof d.author === 'object' && !Array.isArray(d.author) ? d.author : { name: d.author };
  const aSlug = clean(a.slug || slugFromUrl(a.url || '') || '');
  s.author = { name: clean(a.name), slug: aSlug, url: clean(a.url), badge: clean(a.badge || pick('author_badge', 'authorBadge', 'badge')) };
  const img = d.image && typeof d.image === 'object' && !Array.isArray(d.image) ? d.image : { url: pick('image', 'hero', 'hero_image', 'og_image'), alt: pick('image_alt', 'hero_alt') };
  if (nonEmpty(img.url)) s.image = { url: clean(img.url), alt: clean(img.alt) };
  s.datePublished = toIsoDate(pick('date', 'published', 'datePublished', 'published_date'));
  s.dateModified = toIsoDate(pick('updated', 'modified', 'dateModified', 'last_updated'));
  s.canonical = clean(pick('canonical', 'url')) || (s.slug ? `${SITE.origin}${SITE.storiesPath}${s.slug}` : '');
  s.place = placeName(pick('place', 'location', 'byline_location'));
  s.pillar = clean(pick('pillar', 'section'));
  s.tags = splitTags(d.tags ?? d.hashtags ?? '').filter((t) => t.toLowerCase() !== 'thatlayoverlife');
  s.sources = splitSources(d.sources);
  const sp = d.sponsor && typeof d.sponsor === 'object' && !Array.isArray(d.sponsor) ? d.sponsor : { name: d.sponsor };
  s.sponsor = sponsorOf({ name: sp.name, url: sp.url, disclosure: pick('disclosure') });
  s.lang = clean(pick('lang', 'language'));
  const rt = pick('reading_time', 'readingTime', 'reading-time');
  const n = parseInt(String(rt), 10);
  return finishReading(s, n, 'field', countWords(markdownText(body)));
}

function parseHtml(html, opts) {
  const s = emptyStory('html');
  const head = readHead(html);
  const body = bodyOf(html);
  const meta = (k) => (head.tags.get(k) || [])[0] || '';
  const art = head.ld.map((x) => articleNode(x.data)).find(Boolean) || {};
  const ldText = (v) => clean(typeof v === 'object' && v ? v.name || v.url || '' : v || '');

  s.title = firstText(body, (n) => n === 'h1') || clean(meta('og:title')) || head.title;
  s.seoTitle = head.title || clean(meta('og:title'));
  s.seoDescription = clean(meta('description') || meta('og:description'));
  s.excerpt = firstText(body, (n, a) => 'data-st3-lede' in a || hasClass(a, 'st3-lede') || hasClass(a, 'tll-story-excerpt') || hasClass(a, 'dek') || 'data-tll-excerpt' in a)
    || ldText(art.description) || s.seoDescription;

  // Byline: the live story template (.st3-author, .st3-cc-badge), the magazine prototype (.byline), or plain rel=author markup.
  const byline = findAll(body, (n, a) => hasClass(a, 'st3-author') || hasClass(a, 'byline') || 'data-tll-byline' in a || n === 'address', 1)[0];
  const scope = byline ? byline.inner : body;
  const link = findAll(scope, (n, a) => n === 'a' && (/(^|\/)contributors\//.test(a.href || '') || /\bauthor\b/.test(a.rel || '')), 1)[0];
  const name = firstText(body, (n, a) => hasClass(a, 'st3-author-name') || 'data-tll-author-name' in a || a.itemprop === 'author')
    || (link ? plain(link.inner) : '') || clean(meta('author')) || ldText(art.author?.name ? art.author.name : art.author);
  const url = link?.attrs.href || clean(art.author?.url || '');
  const badge = firstText(body, (n, a) => hasClass(a, 'st3-cc-badge') || 'data-tll-author-badge' in a || hasClass(a, 'author-badge'))
    || clean(art.author?.jobTitle || '');
  s.author = { name, slug: slugFromUrl(url), url: url ? new URL(url, SITE.origin).href : '', badge };

  // Reading time: a meta tag, then the page's own reading-time element or "N min read" in the byline, then the word count.
  let rt = 0, from = '';
  const rtMeta = meta('tll:reading-time') || meta('reading-time') || meta('twitter:data2');
  if (rtMeta && parseInt(rtMeta, 10) > 0) { rt = parseInt(rtMeta, 10); from = 'meta'; }
  const bylineText = byline ? plain(byline.inner) : '';
  if (!rt) {
    const el = firstText(body, (n, a) => hasClass(a, 'tll-story-reading-time') || 'data-tll-reading-time' in a);
    const m = el ? el.match(/(\d+)/) : bylineText.match(/(\d+)\s*min(?:ute)?s?\s+read/i);
    if (m) { rt = parseInt(m[1], 10); from = 'page'; }
  }
  // Words: the story body. A Webflow page has several rich-text blocks (short version, quick answers); the body is the longest.
  const explicit = findAll(body, (n, a) => 'data-tll-body' in a, 1)[0] || findAll(body, (n, a) => hasClass(a, 'prose'), 1)[0]
    || findAll(body, (n) => n === 'article', 1)[0];
  let words = 0;
  if (explicit && !findAll(explicit.inner, (n, a) => hasClass(a, 'w-richtext'), 1).length) words = countWords(plain(explicit.inner));
  else {
    for (const e of findAll(body, (n, a) => hasClass(a, 'w-richtext') && a.id !== 'tll-quick-answers' && !isEmptyBind(a))) words = Math.max(words, countWords(plain(e.inner)));
    if (!words) words = countWords(plain((findAll(body, (n) => n === 'main', 1)[0] || { inner: body }).inner));
  }
  finishReading(s, rt, from, words);

  const hero = findAll(body, (n, a) => n === 'img' && (hasClass(a, 'tll-story-hero-img') || 'data-tll-hero' in a || 'fetchpriority' in a), 1)[0];
  if (hero?.attrs.src) s.image = { url: hero.attrs.src, alt: clean(hero.attrs.alt) };
  else if (meta('og:image')) s.image = { url: meta('og:image'), alt: clean(meta('og:image:alt')) };

  const time = findAll(body, (n, a) => n === 'time' && a.datetime, 1)[0];
  s.datePublished = toIsoDate(time?.attrs.datetime || meta('article:published_time') || art.datePublished
    || firstText(body, (n, a) => a['data-tll-lg'] === 'published' || 'data-st3-when' in a)
    || (bylineText.match(/\b(\d{1,2} [A-Z][a-z]+ \d{4}|[A-Z][a-z]+ \d{1,2}, \d{4})\b/) || [])[1]);
  s.dateModified = toIsoDate(meta('article:modified_time') || firstText(body, (n, a) => a['data-tll-lg'] === 'updated'));
  s.canonical = head.canonical[0] || meta('og:url') || '';
  s.slug = slugFromUrl(s.canonical) || opts.slug || slugify(s.title);
  if (!s.canonical && s.slug) s.canonical = `${SITE.origin}${SITE.storiesPath}${s.slug}`;
  const loc = findAll(body, (n, a) => 'data-st3-byline' in a, 1)[0];
  s.place = placeName(loc?.attrs['data-st3-byline'] || firstText(body, (n, a) => hasClass(a, 'tll-story-byline-loc') || 'data-tll-place' in a)
    || meta('tll:place') || ldText(art.contentLocation));
  s.pillar = clean(meta('article:section'));
  s.tags = (head.tags.get('article:tag') || []).map(clean);
  // Sources sit in the receipts box as text that may itself be escaped HTML (<p>...</p>), so decode once before splitting.
  const src = findAll(body, (n, a) => a['data-tll-lg'] === 'sources' && !isEmptyBind(a), 1)[0];
  s.sources = src ? splitSources(decodeText(src.inner)) : [];
  s.sponsor = sponsorOf({
    name: firstText(body, (n, a) => a.id === 'tll-sponsor-name'),
    url: firstText(body, (n, a) => a.id === 'tll-sponsor-url'),
    disclosure: firstText(body, (n, a) => a['data-tll-lg'] === 'disclosure'),
  });
  s.lang = (String(html).match(/<html\b[^>]*\blang\s*=\s*["']?([\w-]+)/i) || [])[1] || '';
  return s;
}

/* ------------------------------------------------------------------ buildMeta */

/**
 * Tags and JSON-LD for one story. Returns { url, tags, jsonLd, visible }:
 *   tags: [{ tag: 'link', rel, href } | { tag: 'meta', attr: 'name' | 'property', key, content }], in output order;
 *   visible: what belongs in the visible byline only (the author badge, the reading time label).
 * Titles: og:title and twitter:title use the SEO title when there is one; the JSON-LD headline is the story title.
 * Descriptions: the meta, og and twitter descriptions use the SEO description when there is one, else the excerpt;
 * the JSON-LD description is the excerpt. Both fields are the story's own text.
 */
export function buildMeta(story, site = SITE) {
  const st = { ...emptyStory(story?.source || ''), ...story };
  const origin = site.origin.replace(/\/$/, '');
  const url = st.canonical || `${origin}${site.storiesPath}${st.slug}`;
  const title = st.title || st.seoTitle;
  const shareTitle = st.seoTitle || st.title;
  const shareDesc = st.seoDescription || st.excerpt;
  const ldDesc = st.excerpt || st.seoDescription;
  const author = st.author || {};
  const authorUrl = author.url || (author.slug ? `${origin}${site.contributorsPath}${author.slug}` : '');
  const badge = mapBadge(author.badge, site);
  const rt = st.readingTime;
  const hasRt = isToken(rt) || Number(rt) > 0;
  const img = st.image || {};
  const published = toIsoDate(st.datePublished);
  const modified = toIsoDate(st.dateModified) || published;

  const tags = [];
  const m = (attr, key, content) => { if (nonEmpty(content)) tags.push({ tag: 'meta', attr, key, content: String(content) }); };
  if (url) tags.push({ tag: 'link', rel: 'canonical', href: url });
  m('name', 'description', shareDesc);
  m('property', 'og:site_name', site.name);
  m('property', 'og:locale', site.locale);
  m('property', 'og:type', 'article');
  m('property', 'og:title', shareTitle);
  m('property', 'og:description', shareDesc);
  m('property', 'og:url', url);
  m('property', 'og:image', img.url);
  m('property', 'og:image:alt', img.alt);
  m('property', 'article:published_time', published);
  m('property', 'article:modified_time', modified);
  m('property', 'article:author', authorUrl);
  m('property', 'article:section', st.pillar);
  for (const t of st.tags || []) m('property', 'article:tag', t);
  m('name', 'twitter:card', img.url ? 'summary_large_image' : 'summary');
  m('name', 'twitter:title', shareTitle);
  m('name', 'twitter:description', shareDesc);
  m('name', 'twitter:image', img.url);
  m('name', 'twitter:image:alt', img.alt);
  if (author.name) { m('name', 'twitter:label1', 'Written by'); m('name', 'twitter:data1', author.name); }
  if (hasRt) { m('name', 'twitter:label2', 'Reading time'); m('name', 'twitter:data2', `${rt} min read`); }

  const placeId = `${url}#place`;
  const article = {
    '@type': 'Article',
    '@id': `${url}#article`,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: title,
    description: ldDesc,
    image: img.url ? [img.url] : undefined,
    datePublished: published,
    dateModified: modified,
    author: author.name ? {
      '@type': 'Person', name: author.name, url: authorUrl || undefined, jobTitle: badge.jobTitle, description: badge.description,
    } : undefined,
    publisher: {
      '@type': 'Organization', '@id': `${origin}/#organization`, name: site.name, url: `${origin}/`,
      logo: site.logo ? { '@type': 'ImageObject', url: site.logo } : undefined,
    },
    inLanguage: st.lang || site.language,
    isAccessibleForFree: true,
    timeRequired: hasRt ? isoDuration(rt) : undefined,
    wordCount: st.readingTimeFrom && st.wordCount > 0 ? st.wordCount : undefined,
    articleSection: st.pillar || undefined,
    keywords: st.tags?.length ? st.tags.join(', ') : undefined,
    contentLocation: st.place ? { '@type': 'Place', '@id': placeId, name: st.place } : undefined,
    about: st.place ? { '@id': placeId } : undefined,
    citation: st.sources?.length ? st.sources.map((x) => (x.url ? { '@type': 'CreativeWork', name: x.name, url: x.url } : x.name)) : undefined,
    sponsor: st.sponsor?.name ? { '@type': 'Organization', name: st.sponsor.name, url: st.sponsor.url || undefined } : undefined,
    breadcrumb: { '@id': `${url}#breadcrumb` },
  };
  const crumbs = {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
      { '@type': 'ListItem', position: 2, name: 'Stories', item: `${origin}${site.storiesPath.replace(/\/$/, '')}` },
      { '@type': 'ListItem', position: 3, name: title, item: url },
    ],
  };
  const jsonLd = prune({ '@context': 'https://schema.org', '@graph': [article, crumbs] });
  const visible = {
    authorName: author.name || '',
    authorBadge: badge.visible || '',
    readingTimeLabel: hasRt ? `${rt} min read` : '',
  };
  return { url, tags, jsonLd, visible };
}

/** Drops undefined, empty strings, empty arrays and empty objects, so no tag or JSON field is ever blank. */
function prune(v) {
  if (Array.isArray(v)) { const a = v.map(prune).filter((x) => x !== undefined); return a.length ? a : undefined; }
  if (v && typeof v === 'object') {
    const o = {};
    for (const [k, x] of Object.entries(v)) { const p = prune(x); if (p !== undefined) o[k] = p; }
    return Object.keys(o).length ? o : undefined;
  }
  if (v === '' || v == null) return undefined;
  return v;
}

/* ------------------------------------------------------------------ render and inject */

export const LD_ID = 'tll-story-ld';

/** The block of tags as HTML lines, markers included. */
export function renderMeta(meta, { indent = '', ldId = LD_ID, ldSpace = 0 } = {}) {
  const lines = [MARK_START];
  for (const t of meta.tags) {
    lines.push(t.tag === 'link'
      ? `<link rel="${escapeAttr(t.rel)}" href="${escapeAttr(t.href)}">`
      : `<meta ${t.attr}="${escapeAttr(t.key)}" content="${escapeAttr(t.content)}">`);
  }
  if (meta.jsonLd) lines.push(`<script type="application/ld+json" id="${escapeAttr(ldId)}">${jsonForScript(meta.jsonLd, ldSpace)}</script>`);
  lines.push(MARK_END);
  return lines.map((l) => indent + l).join('\n');
}

/** Keys the block owns: an equivalent tag outside the markers is replaced (rule "replace") or kept and left out of the block ("skip"). */
function ownedKeys(meta) {
  return new Set(meta.tags.filter((t) => t.tag === 'meta').map((t) => t.key.toLowerCase()));
}

function removeSpans(s, spans) {
  let out = s;
  for (const [a, b] of [...spans].sort((x, y) => y[0] - x[0])) {
    // Take the whole line when the tag stood alone on it.
    const ls = out.lastIndexOf('\n', a - 1) + 1;
    let le = out.indexOf('\n', b); if (le < 0) le = out.length;
    if (out.slice(ls, a).trim() === '' && out.slice(b, le).trim() === '') out = out.slice(0, ls) + out.slice(le + (le < out.length ? 1 : 0));
    else out = out.slice(0, a) + out.slice(b);
  }
  return out;
}

/**
 * Puts the block in the head. Idempotent: running it again with the same meta gives the same text.
 *  - With markers already in the head, only the text between them (markers included) is replaced.
 *  - Without markers, the block goes in just before </head>, at the start of that line.
 *  - Equivalent tags outside the markers (same og:, twitter:, article: or description key, a canonical link, an Article
 *    JSON-LD script): rule "replace" (default) removes them, so the block's value is the only one; rule "skip" keeps them and
 *    leaves that key out of the block. <title>, charset, viewport, icons, styles and scripts are never touched.
 *  - Input without <head> is treated as head code (a fragment, like the Webflow head code box): the block goes at the end.
 */
export function injectHead(html, meta, { rule = 'replace', ldId = LD_ID } = {}) {
  const src = String(html ?? '');
  const ho = src.match(/<head\b[^>]*>/i);
  const hc = src.search(/<\/head>/i);
  const fragment = !ho && hc < 0;
  const hs = fragment ? 0 : (ho ? ho.index + ho[0].length : 0);
  const he = fragment ? src.length : (hc < 0 ? src.length : hc);
  let head = src.slice(hs, he);

  // 1. Take out the old block, remembering where it was.
  let at = -1;
  const a = head.indexOf(MARK_START), b = head.indexOf(MARK_END);
  if (a >= 0 && b > a) {
    at = a;
    head = head.slice(0, a) + head.slice(b + MARK_END.length);
  }
  // 2. Equivalent tags outside the block.
  const keys = ownedKeys(meta);
  const spans = [];
  const skip = new Set();
  let skipCanonical = false, skipLd = false;
  for (const m of head.matchAll(/<meta\b[^>]*>/gi)) {
    const at2 = attrsOf(m[0]);
    const key = (at2.property || at2.name || '').toLowerCase();
    if (!keys.has(key)) continue;
    if (rule === 'skip') skip.add(key); else spans.push([m.index, m.index + m[0].length]);
  }
  for (const m of head.matchAll(/<link\b[^>]*>/gi)) {
    const at2 = attrsOf(m[0]);
    if (!(at2.rel || '').toLowerCase().split(/\s+/).includes('canonical')) continue;
    if (rule === 'skip') skipCanonical = true; else spans.push([m.index, m.index + m[0].length]);
  }
  for (const m of head.matchAll(/<script\b[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    let data = null;
    try { data = JSON.parse(m[1]); } catch { data = null; }
    if (!articleNode(data)) continue;
    if (rule === 'skip') skipLd = true; else spans.push([m.index, m.index + m[0].length]);
  }
  if (spans.length) {
    const before = at >= 0 ? head.slice(0, at) : null;
    head = removeSpans(head, spans);
    if (before != null) at = removeSpans(before, spans.filter(([x]) => x < before.length)).length;
  }
  const kept = {
    ...meta,
    tags: meta.tags.filter((t) => (t.tag === 'link' ? !skipCanonical : !skip.has(t.key.toLowerCase()))),
    jsonLd: skipLd ? null : meta.jsonLd,
  };
  // 3. Put the block back where it was (same indent), or before </head> (one step deeper than </head>), or at the end of a fragment.
  if (at >= 0) {
    const ls = head.lastIndexOf('\n', at - 1) + 1;
    const indent = /^[ \t]*$/.test(head.slice(ls, at)) ? head.slice(ls, at) : '';
    head = head.slice(0, at) + renderMeta(kept, { ldId, indent }).slice(indent.length) + head.slice(at);
  } else if (fragment) {
    const body = head.replace(/\s+$/, '');
    head = (body ? `${body}\n` : '') + renderMeta(kept, { ldId }) + '\n';
  } else {
    const ls = head.lastIndexOf('\n') + 1;
    const tail = head.slice(ls);
    if (/^[ \t]*$/.test(tail)) head = head.slice(0, ls) + renderMeta(kept, { ldId, indent: `${tail}  ` }) + '\n' + tail;
    else head = `${head}\n${renderMeta(kept, { ldId })}\n`;
  }
  return src.slice(0, hs) + head + src.slice(he);
}

/** The same for a Markdown story: the block lives in the front matter as a "head: |" field, which the site build copies into <head>. */
export function injectMarkdown(md, meta) {
  const src = String(md ?? '');
  const block = renderMeta(meta).split('\n').map((l) => `  ${l}`).join('\n');
  const field = `head: |\n${block}`;
  const m = src.match(/^(\uFEFF?---[ \t]*\r?\n)([\s\S]*?\r?\n)?(---[ \t]*(?:\r?\n|$))/);
  if (!m) return `---\n${field}\n---\n${src}`;
  const lines = (m[2] || '').replace(/\r?\n$/, '').split(/\r?\n/).filter((l, i, arr) => !(arr.length === 1 && l === ''));
  const out = [];
  let replaced = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^head\s*:/.test(lines[i])) {
      while (i + 1 < lines.length && (/^\s/.test(lines[i + 1]) || lines[i + 1] === '')) i++;
      if (!replaced) { out.push(field); replaced = true; }
      continue;
    }
    out.push(lines[i]);
  }
  if (!replaced) out.push(field);
  return m[1] + out.join('\n') + '\n' + m[3] + src.slice(m[0].length);
}

/** One local story file, start to finish: parse, build, inject. kind is 'md' or 'html'. Returns { text, story, meta }. */
export function injectStory(text, { kind = 'html', site = SITE, rule = 'replace', slug = '', contributors } = {}) {
  const story = parseStory(kind === 'md' && !String(text).trimStart().startsWith('---') ? `---\n---\n${text}` : text, { slug, contributors });
  const meta = buildMeta(story, site);
  const out = kind === 'md' ? injectMarkdown(text, meta) : injectHead(text, meta, { rule });
  return { text: out, story, meta };
}

/* ------------------------------------------------------------------ webflow-template */

// What Webflow writes on a CMS template page from Page settings (seen on the live Stories pages, 12 Nov 2026), so the
// template head code must not write them again.
export const WEBFLOW_EMITS = [
  ['<title>', 'SEO title binding (seo-title)'],
  ['meta description', 'Meta description binding (seo-description)'],
  ['og:title', 'Open Graph title (seo-title)'],
  ['og:description', 'Open Graph description (seo-description)'],
  ['twitter:title', 'same value as og:title'],
  ['twitter:description', 'same value as og:description'],
  ['og:type', 'always "website"; Webflow has no setting to change it, and custom code cannot remove it'],
  ['twitter:card', 'always "summary_large_image"'],
  ['og:image, twitter:image', 'only when the Open Graph image in Page settings is set or bound; it is empty on the Stories template today'],
];
const WEBFLOW_KEYS = new Set(['description', 'og:title', 'og:description', 'twitter:title', 'twitter:description', 'twitter:card']);

/** The story as Webflow bindings. Field slugs are the Stories collection's (and contributor: for the referenced contributor). */
export function bindingStory() {
  return {
    source: 'webflow',
    slug: token('slug'),
    title: token('name'),
    seoTitle: token('seo-title'),
    excerpt: token('excerpt'),
    seoDescription: token('seo-description'),
    author: { name: token('contributor:name'), slug: token('contributor:slug'), url: '', badge: '' },
    readingTime: token('reading-time', 'Number'),
    readingTimeFrom: '',
    wordCount: 0,
    image: { url: token('hero-image', 'ImageRef'), alt: '' },
    datePublished: token('published-date', 'Date'),
    dateModified: token('last-updated', 'Date'),
    canonical: '',
    place: token('byline-location'),
    pillar: '',
    tags: [],
    sources: [],
    sponsor: null,
    lang: '',
  };
}

/**
 * Head code for the Stories template. Tags Webflow already writes are left out (og:type article stays: it follows Webflow's
 * "website" so readers that keep the last value see article). Fields a binding cannot express are left out and listed in
 * notes: the badge (needs a choice between jobTitle and description), sources, sponsor, section, tags, image alt.
 */
export function webflowTemplate(site = SITE, { ldId = 'tll-article-ld-v3' } = {}) {
  const meta = buildMeta(bindingStory(), site);
  // article:modified_time would bind last-updated, which is empty on most stories; an empty meta tag is worse than none.
  meta.tags = meta.tags.filter((t) => t.tag === 'link' || (!WEBFLOW_KEYS.has(t.key) && t.key !== 'article:modified_time'));
  const html = resolveTokens(renderMeta(meta, { ldId }));
  // Webflow writes an apostrophe in CMS text as &#39; inside a script. This script (it replaces tll-ld-unescape-v1) turns
  // entities back into characters, and fills an empty dateModified (no last-updated date) with datePublished, for readers that
  // run scripts, which includes Google.
  const tidy = `<script id="tll-ld-tidy-v1">(function(){var s=document.getElementById(${JSON.stringify(ldId)});if(!s)return;try{var t=document.createElement("textarea");function d(v){if(typeof v==="string"){if(v.indexOf("&")<0)return v;t.innerHTML=v;return t.value}if(Array.isArray(v))return v.map(d);if(v&&typeof v==="object"){for(var k in v)v[k]=d(v[k])}return v}var j=d(JSON.parse(s.textContent));(j["@graph"]||[]).forEach(function(n){if(n&&n["@type"]==="Article"&&!n.dateModified&&n.datePublished)n.dateModified=n.datePublished});s.textContent=JSON.stringify(j)}catch(e){}})();</script>`;
  const code = html.replace(MARK_END, `${tidy}\n${MARK_END}`);
  const notes = [
    'Not in the template code, because a binding cannot express them (custom code has no conditions):',
    '- author badge: Founder, Editor and Contributor belong in author.jobTitle, other badges in author.description. The badge stays in the visible byline.',
    '- sources (citation), sponsor, pillar (articleSection, article:section) and hashtags (keywords, article:tag): a story without the field would print an empty value.',
    '- og:image:alt and twitter:image:alt: an image binding gives the address only, not its alt text.',
    '- article:modified_time: last-updated is empty on most stories. In the JSON-LD, dateModified binds last-updated and tll-ld-tidy-v1 fills an empty one with datePublished.',
    '- contentLocation prints byline-location as the CMS holds it (upper case on most stories).',
    'Check before publishing: in the Designer, each token above should show as a field chip in the Stories template head code (Page settings, Custom code). The reading-time and last-updated tokens are new to this template.',
  ];
  return { code, notes, webflowEmits: WEBFLOW_EMITS };
}

/* ------------------------------------------------------------------ audit */

const norm = (v) => clean(v).replace(/\/+$/, '');
const sameDate = (a, b) => {
  const x = toIsoDate(a), y = toIsoDate(b);
  if (!x || !y) return false;
  if (x.length === 10 || y.length === 10) return x.slice(0, 10) === y.slice(0, 10);
  return new Date(x).getTime() === new Date(y).getTime();
};
const DATE_KEYS = new Set(['article:published_time', 'article:modified_time', 'ld.datePublished', 'ld.dateModified']);
const same = (k, a, b) => (DATE_KEYS.has(k) ? sameDate(a, b) : norm(a).toLowerCase() === norm(b).toLowerCase());

/**
 * Checks one live story page against what buildMeta expects from the same page's body (h1, byline, badge, reading time,
 * hero, dates, place, sources, disclosure). Returns { slug, story, rows: [{ key, status, expected, found }] } where status is
 * ok | missing | disagree | duplicate | entities.
 */
export function auditStory(html, site = SITE, opts = {}) {
  const story = parseStory(String(html), opts);
  const exp = buildMeta(story, site);
  const head = readHead(html);
  const rows = [];
  const row = (key, status, expected = '', found = '') => rows.push({ key, status, expected: String(expected ?? ''), found: String(found ?? '') });

  const expTags = new Map();
  for (const t of exp.tags) {
    const k = t.tag === 'link' ? 'canonical' : t.key;
    if (!expTags.has(k)) expTags.set(k, []);
    expTags.get(k).push(t.tag === 'link' ? t.href : t.content);
  }
  for (const [k, vals] of expTags) {
    const found = k === 'canonical' ? head.canonical : (head.tags.get(k) || []);
    if (!found.length) { row(k, 'missing', vals.join(' | ')); continue; }
    const distinct = [...new Set(found.map(norm))];
    if (distinct.length > 1) { row(k, 'duplicate', vals.join(' | '), found.join(' | ')); continue; }
    if (k === 'article:tag') { row(k, 'ok', vals.join(' | '), found.join(' | ')); continue; }
    row(k, vals.some((v) => found.some((f) => same(k, v, f))) ? 'ok' : 'disagree', vals[0], found[0]);
  }

  // JSON-LD: the Article node, field by field.
  const ldScripts = head.ld.filter((x) => articleNode(x.data));
  const expArt = articleNode(exp.jsonLd);
  if (!ldScripts.length) {
    row('ld.Article', 'missing', 'Article');
  } else {
    if (ldScripts.length > 1) row('ld.Article', 'duplicate', '1 script', `${ldScripts.length} scripts`);
    const raw = ldScripts[0].raw;
    const ents = raw.match(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi);
    if (ents) row('ld.raw-entities', 'entities', 'plain characters', [...new Set(ents)].join(' '));
    const got = articleNode(ldScripts[0].data);
    const dec = (v) => clean(v);
    const pick = {
      headline: [expArt.headline, dec(got.headline)],
      description: [expArt.description, dec(got.description)],
      image: [[].concat(expArt.image || [])[0], dec([].concat(got.image || [])[0]?.url || [].concat(got.image || [])[0])],
      datePublished: [expArt.datePublished, got.datePublished],
      dateModified: [expArt.dateModified, got.dateModified],
      'author.name': [expArt.author?.name, dec(got.author?.name)],
      'author.url': [expArt.author?.url, got.author?.url],
      'author.jobTitle': [expArt.author?.jobTitle, dec(got.author?.jobTitle)],
      'author.description': [expArt.author?.description, dec(got.author?.description)],
      'publisher.logo': [expArt.publisher?.logo?.url, got.publisher?.logo?.url || got.publisher?.logo],
      timeRequired: [expArt.timeRequired, got.timeRequired],
      'contentLocation.name': [expArt.contentLocation?.name, dec(got.contentLocation?.name)],
      citation: [expArt.citation ? `${expArt.citation.length} item(s)` : '', got.citation ? `${[].concat(got.citation).length} item(s)` : ''],
      sponsor: [expArt.sponsor?.name, dec(got.sponsor?.name)],
    };
    for (const [k, [e, f]] of Object.entries(pick)) {
      if (!nonEmpty(e)) continue;
      const key = `ld.${k}`;
      if (!nonEmpty(f)) row(key, 'missing', e);
      else if (k === 'citation') row(key, 'ok', e, f);
      else row(key, same(key, e, f) ? 'ok' : 'disagree', e, f);
    }
  }
  // Reading time: the CMS number on the page against the body's word count at 200 words a minute (a note, not a tag).
  if ((story.readingTimeFrom === 'page' || story.readingTimeFrom === 'meta') && story.wordCount) {
    const byWords = readingMinutes(story.wordCount);
    if (Math.abs(byWords - story.readingTime) > 1) row('reading-time vs words', 'disagree', `${byWords} min (${story.wordCount} words)`, `${story.readingTime} min`);
  } else if (!story.readingTimeFrom || story.readingTimeFrom === 'words') {
    row('reading-time on page', 'missing', `${story.readingTime} min (from ${story.wordCount} words)`);
  }
  return { slug: story.slug, story, rows };
}

/** Story addresses from a sitemap: /stories/<slug> only. */
export function storyUrlsFromSitemap(xml, site = SITE) {
  const out = [];
  for (const m of String(xml ?? '').matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
    const u = decodeText(m[1]);
    try {
      const p = new URL(u).pathname.replace(/\/$/, '');
      if (new RegExp(`^${site.storiesPath}[^/]+$`).test(p)) out.push(u);
    } catch { /* not a URL */ }
  }
  return [...new Set(out)];
}

/** CSV text. Quotes every cell that needs it. */
export function toCsv(rows, cols) {
  const cell = (v) => { const s = String(v ?? ''); return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  return [cols.join(','), ...rows.map((r) => cols.map((c) => cell(r[c])).join(','))].join('\n') + '\n';
}

/** Per check: how many stories are ok, missing, disagree, duplicate, entities. Sorted by gaps, largest first. */
export function summarize(results) {
  const by = new Map();
  for (const r of results) for (const x of r.rows) {
    if (!by.has(x.key)) by.set(x.key, { key: x.key, ok: 0, missing: 0, disagree: 0, duplicate: 0, entities: 0 });
    by.get(x.key)[x.status]++;
  }
  const list = [...by.values()].map((x) => ({ ...x, gaps: x.missing + x.disagree + x.duplicate + x.entities }));
  return list.sort((a, b) => b.gaps - a.gaps || a.key.localeCompare(b.key));
}
