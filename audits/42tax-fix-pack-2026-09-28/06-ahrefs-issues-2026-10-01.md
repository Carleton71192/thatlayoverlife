# 06 Ahrefs Site Audit issues, crawl of 1 Oct 2026, mapped to Statamic

Source: "All issues" export, 42tax project, 1 Oct 2026, compared with 24 Sep. 179 issues tracked, 14 active types, 3 new. The export lists issue types and counts, not the affected URLs. Where a fix needs the URL list, it says so; get it from Ahrefs with **Export all issues**, or open the issue row and use **View affected URLs**.

Two kinds of fix. **Control panel** means Nancy can do it in Statamic today. **Code** means a template or route change for the developer.

## Do nothing

| Issue | Count | Why |
|---|---|---|
| 3XX redirect | 3 | Normal. Redirects that work are not a fault. |
| HTTP to HTTPS redirect | 2 | Normal and required. |
| Pages dropped from Top 10 | 6, new | All six dropped for the same query, the brand name "42tax": the Danish home, both contact pages, both team pages and What we've done. Google is consolidating the brand result onto the homepage and shuffling which pages show as sitelinks. Not a site fault, nothing to change. |
| Organic traffic dropped | 1, new | Same. One page; identify it in Ahrefs and see whether it is one of the five long titles. |

## Fix in the control panel

### 404 page (2), 4XX page (2), 4XX page in sitemap (2)

All three rows are the same two URLs: `/what-were-good-at` and `/da/det-er-vi-gode-til`. The full fix is in `02-sitemap-404s.md`. The control panel part, if you choose option B:

1. Pages collection, open "What we're good at". SEO tab. Switch **Include in sitemap** off. Save.
2. Switch the site selector to Danish, open "Det er vi gode til", same toggle.
3. Clear the static cache (Utilities > Cache, or ask the developer).

That clears "4XX page in sitemap". The "404 page" rows only clear when the URLs stop 404ing, which is the redirect in option B or the overview page in option A, both developer work.

### Title too long (5)

**Resolved on 2 Oct 2026 from the affected-URL export.** The site name already prints as `| 42TAX` on these pages, so cause one below is done. The five are all long article titles. Open each entry, SEO tab, Title, and paste the proposed title. Lengths include the ` | 42TAX` suffix.

| Entry | Now | Proposed SEO title | New |
|---|---|---|---|
| `/what-we-think/bridging-the-gap-why-tax-professionals-struggle-to-get-started-with-using-ai-to-support-their-tax-work` | 111 | Why Tax Professionals Struggle to Start with AI | 55 |
| `/da/det-vi-taenker/bridging-the-gap-why-tax-professionals-struggle-to-get-started-with-using-ai-to-support-their-tax-work` | 79 | Svært at komme i gang med AI i skattefunktionen | 55 |
| `/da/det-vi-taenker/hoeringssvar-paa-l194-minimumsskatteloven-ll-2-b-og-transfer-pricing-dokumentation` | 93 | Høringssvar L194: minimumsskat og TP-dokumentation | 58 |
| `/what-we-think/consultation-response-to-public-consulting-paper-on-the-oecd-guidelines-chapter-vii` | 91 | Consultation Response: OECD Guidelines Chapter VII | 58 |
| `/what-we-think/consultation-response-for-new-regulations-on-transfer-pricing-documentation-and-minimum-taxation-act` | 108 | Consultation Response: New TP Documentation Rules | 57 |

Ahrefs flags at 70 characters. Google starts cutting at about 60. Two more sit between the two limits and are worth doing in the same sitting:

| Entry | Now | Proposed SEO title | New |
|---|---|---|---|
| `/what-we-think/statistical-intervals-in-transfer-pricing-an-analysis-of-eet` (and the Danish twin) | 69 | Statistical Intervals in TP: An Analysis of EET | 55 |
| `/what-we-think/bridging-the-gap-artificial-intelligence-for-tax-functions` | 67 | AI for Tax Functions: Bridging the Gap | 46 |

The Danish proposals are suggestions for Anja to approve; the English ones keep the article's own words. The page title (H1) stays as written; only the SEO title changes.

Two causes, one fix each, kept for reference.

**Cause one, every page:** the site name prints as "42TAX (en)". SEO Pro > Site Defaults:

- Site name: `42TAX`
- Site name position: after
- Separator: `|`

That alone shortens every title on the site by about 6 characters and removes the language code.

**Cause two, long article titles:** SEO Pro > Section Defaults > the What we think collection. Title field:

```antlers
{{ title | safe_truncate:52 }}
```

