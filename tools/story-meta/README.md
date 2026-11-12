# Story share tags and structured data

`tools/story-meta/` reads a story (Markdown, an HTML page, a Webflow CMS item or a search-index row), finds its title, author, author badge, reading time, hero image, dates, place and sources, and builds the Open Graph tags, the Twitter card tags and a JSON-LD Article graph for it. It can write those tags into local story files, audit what the live story pages carry today, and print the head code for the Webflow Stories template.

Plain Node 22 ESM, no new dependencies. Built 12 November 2026. Nothing here touches Webflow.

## The honest limit

Live stories are Webflow CMS items rendered by the Stories template. Their `<head>` is written by Webflow from Page settings (title, description, Open Graph and Twitter title and description) and by the template's own head code (canonical, og:image, og:url, og:type article, the JSON-LD). A local script cannot write those heads. So the tool does three things:

1. **`webflow-template`** prints the head code for the Stories template with Webflow binding tokens in place of values. Pasting that into the template is the only way these tags reach the live site, and only the owner does that.
2. **`audit --live`** reads every story page in the sitemap and reports what is missing or different from what `buildMeta` expects. It writes nothing unless you ask for a CSV.
3. **`inject`** writes the tags into local story `.md` and `.html` files, for pages built outside Webflow (prototypes, previews, a future static build). The repo holds no story Markdown today; the local story HTML files are the magazine prototypes in `src/design/magazine-2026-10/`.

## Commands

```sh
# 1. Head code for the Webflow Stories template (stdout). Notes follow a separator; --code-only drops them.
node tools/story-meta/cli.mjs webflow-template
node tools/story-meta/cli.mjs webflow-template --code-only > /tmp/stories-head.html

# 2. Audit the live story pages. Behind an HTTPS proxy, Node's fetch needs NODE_USE_ENV_PROXY=1.
NODE_USE_ENV_PROXY=1 node tools/story-meta/cli.mjs audit --live
NODE_USE_ENV_PROXY=1 node tools/story-meta/cli.mjs audit --live --csv /tmp/story-meta-audit.csv
node tools/story-meta/cli.mjs audit "src/design/magazine-2026-10/story/*.html"     # local pages, same checks

# 3. Write the tags into local story files, in place.
node tools/story-meta/cli.mjs inject "stories/**/*.md" --dry-run    # list what would change
node tools/story-meta/cli.mjs inject "stories/**/*.md" --check      # CI: exit 1 when a file is out of date
node tools/story-meta/cli.mjs inject "stories/**/*.md"              # write
node tools/story-meta/cli.mjs inject page.html --rule skip          # keep existing equivalent tags (see rules)

# One file, printed, nothing written. A CMS item JSON needs the contributors to name its author:
node tools/story-meta/cli.mjs print src/design/magazine-2026-10/story/ghana-easter-everyone-wears-white.json \
  --contributors handoff/claude-design-source/webflow-export-2026-10-13/cms/contributors.json
```

The library (`lib.mjs`) is pure functions: `parseStory`, `buildMeta`, `renderMeta`, `injectHead`, `injectMarkdown`, `injectStory`, `readHead`, `auditStory`, `webflowTemplate`, plus helpers. Tests: `test/story-meta.test.js`.

## What each input gives

| Input | Title | Author and badge | Reading time | Other |
|---|---|---|---|---|
| Markdown with front matter | `title`, else the first `# ` heading | `author:` as a name, or nested `name`, `slug`, `url`, `badge` | `reading_time`, else the body at 200 words a minute | `slug`, `excerpt`, `seo_title`, `seo_description`, `image`, `image_alt`, `date`, `updated`, `canonical`, `place`, `pillar`, `tags`, `sources`, `sponsor` |
| Story HTML page | the `h1`, else og:title, else `<title>` | the live byline (`.st3-author-name`, the `/contributors/` link, `.st3-cc-badge`), a `.byline`, or `rel=author` | a meta (`tll:reading-time`, `twitter:data2`), else the page's reading-time element or "N min read", else the body word count | hero `img`, `<time>` or the published date on the page, canonical, place from the byline, sources and disclosure from the receipts box, sponsor from `#tll-sponsor-name` |
| Webflow CMS item JSON (flat, or API v2 `fieldData`) | `name` (SEO title in `seo-title`) | `contributor` id, resolved with a contributors map or a collection export | `reading-time`, else the `body` word count | `excerpt`, `seo-description`, `hero-image` (or `og-image`), `published-date`, `last-updated`, `byline-location`, `pillar-name`, `hashtag-set`, `sources`, `sponsor-name-2`, `sponsor-url`, `disclosure` |
| Row of `src/data/story-search-index.json` | none | none | none | the slug and the count of distinct words. The index keeps each word once, for search, so it cannot give a reading time. |

