import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  SITE, MARK_START, MARK_END, auditStory, buildMeta, contributorsFromExport, countWords, escapeAttr, injectHead, injectMarkdown,
  injectStory, isoDuration, jsonForScript, mapBadge, parseFrontMatter, parseStory, placeName, readHead, readingMinutes, renderMeta,
  splitSources, sponsorOf, storyUrlsFromSitemap, summarize, toCsv, toIsoDate, webflowTemplate,
} from '../tools/story-meta/lib.mjs';

const root = new URL('..', import.meta.url);
const readJson = (p) => JSON.parse(readFileSync(new URL(p, root), 'utf8'));

// Filler text for word counts. Test strings only, never story copy.
const words = (n) => Array.from({ length: n }, (_, i) => `word${i}`).join(' ');

const MD = `---
title: "Café \\"Lua\\" & the São Paulo </script> night 🐻‍❄️"
slug: test-sao-paulo
excerpt: 'It''s an excerpt with <tags> & "quotes"'
author:
  name: Ana Tester
  slug: ana-tester
  badge: Location Expert
date: 2026-10-09T06:00:00.000Z
image: https://cdn.example.com/hero.jpg
image_alt: A hero photo
place: SÃO PAULO, BRAZIL
sources:
  - First-hand
  - "UNESCO World Heritage Centre"
tags: [Brazil, SaoPaulo]
---
# Heading

${words(450)}
`;

const PAGE = (head = '') => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>SEO title for the page</title>
  <meta name="description" content="SEO description">
  <meta property="og:title" content="SEO title for the page">
  <meta property="og:type" content="website">
  <link rel="canonical" href="https://www.thatlayover.life/stories/test-story">
  <style>.x{color:red}</style>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"Old"}</script>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Keep me"}</script>
