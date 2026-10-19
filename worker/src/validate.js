// Server-side checks for the TLL Worker. Pure functions, no network, no Worker APIs,
// so they run unchanged under `node --test`.

/**
 * NFKC, lowercase, drop every character that is not a letter, number or whitespace,
 * collapse whitespace, trim.
 */
export function normalize(s) {
  return String(s ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Damerau-Levenshtein distance (optimal string alignment variant):
 * insert, delete, substitute, or swap two adjacent characters, each costing 1.
 */
export function damerauLevenshtein(a, b) {
  const s = [...String(a)];
  const t = [...String(b)];
  if (s.length === 0) return t.length;
  if (t.length === 0) return s.length;
  const d = Array.from({ length: s.length + 1 }, () => new Array(t.length + 1).fill(0));
  for (let i = 0; i <= s.length; i++) d[i][0] = i;
  for (let j = 0; j <= t.length; j++) d[0][j] = j;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 1; j <= t.length; j++) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && s[i - 1] === t[j - 2] && s[i - 2] === t[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[s.length][t.length];
}

const countParagraphBreaks = (s) => (s.match(/\n\n/g) || []).length;
const collapseWhitespace = (s) => s.replace(/\s+/g, " ").trim();

function splitSentences(s) {
  return s
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map(normalize)
    .filter(Boolean);
}

// Raw whitespace-separated words of the original string, paired with their normalized
// form, skipping words that normalize to nothing (a lone dash, for example). `startsSentence`
// is true for the first word and for any word that follows one ending in . ! or ?
function rawWords(original) {
  const raw = original.split(/\s+/).filter(Boolean);
  const out = [];
  for (let j = 0; j < raw.length; j++) {
    const norm = normalize(raw[j]);
    if (!norm) continue;
    const prev = j === 0 ? "" : raw[j - 1];
    out.push({
      raw: raw[j],
      norm,
      startsSentence: j === 0 || /[.!?]["'”’)\]]*$/u.test(prev),
    });
  }
  return out;
}

/**
 * Classify an edit as one of "punctuation", "capitalization", "paragraph", "order",
 * "spelling", or null when it is anything else (a changed fact, name, number, added
 * or removed words). null means the edit must be rejected.
 */
export function classifyEdit(original, suggested) {
  if (typeof original !== "string" || typeof suggested !== "string") return null;

  // (a) nothing changed
  if (original === suggested) return null;

  // (b) same letters and numbers, so only punctuation, case or paragraph breaks moved
  if (normalize(original) === normalize(suggested)) {
    if (
      countParagraphBreaks(original) !== countParagraphBreaks(suggested) &&
      collapseWhitespace(original) === collapseWhitespace(suggested)
    ) {
      return "paragraph";
    }
    if (original.toLowerCase() === suggested.toLowerCase()) return "capitalization";
    return "punctuation";
  }

  // (c) the same sentences in a different order
  const sa = splitSentences(original);
  const sb = splitSentences(suggested);
  if (sa.length === sb.length && sa.length > 1) {
    const sortedA = [...sa].sort();
    const sortedB = [...sb].sort();
    if (sortedA.every((v, i) => v === sortedB[i])) return "order";
  }

  // (d) spelling: same word count, at most 2 words differ, each by at most 2 edits,
  // no digits, and never a name (a capitalized word in the middle of a sentence)
  const ta = normalize(original).split(" ");
  const tb = normalize(suggested).split(" ");
  if (ta.length === tb.length) {
    const words = rawWords(original);
    if (words.length !== ta.length) return null;
    const diffs = [];
    for (let i = 0; i < ta.length; i++) if (ta[i] !== tb[i]) diffs.push(i);
    if (diffs.length >= 1 && diffs.length <= 2) {
      const ok = diffs.every((i) => {
        if (damerauLevenshtein(ta[i], tb[i]) > 2) return false;
        if (/\d/.test(ta[i])) return false;
        // short words ("to" to "so") are word changes, not spelling
        if (ta[i].length < 4 || tb[i].length < 4) return false;
        const w = words[i];
        const startsUpper = /^\P{L}*\p{Lu}/u.test(w.raw);
        if (startsUpper && !w.startsSentence) return false;
        return true;
      });
      if (ok) return "spelling";
    }
  }

  // (e) anything else
  return null;
}

// ---------------------------------------------------------------------------------------
// Cloudinary URLs
// ---------------------------------------------------------------------------------------

const ALLOWED_PREFIXES = ["c_crop", "ar_", "a_", "w_", "h_", "x_", "y_", "g_", "q_auto", "f_auto", "fl_keep_iptc"];
const ALLOWED_EXACT = new Set(["e_improve", "e_auto_brightness", "e_auto_color", "e_auto_contrast"]);
const BLOCKED_FRAGMENTS = ["e_gen_", "e_background_removal", "e_upscale", "e_enhance"];
const TRANSFORM_LIKE = /^[a-z]{1,4}_/i;
const VERSION = /^v\d+$/;

function checkComponent(component) {
  const c = component.toLowerCase();
  if (!/^[a-z0-9_.:\-]+$/.test(c)) return `Transformation "${component}" has characters that are not allowed.`;
  for (const frag of BLOCKED_FRAGMENTS) {
    if (c.includes(frag)) return `Transformation "${component}" is not allowed because it generates or alters image content.`;
  }
  if (c.startsWith("e_")) {
    return ALLOWED_EXACT.has(c) ? null : `Effect "${component}" is not on the allowed list.`;
  }
  if (ALLOWED_PREFIXES.some((p) => c.startsWith(p))) return null;
  return `Transformation "${component}" is not on the allowed list.`;
}

/**
 * Accepts only https://res.cloudinary.com/<cloud>/image/upload/... URLs whose
 * transformation components are all on the allowlist. A URL with no transformations is ok.
 * Pass { allowTransformations: false } for the untouched original.
 */
export function checkCloudinaryUrl(url, { allowTransformations = true } = {}) {
  let u;
  try {
    u = new URL(String(url));
  } catch {
    return { ok: false, reason: "That is not a valid URL." };
  }
  if (u.protocol !== "https:" || u.hostname !== "res.cloudinary.com" || u.port || u.username || u.password) {
    return { ok: false, reason: "Photos must be served from https://res.cloudinary.com." };
  }
  if (!u.pathname.startsWith("/idonvlow/image/upload/")) {
    return { ok: false, reason: "Photos must come from the That Layover Life upload." };
  }

  let segments;
  try {
    segments = u.pathname.split("/").filter(Boolean).map((s) => decodeURIComponent(s));
  } catch {
    return { ok: false, reason: "That URL is not encoded correctly." };
  }
  // <cloud>/image/upload/<transformations>/<version>/<public id>
  if (segments.length < 4 || segments[1] !== "image" || segments[2] !== "upload") {
    return { ok: false, reason: "Photos must be Cloudinary image uploads." };
  }
  const rest = segments.slice(3);
  if (rest[0].startsWith("s--")) return { ok: false, reason: "Signed URLs are not accepted." };

  const versionAt = rest.findIndex((s) => VERSION.test(s));
  const transformSegments = [];
  if (versionAt >= 0) {
    transformSegments.push(...rest.slice(0, versionAt));
  } else {
    // No version: scan from the front while a segment looks like transformations.
    // The last segment is always the public id.
    for (let i = 0; i < rest.length - 1; i++) {
      if (rest[i].split(",").some((c) => TRANSFORM_LIKE.test(c))) transformSegments.push(rest[i]);
      else break;
    }
  }

  if (transformSegments.length && !allowTransformations) {
    return { ok: false, reason: "The original photo must have no transformations." };
  }
  for (const seg of transformSegments) {
    for (const component of seg.split(",")) {
      if (!component) return { ok: false, reason: "Empty transformation component." };
      const problem = checkComponent(component);
      if (problem) return { ok: false, reason: problem };
    }
  }
  return { ok: true };
}

/** Reading time in whole minutes, 220 words per minute, never less than 1. */
export function readingTime(text) {
  const words = String(text ?? "")
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}
