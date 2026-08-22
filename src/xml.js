// A tolerant RSS 2.0 / Atom 1.0 reader. Workers have no XML parser and the feeds
// we read are small and well-formed enough that a targeted extractor beats a
// dependency here.

import { collapseWhitespace, decodeEntities, stripTags } from './text.js';

function unwrapCdata(value) {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
}

// Every <name>...</name> block in `xml`, contents raw.
export function tagContents(xml, name) {
  const pattern = new RegExp(`<(?:[\\w.-]+:)?${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/(?:[\\w.-]+:)?${name}\\s*>`, 'gi');
  const out = [];
  let match;
  while ((match = pattern.exec(xml)) !== null) out.push(match[1]);
  return out;
}

export function firstTag(xml, name) {
  const found = tagContents(xml, name);
  return found.length ? unwrapCdata(found[0]) : '';
}

// First tag whose name matches any of `names`, in the order given.
export function firstOf(xml, names) {
  for (const name of names) {
    const value = firstTag(xml, name);
    if (collapseWhitespace(stripTags(value))) return value;
  }
  return '';
}

export function attr(tag, name) {
  const match = tag.match(new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'));
  if (!match) return '';
  return decodeEntities(match[2] !== undefined ? match[2] : match[3] || '');
}

// Atom puts the article URL in <link href> and can carry several links per entry.
// We want rel="alternate" (or the first link with no rel at all).
function atomLink(entry) {
  const tags = entry.match(/<(?:[\w.-]+:)?link\b[^>]*\/?>/gi) || [];
  let fallback = '';
  for (const tag of tags) {
    const href = attr(tag, 'href');
    if (!href) continue;
    const rel = attr(tag, 'rel').toLowerCase();
    if (rel === 'alternate' || rel === '') return href;
    if (!fallback) fallback = href;
  }
  return fallback;
}

function blockLink(block) {
  const plain = collapseWhitespace(decodeEntities(unwrapCdata(firstTag(block, 'link'))));
  // RSS <link> holds the URL as text; Atom holds it in an attribute.
  if (/^https?:\/\//i.test(plain)) return plain;
  const fromAtom = atomLink(block);
  if (fromAtom) return fromAtom;
  const guid = collapseWhitespace(decodeEntities(unwrapCdata(firstTag(block, 'guid'))));
  return /^https?:\/\//i.test(guid) ? guid : '';
}

/**
 * Read a feed document into raw item records. No cleanup beyond CDATA unwrapping
 * happens here; normalize.js owns that.
 *
 * @param {string} xml
 * @returns {{title: string, link: string, published: string, summary: string}[]}
 */
export function parseFeed(xml) {
  if (!xml || typeof xml !== 'string') return [];
  const blocks = [...tagContents(xml, 'item'), ...tagContents(xml, 'entry')];
  const items = [];
  for (const block of blocks) {
    const title = firstTag(block, 'title');
    const link = blockLink(block);
    if (!title && !link) continue;
    items.push({
      title,
      link,
      published: collapseWhitespace(
        firstOf(block, ['pubDate', 'published', 'updated', 'date', 'created']),
      ),
      // content:encoded is the full article body on some feeds, so it is last and
      // normalize.js truncates hard. description/summary is what we want.
      summary: firstOf(block, ['description', 'summary', 'subtitle']),
    });
  }
  return items;
}
