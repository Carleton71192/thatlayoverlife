// GET /link-summary?url=  (31 Oct 2026, Nancy: "one of the biggest priorities was building the AI summary box for linked
// articles"). For a link-out story (a member's article published elsewhere), the Worker reads the article's text and asks
// Claude for a short, neutral summary of what the piece covers. It is shown in a box labeled as an AI summary of the linked
// article, never as the member's words, and it never replaces their title or their own summary. Same safety rules as
// /link-preview (public https pages only, every redirect checked, size caps), the site's own origins only, 20 calls an hour
// per IP, each URL summarized once and kept 30 days. Needs the ANTHROPIC_API_KEY secret; without it the route answers
// {ok:false} and the site simply shows no box.
import Anthropic from '@anthropic-ai/sdk';
import { isSafeUrl, decodeEntities, linkPreviewCors } from './link-preview.js';

const MODEL = 'claude-opus-5-5';
const PAGE_LIMIT = 900_000;   // bytes of HTML read from the article
const TEXT_LIMIT = 24_000;    // characters of article text sent to Claude
const RATE_PER_HOUR = 20;
const KEEP_SECONDS = 60 * 60 * 24 * 30;
const UA = 'Mozilla/5.0 (compatible; TLLLinkSummary/1.0; +https://www.thatlayover.life)';

const SYSTEM = [
  'You write the summary box for a travel magazine link card. A member wrote the linked article and published it on another site.',
  'Write two or three plain sentences, at most 60 words, saying what the article covers: the place, the trip or topic, and what a reader will find.',
  'Neutral and factual, third person, US English. Use only facts stated in the article text. No opinions of your own, no praise, no quotes longer than five words, no prices or dates unless the article states them.',
  'No em dashes and no exclamation marks. Do not mention that you are an AI or that this is a summary.',
  'If the text is not an article (a login page, an error, a paywall notice, a list of links), reply with exactly: NO_SUMMARY',
].join(' ');

/** Visible article text: <article> if present, else the page's paragraphs. */
export function articleText(html) {
  let h = String(html).replace(/<(script|style|noscript|svg|nav|footer|header|form|aside)[\s\S]*?<\/\1>/gi, ' ');
  const art = /<article[\s\S]*?<\/article>/i.exec(h);
  if (art) h = art[0];
  const paras = [];
  const re = /<(p|h1|h2|h3|li|blockquote)[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = re.exec(h))) {
    const t = decodeEntities(m[2].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
    if (t.length >= 30 || /^h[123]$/i.test(m[1])) paras.push(t);
  }
  return paras.join('\n').slice(0, TEXT_LIMIT);
}

/** A summary that keeps the house rules, or '' when it does not. */
export function cleanSummary(text) {
  let s = String(text || '').replace(/\s+/g, ' ').trim();
  if (!s || /^NO_SUMMARY/.test(s)) return '';
  s = s.replace(/\s*—\s*/g, ', ').replace(/!/g, '.');
  return s.split(/\s+/).length > 80 ? '' : s;
}

async function fetchArticle(url, fetchImpl) {
  let current = url;
  for (let hop = 0; hop <= 4; hop += 1) {
    if (!isSafeUrl(current)) throw new Error('address not allowed');
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    let res;
    try { res = await fetchImpl(current, { headers: { 'User-Agent': UA, Accept: 'text/html' }, redirect: 'manual', signal: ctrl.signal }); } finally { clearTimeout(timer); }
    if (res.status >= 300 && res.status < 400 && res.headers.get('Location')) { current = new URL(res.headers.get('Location'), current).href; continue; }
    if (!res.ok || !/text\/html|xhtml/i.test(res.headers.get('Content-Type') || '')) throw new Error(`page answered ${res.status}`);
    const buf = new Uint8Array(await res.arrayBuffer());
    return new TextDecoder().decode(buf.slice(0, PAGE_LIMIT));
  }
  throw new Error('too many redirects');
}

/** Summary for one URL, or null. Never throws. */
export async function summarizeLink(url, env, { fetchImpl = fetch, client } = {}) {
  if (!env.ANTHROPIC_API_KEY && !client) return null;
  let text;
  try { text = articleText(await fetchArticle(url, fetchImpl)); } catch { return null; }
  if (text.length < 400) return null;
  const anthropic = client || new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 30_000 });
  try {
    const response = await anthropic.beta.messages.create({
      model: MODEL,
      max_tokens: 1024,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low' },
      system: SYSTEM,
      messages: [{ role: 'user', content: `Article at ${url}:\n\n${text}` }],
    });
    if (response.stop_reason === 'refusal') return null;
    const out = response.content.filter((b) => b.type === 'text').map((b) => b.text).join(' ');
    const summary = cleanSummary(out);
    return summary ? { summary, model: response.model } : null;
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) console.log('link-summary rate limited');
    else if (error instanceof Anthropic.APIError) console.log(`link-summary API error ${error.status}`);
    else console.log(`link-summary ${String(error?.message || error)}`);
    return null;
  }
}

export async function handleLinkSummary(request, env, { fetchImpl = fetch, client } = {}) {
  const cors = linkPreviewCors(request);
  const reply = (b, s = 200, cache = 0) => new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cache ? `public, max-age=${cache}` : 'no-store', ...cors } });
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  const target = new URL(request.url).searchParams.get('url') || '';
  if (!isSafeUrl(target)) return reply({ ok: false, reason: 'bad url' }, 400);
  const key = `linksum:v1:${target}`;
  if (env.WIRE_KV) {
    const hit = await env.WIRE_KV.get(key);
    if (hit) return reply(JSON.parse(hit), 200, 3600);
    const ip = request.headers.get('CF-Connecting-IP') || 'anon';
    const hk = `linksum-rate:${ip}:${new Date().toISOString().slice(0, 13)}`;
    const n = Number((await env.WIRE_KV.get(hk)) || 0);
    if (n >= RATE_PER_HOUR) return reply({ ok: false, reason: 'busy' }, 429);
    await env.WIRE_KV.put(hk, String(n + 1), { expirationTtl: 3700 });
  }
  const s = await summarizeLink(target, env, { fetchImpl, client });
  const body = s ? { ok: true, summary: s.summary, label: 'Summary by AI, from the linked article' } : { ok: false };
  if (s && env.WIRE_KV) await env.WIRE_KV.put(key, JSON.stringify(body), { expirationTtl: KEEP_SECONDS });
  return reply(body, 200, s ? 3600 : 0);
}
