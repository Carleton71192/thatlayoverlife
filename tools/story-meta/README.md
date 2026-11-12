# Story share tags and structured data

`tools/story-meta/` reads a story (Markdown, an HTML page, a Webflow CMS item or a search-index row), finds its title, author, author badge, reading time, hero image, dates, place and sources, and builds the Open Graph tags, the Twitter card tags and a JSON-LD Article graph for it. It can write those tags into local story files, audit what the live story pages carry today, and print the head code for the Webflow Stories template.

Plain Node 22 ESM, no new dependencies. Built November 12, 2026, and revised the same day after review. Nothing here touches Webflow.

## The honest limit

Live stories are Webflow CMS items rendered by the Stories template. Their `<head>` is written by Webflow from Page settings (title, description, Open Graph and Twitter title and description) and by the template's own head code (canonical, og:image, og:url, og:type article, the JSON-LD). A local script cannot write those heads. So the tool does three things:

1. **`webflow-template`** prints the head code for the Stories template with Webflow binding tokens in place of values. Pasting that into the template is the only way these tags reach the live site, and only the owner does that.
2. **`audit --live`** reads every story page in the sitemap and reports what is missing or different from what `buildMeta` expects. It writes nothing unless you ask for a CSV.
3. **`inject`** writes the tags into local story `.md` and `.html` files, for pages built outside Webflow (prototypes, previews, a future static build). The repo holds no story Markdown today; the local story HTML files are the magazine prototypes in `src/design/magazine-2026-10/`.

## This replaces the schema-templates draft for the Stories template

`prototypes/2026-11-11/schema-templates/` proposed a Stories head too. The two drafts disagreed, so this section settles it. **For the Stories template, use the head code that `webflow-template` prints, not the Stories block or the `tll-ld-unescape-v2` script in `schema-templates/webflow-head-code.html`.** The Layovers template and the FAQ part of that draft are not covered here and still stand as proposed.

| Question | schema-templates draft | First version of this tool | Choice now, and why |
|---|---|---|---|
| Author badge | `author.memberOf`, an `OrganizationRole` with `roleName` | `author.jobTitle` for Founder, Editor, Contributor; `author.description` for the rest | **`memberOf` with an `OrganizationRole`.** schema.org defines `jobTitle` as a job title ("Financial Manager"). A badge says what someone is at That Layover Life, which is what an `OrganizationRole` inside `#organization` describes, and it fits every badge ("Frequent" is not a job). One binding covers all badges, so no conditions are needed. Google's Article docs use neither property, so this is about being accurate, not about search features. |
| JSON-LD id | keep `tll-article-ld-v2` | `tll-article-ld-v3` | **Keep `tll-article-ld-v2`.** The live body script `tll-st3-owner-edit-v1` (`src/pages/story/v3/embed-st3-owner-edit-v1.html`) finds the block by that id to put Last updated into `dateModified`. A new id would turn that off. |
| dateModified binding | `published-date` | `last-updated` | **`published-date`.** Head code cannot fall back from an empty field, and Last updated is empty on most stories, so binding it would leave `"dateModified":""` in the raw page. The owner-edit script swaps in Last updated for readers that run scripts. |
| Tidy script name | `tll-ld-unescape-v2` | `tll-ld-tidy-v1` | **`tll-ld-tidy-v1`.** It is different code from the draft's script, and one id should not name two scripts. It replaces the live `tll-ld-unescape-v1`. |
| Tidy script scope | every `ld+json` block; drops empty values of many kinds; fills an empty dateModified | one block; fixes entities; fills an empty dateModified | **Only `#tll-article-ld-v2`, and it never touches dateModified.** That block is the only one on a story page filled from CMS bindings, so it is the only one with Webflow's entities. The FAQPage block is built after load by another script from page text, and the rest are written by hand; rewriting blocks it does not own adds risk for no gain. It fixes entities and control characters, deletes `"timeRequired":"PTM"` (empty Reading time) and deletes `author.memberOf` when the badge is empty. |
| breadcrumb | on the Article | on the Article | **On the WebPage.** In schema.org `breadcrumb` is a property of `WebPage`, not of `Article`. The Article's `mainEntityOfPage` is now a `WebPage` node that carries `breadcrumb`. Both drafts had this wrong. |
| Author `@id` | `<contributor page>#person` | none | **Taken from the draft.** Contributor pages already emit a Person with that id (checked on November 12, 2026), so the author joins up with it. |
| `isPartOf`, `publishingPrinciples` | `#website`, `/editorial-charter` | none | **Taken from the draft.** The home page emits `#website`, and `/editorial-charter` answers 200 (both checked on November 12, 2026). |
| Editor, sponsor, country | bound (`edited-by`, `sponsor-name-2`, `country-2:name` as a PostalAddress) | left out | **Left out of the template.** On a story without the field each prints an empty value, and this tidy script does not prune empty nodes. The local tool handles the sponsor from the CMS fields. |
| Publisher logo, Open Graph and Twitter tags, place as `about` | none | present | **Kept.** |

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
node tools/story-meta/cli.mjs inject "stories/**/*.md" --check      # CI: exit 1 when a file is out of date or incomplete
node tools/story-meta/cli.mjs inject "stories/**/*.md"              # write
node tools/story-meta/cli.mjs inject page.html --rule skip          # keep existing equivalent tags (see rules)
node tools/story-meta/cli.mjs inject "stories/**/index.md" --slug-from-filename   # slug from the folder name