## Rules `buildMeta` follows

- **Titles and descriptions are the story's own.** og:title and twitter:title use the SEO title when there is one, else the story title; the JSON-LD headline is the story title. The meta, og and twitter descriptions use the SEO description when there is one, else the excerpt; the JSON-LD description is the excerpt. Nothing is written or summarized.
- **Reading time:** words are runs of letters or digits (punctuation, emoji and markup do not count), divided by 200 and rounded up, never below one minute. In JSON-LD it is `timeRequired` as an ISO 8601 duration (`PT7M`, `PT1H15M`). In tags it is `twitter:label2` "Reading time" with `twitter:data2` "7 min read", which Slack shows in link previews.
- **Author:** a schema.org `Person` with the contributor page as `url`. `article:author` carries the same page.
- **Author badge.** schema.org has no property for a community badge, and no badge produces a rich result in search. The tool maps it honestly:

  | Badge | JSON-LD | Visible byline |
  |---|---|---|
  | Founder, Editor, Contributor (roles at TLL) | `author.jobTitle` | `meta.visible.authorBadge` |
  | Any other (Frequent, Founding member, Location Expert) | `author.description`, "Location Expert at That Layover Life" | `meta.visible.authorBadge` |

  The badge never becomes a head tag. `meta.visible` is for the byline only.
- **Place:** `contentLocation` (and `about`, pointing at the same node) is a `Place` with the byline place only, in normal case ("PORTO JOFRE, BRAZIL" becomes "Porto Jofre, Brazil"). No coordinates, no address, nothing beyond the story's stated place.
- **Sources:** `citation`. Paragraphs and top-level semicolons split items; a leading "First-hand" is dropped (it says the writer was there; it is not a source), and so is "official sources linked below".
- **Sponsor:** only from the CMS sponsor fields, or a Disclosure that starts "Hosted by", "Hosted:" or "Sponsored by". "Paid for by the travelers" is a self-funded trip and never counts.
- **Publisher:** the site's existing `#organization` node, with the web clip the site already serves as its logo.
- Always: `isAccessibleForFree: true`, `inLanguage`, `mainEntityOfPage`, `datePublished`, `dateModified` (the published date when there is no update), a `BreadcrumbList`. Empty values are dropped, so no tag or JSON field is ever blank.

## Escaping

- Attribute values: `&`, `"`, `'`, `<`, `>` become entities.
- JSON inside `<script type="application/ld+json">`: `<`, `>` and `&` become `\u003c`, `\u003e`, `\u0026`, so `</script>` and `<!--` cannot appear; U+2028 and U+2029 are escaped. Accents and emoji stay as characters (São Paulo stays São Paulo).

## Injection rules

- The block sits between `<!-- tll-meta:start -->` and `<!-- tll-meta:end -->`. Running `inject` again replaces only what is between the markers, so inject twice equals inject once.
- Without markers, the block goes just before `</head>`. A file without `<head>` is treated as head code (like the Webflow head code box) and the block goes at the end.
- **Equivalent tags outside the markers** (the same og:, twitter:, article: or description key; a canonical link; an Article JSON-LD script):
  - `--rule replace` (default): they are removed, so each key has one value, the block's.
  - `--rule skip`: they stay, and the block leaves those keys out.