Then open each of the five flagged entries (list from Ahrefs), SEO tab, and write a title of 52 characters or fewer by hand so the truncation never has to fire. The one known from search: "Bridging the Gap: Artificial Intelligence for Tax Functions" becomes `AI for Tax Functions: Bridging the Gap`.

### Meta description too short (3)

Open each of the three entries (list from Ahrefs), SEO tab, Description. Write 120 to 160 characters: what the page is about, who it is for, one reason to click. Use facts from the page itself. A pattern that fits 42TAX:

> [What the page covers] for Danish and Nordic groups. [One concrete thing a reader gets]. Senior transfer pricing advisers in Copenhagen, 42TAX.

For a What we think article, the first two sentences of the article usually work, trimmed to length. SEO Pro shows a character count under the field.

### H1 tag missing or empty (1)

Find the page in Ahrefs. Then two possibilities:

- **The entry has a title but the template does not print it as an H1.** Code fix: in that template, make sure the title renders as `<h1>{{ title }}</h1>`. Common on contact pages and listing pages where the design shows the title as a styled div.
- **The H1 is in the page builder but the field is empty.** Open the entry and fill the heading field.

Every page needs exactly one H1 and it should say what the page is about, not a slogan.

### Orphan page (2)

**Resolved on 2 Oct 2026 from the affected-URL export.** The two orphans are `/da/contact-form` (the July test page, title "Contact | 42TAX", on the Danish site) and `/42tax` (the duplicate homepage). Neither should be linked. Delete the first; redirect and unpublish the second per `05-seo-pro-titles-canonical.md`, part 2. Both are in the sitemap today and leave it once unpublished. The guidance below stays for any future orphan that is a real page.

An orphan page has no internal link pointing at it. Find the two URLs in Ahrefs, then add at least one contextual link to each from a page that already talks about the same subject. In the control panel: open the related entry, select text in the Bard editor, add link, pick the entry. If one of the two is a What we think article, link it from a related article; if it is a service page, link it from the services overview (option A in `02-sitemap-404s.md`) and from the homepage services block.

Also check whether the two orphans are leftover test pages from July (`/everything-counts-in-large-amounts` variants, `/da/det-er-vi-gode-til/ccc`, `/da/contact-form`). Those should be deleted, not linked.

## Code fixes for the developer

### X-default hreflang annotation missing (46)

**Confirmed on 2 Oct 2026 from the CSV export.** All 46 pages (23 English, 23 Danish pairs) carry both the `en` and `da` alternates and the only issue Ahrefs reports is "Missing x-default". One line in the layout fixes every page.

SEO Pro already prints the `en` and `da` alternates for each page. It does not print the `x-default` line, which tells search engines which version to show visitors whose language matches neither. For 42TAX that is the English page. Add this to the layout `<head>`, directly after `{{ seo_pro:meta }}`:

```antlers
{{# x-default hreflang: point language-agnostic visitors at the English version #}}
{{ x_default = permalink }}
{{ locales }}
  {{ if locale:handle == 'en' }}{{ x_default = permalink }}{{ /if }}
{{ /locales }}
<link rel="alternate" hreflang="x-default" href="{{ x_default }}">
```

If the Antlers runtime in use does not carry the assignment out of the `{{ locales }}` loop (older Antlers did not), use this form instead:

```antlers
{{ locales }}
  {{ if locale:handle == 'en' }}<link rel="alternate" hreflang="x-default" href="{{ permalink }}">{{ /if }}
{{ /locales }}
```

with the understanding that an entry with no English version then gets no x-default line, which is acceptable.

Confirm after deploy: view source on `/` and on `/da/`. Both should carry three `rel="alternate"` lines: `en`, `da`, `x-default`, all pointing at the English URL for x-default.

### Page has only one dofollow incoming internal link (28)

**Confirmed on 2 Oct 2026 from the affected-URL export.** All 28 are articles: the English What we think (`/what-we-think/`) and What we've done (`/what-weve-done/`) collections and their Danish twins (`/da/det-vi-taenker/`, `/da/vores-erfaring/`). Each has exactly one link in, from its listing page, plus the hreflang link from its other-language version. Nothing in any article body links to another article. So this is a template job, not a copywriting job: fix (a) below on both article templates clears all 28 at once.

Twenty-eight pages are reachable by a single link, which is almost certainly the navigation or the listing page. Two template additions fix most of it without anyone writing copy:

**a. Related articles on each What we think entry.** In the article template, after the body:

```antlers
<aside class="related" aria-labelledby="related-heading">
  <h2 id="related-heading">{{ if site:short_locale == 'da' }}Læs også{{ else }}Related{{ /if }}</h2>
  <ul>
    {{ collection:what_we_think :id:not="id" sort="date:desc" limit="3" }}
      <li><a href="{{ url }}">{{ title }}</a></li>
    {{ /collection:what_we_think }}
  </ul>
</aside>
```

Replace `what_we_think` with the real collection handle. If articles carry a tag or category field, filter on it (`:topic:is="topic"`) so the three links are genuinely related rather than just recent.

**b. Services in the footer.** The footer partial should list the four service pages and the two overview pages on every page of the site. With `{{ nav:collection:pages }}` or a hand-written list, that gives each service page about 80 incoming links instead of one.

**c. The services overview page** from option A in `02-sitemap-404s.md` adds one more link to each service page.

### Changed pages not submitted to IndexNow (1, new)

**2 Oct 2026:** the one page is `/about/privacy-policy`. No search value, no action needed; the note below explains the options if the notice should go.

IndexNow is a ping that tells Bing (and through Bing, ChatGPT's index) that a page changed. Google does not use it. Statamic has no built-in IndexNow. Two options:

- **Let Ahrefs do it.** Site Audit > project settings > IndexNow. Ahrefs gives you a key file; the developer places it in `public/` so it serves at `https://42tax.com/<key>.txt`. Ahrefs then submits changed pages after each crawl. About ten minutes, no code.
- **Ignore it.** Bing freshness on a site that changes a few times a month is a small gain. The issue stays as a notice in Ahrefs.

Recommendation: do it when the developer is already in for the other items; otherwise leave it.

## Order of work

1. Site Defaults site name (control panel, 2 minutes, fixes most long titles).
2. Sitemap toggles on the two parents (control panel, 2 minutes) plus the redirects or overview page (code).
3. Five titles and three descriptions by hand (control panel, 30 minutes, needs the URL list).
4. H1 and orphan pages (needs the URL list).
5. x-default hreflang, related articles, footer services (code, about 2 hours).
6. IndexNow key file (optional).

Then request a recrawl in Ahrefs and resubmit the sitemap in Search Console.

## Recrawl of 8 Oct 2026

79 internal URLs crawled. Health score 96, errors 4, warnings 13 (one new), notices 66. The four errors are the same two 404 URLs counted twice (404 page, 4XX page in sitemap), so the two sitemap toggles had not landed when this crawl ran. Two new warnings, both performance:

### Slow page (1, new)

Ahrefs flags a page whose HTML takes more than about three seconds to arrive. In July the homepage loaded in 7.1 seconds with unminified JavaScript and CSS, so this is the same problem resurfacing on one URL. Get the URL from the issue row, then check in this order:

1. **Is the page served from the static cache?** The site uses Statamic static caching (the July cache problem proves it). A page that is excluded from the cache, or whose cache was just cleared, renders fresh on every request. Pages with forms are often excluded because of the CSRF token. In `config/statamic/static_caching.php`, check `exclude` for the URL, and check the strategy: `half` caches in the application, `full` writes HTML files that the web server returns without touching PHP. `full` is the one that makes a Statamic page fast. If the contact page must stay excluded, the form can instead be fetched through Statamic's `{{ nocache }}` tag so the rest of the page is still cached.
2. **Images.** Any hero or team photo served at its original size. Use Glide in the template, for example `{{ glide:image width="1600" format="webp" }}`, and add `loading="lazy"` below the fold.
3. **Assets.** Confirm the production build minifies JavaScript and CSS (Vite `npm run build`, not `npm run dev`). This was the July finding and may never have been done.
4. **Third-party scripts.** Cookie Information and Tag Manager both load in the head. They should load with `defer` or `async` so they do not block the first paint. Cookie Information's script must stay first, but can still be `async`.

### Slow server response for AI crawlers (1, new)

Ahrefs re-requests pages with AI crawler user agents (GPTBot, ClaudeBot, PerplexityBot and others) and flags a slow time to first byte. Almost always the same page as the slow page above. Two things to rule out:

- The static cache serves cached HTML to every user agent. If a bot-detection or rate-limiting rule (Cloudflare, a firewall, or middleware) sends AI user agents to the uncached PHP path, they see the slow version. Check the host's bot settings and `robots.txt`; the AI crawlers should get the same cached page as everyone else.
- If the page is simply slow for everyone, fixing "Slow page" above clears this row too.

Neither warning needs copy or control panel work. Both go to the developer, with the URL from Ahrefs.