# One file, printed, nothing written. A CMS item JSON needs the contributors to name its author:
node tools/story-meta/cli.mjs print src/design/magazine-2026-10/story/ghana-easter-everyone-wears-white.json \
  --contributors handoff/claude-design-source/webflow-export-2026-10-13/cms/contributors.json
```

`inject` exit codes: 0 when done; 1 with `--check` when a file is out of date or misses a required field; 1 in every mode when a file was refused (damaged markers, or a `head:` field the tool did not write); 2 for a usage error. `--dry-run` and `--check` never write.

The library (`lib.mjs`) is pure functions: `parseStory`, `buildMeta`, `renderMeta`, `injectHead`, `injectMarkdown`, `injectStory`, `readHead`, `auditStory`, `webflowTemplate`, `tidyScript`, plus helpers. Tests: `test/story-meta.test.js`.

## What each input gives

| Input | Title | Author and badge | Reading time | Other |
|---|---|---|---|---|
| Markdown with front matter | `title`, else the first `# ` heading | `author:` as a name, or nested `name`, `slug`, `url`, `badge` | `reading_time`, else the body at 200 words a minute | `slug`, `excerpt`, `seo_title`, `seo_description`, `image`, `image_alt`, `date`, `updated`, `canonical`, `place`, `pillar`, `tags`, `sources`, `sponsor` |
| Story HTML page | the `h1`, else og:title, else `<title>` | the live byline (`.st3-author-name`, the `/contributors/` link, `.st3-cc-badge`), a `.byline`, or `rel=author` | a meta (`tll:reading-time`, `twitter:data2`), else the page's reading-time element or "N min read", else the body word count | hero `img`, `<time>` or the published date on the page, canonical, place from the byline, sources and disclosure from the receipts box, sponsor from `#tll-sponsor-name` |
| Webflow CMS item JSON (flat, or API v2 `fieldData`) | `name` (SEO title in `seo-title`) | `contributor` id, resolved with a contributors map or a collection export | `reading-time`, else the `body` word count | `excerpt`, `seo-description`, `hero-image` (or `og-image`), `published-date`, `last-updated`, `byline-location`, `pillar-name`, `hashtag-set`, `sources`, `sponsor-name-2`, `sponsor-url`, `disclosure` |
| Row of `src/data/story-search-index.json` | none | none | none | the slug and the count of distinct words. The index keeps each word once, for search, so it cannot give a reading time. |

**The slug is never made up.** It comes from the story itself (`slug`, `canonical` or `url` in front matter; the canonical link or og:url of a page; the CMS slug). With `--slug-from-filename` the file name gives it, and an `index.md` or `index.html` gives its folder name. Without a slug, a title or a published date, `inject` writes nothing for that file and prints a `missing` line.

The front matter reader handles the subset a story file needs: `key: value`, quoted values (also over several lines), inline `[a, "b, c"]` lists (commas inside quotes do not split), `- item` lists, one level of nested keys, and `|` or `>` blocks. Values may hold U+2028 and U+2029.

## Rules `buildMeta` follows

