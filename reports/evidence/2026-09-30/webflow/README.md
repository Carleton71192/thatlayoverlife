# Webflow evidence · That Layover Life · 2026-09-30

Read-only export from the Webflow MCP Data API (site id `69d6145cf421c777840c1e25`). Nothing was changed or published.
Collected by the evidence subagent (agent id `fable-5.1|claude-code|evid7q`, Webflow session `ses_3JxJ0e4t0CfR7N00ZUfLZKPGz64`).

Site facts: custom domains `www.thatlayover.life` and `thatlayover.life`; last published `2026-09-30T08:52:44Z`; timezone `Europe/Copenhagen`; one locale (English, `en`, localization not enabled); `dataCollectionEnabled: false`; no `googleTagIds` set at site level.
Pages: 74 total (list_pages), of which 22 are CMS collection templates (`detail_*`) and 52 are static pages (48 static pages returned metadata; 4 of the 52 are pages whose slug is the same as a template and were counted once). 47 static pages carry a sitemap status (the 404 utility page is excluded by the API).

## Files

| File | What it holds | Source action |
|---|---|---|
| `site.json` | Site record: domains, lastPublished, timezone, locales, data-collection flags | `data_sites_tool.get_site` |
| `site-custom-code-head.html` | Site-wide freeform head code (28,974 chars: CSS, embed-mode rules, consent/analytics loader, font links) | `data_scripts_tool.get_site_freeform_code` |
| `site-custom-code-footer.html` | Site-wide freeform footer code (25,654 chars: runtime scripts) | same |
| `registered-scripts.json` | 100 registered scripts, all hosted on `cdn.prod.website-files.com` (Webflow-hosted, first-party) | `get_registered_scripts` |
| `site-scripts.json` | 15 scripts applied site-wide (Memberstack init/skin, feedback widget, world map, ledger sync, save story, reader notes, form controls, avatar, map v3) | `get_site_scripts` |
| `pages.json` | Full `list_pages` output (74 pages, includes seo/openGraph/publishedPath) | `data_pages_tool.list_pages` |
| `pages-metadata.json` | Array of 48 static pages from `get_page_metadata`: id, title, slug, publishedPath, draft, archived, seo title/description, OG title/description/image, copied flags. `canonical` and `noindex` are not exposed by this API (see `page-code/*.head.html` for `<link rel=canonical>` and `<meta name=robots>`). | `get_page_metadata` x48 |
| `page-code/<slug>.head.html`, `page-code/<slug>.footer.html` | Per-page freeform custom code for 25 pages (see list below). Empty file = empty block. | `get_page_freeform_code` |
| `legal-pages-text/privacy.txt`, `.tree.json` | Privacy Policy page: string extraction in document order + raw element tree | `data_element_tool.get_all_elements` depth -1 |
| `legal-pages-text/terms.txt`, `.tree.json` | Terms of Service page | same |
| `legal-pages-text/cookies.txt`, `.tree.json` | Cookie Policy page | same |
| `footer.json`, `footer.txt` | "TLL Site Footer" component (id `710ff458-c06e-d602-a663-e5e88ca1456b`): raw tree + strings and hrefs | `get_all_elements` with `scope_component_id` |
| `nav.json`, `nav.txt` | "TLL Nav v1" component (id `8484ce87-193e-8ab5-fff8-590bb198f8a8`): raw tree + strings and hrefs | same |
| `forms.json` | 66 form records with field definitions (many duplicates: Webflow keeps one record per publish of the same form; e.g. 3x Signup, 3x Login, 3x Share Your Story, 3x Newsletter, 3x Edit profile, 12x Style-guide test forms). Field names only, no submission data. | `data_forms_tool.list_forms` |
| `sitemap-robots.json` | Per-page `includeInSitemap` for 47 static pages. Excluded from sitemap: editors-desk, spotlight-crew, spotlight-index, travelers-archive, share-photos, my-pets, my-passport, edit-profile, submit, account, forgot-password, signup, login, profile, style-guide. | `data_sitemap_tool.list_pages_sitemap_status` |
| `fonts.json` | Uploaded custom fonts: none (0). Google Fonts requests found in custom code (Playfair Display, IBM Plex Sans Condensed, JetBrains Mono) and font-family names referenced in CSS. | `data_fonts_tool.list_fonts` + grep of custom code |
| `home-tree.json`, `home.txt` | Home page (id `69d6145df421c777840c1e46`) full element tree + string/href extraction | `get_all_elements` depth -1 |

