# 05 SEO Pro: titles, the /42tax duplicate, and the Danish contact page

## Where SEO Pro keeps its settings

| Setting | Control panel | On disk |
|---|---|---|
| Site defaults (site name, title format, default description, OG image) | SEO Pro > Site Defaults | `content/seopro/defaults.yaml` |
| Per-collection defaults (title format for insights, team, pages) | SEO Pro > Section Defaults > collection | `content/seopro/collections/<handle>.yaml` |
| Per-entry overrides (title, description, canonical, sitemap on/off) | The entry, SEO section | the `seo` key in the entry file |

## 1. Insights titles capped at 60 characters

Today an insight renders as `42TAX (en) / <full article title>`. Two things are wrong: the site name is a language code, and long article titles run past what Google shows.

**a. Fix the site name once, for every page.** SEO Pro > Site Defaults:

- Site name: `42TAX`
- Site name position: after
- Separator: `|`

The Statamic sites themselves can stay named "42TAX (en)" and "42TAX (da)" in the control panel; only what SEO Pro prints changes. Result on any page: `<Page title> | 42TAX`.

**b. Cap the insights collection.** SEO Pro > Section Defaults > What we think, Title:

```antlers
{{ title | safe_truncate:52 }}
```

`safe_truncate` cuts on a word boundary, never mid-word. 52 characters plus ` | 42TAX` (8 characters) keeps every insight at or under 60. If the developer prefers, the same value can go in `content/seopro/collections/what_we_think.yaml` as `title: '{{ title | safe_truncate:52 }}'`.

**c. Hand-write the ones that get cut.** Truncation is a safety net, not a headline. Any title over 52 characters deserves a written SEO title in the entry's SEO section. Two from the current site:

| Article title | Length with suffix | Suggested SEO title |
|---|---|---|
| How to prepare high-quality benchmark studies | 53 | Keep as is |
| Bridging the Gap: Artificial Intelligence for Tax Functions | 67 | `AI for Tax Functions: Bridging the Gap` (46 with suffix) |

The August crawl found five titles over the limit; the developer or Anja can list them from Ahrefs or from SEO Pro's own report (SEO Pro > Reports), then write the rest the same way.

## 2. `/42tax` duplicates the homepage

Google indexes `https://42tax.com/42tax` with the homepage's old title, "Transfer Pricing & Tax Advisory in Copenhagen | 42TAX". It is one of the leftover ad landing pages. Two copies of the homepage split whatever authority the site earns.

**If the page has no live ad campaign pointing at it (most likely):** redirect and remove.

1. `routes/web.php`, above other routes:

   ```php
   Route::redirect('/42tax', '/', 301);
   ```

2. Unpublish or delete the `/42tax` entry so it leaves the sitemap.
3. Check for a Danish twin at `/da/42tax` and treat it the same way.

**If a campaign still lands on it:** keep it live but tell Google which copy counts. In the entry's SEO section set **Canonical URL** to `https://42tax.com/` and switch off **Include in sitemap**. Do not do both the redirect and the canonical; the redirect makes the canonical unreachable.

Either way, clear the static cache afterwards.

## 3. The Danish contact page has an English title

The Danish contact entry (the localization of `/about/contact`) carries the English entry title "Contact", so the page renders as `42TAX (da) / Contact`. Danish visitors searching in Danish see an English title.

In the control panel, switch to the Danish site, open the contact entry, and set:

- Entry title: `Kontakt`
- SEO title: `Kontakt 42TAX i København | Transfer pricing og skat` (51 characters, within the cap)
- SEO description: `Ring på +45 9310 4242 eller skriv til contact@42tax.com. 42TAX, Bredgade 6, 1260 København K. Rådgivning i transfer pricing og international skat.` (149 characters)

The description repeats the phone, email and address already on the page, in the same form the Google Business Profile uses, which is what the schema in folder 01 needs as well.

While there: the July review found a leftover test page at `/da/contact-form`. Confirm it is gone.

## 4. One related check

The DA team slug `/da/hvem-vi-er/asger-keldstrup` spells the surname differently from the English `/who-we-are/asger-kelstrup` and from the name on the page. Renaming the Danish slug to `asger-kelstrup` with a 301 from the old slug keeps the two language versions matched and stops the misspelling appearing in search results. Low priority, five minutes.