- **Titles and descriptions are the story's own.** og:title and twitter:title use the SEO title when there is one, else the story title; the JSON-LD headline is the story title. The meta, og and twitter descriptions use the SEO description when there is one, else the excerpt; the JSON-LD description is the excerpt. Nothing is written or summarized.
- **Reading time:** words are runs of letters or digits (punctuation, emoji and markup do not count), divided by 200 and rounded up, never below one minute. In JSON-LD it is `timeRequired` as an ISO 8601 duration (`PT7M`, `PT1H15M`). In tags it is `twitter:label2` "Reading time" with `twitter:data2` "7 min read", which Slack shows in link previews.
- **Author:** a schema.org `Person` with the contributor page as `url` and `<contributor page>#person` as `@id`. `article:author` carries the same page.
- **Author badge:** `author.memberOf` is an `OrganizationRole` with the badge as `roleName`, inside the site's `#organization`. No badge produces a rich result in search. The badge never becomes a head tag; `meta.visible.authorBadge` is for the byline only.
- **Place:** `contentLocation` (and `about`, pointing at the same node) is a `Place` with the byline place only, in normal case ("PORTO JOFRE, BRAZIL" becomes "Porto Jofre, Brazil"). No coordinates, no address, nothing beyond the story's stated place.
- **Image:** og:image must be an absolute address. A relative path is resolved against the story's canonical address; anything that is not http or https afterwards (a `data:` or `file:` address) is dropped, with its alt text.
- **Sources:** `citation`. Paragraphs and top-level semicolons split items; a leading "First-hand" is dropped (it says the writer was there; it is not a source), and so is "official sources linked below".
- **Sponsor:** only from the CMS sponsor fields, or a Disclosure that starts "Hosted by", "Hosted:" or "Sponsored by". "Paid for by the travelers" is a self-funded trip and never counts.
- **Publisher:** the site's existing `#organization` node, with the web clip the site already serves as its logo.
- **Page:** `mainEntityOfPage` is a `WebPage` with the story address as `@id` and the `BreadcrumbList` as its `breadcrumb`. `isPartOf` is the site's `#website`, `publishingPrinciples` the editorial charter.
- Always: `isAccessibleForFree: true`, `inLanguage`, `datePublished`, `dateModified` (the published date when there is no update). Empty values are dropped, so no tag or JSON field is ever blank.

## Escaping

- Attribute values: `&`, `"`, `'`, `<`, `>` become entities.
- JSON inside `<script type="application/ld+json">`: `<`, `>` and `&` become `\u003c`, `\u003e`, `\u0026`, so `</script>` and `<!--` cannot appear; U+2028 and U+2029 are escaped. Accents and emoji stay as characters (São Paulo stays São Paulo).

## Injection rules

- The block sits between `<!-- tll-meta:start -->` and `<!-- tll-meta:end -->`. Running `inject` again replaces only what is between the markers, so inject twice equals inject once.
- **Damaged markers** (a start without an end, an end before the start, or two pairs): the file is reported and left as it is.
- Scripts, styles and comments in the head are read as text, not markup. A `<meta>` inside a script string or a comment is never matched or edited, and a `"</head>"` inside a script string is not taken for the end of the head.
- Without markers, the block goes just before `</head>`. A page with `<body>` and no `<head>` gets `<head>`, the block and `</head>` just before `<body>`. Input with neither is treated as head code (like the Webflow head code box) and the block goes at the end.
- **Equivalent tags outside the markers** (the same og:, twitter:, article: or description key; a canonical link; an Article JSON-LD script):
  - `--rule replace` (default): they are removed, so each key has one value, the block's.
  - `--rule skip`: they stay, and the block leaves those keys out.
- **The JSON-LD id:** when the Article block being replaced has the id `tll-article-ld-v2` (a saved copy of a live story page), the new block keeps that id, so `tll-st3-owner-edit-v1` and `tll-ld-unescape-v1` on that page still find it. Any other page gets `tll-story-ld`.
- `<title>`, charset, viewport, icons, styles, other scripts and other JSON-LD (an Organization, say) are never touched.
- The file's own line ending (LF or CRLF) is kept.
- Markdown: the block goes into the front matter as a `head: |` field (two-space indent), which a site build copies into `<head>`. The body is not touched. A `head:` field that does not start with the tll-meta start marker was written by someone else: the file is reported and left as it is.

## The Webflow template code

`webflow-template` writes bindings exactly as the existing Stories template head code does, for example `{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;} }}`. It leaves out what Webflow already writes from Page settings, so nothing is doubled:

| Webflow writes | From |
|---|---|
| `<title>`, meta description | SEO title and description bindings |
| og:title, og:description, twitter:title, twitter:description | the same bindings |
| og:type `website` | always; Webflow has no setting for it and custom code cannot remove it. The template adds `article` after it, as today. |
| twitter:card `summary_large_image` | always |
| og:image, twitter:image | only when the Page settings Open Graph image is set; it is empty on the Stories template today, so the template code writes both. If that setting is ever bound, take them out of the code. |