${head}</head>
<body>
<section class="tll-story-hero"><img class="tll-story-hero-img" src="https://cdn.example.com/hero.jpg" alt="Kids &amp; drums">
<div class="tll-story-meta-row"><div class="tll-eyebrow-teal tll-story-byline-loc">PORTO JOFRE, BRAZIL</div><div class="tll-micro tll-story-reading-time">3</div></div>
<h1 class="tll-story-title">A title with &quot;quotes&quot; &amp; São Paulo</h1></section>
<div class="tll-reading-column tll-story-body">
<div class="st3-author"><a href="/contributors/ana-tester" class="st3-author-link"><div class="st3-author-name">Ana Tester</div>
<span data-st3-loc="1" data-st3-byline="PORTO JOFRE, BRAZIL">Copenhagen, Denmark</span><span data-st3-when="1">October 9, 2026</span></a></div>
<p data-st3-lede="1" class="st3-lede">The lede, from the page.</p>
<div class="tll-body w-richtext"><p>${words(120)}</p></div>
<div class="tll-body w-richtext"><p>${words(1000)}</p></div>
<div id="tll-quick-answers" class="tll-body w-richtext"><p>${words(1200)}</p></div>
</div>
<div data-tll-lg="sources">&lt;p&gt;First-hand; NOAA; Smithsonian (Santa Ana; Izalco)&lt;/p&gt;</div>
<div data-tll-lg="disclosure">Paid for by the travelers</div>
<div class="st3-cc-badge">Founder</div>
</body></html>`;

describe('parseStory: Markdown with front matter', () => {
  const s = parseStory(MD);
  it('reads title, slug, excerpt, author and badge', () => {
    expect(s.source).toBe('markdown');
    expect(s.title).toBe('Café "Lua" & the São Paulo </script> night 🐻‍❄️');
    expect(s.slug).toBe('test-sao-paulo');
    expect(s.excerpt).toBe('It\'s an excerpt with <tags> & "quotes"');
    expect(s.author).toEqual({ name: 'Ana Tester', slug: 'ana-tester', url: '', badge: 'Location Expert' });
  });
  it('computes reading time from the body at 200 words a minute when there is none', () => {
    expect(s.wordCount).toBe(451); // 450 filler words and the heading
    expect(s.readingTime).toBe(3);
    expect(s.readingTimeFrom).toBe('words');
  });
  it('keeps a stated reading time', () => {
    const t = parseStory(MD.replace('slug: test-sao-paulo', 'slug: test-sao-paulo\nreading_time: 9'));
    expect(t.readingTime).toBe(9);
    expect(t.readingTimeFrom).toBe('field');
  });
  it('normalizes the place, the date, the sources and the tags', () => {
    expect(s.place).toBe('São Paulo, Brazil');
    expect(s.datePublished).toBe('2026-10-09T06:00:00.000Z');
    expect(s.sources).toEqual([{ name: 'UNESCO World Heritage Centre', url: '' }]);
    expect(s.tags).toEqual(['Brazil', 'SaoPaulo']);
  });
  it('front matter parser handles block scalars, lists and nested keys', () => {
    const { data, body } = parseFrontMatter('---\na: 1\nb: [x, "y"]\nhead: |\n  <meta a>\n  <meta b>\nc:\n  - one\n  - two\nd:\n  e: f\n---\nbody');
    expect(data).toEqual({ a: 1, b: ['x', 'y'], head: '<meta a>\n<meta b>', c: ['one', 'two'], d: { e: 'f' } });
    expect(body).toBe('body');
  });
});

describe('parseStory: an HTML page (the live story template markup)', () => {
  const s = parseStory(PAGE());
  it('takes the title from the h1, decoded', () => expect(s.title).toBe('A title with "quotes" & São Paulo'));
  it('keeps the SEO title and description from the head apart from the excerpt', () => {
    expect(s.seoTitle).toBe('SEO title for the page');
    expect(s.seoDescription).toBe('SEO description');
    expect(s.excerpt).toBe('The lede, from the page.');
  });
  it('reads the byline: author, contributor page, badge', () => {
    expect(s.author).toEqual({ name: 'Ana Tester', slug: 'ana-tester', url: 'https://www.thatlayover.life/contributors/ana-tester', badge: 'Founder' });
  });
  it('reads the reading time from the page and counts the body (the longest rich text, not quick answers)', () => {
    expect(s.readingTime).toBe(3);
    expect(s.readingTimeFrom).toBe('page');
    expect(s.wordCount).toBe(1000);
  });
  it('reads hero, date, canonical, place, sources; a self-funded trip is not a sponsor', () => {
    expect(s.image).toEqual({ url: 'https://cdn.example.com/hero.jpg', alt: 'Kids & drums' });
    expect(s.datePublished).toBe('2026-10-09');
    expect(s.canonical).toBe('https://www.thatlayover.life/stories/test-story');
    expect(s.slug).toBe('test-story');
    expect(s.place).toBe('Porto Jofre, Brazil');
    expect(s.sources.map((x) => x.name)).toEqual(['NOAA', 'Smithsonian (Santa Ana; Izalco)']);
    expect(s.sponsor).toBeNull();
  });
  it('falls back to "N min read" in a byline and to the word count', () => {
    const a = parseStory('<html><head><title>T</title></head><body><h1>T</h1><p class="byline"><a href="/contributors/x">X</a> 27 September 2024 · 4 min read</p><div class="prose"><p>a b c</p></div></body></html>');
    expect([a.readingTime, a.readingTimeFrom, a.datePublished, a.author.name]).toEqual([4, 'page', '2024-09-27', 'X']);
    const b = parseStory(`<html><head></head><body><h1>T</h1><article><p>${words(401)}</p></article></body></html>`);
    expect([b.readingTime, b.readingTimeFrom]).toEqual([3, 'words']);
  });
});

describe('parseStory: CMS item and search-index row', () => {
  const contributors = contributorsFromExport(
    readJson('handoff/claude-design-source/webflow-export-2026-10-13/cms/contributors.json'),
    readJson('reports/evidence/webflow-export-2026-10-13/state/cms-schemas/6a0b29c7a7b1840afe9390a5.json'),
  );
  it('maps contributor badge option ids to names', () => {
    expect(contributors['6a0be79e01ee7eff10102ce9']).toEqual({ name: 'Nancy Carleton', slug: 'nancy-carleton', badge: 'Founder' });
  });
  it('reads a CMS item as the CMS holds it', () => {
    const s = parseStory(readJson('src/design/magazine-2026-10/story/pantanal-glimmers-in-the-wild.json'), { contributors });
    expect(s.source).toBe('cms');
    expect(s.title).toBe('Glimmers in the Wild: 120 Wooden Bridges, Jaguars, and No Guide');
    expect(s.readingTime).toBe(7);
    expect(s.readingTimeFrom).toBe('field');
    expect(s.place).toBe('Porto Jofre, Brazil');
    expect(s.author.name).toBe('Nancy Carleton');
    expect(s.sources.length).toBeGreaterThan(1);
    expect(s.tags).not.toContain('ThatLayoverLife');
  });
  it('a CMS item wrapped in fieldData (API v2) reads the same', () => {
    const flat = readJson('src/design/magazine-2026-10/story/ghana-easter-everyone-wears-white.json');
    expect(parseStory({ id: 'x', fieldData: flat }, { contributors })).toEqual(parseStory(flat, { contributors }));
  });
  it('reads a search-index row: slug and distinct words, no reading time', () => {
    const index = readJson('src/data/story-search-index.json');
    const s = parseStory({ slug: 'ghana-easter-everyone-wears-white', text: index['ghana-easter-everyone-wears-white'] });
    expect(s.source).toBe('index');
    expect(s.canonical).toBe('https://www.thatlayover.life/stories/ghana-easter-everyone-wears-white');
    expect(s.distinctWords).toBeGreaterThan(50);
    expect(s.readingTime).toBe(0);
  });
});

describe('reading time', () => {
  it('counts words, not punctuation, emoji or markup', () => {
    expect(countWords('São Paulo, 2026 · café? 🐻‍❄️ it\'s')).toBe(5);
    expect(countWords('')).toBe(0);
  });
  it('rounds up at 200 words a minute, never below one', () => {
    expect([0, 1, 199, 200, 201, 400, 401].map((n) => readingMinutes(n))).toEqual([0, 1, 1, 1, 2, 2, 3]);
  });
  it('writes ISO 8601 durations', () => {
    expect([3, 60, 75, 0, -2, '4'].map(isoDuration)).toEqual(['PT3M', 'PT1H', 'PT1H15M', '', '', 'PT4M']);
  });
});

describe('author badge', () => {
  it('roles go to jobTitle, other badges to description, all to the visible byline', () => {
    expect(mapBadge('Founder')).toEqual({ jobTitle: 'Founder', visible: 'Founder' });
    expect(mapBadge('editor')).toEqual({ jobTitle: 'editor', visible: 'editor' });
    expect(mapBadge('Location Expert')).toEqual({ description: 'Location Expert at That Layover Life', visible: 'Location Expert' });
    expect(mapBadge('Founding member')).toEqual({ description: 'Founding member at That Layover Life', visible: 'Founding member' });
    expect(mapBadge('')).toEqual({ visible: '' });
  });
  it('the badge never becomes a head tag', () => {
    const meta = buildMeta(parseStory(MD));
    expect(meta.visible.authorBadge).toBe('Location Expert');
    expect(meta.tags.some((t) => (t.content || '').includes('Location Expert'))).toBe(false);
    const author = meta.jsonLd['@graph'][0].author;
    expect(author).toEqual({ '@type': 'Person', name: 'Ana Tester', url: 'https://www.thatlayover.life/contributors/ana-tester', description: 'Location Expert at That Layover Life' });
  });
});

describe('escaping', () => {
  it('escapes attributes', () => {
    expect(escapeAttr(`a "b" & 'c' <d>`)).toBe('a &quot;b&quot; &amp; &#39;c&#39; &lt;d&gt;');
  });
  it('JSON inside a script cannot close the script or open a comment, and line separators are escaped', () => {
    const out = jsonForScript({ t: '</script><!-- x --> & \u2028\u2029 São 🐻‍❄️' });
    expect(out).not.toMatch(/<\/script|<!--|[\u2028\u2029]/);
    expect(JSON.parse(out)).toEqual({ t: '</script><!-- x --> & \u2028\u2029 São 🐻‍❄️' });
  });
  it('a rendered block reads back to the same values (quotes, ampersands, accents, emoji, </script>)', () => {
    const story = parseStory(MD);
    const meta = buildMeta(story);
    const html = `<html><head>\n${renderMeta(meta)}\n</head><body></body></html>`;
    const head = readHead(html);
    expect(head.tags.get('og:title')[0]).toBe(story.title);
    expect(head.tags.get('og:description')[0]).toBe(story.excerpt);
    expect(head.tags.get('twitter:data1')[0]).toBe('Ana Tester');
    expect(head.ld).toHaveLength(1);
    expect(head.ld[0].data['@graph'][0].headline).toBe(story.title);
    expect(html.match(/<\/script>/g)).toHaveLength(1);
  });
});

describe('buildMeta', () => {
  const meta = buildMeta(parseStory(MD));
  const tag = (k) => meta.tags.filter((t) => t.key === k).map((t) => t.content);
  it('emits Open Graph article tags and a large-image Twitter card', () => {
    expect(tag('og:type')).toEqual(['article']);
    expect(tag('twitter:card')).toEqual(['summary_large_image']);
    expect(tag('article:published_time')).toEqual(['2026-10-09T06:00:00.000Z']);
    expect(tag('article:modified_time')).toEqual(['2026-10-09T06:00:00.000Z']);
    expect(tag('article:tag')).toEqual(['Brazil', 'SaoPaulo']);
    expect(tag('twitter:data2')).toEqual(['3 min read']);
  });
  it('the Article has timeRequired, a place without coordinates, citations and no sponsor', () => {
    const a = meta.jsonLd['@graph'][0];
    expect(a.timeRequired).toBe('PT3M');
    expect(a.contentLocation).toEqual({ '@type': 'Place', '@id': 'https://www.thatlayover.life/stories/test-sao-paulo#place', name: 'São Paulo, Brazil' });
    expect(JSON.stringify(a)).not.toMatch(/geo|latitude|longitude/);
    expect(a.citation).toEqual(['UNESCO World Heritage Centre']);
    expect(a.sponsor).toBeUndefined();
    expect(a.isAccessibleForFree).toBe(true);
  });
  it('a sponsored story names its sponsor', () => {
    const a = buildMeta({ ...parseStory(MD), sponsor: sponsorOf({ disclosure: 'Hosted by Visit Example, flights included' }) }).jsonLd['@graph'][0];
    expect(a.sponsor).toEqual({ '@type': 'Organization', name: 'Visit Example' });
  });
  it('no image means a summary card and no empty tags', () => {
    const m = buildMeta({ ...parseStory(MD), image: { url: '', alt: '' } });
    expect(m.tags.find((t) => t.key === 'twitter:card').content).toBe('summary');
    expect(m.tags.every((t) => (t.content ?? t.href) !== '')).toBe(true);
  });
  it('snapshot: a real story from the index (Ghana, as the CMS holds it)', () => {
    const index = readJson('src/data/story-search-index.json');
    const slug = 'ghana-easter-everyone-wears-white';
    expect(index[slug]).toBeTruthy();
    const contributors = contributorsFromExport(
      readJson('handoff/claude-design-source/webflow-export-2026-10-13/cms/contributors.json'),
      readJson('reports/evidence/webflow-export-2026-10-13/state/cms-schemas/6a0b29c7a7b1840afe9390a5.json'),
    );
    const story = parseStory(readJson(`src/design/magazine-2026-10/story/${slug}.json`), { contributors });
    expect(story.slug).toBe(slug);
    expect(buildMeta(story, SITE)).toMatchSnapshot();
  });
});

describe('injectHead', () => {
  const meta = buildMeta(parseStory(PAGE()));
  it('inject twice equals inject once', () => {
    const once = injectHead(PAGE(), meta);
    expect(injectHead(once, meta)).toBe(once);
    const skipOnce = injectHead(PAGE(), meta, { rule: 'skip' });
    expect(injectHead(skipOnce, meta, { rule: 'skip' })).toBe(skipOnce);
  });
  it('replace rule: one value per key, the Article JSON-LD replaced, everything else untouched', () => {
    const out = injectHead(PAGE(), meta);
    const head = readHead(out);
    for (const [k, v] of head.tags) if (k !== 'article:tag') expect([k, v.length]).toEqual([k, 1]);
    expect(head.tags.get('og:type')).toEqual(['article']);
    expect(head.canonical).toHaveLength(1);
    expect(out).toContain('<title>SEO title for the page</title>');
    expect(out).toContain('<style>.x{color:red}</style>');
    expect(out).toContain('"name":"Keep me"');
    expect(out).not.toContain('"headline":"Old"');
    expect(out.indexOf(MARK_START)).toBeLessThan(out.indexOf('</head>'));
    expect(out.split(MARK_START)).toHaveLength(2);
  });
  it('skip rule: existing equivalent tags stay and the block leaves those keys out', () => {
    const out = injectHead(PAGE(), meta, { rule: 'skip' });
    const head = readHead(out);
    expect(head.tags.get('og:type')).toEqual(['website']);
    expect(head.tags.get('og:title')).toEqual(['SEO title for the page']);
    expect(head.canonical).toHaveLength(1);
    expect(out).toContain('"headline":"Old"');
    expect(head.tags.get('twitter:card')).toEqual(['summary_large_image']);
  });
  it('a changed story replaces only the block', () => {
    const once = injectHead(PAGE(), meta);
    const changed = injectHead(once, { ...meta, tags: meta.tags.filter((t) => t.key !== 'og:locale') });
    expect(changed.replace(/<!-- tll-meta:start -->[\s\S]*<!-- tll-meta:end -->/, '')).toBe(once.replace(/<!-- tll-meta:start -->[\s\S]*<!-- tll-meta:end -->/, ''));
    expect(changed).not.toContain('og:locale');
  });
  it('head code without <head> (a fragment) gets the block at the end, idempotently', () => {
    const frag = '<style>.a{}</style>\n<meta property="og:type" content="article">';
    const once = injectHead(frag, meta);
    expect(once.startsWith('<style>.a{}</style>\n')).toBe(true);
    expect(injectHead(once, meta)).toBe(once);
  });
  it('injectStory on a page is a fixed point (parse, build, inject, again)', () => {
    const once = injectStory(PAGE(), { kind: 'html' }).text;
    expect(injectStory(once, { kind: 'html' }).text).toBe(once);
  });
});

describe('injectMarkdown', () => {
  it('writes the block into front matter as head:, and twice equals once', () => {
    const meta = buildMeta(parseStory(MD));
    const once = injectMarkdown(MD, meta);
    expect(injectMarkdown(once, meta)).toBe(once);
    const fm = parseFrontMatter(once).data;
    expect(fm.head.startsWith(MARK_START)).toBe(true);
    expect(fm.head.endsWith(MARK_END)).toBe(true);
    expect(fm.title).toBe(parseFrontMatter(MD).data.title);
    expect(parseFrontMatter(once).body).toBe(parseFrontMatter(MD).body);
    expect(injectStory(once, { kind: 'md' }).text).toBe(once);
  });
  it('adds front matter to a file without it', () => {
    const md = '# Just a title\n\nSome words here.\n';
    const once = injectStory(md, { kind: 'md' }).text;
    expect(once.startsWith('---\nhead: |\n')).toBe(true);
    expect(injectStory(once, { kind: 'md' }).text).toBe(once);
  });
});

describe('helpers', () => {
  it('places, dates, sources, sponsors', () => {
    expect(placeName('ARIZONA, USA')).toBe('Arizona, USA');
    expect(placeName('RIO DE JANEIRO, BRAZIL')).toBe('Rio de Janeiro, Brazil');
    expect(placeName('Copenhagen, Denmark')).toBe('Copenhagen, Denmark');
    expect(toIsoDate('September 19, 2026')).toBe('2026-09-19');
    expect(toIsoDate('9 October 2026')).toBe('2026-10-09');
    expect(toIsoDate('nonsense')).toBe('');
    expect(splitSources('First-hand, with UNESCO and IUCN').map((x) => x.name)).toEqual(['UNESCO and IUCN']);
    expect(splitSources('First-hand, with official sources linked below.')).toEqual([]);
    expect(splitSources('<p><a href="https://x.example/a">A report</a></p><p>B</p>')).toEqual([{ name: 'A report', url: 'https://x.example/a' }, { name: 'B', url: '' }]);
    expect(sponsorOf({ disclosure: 'Paid for by the traveler, flights on points' })).toBeNull();
    expect(sponsorOf({ name: 'Brand', url: 'https://brand.example' })).toEqual({ name: 'Brand', url: 'https://brand.example' });
  });
  it('sitemap: story addresses only', () => {
    const xml = '<urlset><url><loc>https://www.thatlayover.life/stories</loc></url><url><loc>https://www.thatlayover.life/stories/a-b</loc></url><url><loc>https://www.thatlayover.life/countries/x</loc></url></urlset>';
    expect(storyUrlsFromSitemap(xml)).toEqual(['https://www.thatlayover.life/stories/a-b']);
  });
  it('CSV quoting', () => {
    expect(toCsv([{ a: 'x,y', b: 'say "hi"' }], ['a', 'b'])).toBe('a,b\n"x,y","say ""hi"""\n');
  });
});

describe('audit', () => {
  it('finds missing, duplicate and disagreeing tags and HTML entities in the JSON-LD', () => {
    const page = PAGE().replace('<meta property="og:type" content="website">', '<meta property="og:type" content="website">\n<meta property="og:type" content="article">')
      .replace('"headline":"Old"', '"headline":"It&#39;s old"');
    const { rows } = auditStory(page);
    const st = (k) => rows.find((r) => r.key === k)?.status;
    expect(st('og:type')).toBe('duplicate');
    expect(st('twitter:image')).toBe('missing');
    expect(st('og:title')).toBe('ok');
    expect(st('ld.headline')).toBe('disagree');
    expect(st('ld.timeRequired')).toBe('missing');
    expect(st('ld.raw-entities')).toBe('entities');
    expect(st('reading-time vs words')).toBe('disagree'); // 3 on the page, 1000 words is 5 min
    const sum = summarize([{ rows }]);
    expect(sum[0].gaps).toBe(1);
  });
  it('a page written by inject passes the audit except the reading-time note', () => {
    const out = injectStory(PAGE(), { kind: 'html' }).text;
    const bad = auditStory(out).rows.filter((r) => r.status !== 'ok').map((r) => r.key);
    expect(bad).toEqual(['reading-time vs words']);
  });
});

describe('webflow-template', () => {
  const t = webflowTemplate();
  it('writes bindings the way the existing template head code does', () => {
    expect(t.code).toContain('href="https://www.thatlayover.life/stories/{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;} }}"');
    expect(t.code).toContain('"timeRequired":"PT{{wf {&quot;path&quot;:&quot;reading-time&quot;,&quot;type&quot;:&quot;Number&quot;} }}M"');
    expect(t.code).toContain('"dateModified":"{{wf {&quot;path&quot;:&quot;last-updated&quot;,&quot;type&quot;:&quot;Date&quot;} }}"');
    expect(t.code).not.toMatch(/@@wf:/);
  });
  it('leaves out what Webflow already writes from Page settings', () => {
    for (const k of ['og:title', 'og:description', 'twitter:title', 'twitter:description', 'twitter:card', 'name="description"', 'article:modified_time']) {
      expect(t.code).not.toContain(k);
    }
    expect(t.code.match(/og:type/g)).toHaveLength(1);
    expect(t.webflowEmits.map((x) => x[0])).toContain('og:type');
  });
  it('is one block between the markers, with the tidy script pointed at the new JSON-LD id', () => {
    expect(t.code.startsWith(MARK_START)).toBe(true);
    expect(t.code.endsWith(MARK_END)).toBe(true);
    expect(t.code).toContain('id="tll-article-ld-v3"');
    expect(t.code).toContain('getElementById("tll-article-ld-v3")');
  });
});
