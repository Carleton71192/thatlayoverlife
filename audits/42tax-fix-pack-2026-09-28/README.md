# 42TAX fix pack, 28 Sep 2026

Prepared by The Brand Collective for 42tax.com (Statamic Pro + SEO Pro). Findings only: nothing in this pack has been applied to the live site. No Statamic repository was available in this session, so the pack is delivered as files for the site's developer to apply.

## Contents

| File or folder | What it covers | Owner | Effort |
|---|---|---|---|
| `00-cover-note-for-anja.md` | Plain-language summary for the client | Nancy sends | none |
| `01-schema/` | JSON-LD partials (ProfessionalService, Person, Article), a Company global set, and notes | Developer | 1 to 2 hours |
| `02-sitemap-404s.md` | The two sitemap URLs that return 404, two ways to fix them, breadcrumb snippet | Developer, Anja decides A or B | 30 min to 2 hours |
| `03-consent-banner.md` | Cookie Information: language per site, mobile size, `#coi-expand` label, where settings live | Developer + whoever holds the Cookie Information login | 1 hour |
| `04-accessibility.md` | Logo link name, `.toggle` button, contact form labels, "Read more" links | Developer | 1 to 2 hours |
| `05-seo-pro-titles-canonical.md` | Site name, insights title cap, `/42tax` redirect or canonical, Danish contact title | Anja in the control panel, developer for the redirect | 1 hour |
| `06-ahrefs-issues-2026-10-01.md` | Every issue type in the 1 Oct Ahrefs Site Audit mapped to a control panel or code fix: titles, descriptions, H1, orphans, x-default hreflang, internal links, IndexNow | Nancy in the control panel, developer for code | 3 to 4 hours |

The audit report behind this pack is at `../42tax-site-lab-2026-09-28.md`.

## Suggested order

1. 05, part 1 (site name). One setting, every page improves.
2. 02 (sitemap 404s). Clears the two crawl errors that have been open since August.
3. 01 (structured data). Needs the LinkedIn URL and a PNG logo from Anja first.
4. 03 (consent banner). Needs the Cookie Information login.
5. 04 (accessibility) and the rest of 05.

Clear the static cache after each deploy; the July cache issue meant control panel changes did not show until it was cleared.

## Facts used, and where they come from

| Fact | Source |
|---|---|
| Address: Bredgade 6, 1260 København K | Google Business Profile (per brief); Asger Kelstrup's email signature, 30 Jul 2026 |
| Phone +45 9310 4242, email contact@42tax.com, CVR 43083341 | 42tax.com contact page (Google's indexed copy) |
| Partners and titles: Asger Kelstrup, Senior Partner; Anja Kirk, Claus Agger, Carsten Dall Larsen, Partner | Team pages on 42tax.com (as indexed) and the team collage prepared for the Business Profile |
| Consent tool: Cookie Information, `data-culture="DA"`, Consent Mode v2 | Site source, recorded in the 10 Jul 2026 SEO report |
| Sitemap 404s, orphan pages, five long titles | Ahrefs Site Audit, 20 and 27 Aug 2026 |

Not known and not guessed: the LinkedIn company page URL, the team blueprint's field handles, the exact Cookie Information template in use. Each is flagged where it matters.

## Rules followed

US English in English copy. No em dashes. No invented credentials or figures. Everything the schema outputs is already on the site or the Business Profile.
