// POST /translate   { "itemId": "<Stories item id>", "target": "es" }   or   { "slug": "<story slug>", "target": "es" }
// (the story page knows its slug from its own address; Webflow has no bindable item id attribute)
//
// Multilingual stories, Phase 1 (Nancy's prompt, 29 Oct 2026). A reader taps "Read it in ..." on a story page; the page calls
// this route with the story's item id and the reader's language. The original story is never changed and never replaced on
// the server: the translation goes back to that one browser, labeled, with "Show the original" one tap away.
//
// Rules this file enforces:
//   - Only an item id comes in. The text is read here from the PUBLISHED Stories item (Webflow /items/{id}/live), so nobody
//     can send arbitrary text and use TLL's DeepL quota as a free translator.
//   - Refused: Allow translation off, target equal to the story language, target outside the approved list, unknown or
//     unpublished item.
//   - Title, excerpt and body only. The author name, the sign-off ("Mood: ... Nancy"), place tags and hashtags are not sent.
//     Inside the body, anything marked translate="no" or data-tll-place is kept as written (DeepL tag handling "html").
//   - "Author translation (English)" wins for English readers and comes back labeled by: "author", no DeepL call.
//   - Cache: WIRE_KV "tr:v1:{itemId}:{target}:{sha256 of the source}". A story is translated once per language until its
//     text changes.
//   - Monthly cap: no DeepL call once this month's characters reach TRANSLATE_MONTHLY_CAP (default 450,000; the Free plan
//     allows 500,000). Usage per month in "tr:usage:YYYY-MM". Soft rate limit per IP per hour.
//   - No reader data stored, no cookies. CORS for thatlayover.life and www.thatlayover.life only.
//
// Needs: secret DEEPL_KEY (DeepL API Free key, set by Nancy with `npx wrangler secret put DEEPL_KEY`), secret WEBFLOW_TOKEN,
// [vars] STORIES_COLLECTION_ID, the WIRE_KV binding. Optional [vars]: TRANSLATE_TARGETS ("en,es,pt-BR,da"),
// TRANSLATE_MONTHLY_CAP, DEEPL_API_URL (defaults to the Free endpoint).

import { rateLimit } from './member-auth.js';

const WEBFLOW_API = 'https://api.webflow.com/v2';
const DEEPL_FREE_URL = 'https://api-free.deepl.com/v2/translate';
export const DEFAULT_TARGETS = ['en', 'es', 'pt-BR', 'da'];
export const DEFAULT_CAP = 450000;
const PER_IP_PER_HOUR = 40;
const SCHEMA_TTL = 6 * 3600;

/** CMS field slugs (proposed in the change log; created only after Nancy's yes). */
export const FIELDS = Object.freeze({
  language: 'story-language',
  languageOther: 'story-language-other',
  allow: 'allow-translation',
  author: 'author-translation-english',
  title: 'name',
  excerpt: 'excerpt',
  body: 'body',
});

/** TLL code -> DeepL target and source codes. */
export const DEEPL_TARGET = { en: 'EN-US', es: 'ES', 'pt-BR': 'PT-BR', da: 'DA', de: 'DE', fr: 'FR', it: 'IT', nl: 'NL', sv: 'SV', nb: 'NB', ja: 'JA' };
export const DEEPL_SOURCE = { en: 'EN', es: 'ES', 'pt-BR': 'PT', pt: 'PT', da: 'DA', de: 'DE', fr: 'FR', it: 'IT', nl: 'NL', sv: 'SV', nb: 'NB', ja: 'JA' };

export const TRANSLATE_ORIGINS = Object.freeze(['https://thatlayover.life', 'https://www.thatlayover.life']);

export function translateCors(request) {
  const origin = request.headers.get('Origin') || '';
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
  if (TRANSLATE_ORIGINS.includes(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}

export function approvedTargets(env) {
  const raw = (env && env.TRANSLATE_TARGETS) || '';
  const list = raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : DEFAULT_TARGETS;
  return list.filter((c) => c in DEEPL_TARGET);
}

/** "pt-BR" and "pt-br" are the same language; "en-US" counts as "en". */
export function sameLanguage(a, b) {
  const norm = (c) => String(c || '').toLowerCase();
  const x = norm(a), y = norm(b);
  if (x === y) return true;
  const px = x.split('-')[0], py = y.split('-')[0];
  if (px !== py) return false;
  // Same base language: only treat as different when both name a region and they differ (pt-BR vs pt-PT).
  return !(x.includes('-') && y.includes('-'));
}

/** The code in an option name such as "Português (Brasil) (pt-BR)" or "es · Español". */
export function codeFromOptionName(name) {
  const s = String(name || '').trim();
  const paren = s.match(/\(([A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})?)\)\s*$/);
  if (paren) return paren[1];
  const lead = s.match(/^([A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})?)\b/);
  if (lead && /^[a-z]{2,3}(-[A-Z]{2}|-[A-Za-z0-9]{2,8})?$/.test(lead[1])) return lead[1];
  if (/^other$/i.test(s)) return 'other';
  return '';
}