What the template code adds over today's: og:site_name, og:locale, twitter:image, article:published_time, article:author, twitter:label1/data1 (author), twitter:label2/data2 (reading time), and in the JSON-LD `timeRequired`, the badge as an `OrganizationRole`, the author `@id`, a publisher logo, `isPartOf`, `publishingPrinciples`, `mainEntityOfPage` as a WebPage carrying the breadcrumb, and the place as `about`. The JSON-LD keeps the id `tll-article-ld-v2` and binds dateModified to the published date, as today. `tll-ld-tidy-v1` replaces `tll-ld-unescape-v1`.

**Required on every story**, because head code has no conditions: Name, Slug, Published date, Excerpt, Hero image, Reading time, Byline location, and a contributor with a Badge. `tll-ld-tidy-v1` drops an empty Reading time (`"PTM"`) and an empty badge from the JSON-LD, but `twitter:data2` would still read " min read", so treat Reading time as required.

Left out because a binding cannot express them: sources, sponsor, editor, pillar and hashtags (a story without the field would print an empty value), image alt text (an image binding gives the address only), article:modified_time (head code cannot read Last updated, so it would only repeat the published date). `contentLocation` prints Byline location as the CMS holds it, in capitals. These stay correct in the local tool and in the audit's expectations.

## Live audit

`NODE_USE_ENV_PROXY=1 node tools/story-meta/cli.mjs audit --live --csv reports/evidence/story-meta-2026-11-12/audit-live.csv`

The counts are in the CSV, one row per story and check, and the command prints the summary table again whenever it runs. The committed CSV is from the run on November 12, 2026, when every story address in the sitemap loaded. Expected values come from each page's own body: the h1, the byline, the badge on the contributor card, the reading time shown on the page, the hero image, the published date, the byline place, the receipts box.

What the November 12, 2026 run found (see the CSV for the stories behind each line):

1. **og:type is written twice on every story:** `website` from Webflow, then `article` from the template code. Readers that keep the first value see a website. No custom code can remove Webflow's tag; the template keeps `article` last.
2. **No twitter:image on any story.** X and others fall back to og:image, so cards still show the hero, but the tag is missing.
3. **No article:published_time, article:modified_time or article:author,** and no og:site_name or og:locale.
4. **The JSON-LD has no `timeRequired`, no publisher logo and no badge,** although every page shows a reading time and the contributor card shows a badge.
5. **Sources are not in the JSON-LD** on the stories whose receipts box names sources beyond "First-hand" (rows `ld.citation`, status `missing`).
6. **HTML entities in the raw JSON-LD** (`&#39;` mostly, also `&quot;` and `&amp;`; rows `ld.raw-entities`). Webflow escapes CMS text inside the script; `tll-ld-unescape-v1` repairs it for readers that run scripts, but a reader of the raw HTML sees "It&#39;s".
7. **dateModified in the raw HTML is the published date,** also on the one story with Last updated set (marathon-on-all-7-continents; row `ld.dateModified`, status `disagree`). This is true of the raw HTML only: the live `tll-st3-owner-edit-v1` script swaps Last updated into dateModified for readers that run scripts, Google included. The new template keeps it that way on purpose.
8. **Reading time in the CMS differs from the body by more than a minute on a few stories** (rows `reading-time vs words`, status `disagree`, stated value against the count at 200 words a minute). This is a note for the editor, not a tag gap: the audit and the template both use the CMS number.

What agreed everywhere on that run: canonical, og:url, og:image (the hero), titles and descriptions, twitter:card, and the JSON-LD headline, description, image, published date, author name and contributor page, and place.

## For the owner

1. Run `node tools/story-meta/cli.mjs webflow-template --code-only`. In the Designer, open the Stories template, Page settings, Custom code, Inside `<head>`. Replace the lines from `<meta property="og:image"` through the `tll-ld-unescape-v1` script with the printed block. Check that each token shows as a field chip; the Reading time and contributor Badge tokens are new to this template, so let the field picker settle their binding types (Number, Option). Do not use the Stories block from `prototypes/2026-11-11/schema-templates/`. Publish when ready, then run `audit --live` again.
2. Make sure every story has the required fields above, and every contributor a Badge.
3. Decide whether sources, sponsor and pillar should reach the live JSON-LD. A binding cannot skip an empty field; a small script in the template could.
4. Look at the reading-time notes in the CSV, and set Last updated on any story that has really changed.