- `<title>`, charset, viewport, icons, styles, other scripts and other JSON-LD (an Organization, say) are never touched.
- Markdown: the block goes into the front matter as a `head: |` field (two-space indent), which a site build copies into `<head>`. The body is not touched. A file without front matter gets one.

## The Webflow template code

`webflow-template` writes bindings exactly as the existing Stories template head code does, for example `{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;} }}`. It leaves out what Webflow already writes from Page settings, so nothing is doubled:

| Webflow writes | From |
|---|---|
| `<title>`, meta description | SEO title and description bindings |
| og:title, og:description, twitter:title, twitter:description | the same bindings |
| og:type `website` | always; Webflow has no setting for it and custom code cannot remove it. The template adds `article` after it, as today. |
| twitter:card `summary_large_image` | always |
| og:image, twitter:image | only when the Page settings Open Graph image is set; it is empty on the Stories template today, so the template code writes both. If that setting is ever bound, take them out of the code. |

What the template code adds over today's: og:site_name, og:locale, twitter:image, article:published_time, article:author, twitter:label1/data1 (author), twitter:label2/data2 (reading time), and in the JSON-LD `timeRequired`, a publisher logo, `dateModified` from Last updated, `mainEntityOfPage` as a WebPage, and the place as `about`. It replaces `tll-ld-unescape-v1` with `tll-ld-tidy-v1`, which does the same entity fix and also fills an empty `dateModified` with the published date for readers that run scripts (Google does).

Left out because a binding cannot express them (custom code has no conditions): the author badge, sources, sponsor, pillar and hashtags (a story without the field would print an empty value), image alt text (an image binding gives the address only), article:modified_time (Last updated is empty on most stories). `contentLocation` prints Byline location as the CMS holds it, in capitals. These stay correct in the local tool and in the audit's expectations.

## Live audit, 12 November 2026

`NODE_USE_ENV_PROXY=1 node tools/story-meta/cli.mjs audit --live --csv reports/evidence/story-meta-2026-11-12/audit-live.csv`

Every story address in the sitemap loaded (57 at the time of the run). Expected values come from each page's own body: the h1, the byline, the badge on the contributor card, the reading time shown on the page, the hero image, the published date, the byline place, the receipts box. The CSV has one row per story and check.

| Check | OK | Missing | Disagree | Duplicate | Entities |
|---|---|---|---|---|---|
| article:author | 0 | 57 | 0 | 0 | 0 |
| article:modified_time | 0 | 57 | 0 | 0 | 0 |
| article:published_time | 0 | 57 | 0 | 0 | 0 |
| ld.author.jobTitle | 0 | 57 | 0 | 0 | 0 |
| ld.publisher.logo | 0 | 57 | 0 | 0 | 0 |
| ld.timeRequired | 0 | 57 | 0 | 0 | 0 |
| og:image:alt | 0 | 57 | 0 | 0 | 0 |
| og:locale | 0 | 57 | 0 | 0 | 0 |
| og:site_name | 0 | 57 | 0 | 0 | 0 |
| og:type | 0 | 0 | 0 | 57 | 0 |
| twitter:data1 | 0 | 57 | 0 | 0 | 0 |
| twitter:data2 | 0 | 57 | 0 | 0 | 0 |
| twitter:image | 0 | 57 | 0 | 0 | 0 |
| twitter:image:alt | 0 | 57 | 0 | 0 | 0 |
| twitter:label1 | 0 | 57 | 0 | 0 | 0 |
| twitter:label2 | 0 | 57 | 0 | 0 | 0 |
| ld.citation | 0 | 41 | 0 | 0 | 0 |
| ld.raw-entities | 0 | 0 | 0 | 0 | 21 |
| reading-time vs words | 0 | 0 | 8 | 0 | 0 |
| ld.dateModified | 56 | 0 | 1 | 0 | 0 |
| canonical, description, og:title, og:description, og:url, og:image, twitter:card, twitter:title, twitter:description | 57 | 0 | 0 | 0 | 0 |
| ld.headline, ld.description, ld.image, ld.datePublished, ld.author.name, ld.author.url, ld.contentLocation.name | 57 | 0 | 0 | 0 | 0 |