function monthKey(now = Date.now()) {
  return new Date(now).toISOString().slice(0, 7);
}

export async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Characters DeepL will bill: text of title and excerpt, and the body's visible text (tags are not counted). */
export function billableChars(parts) {
  return parts.reduce((n, p) => n + String(p || '').replace(/<[^>]*>/g, '').length, 0);
}

/** Marks places and anything already flagged so DeepL leaves them as written. */
export function protectHtml(html) {
  return String(html || '').replace(/<([a-z][a-z0-9]*)\b([^>]*\bdata-tll-place\b[^>]*)>/gi, (m, tag, attrs) =>
    /\btranslate\s*=/.test(attrs) ? m : `<${tag}${attrs} translate="no">`);
}

async function webflow(fetchImpl, env, path) {
  const res = await fetchImpl(`${WEBFLOW_API}${path}`, {
    headers: { Authorization: `Bearer ${env.WEBFLOW_TOKEN}`, accept: 'application/json' },
  });
  return res;
}

/** Option id -> code for the Story language field, cached in KV. */
async function languageOptions(fetchImpl, env) {
  const key = 'tr:schema:v1';
  try {
    const hit = await env.WIRE_KV.get(key);
    if (hit) return JSON.parse(hit);
  } catch { /* fall through */ }
  const res = await webflow(fetchImpl, env, `/collections/${env.STORIES_COLLECTION_ID}`);
  if (!res.ok) return {};
  const schema = await res.json();
  const field = (schema.fields || []).find((f) => f.slug === FIELDS.language);
  const map = {};
  for (const o of (field && field.validations && field.validations.options) || []) map[o.id] = codeFromOptionName(o.name);
  try { await env.WIRE_KV.put(key, JSON.stringify(map), { expirationTtl: SCHEMA_TTL }); } catch { /* cache is optional */ }
  return map;
}

/** The story's language code from its fields. Default English. */
export function storyLanguage(fieldData, options) {
  const raw = fieldData[FIELDS.language];
  let code = raw ? (options[raw] || codeFromOptionName(raw)) : '';
  if (code === 'other') code = String(fieldData[FIELDS.languageOther] || '').trim();
  return code || 'en';
}

function out(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...cors },
  });
}

