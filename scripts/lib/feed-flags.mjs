// Rewrites the `enabled:` flags in src/feeds.js. Kept as a pure string
// transform so it can be tested without touching the disk or the network.

/**
 * Flip one feed's `enabled` value in the source text of src/feeds.js.
 *
 * @param {string} source contents of src/feeds.js
 * @param {string} id feed id, e.g. "lonely-planet"
 * @param {boolean} value
 * @returns {string} the rewritten source
 * @throws when the feed or its enabled flag cannot be found
 */
export function setEnabled(source, id, value) {
  const anchor = source.indexOf(`id: '${id}'`);
  if (anchor === -1) throw new Error(`no feed with id '${id}' in src/feeds.js`);

  // Stay inside this feed's object literal: stop at the next feed's id.
  const nextAnchor = source.indexOf('id: \'', anchor + 5);
  const end = nextAnchor === -1 ? source.length : nextAnchor;
  const block = source.slice(anchor, end);

  const match = block.match(/enabled:\s*(true|false)/);
  if (!match) throw new Error(`feed '${id}' has no enabled flag`);
  if (match[1] === String(value)) return source;

  const rewritten = block.replace(/enabled:\s*(true|false)/, `enabled: ${value}`);
  return source.slice(0, anchor) + rewritten + source.slice(end);
}

/**
 * Apply several flips at once.
 *
 * @param {string} source
 * @param {{id: string, enabled: boolean}[]} changes
 */
export function applyFlags(source, changes) {
  return changes.reduce((text, change) => setEnabled(text, change.id, change.enabled), source);
}