Gaps per story: fewest 16, most 19 (marathon-on-all-7-continents, morocco-toubkal-peaks-mules-uno-vengeance).

### Top gaps

1. **og:type is written twice on every story:** `website` from Webflow, then `article` from the template code. Readers that keep the first value see a website. No custom code can remove Webflow's tag; the template keeps `article` last.
2. **No twitter:image on any story.** X and others fall back to og:image, so cards still show the hero, but the tag is missing.
3. **No article:published_time, article:modified_time or article:author,** and no og:site_name or og:locale.
4. **JSON-LD has no `timeRequired`, no publisher logo and no author `jobTitle`,** although every page shows a reading time and the contributor card shows a badge (Founder or Contributor today, both roles, so all map to jobTitle).
5. **Sources are not in the JSON-LD.** 41 stories have sources beyond "First-hand" in the receipts box and no `citation`.
6. **HTML entities in the raw JSON-LD on 21 stories** (`&#39;` mostly, also `&quot;` and `&amp;`). Webflow escapes CMS text inside the script; `tll-ld-unescape-v1` repairs it for readers that run scripts, but a reader of the raw HTML sees "It&#39;s". Stories: angkor-wat-most-indiana-jones-thing, aruba-curacao-dushi-detour, bali-extended-layover-edition, chile-santiago-chilean-kazakh-wedding, croatia-te-amo-velho-birthday-week, eswatini-lesotho-how-many-goats-small-car, horseshoe-bend-arizona, kuala-lumpur-fomo-is-real, la-tomatina-bunol-i-wore-white, marathon-on-all-7-continents, mexico-holy-mole-teotihuacan-cenotes-pink-lagoons, montenegro-budva-switchback-roads, morocco-toubkal-peaks-mules-uno-vengeance, new-orleans-short-girl-wedding-krewe-of-boo, paraguay-poor-monday, sao-paulo-first-nfl-game-brazil, spain-madrid-wedding-ibiza, texas-hill-country-boot-scootin-eclipse, torrevieja-street-food-market-2026-rocking-out-with-some-great-food, uruguay-tiradentes-wine-yards, vietnam-thailand-noodle-week.
7. **dateModified ignores Last updated.** marathon-on-all-7-continents shows "Last updated 12 October 2026" on the page; its JSON-LD says 24 October 2024 (the published date), because the template binds published-date for both.
8. **Reading time in the CMS differs from the body by more than a minute on 8 stories** (stated, then by words at 200 a minute): agra-taj-mahal-keep-calm-and-curry-on 6 vs 8, kilimanjaro-someone-was-already-awake 9 vs 7, morocco-toubkal-peaks-mules-uno-vengeance 5 vs 7, nepal-everest-base-camp-dal-bhat-power 10 vs 12, oregon-pacific-northwest-epic-trip 4 vs 6, pantanal-glimmers-in-the-wild 7 vs 10, sao-paulo-world-cup-2022-ilhabela 6 vs 8, southern-africa-safari 7 vs 9. This is a note for the editor, not a tag gap: the audit and the template both use the CMS number.

What agrees everywhere: canonical, og:url, og:image (the hero), titles and descriptions, twitter:card, and the JSON-LD headline, description, image, published date, author name and contributor page, and place.

## For the owner

1. Run `node tools/story-meta/cli.mjs webflow-template --code-only` and, in the Designer, open the Stories template, Page settings, Custom code, Inside `<head>`. Replace the lines from `<meta property="og:image"` through the `tll-ld-unescape-v1` script with the printed block. Check that each token shows as a field chip (the reading-time and last-updated tokens are new to this template). Publish when ready, then run `audit --live` again.
2. Decide whether the badge, sources and pillar should reach the live JSON-LD. A binding cannot choose between jobTitle and description or skip an empty field; a small script in the template could, like `tll-ld-tidy-v1` does for dateModified.
3. Look at the 8 reading times above, and set Last updated on any story that has really changed.