/** POST /translate */
export async function handleTranslate(request, env, fetchImpl = fetch, now = Date.now()) {
  const cors = translateCors(request);
  const fail = (status, code, message) => out({ ok: false, code, message }, status, cors);

  let input;
  try { input = await request.json(); } catch { return fail(400, 'bad-request', 'Send an item id and a target language.'); }
  const keys = Object.keys(input || {});
  if (keys.some((k) => k !== 'itemId' && k !== 'slug' && k !== 'target')) return fail(400, 'bad-request', 'Only a story id or slug and a target language are accepted.');
  let itemId = String(input.itemId || '');
  const slug = String(input.slug || '');
  const target = String(input.target || '');
  if (itemId && !/^[0-9a-f]{24}$/.test(itemId)) return fail(400, 'bad-request', 'That is not a story id.');
  if (!itemId && !/^[a-z0-9][a-z0-9-]{0,255}$/.test(slug)) return fail(400, 'bad-request', 'That is not a story.');
  const targets = approvedTargets(env);
  const tgt = targets.find((t) => t.toLowerCase() === target.toLowerCase());
  if (!tgt) return fail(400, 'target-not-approved', 'That language is not offered yet.');

  if (!env.WEBFLOW_TOKEN || !env.STORIES_COLLECTION_ID || !env.WIRE_KV) return fail(503, 'not-set-up', 'Translations are not switched on yet.');
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (!(await rateLimit(env, 'tr-ip', ip, PER_IP_PER_HOUR, now))) return fail(429, 'rate-limited', 'Our translator missed its connection. Try again in a minute.');

  let item;
  if (itemId) {
    const itemRes = await webflow(fetchImpl, env, `/collections/${env.STORIES_COLLECTION_ID}/items/${itemId}/live`);
    if (itemRes.status === 404) return fail(404, 'not-published', 'That story is not published.');
    if (!itemRes.ok) return fail(502, 'cms-error', 'Our translator missed its connection. Try again in a minute.');
    item = await itemRes.json();
  } else {
    const listRes = await webflow(fetchImpl, env, `/collections/${env.STORIES_COLLECTION_ID}/items/live?slug=${encodeURIComponent(slug)}&limit=1`);
    if (!listRes.ok) return fail(502, 'cms-error', 'Our translator missed its connection. Try again in a minute.');
    const list = await listRes.json();
    item = (list.items || []).find((i) => i.fieldData && i.fieldData.slug === slug);
    if (!item) return fail(404, 'not-published', 'That story is not published.');
    itemId = item.id;
  }
  const fd = item.fieldData || {};
  if (item.isDraft || item.isArchived) return fail(404, 'not-published', 'That story is not published.');
  if (fd[FIELDS.allow] === false) return fail(403, 'translation-off', 'The writer keeps this one in the original.');

  const options = await languageOptions(fetchImpl, env);
  const source = storyLanguage(fd, options);
  if (sameLanguage(source, tgt)) return fail(400, 'same-language', 'This story is already in that language.');

  const title = String(fd[FIELDS.title] || '');
  const excerpt = String(fd[FIELDS.excerpt] || '');
  const body = String(fd[FIELDS.body] || '');

  // The writer's own English version wins for English readers.
  if (sameLanguage(tgt, 'en') && String(fd[FIELDS.author] || '').replace(/<[^>]*>/g, '').trim()) {
    return out({ ok: true, itemId, source, target: tgt, by: 'author', title: null, excerpt: null, bodyHtml: String(fd[FIELDS.author]) }, 200, cors);
  }

  if (!env.DEEPL_KEY) return fail(503, 'not-set-up', 'Translations are not switched on yet.');
  const hash = await sha256Hex(JSON.stringify([title, excerpt, body, source]));
  const cacheKey = `tr:v1:${itemId}:${tgt}:${hash}`;
  try {
    const hit = await env.WIRE_KV.get(cacheKey);
    if (hit) return out({ ...JSON.parse(hit), cached: true }, 200, cors);
  } catch { /* miss */ }

  const chars = billableChars([title, excerpt, body]);
  const cap = parseInt(env.TRANSLATE_MONTHLY_CAP, 10) || DEFAULT_CAP;
  const usageKey = `tr:usage:${monthKey(now)}`;
  let used = 0;
  try { used = parseInt((await env.WIRE_KV.get(usageKey)) || '0', 10) || 0; } catch { used = 0; }
  if (used + chars > cap) return fail(429, 'monthly-cap', 'Our translator has used up its miles for this month. The original is right here.');

  const deeplSource = DEEPL_SOURCE[source] || DEEPL_SOURCE[source.split('-')[0]];
  const payload = {
    text: [title, excerpt, protectHtml(body)],
    target_lang: DEEPL_TARGET[tgt],
    tag_handling: 'html',
    preserve_formatting: true,
  };
  if (deeplSource) payload.source_lang = deeplSource;
  let res;
  try {
    res = await fetchImpl(env.DEEPL_API_URL || DEEPL_FREE_URL, {
      method: 'POST',
      headers: { Authorization: `DeepL-Auth-Key ${env.DEEPL_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    return fail(502, 'translator-error', 'Our translator missed its connection. Try again in a minute.');
  }
  if (res.status === 456) return fail(429, 'monthly-cap', 'Our translator has used up its miles for this month. The original is right here.');
  if (!res.ok) return fail(502, 'translator-error', 'Our translator missed its connection. Try again in a minute.');
  const data = await res.json();
  const t = (data.translations || []).map((x) => x.text);
  if (t.length !== 3) return fail(502, 'translator-error', 'Our translator missed its connection. Try again in a minute.');

  try { await env.WIRE_KV.put(usageKey, String(used + chars), { expirationTtl: 400 * 86400 }); } catch { /* soft */ }
  const result = { ok: true, itemId, source, target: tgt, by: 'machine', title: t[0] || null, excerpt: t[1] || null, bodyHtml: t[2] };
  try { await env.WIRE_KV.put(cacheKey, JSON.stringify(result), { expirationTtl: 180 * 86400 }); } catch { /* soft */ }
  return out(result, 200, cors);
}

/** Usage for the final report: characters billed this month. */
export async function translateUsage(env, now = Date.now()) {
  try { return parseInt((await env.WIRE_KV.get(`tr:usage:${monthKey(now)}`)) || '0', 10) || 0; } catch { return 0; }
}
