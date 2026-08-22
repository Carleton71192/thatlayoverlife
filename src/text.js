// Plain-text helpers. Feed snippets arrive as HTML, sometimes escaped twice.

const NAMED_ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  eacute: 'é',
  egrave: 'è',
  agrave: 'à',
  ccedil: 'ç',
  uuml: 'ü',
  ouml: 'ö',
  auml: 'ä',
  ntilde: 'ñ',
  szlig: 'ß',
  aring: 'å',
  oslash: 'ø',
  aelig: 'æ',
};

export function decodeEntities(input) {
  if (!input) return '';
  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (match, body) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X'
        ? parseInt(body.slice(2), 16)
        : parseInt(body.slice(1), 10);
      if (!Number.isFinite(code) || code < 1 || code > 0x10ffff) return match;
      try {
        return String.fromCodePoint(code);
      } catch {
        return match;
      }
    }
    const named = NAMED_ENTITIES[body.toLowerCase()];
    return named === undefined ? match : named;
  });
}

export function stripTags(input) {
  if (!input) return '';
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|div|li|h[1-6])>/gi, ' ')
    .replace(/<[^>]*>/g, '');
}

export function collapseWhitespace(input) {
  return (input || '').replace(/\s+/g, ' ').trim();
}

// Feeds routinely ship markup inside a CDATA block, or escaped markup, or both.
// Decode, strip, decode again: that covers all three without mangling plain text.
export function toPlainText(input) {
  return collapseWhitespace(decodeEntities(stripTags(decodeEntities(input || ''))));
}

// Cut to `max` characters on a word boundary. The ellipsis counts toward the budget.
export function truncate(input, max = 280) {
  const text = input || '';
  if (text.length <= max) return text;
  const slice = text.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(' ');
  const body = lastSpace > max * 0.5 ? slice.slice(0, lastSpace) : slice;
  return `${body.replace(/[\s,;:.\-–—]+$/, '')}…`;
}
