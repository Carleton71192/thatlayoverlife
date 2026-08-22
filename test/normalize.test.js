import { describe, expect, it } from 'vitest';
import { canonicalLink, normalizeItem, parsePublishedAt, sha1Hex } from '../src/normalize.js';
import { toPlainText, truncate } from '../src/text.js';

const FEED = { source: 'SKIFT' };
const NOW = new Date('2026-08-22T14:30:00Z');

describe('canonicalLink', () => {
  it('drops campaign tracking params and fragments', () => {
    expect(canonicalLink('https://skift.com/a?utm_source=rss&id=7#top')).toBe('https://skift.com/a?id=7');
  });

  it('rejects junk and non-http schemes', () => {
    expect(canonicalLink('not a url')).toBe('');
    expect(canonicalLink('javascript:alert(1)')).toBe('');
    expect(canonicalLink('')).toBe('');
  });
});

describe('parsePublishedAt', () => {
  it('reads RFC 822 and ISO dates', () => {
    expect(parsePublishedAt('Fri, 22 Aug 2026 09:12:00 GMT', NOW)).toBe('2026-08-22T09:12:00.000Z');
    expect(parsePublishedAt('2026-08-22T09:12:00Z', NOW)).toBe('2026-08-22T09:12:00.000Z');
  });

  it('rejects unparseable and implausible dates', () => {
    expect(parsePublishedAt('sometime last week', NOW)).toBeNull();
    expect(parsePublishedAt('2031-01-01T00:00:00Z', NOW)).toBeNull();
    expect(parsePublishedAt('', NOW)).toBeNull();
  });
});

describe('toPlainText', () => {
  it('unwraps escaped markup and collapses whitespace', () => {
    expect(toPlainText('&lt;p&gt;Qatar   doubles\nthe window.&lt;/p&gt;')).toBe('Qatar doubles the window.');
  });

  it('decodes numeric and named entities', () => {
    expect(toPlainText('Rome&#8217;s airport &amp; rail hub')).toBe('Rome’s airport & rail hub');
  });
});

describe('truncate', () => {
  it('leaves short text alone', () => {
    expect(truncate('short', 280)).toBe('short');
  });

  it('cuts on a word boundary and stays within budget', () => {
    const long = 'word '.repeat(80).trim();
    const cut = truncate(long, 280);
    expect(cut.length).toBeLessThanOrEqual(280);
    expect(cut.endsWith('…')).toBe(true);
    expect(cut).not.toMatch(/ …$/);
  });
});

describe('normalizeItem', () => {
  it('produces the shape the site expects', async () => {
    const item = await normalizeItem({
      title: '  Doha extends free transit visas to 96 hours ',
      link: 'https://apnews.com/article/doha?utm_medium=rss',
      published: 'Fri, 22 Aug 2026 09:12:00 GMT',
      summary: '&lt;p&gt;Qatar doubles the stopover window for 95 nationalities.&lt;/p&gt;',
    }, { source: 'AP' }, NOW);

    expect(item).toEqual({
      id: await sha1Hex('https://apnews.com/article/doha'),
      title: 'Doha extends free transit visas to 96 hours',
      link: 'https://apnews.com/article/doha',
      source: 'AP',
      publishedAt: '2026-08-22T09:12:00.000Z',
      summary: 'Qatar doubles the stopover window for 95 nationalities.',
      region: 'MIDDLE EAST',
      country: 'QA',
    });
  });

  it('caps the summary at 280 characters', async () => {
    const item = await normalizeItem({
      title: 'Long one',
      link: 'https://skift.com/long',
      published: NOW.toISOString(),
      summary: 'sentence '.repeat(60),
    }, FEED, NOW);
    expect(item.summary.length).toBeLessThanOrEqual(280);
  });

  it('falls back to run time when the feed date is missing', async () => {
    const item = await normalizeItem({
      title: 'No date',
      link: 'https://skift.com/no-date',
      published: '',
      summary: '',
    }, FEED, NOW);
    expect(item.publishedAt).toBe(NOW.toISOString());
  });

  it('drops items with no title or no usable link', async () => {
    expect(await normalizeItem({ title: '', link: 'https://skift.com/a' }, FEED, NOW)).toBeNull();
    expect(await normalizeItem({ title: 'Headline', link: '' }, FEED, NOW)).toBeNull();
  });

  it('keeps the source name verbatim', async () => {
    const item = await normalizeItem(
      { title: 'Headline', link: 'https://thepointsguy.com/a', published: '', summary: '' },
      { source: 'THE POINTS GUY' },
      NOW,
    );
    expect(item.source).toBe('THE POINTS GUY');
  });

  it('gives the same link the same id', async () => {
    const args = [{ title: 'A', link: 'https://skift.com/x', published: '', summary: '' }, FEED, NOW];
    const [first, second] = [await normalizeItem(...args), await normalizeItem(...args)];
    expect(first.id).toBe(second.id);
    expect(first.id).toMatch(/^[0-9a-f]{40}$/);
  });
});