Text-extraction format (`*.txt`): one line per String node in document order; `[href: ...]` lines mark link targets; `[[component: ...]]` marks nested component instances; `[img: ...]`/`[src: ...]` mark image sources when present.

### Page custom code collected (page-code/)
index (home), stories, travelers, countries, contact, privacy, terms, cookies, about, support, submit, login, signup, account, edit-profile, share-photos, my-pets, 404, faq, the-paw-passport, for-expats, for-press, for-brands, editorial-charter, community-guidelines.

Requested slugs that do not exist on the site (skipped): `cookie-policy`, `legal`, `imprint`, `sign-up`. No page has a slug or title containing "legal", "imprint" or "gdpr"; the only legal-family pages are privacy, terms, cookies (plus editorial-charter and community-guidelines, whose custom code is in page-code/).

### Third-party hostnames found in site + page custom code (grep `https://`)
- `fonts.googleapis.com`, `fonts.gstatic.com` (Google Fonts)
- `cdn.jsdelivr.net` (orestbida/cookieconsent@3.1.0 CSS + UMD JS: the consent banner)
- `www.googletagmanager.com` (gtag.js, GA4 measurement id `G-T1K83PRL1R`)
- `analytics.ahrefs.com` (`analytics.js`, Ahrefs Web Analytics)
- `cdn.prod.website-files.com` (Webflow asset CDN, first-party)
- `lh3.googleusercontent.com` (Google account avatar images)
- Social/outbound link targets only (not scripts): `www.instagram.com`, `www.linkedin.com`, `twitter.com`, `www.tiktok.com`, `www.youtube.com`, `www.strava.com`, `wa.me`
- Own domains: `www.thatlayover.life`, `thatlayover.life` (canonical links; note `/for-brands` canonical points at the apex `thatlayover.life` while all other pages use `www.`)
- Registered scripts: 100/100 hosted on `cdn.prod.website-files.com` (no externally hosted registered scripts).

## Not collected
- `contact-tree.json` / `contact.txt` (contact page element tree): not fetched; the coordinator asked to wrap up before this call. Contact page custom code is in `page-code/contact.head.html`.
- `styles-summary.json` (`data_style_tool.get_styles`) and design variables (`data_variable_tool.get_variable_collections` / `get_variables`): not fetched (wrap-up request). Color values are partly visible in the custom CSS (`site-custom-code-head.html`, `page-code/*.head.html`).
- `cms-collections.json` (`data_cms_tool.get_collection_list`): not fetched (wrap-up request). Collection ids and names can be inferred from `pages.json` (`collectionId` on the 22 `detail_*` template pages).
- Form submission counts: not fetched. `list_form_submissions` returns submission records (personal data) even at limit 1, so it was skipped to respect the "counts only, no personal data" rule.
- robots.txt content and sitemap.xml settings: not exposed by the Webflow MCP API. Only per-page `includeInSitemap` is available (saved).
- Per-page canonical / noindex settings: not exposed by `get_page_metadata`; taken from page custom code instead (every collected page except 404/login/signup/share-photos sets an explicit `<link rel="canonical">`; only `/404` has `<meta name="robots" content="noindex">`).
- Google Fonts configured in the Designer (as opposed to custom code) are not exposed by the API.

## Errors
No permanent errors and no 429 rate-limit responses were encountered. Three responses exceeded the tool output limit and were saved by the harness to disk, then parsed into the files above (scripts batch, forms list, home tree).
