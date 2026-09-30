# EU Website Legal + Functional Audit · That Layover Life · 30 September 2026

**This is a technical compliance review, not legal advice. Items tagged NEEDS COUNSEL should be confirmed by a qualified lawyer.**

## 1. Header

| | |
|---|---|
| Site | That Layover Life (TLL) |
| Live URL | https://www.thatlayover.life (apex thatlayover.life redirects; Webflow subdomain that-layover-life.webflow.io) |
| Platform | Webflow (site 69d6145cf421c777840c1e25), Memberstack 2021-01-07 API for accounts, Cloudflare Worker (tll-travel-wire) for the Travel Wire feed and profile sync |
| Legal entity | Nancy Carleton, operating as a sole person ("operated by Nancy Carleton, an independent American expat based in Copenhagen"), per /privacy and /terms. Handoff notes say paid work is invoiced by The Brand Collective. **Inferred, confirm.** |
| Registration no. (CVR) | Not shown anywhere on the site. Unknown whether one exists. **NEEDS OWNER CONFIRMATION.** |
| VAT no. | Not shown. The Paw guide price line says "INCL. 25% MOMS", which implies VAT registration for that product. **NEEDS OWNER CONFIRMATION.** |
| Registered address | Only "Copenhagen, Denmark" on the site. No street address. |
| Country of establishment | Denmark |
| Audience | B2C (readers, contributors, members). B2B only for /for-brands. |
| What the site does | Content, contact and submission forms, newsletter signup, free membership with login (Memberstack, email or Google), user-generated content (stories, photos, reader notes, expat group listings, award nominations), AI-assisted first read of submissions (disclosed in /terms). No checkout: the Paw guide sale points to Ko-fi and is still "Coming soon". No chatbot. |
| Company size | Under 10 staff and well under EUR 2M turnover (one operator, pre-launch). **Inferred, confirm.** |
| Known third parties | Memberstack, Webflow, Google Analytics 4 (G-T1K83PRL1R), Ahrefs Web Analytics, Google Fonts, jsDelivr CDN (CookieConsent, d3, topojson, world-atlas), Google Sign-In via Memberstack, Google Drive image host (founder avatar), Cloudflare Workers, Ko-fi (planned), Substack (named in privacy policy draft, not in code) |
| Cookie banner tool | orestbida CookieConsent v3.1.0 (self-configured, loaded from jsDelivr) |
| Test mode available | Not needed: no payments on site |
| Owner for fixes | Nancy Carleton |

### What was tested, and how
The audit container cannot reach the live site (the environment's network policy blocks www.thatlayover.life, awwwards.com, Ahrefs and PageSpeed Insights is over its daily quota). Ahrefs Site Audit returned "Insufficient plan". So this run is a **desk audit of the source of truth behind the live site**: the Webflow site and page custom code, the registered scripts, every page's SEO and Open Graph settings, the element trees of the legal pages, footer, nav, signup, newsletter and account pages, the forms list, the Memberstack app configuration, the repo's Worker source and the v8 handoff. The site was last published on 30 September 2026 at 08:52 UTC, so the code read here is what is live, except where a page or section is marked unpublished.

**Not tested (NOT VERIFIED):** the Phase 1 consent test in a real browser (cookies, localStorage and network requests in no-interaction, reject-all and accept-all modes), status codes and redirect chains, the 404 status code, TLS, HSTS and security headers, SPF/DKIM/DMARC, domain expiry, Core Web Vitals, console errors, axe-core and Lighthouse runs, rendering at 375/768/1440, and anything on the Webflow subdomain. Evidence for those needs a run from a machine that can reach the site. The fastest way: allow www.thatlayover.life (and thatlayover.life) in this environment's network settings, then rerun this prompt.

Evidence folder: `reports/evidence/2026-09-30/` (webflow/, webflow-site/, memberstack/, brand/, prototype-screens/).

## 2. Scorecard

| Area | Result | Issues |
|---|---|---|
| 2.1 Company identification | FAIL | 3 (no legal form/CVR/street address; contact page says "CVR on the way") |
| 2.2 Cookies and tracking | PARTIAL | 5 (GA4 gated correctly; Ahrefs, Google Fonts and a Google-hosted image load before any choice; no per-cookie declaration; privacy page still points at Cookiebot) |
| 2.3 Privacy and GDPR | PARTIAL | 7 (policy exists and is linked everywhere; gaps on legal basis per purpose, transfer mechanism wording, retention, a processor list that does not match the code, newsletter consent, microchip wording) |
| 2.4 Consumer law | NOT APPLICABLE today, 2 forward-looking notes (Paw guide via Ko-fi, ODR wording absent: good) |
| 2.5 Accessibility | PARTIAL, NOT VERIFIED in a browser | 3 (no accessibility statement; skip link and focus ring exist in code; contrast issues known from the design work) |
| 2.6 AI transparency | PASS with 1 note (AI-assisted first read disclosed; keep the "written by humans, not AI chatbots" claims out of marketing as the brand kit already rules) |
| 2.7 Platform and content duties (DSA) | PARTIAL | 2 (report links exist per story and profile; no single notice-and-action page or point of contact statement) |
| 2.8 Other legal flags | PARTIAL | 3 (Google Drive image host, founder stats claims, legal pages in English only: fine) |
| Phase 3 Functionality | PARTIAL, mostly NOT VERIFIED | 6 verified from source (newsletter form GET, hardcoded counts, duplicate GA4 property, orphan draft pages in sitemap flag, 404 noindex present, missing OG images on 8 live pages) |

## 3. Top 5 fixes (legal risk first, then user impact)

1. **Put the imprint on the site.** Legal name and form (or "sole proprietor / enkeltmandsvirksomhed"), street address, email and CVR (if registered; if not, say so is not required but the address is). Footer line plus the /privacy "Who runs this thing" block. E-Commerce Directive Art. 5 and the Danish E-handelsloven §7 make this mandatory for a service provider established in Denmark, and the contact page already promises it ("full imprint and CVR on the way"). FIX + NEEDS OWNER CONFIRMATION (which entity: Nancy Carleton personally or The Brand Collective).
2. **Stop the pre-consent third-party requests.** Ahrefs Web Analytics loads on every page before any choice, Google Fonts are pulled from fonts.googleapis.com and fonts.gstatic.com, and the founder avatar is served from lh3.googleusercontent.com. All three send every visitor's IP to a third party before the banner is answered. Self-host the two font families and the avatar (Webflow assets), and either gate Ahrefs under the analytics category or keep it and document the cookieless basis (NEEDS COUNSEL: Erhvervsstyrelsen treats access to the device as the trigger, not cookies as such).
3. **Make the privacy policy match the code.** Remove "Cookiebot" (the link `javascript:Cookiebot.show();` is dead in raw HTML and is only patched by script at runtime), list Ahrefs, jsDelivr, Cloudflare (Worker) and Google Fonts, state the legal basis per purpose, give a retention period per category, and name the transfer mechanism per US processor. Also remove "microchip number" (brand rule A09) and update the date.
4. **Newsletter consent.** The /newsletter form is a plain Webflow form (method GET) with no consent sentence, no privacy link and no double opt-in. Under Markedsføringsloven §10 email marketing needs prior consent; a bare email field is thin. Add the consent line, a privacy link and switch to a double opt-in provider (the open Notion task to move newsletter forms to Substack covers this).
5. **Cookie declaration table.** The /cookies page and the preferences modal list categories only. Add a table with each cookie or storage key, provider, purpose and duration (the design's "Every cookie, who sets it, why, and for how long" promise). Needs one browser run to capture the real names.

## 4. Findings table

Severity: Critical = tracking before consent, missing company ID, personal data over HTTP, broken primary form. Tag: FIX (draft ready below), NEEDS COUNSEL, NEEDS OWNER CONFIRMATION.

| ID | Area | Sev | Page | What is wrong | Evidence | Rule | Suggested fix | Effort | Tag |
|---|---|---|---|---|---|---|---|---|---|
| L01 | 2.1 | Critical | every page (footer), /privacy, /terms, /contact | No legal name with form, no street address, no CVR. Footer says "© 2026 That Layover Life · Copenhagen, Denmark". Privacy says "operated by Nancy Carleton". Contact says "full imprint and CVR on the way (counsel pending)". | webflow/footer.txt, webflow/legal-pages-text/privacy.txt, handoff/screens/27-contact.html | ECD Art. 5(1)(a) to (g); E-handelsloven §7 | Add imprint block (draft F1) to footer and /privacy §1 | S | FIX + NEEDS OWNER CONFIRMATION |
| L02 | 2.1 | High | /privacy vs /for-brands | The entity named in the policy (Nancy Carleton) differs from the invoicing entity named in the handoff for brand work (The Brand Collective). Terms must name one contracting party. | handoff/CHANGES.md line 19; privacy.txt §1 | ECD Art. 5; GDPR Art. 13(1)(a) controller identity | Decide the controller and contracting entity; use the same name in footer, privacy, terms, for-brands | S | NEEDS OWNER CONFIRMATION |
| L03 | 2.1 | Medium | /terms | Terms name Danish law for content but have no governing-law and venue clause and no ADR statement. | terms.txt | Consumer ADR Directive 2013/11/EU Art. 13 (where applicable); good practice | Add "Governing law: Denmark. Disputes: Danish courts; consumers may also use Forbrugerklagenævnet / Nævnenes Hus where the claim qualifies" | S | NEEDS COUNSEL |
| L04 | 2.2 | High | every page | Ahrefs Web Analytics (`analytics.ahrefs.com/analytics.js`) loads unconditionally in the site head. Even if cookieless, it is a third-party request that transmits IP and user agent before consent. | webflow-site/site-head.html line with `data-key="hbUjDXMWTy6UXwJhDa47gw"`; third-party-inventory-from-code.md | ePrivacy Art. 5(3); Cookiebekendtgørelsen §3; GDPR Art. 6 | Move the tag inside `type="text/plain" data-category="analytics"` so it runs only after consent (draft F2), or document the cookieless legitimate-interest basis and keep it | S | FIX (NEEDS COUNSEL on the alternative) |
| L05 | 2.2 | High | every page | Google Fonts loaded from Google's servers (`fonts.googleapis.com/css2?family=Playfair+Display…` plus `@font-face` src on `fonts.gstatic.com`). Visitor IPs go to Google on every page load with no consent. LG München I (3 O 17493/20) awarded damages for exactly this. | site-head.html (`<link rel="stylesheet" href="https://fonts.googleapis.com/…">`, tll-proto-parity-v1 block) | GDPR Art. 6, 44; ePrivacy Art. 5(3) | Self-host Playfair Display 800 (regular + italic), JetBrains Mono 400/600 and IBM Plex Sans Condensed as Webflow custom fonts; replace the link and the `@font-face` aliases (draft F3) | M | FIX |
| L06 | 2.2 | Medium | every page (footer script tll-core-v2) | Founder avatar is fetched from `lh3.googleusercontent.com/d/1sbjvhec…` (Google Drive). Same IP-transfer issue, and Drive links can break. | site-footer.html, string `var AV='https://lh3.googleusercontent.com/…'` | GDPR Art. 6, 44 | Upload the photo to Webflow assets and point AV at the asset URL | S | FIX |
| L07 | 2.2 | Medium | /cookies, preferences modal | No per-cookie declaration (name, provider, purpose, duration). The page promises it ("Every cookie, who sets it, why, and for how long"). The modal has two categories with one sentence each. | legal-pages-text/cookies.txt; site-footer.html CookieConsent.run config | Cookiebekendtgørelsen §3(2); EDPB Guidelines 05/2020 | Add a table (draft F4) once a browser run has captured the real cookie names (Memberstack session, cc_cookie, _ga, _ga_T1K83PRL1R) | S | FIX after verification |
| L08 | 2.2 | Medium | /privacy §3 | Link text "Cookie Preferences" has href `javascript:Cookiebot.show();`. Cookiebot is not installed; a site script rewrites such links at runtime, so it works in a browser but is broken for crawlers, noscript and the raw page. Also the policy says "CookieConsent, an open-source tool" in one sentence and Cookiebot in the next. | privacy.txt; site-footer.html "wire()" script | Consistency; GDPR Art. 7(3) withdrawal as easy as consent | Change the href to `#` with `data-tll-cookie-prefs="1"` and drop the Cookiebot name (draft F5) | S | FIX |
| L09 | 2.2 | Low | every page | Consent banner: Accept all and Reject all sit on the same first layer with equal weight, no pre-ticked boxes, Analytics off by default, Necessary read-only, preferences reachable from the footer link. Good. The banner copy names only "Google Analytics" while Ahrefs also runs. | site-footer.html CookieConsent.run; footer.txt "Cookie preferences" | ePrivacy Art. 5(3) | Mention Ahrefs in the analytics section text if it stays ungated | S | FIX |
| L10 | 2.2 | Info | every page | `dataCollectionEnabled` is false on the Webflow site, `googleTagIds` empty: Webflow's own analytics and its native GA hook are off. Only the custom gtag runs, and it is gated. GA4 IP anonymization is default in GA4; the policy claims it. | webflow/site.json | | none | | PASS |
| L11 | 2.3 | High | /privacy §4 | Processor list does not match the code. Listed: Memberstack, Webflow, GA4, CookieConsent, Google Sign-In. In code but not listed: Ahrefs Web Analytics (named in §2 only), jsDelivr (Fastly) CDN, Google Fonts, Google Drive (image host), Cloudflare Workers (travel wire, profile sync). Design draft also names Substack and "Cookiebot". | privacy.txt; third-party-inventory-from-code.md; wrangler.toml | GDPR Art. 13(1)(e), 28 | Rewrite §4 (draft F6) | S | FIX |
| L12 | 2.3 | High | /privacy §2 | Purposes are described but the legal basis per purpose is not stated (contract for the account, consent for analytics, legitimate interest for security logs and the Worker cache). | privacy.txt §2 | GDPR Art. 13(1)(c), (d) | Add a legal-basis line per block (draft F6) | S | FIX |
| L13 | 2.3 | High | /privacy §9 | Transfer wording is internally contradictory: "covered by Standard Contractual Clauses (SCCs) per the EU-US Data Privacy Framework". These are two different mechanisms. Name the mechanism per recipient (Memberstack, Google, Ahrefs (Singapore), Cloudflare, Webflow). | privacy.txt §9 | GDPR Art. 13(1)(f), 44 to 49 | Draft F6 §9 | S | FIX + NEEDS OWNER CONFIRMATION (which vendors are DPF-certified today) |
| L14 | 2.3 | Medium | /privacy | Retention: only GA (14 months) and deletion (30/90 days) are stated. No retention for form submissions (Webflow form inbox keeps them indefinitely), reader notes, expat group listings, award nominations, Worker KV. | privacy.txt; forms.json | GDPR Art. 13(2)(a) | Add a retention table (draft F6 §2b) | S | FIX |
| L15 | 2.3 | Medium | /privacy §2 | "Pet records (name, species, microchip number if you choose…)" conflicts with the brand rule that the word "microchip" stays out of UI and marketing (A09), and the field is no longer shown on the pet forms. | privacy.txt; handoff/STATUS.md A09 | Accuracy (Art. 5(1)(d)); brand rule | Replace with "Pet records (name, species, and the details you choose to add, stored privately)" | S | FIX |
| L16 | 2.3 | Medium | /newsletter | Newsletter signup has no consent sentence, no privacy link near submit, no double opt-in, and the form posts with method GET to the Webflow inbox (email appears in the request URL and server logs). | webflow-site/forms-signup-newsletter-account-notes.md; forms.json "Email Form" | Markedsføringsloven §10; GDPR Art. 7, 13; Art. 32 | Draft F7: method POST, consent line, privacy link; route to a double opt-in provider | S | FIX |
| L17 | 2.3 | Medium | /signup | Consent is one required checkbox that bundles Terms, Editorial Charter and Privacy Policy. Acknowledging a privacy policy is not consent and does not need a checkbox; bundling is acceptable for terms acceptance but not for any marketing. There is no marketing checkbox (good). Age gate "I am 16 or older" present. | forms-signup-newsletter-account-notes.md | GDPR Art. 7(2), 8 (Denmark: 13 for information society services, site chose 16, fine) | Reword to "I accept the Terms of Service and the Editorial Charter. I have read the Privacy Policy." | S | FIX (optional) |
| L18 | 2.3 | Medium | /account, Memberstack | Policy and terms promise self-serve deletion ("/account → Settings → Delete Account", "deleted within 30 days"). The Account page has a "Delete account" button, but Memberstack `allowMemberSelfDelete` is false, so the button's behavior is unverified. Export is by email within one month (fine). | memberstack/app-config-summary.md; account page strings | GDPR Art. 17, 12(3) | Verify the button in a browser; either enable self-delete in Memberstack or change the copy to "email us and it is done within 30 days" | S | NEEDS OWNER CONFIRMATION |
| L19 | 2.3 | Medium | Memberstack | Memberstack app has `privacyPolicyURL` and `termsOfServiceURL` empty, `businessEntityName` empty, captcha off. Its AI-generated business tagline says "Real travel stories written by real humans, not AI chatbots", which the brand kit and A03 ban from marketing. These fields feed Memberstack's hosted emails and modals. | memberstack/app-config-summary.md | Consistency; A03 | Set the two URLs, the entity name, and replace the tagline with "a travel storytelling platform" wording | S | FIX (owner does it in the Memberstack dashboard) |
| L20 | 2.3 | Medium | /submit, /share-photos, /my-pets, /edit-profile, /for-expats, /for-press, /awards | Forms collect appropriate fields, but no privacy line near the submit button on the Webflow forms (Expat group listing, Press trip, Location Expert application, Award nomination, Link-out story). The expat group form collects a third party's email ("Your email, never shown") which is fine. | forms.json; page trees | GDPR Art. 13 at point of collection | Add one line under each submit: "Sent to hello@thatlayover.life. Kept until reviewed, then 12 months. Privacy policy." | S | FIX |
| L21 | 2.3 | Info | every page | HTTPS: Webflow hosting forces TLS; forms post over HTTPS. Not verified from here (headers, HSTS). | | GDPR Art. 32 | Verify in the live run | | NOT VERIFIED |
| L22 | 2.3 | Info | processors | DPAs needed with: Webflow (hosting, forms, CMS), Memberstack (accounts), Google (GA4, Sign-In, Fonts if kept), Ahrefs (analytics), Cloudflare (Workers, KV), Fastly/jsDelivr (CDN, no personal data beyond IP), Ko-fi (when live), Substack (if used). | third-party-inventory-from-code.md | GDPR Art. 28 | Confirm each DPA is accepted (most are click-through in the vendor terms) | S | NEEDS OWNER CONFIRMATION |
| L23 | 2.4 | Info | /the-paw-passport | Paw guide sale ("€9 · PDF · V1.0 · INCL. 25% MOMS", Ko-fi button disabled, "Coming soon"). When it goes live via Ko-fi, the consumer-law pre-contract items (total price incl. VAT, right of withdrawal and its digital-content waiver, complaint route, ADR statement) must appear on the page or the Ko-fi listing. Regulation (EU) 2026/131 citation is on the page; its number is not verified (open Notion task). | Paw hub element tree | CRD 2011/83/EU Arts. 6, 16(m); Prisoplysning | Add a "Buying the guide" fine-print line before launch | S | NEEDS COUNSEL (later) |
| L24 | 2.4 | Pass | site | No link to the EU ODR platform anywhere (good, it was discontinued 20 July 2025). No reviews, no discounts, no geo-blocking. Sponsored and affiliate labeling mechanism now exists on the story template (Reklame / Reklamelink / Annonce, staged 30 Sep). | story template head; grep of site code | Omnibus; Markedsføringsloven §6 | none | | PASS |
| L25 | 2.5 | Medium | site | No accessibility statement page. If the microenterprise exemption applies (fewer than 10 staff, under EUR 2M), the EAA does not require one for services, but WCAG remains the quality bar and the site is pre-launch. | pages.json (no such page) | EAA 2019/882 Art. 4(5); Danish lov nr 801/2022 | Add a short /accessibility page (draft F8) | S | NEEDS COUNSEL on scope, FIX for the page |
| L26 | 2.5 | Info | site | In code: skip link, 3px focus ring, 44px touch targets, reduced-motion switch (tll-a11y-motion-v1), Deep Teal for text on light. Known open contrast issue: white on Rose #F0507A is 3.42:1 (Notion task). Alt text, keyboard order, contrast, headings and form errors need a browser run with axe-core. | site-footer.html; Notion task "Decide Rose button shade" | WCAG 2.1 AA | Run axe on home, story, stories, travelers, paw, signup, submit | M | NOT VERIFIED |
| L27 | 2.5 | Low | site head | `lang` attribute: primary locale is English (tag en). Danish disclosure labels carry `lang="da"` in the new labeling script. Fine. | site.json locales; story head tll-label-js-v1 | WCAG 3.1.1, 3.1.2 | none | | PASS |
| L28 | 2.6 | Pass | /terms §3 | Editorial review discloses "an AI-assisted first read" with a human decision within 48 hours. No chatbot on the site. No AI-generated imagery is used (brand rule: real photography only; not verifiable image by image). | terms.txt | AI Act Art. 50 | Keep. Confirm no AI-generated images in the Lounge (owner) | | PASS + NEEDS OWNER CONFIRMATION |
| L29 | 2.6 | Low | Memberstack profile, marketing | Claims of "written by real humans, not AI chatbots" are banned by the brand kit (A03) and can mislead if any AI editing is used; the terms already say AI is used for first read and light editing. | memberstack/app-config-summary.md | Markedsføringsloven §5 (misleading); brand rule | Replace with the descriptor "a travel storytelling platform" | S | FIX (owner) |
| L30 | 2.7 | Medium | site | User content (stories, photos, reader notes, group listings) makes TLL a hosting service under the DSA. "Report this profile" and "Report this story" mailto links exist on the new templates, and the Community Guidelines describe removal and appeal ("Contest a decision, reply within 7 days"). Missing: a single named point of contact for authorities and users (Art. 11, 12) and a stated notice-and-action route in the terms (Art. 16). | community-guidelines (design 24), profile template, story template | DSA Arts. 11, 12, 14, 16 | Add a "Reporting illegal content" section to /community-guidelines naming hello@thatlayover.life as the point of contact and the steps (draft F9) | S | FIX + NEEDS COUNSEL (micro/small exemptions cover Arts. 15, 20 to 24, not 11 to 16) |
| L31 | 2.8 | Low | home, /the-paw-passport, /signup | Stats: footer "6 stories · 87 countries · 1 traveler · 1 pet" and signup "1 · 9 · 6 · 1" are static strings, not bound. Not misleading today, but they drift. | footer.txt; signup tree | Markedsføringsloven §5; brand rule "numbers live in one place" | Bind to the counts script (existing REQUIREMENTS row) | M | FIX (build) |
| L32 | 2.8 | Low | images | Founder photo hosted on Google Drive; Lounge tiles and story photos are Nancy's own per the charter. No stock photography per brand rule. Licensing of the circle flags (handoff/circle-flags, MIT per its README) fine. | site-footer.html; handoff/circle-flags/README.md | Copyright | Confirm each Lounge tile credit | S | NEEDS OWNER CONFIRMATION |
| L33 | 2.8 | Info | legal pages | Site is English only; legal pages in English only. Consistent. | site.json | | none | | PASS |
| F01 | Phase 3 | High | /newsletter | Form method GET (email in query string), no destination beyond the Webflow inbox. | forms.json, newsletter tree | | Draft F7 | S | FIX |
| F02 | Phase 3 | Low | sitemap, canonicals | The four draft directory pages (/expats, /creators, /press, /press-trips) are flagged `includeInSitemap: true`; drafts do not publish, but the flag exposes them the moment Draft is unticked before review. The utility and member pages (editors-desk, style-guide, travelers-archive, spotlight-crew, spotlight-index, account, edit-profile, my-pets, my-passport, submit, share-photos, login, signup, forgot-password, profile) are correctly excluded. /for-brands sets its canonical on the apex domain while every other page uses www. | webflow/sitemap-robots.json; page-code/for-brands.head.html | Indexing hygiene | Untick sitemap on the four drafts until reviewed; change the /for-brands canonical to https://www.thatlayover.life/for-brands | S | FIX |
| F03 | Phase 3 | Medium | 8 live pages | Open Graph image missing on /404, /account, /awards, /edit-profile, /for-brands, /forgot-password, /login, /signup (share cards fall back to nothing). /cookies has no OG title or description. /editors-desk has a 13-character SEO title and no description. | pages-metadata.json | Basics | Set OG image to the site share image; write the two missing descriptions | S | FIX (bucket 1, API) |
| F04 | Phase 3 | Medium | GA4 | Two GA4 properties exist for TLL (open Notion task "Tidy duplicate GA4 properties"); the code sends to G-T1K83PRL1R only. | Notion; site-head.html | Analytics accuracy | Retire the unused property | S | NEEDS OWNER CONFIRMATION |
| F05 | Phase 3 | Info | /404 | 404 page has `<meta name="robots" content="noindex">` in its head code and the design copy "This page missed its connection." Whether it returns HTTP 404 is Webflow default (yes) but NOT VERIFIED. | page-code/404.head.html | Basics | Verify status in the live run | | NOT VERIFIED |
| F06 | Phase 3 | Info | site scripts | 15 registered scripts applied at site level (Webflow's cap) plus about 100 registered but unapplied versions (tll_page_patch_v1 to v11, tll_perf_polish_v1 to v7, and so on). Not a legal issue; it is technical debt that makes the consent inventory harder to keep accurate. | webflow/registered-scripts.json | Maintainability | Delete unapplied registered scripts in a cleanup session | M | FIX (later) |
| F07 | Phase 3 | Info | mobile performance | Notion records mobile LCP of 17.3 s from an earlier PageSpeed run ("Phase 1b mobile speed" task, waiting on approval). Not re-measured today (quota). | Notion task | CWV | Approve the Phase 1b batch (hero preload, fonts, slim cookie bar, WebP); self-hosting fonts (L05) helps here too | M | NOT VERIFIED |
| F08 | Phase 3 | Info | infrastructure | TLS, HSTS, CSP and other headers, SPF/DKIM/DMARC for thatlayover.life, domain expiry: not reachable from here. Webflow sets HSTS when "Enable SSL" and "HSTS" are on in Hosting settings; check the toggle. Email sending for hello@ (Google Workspace?) needs SPF, DKIM and DMARC records at the registrar (the Notion archive mentions GoDaddy DNS). | | Security basics | Run `dig TXT thatlayover.life`, `dig TXT _dmarc.thatlayover.life`, and `curl -I` from a machine with access | S | NOT VERIFIED |

## 5. Third-party inventory

| Vendor / host | What it does | When it loads | Disclosed in privacy policy | Disclosed in cookie page/modal |
|---|---|---|---|---|
| Webflow (cdn.prod.website-files.com, hosting, forms, CMS) | Hosting, assets, form inbox | Always | Yes (§4) | Implied (Necessary) |
| Memberstack (static.memberstack.com) | Accounts, login session, member data, reader notes table | Always | Yes | Yes (Necessary: login session) |
| Google Analytics 4 (www.googletagmanager.com, G-T1K83PRL1R) | Analytics | After analytics consent only (`type="text/plain" data-category="analytics"`) | Yes | Yes |
| Ahrefs Web Analytics (analytics.ahrefs.com) | Cookieless page-view counting | Always, before consent | Yes (§2 sentence, not in §4 list) | Yes (cookies page says it "runs without a banner choice") |
| Google Fonts (fonts.googleapis.com, fonts.gstatic.com) | Playfair Display, JetBrains Mono, IBM Plex Sans Condensed | Always, before consent | No | No |
| jsDelivr / Fastly (cdn.jsdelivr.net) | CookieConsent v3.1.0, d3, topojson, world-atlas JSON | Always (map libs only on map pages) | No | No |
| Google Drive image host (lh3.googleusercontent.com) | Founder avatar image | Always (wherever the avatar is swapped in) | No | No |
| Google Sign-In (via Memberstack) | OAuth login | Only on click | Yes | n/a |
| Cloudflare Workers (tll-travel-wire.thatlayoverlife.workers.dev, KV) | Travel Wire feed, story and profile sync hooks | On /travel-wire fetch and on webhooks (server side) | No | No |
| LinkedIn, X share intents | Share links | Only on click | No (not needed) | n/a |
| Ko-fi | Paw guide and Layover Club payments | Not live (buttons disabled) | No (add before launch) | n/a |
| Substack | Newsletter (planned per design and Notion) | Not in code | Named in the design draft only | n/a |
| Cloudflare Turnstile | Form spam guard (per Notion "Turnstile is live on TLL") | NOT VERIFIED in the code read (not found in site head or footer; may sit in page embeds) | No | No |

## 6. Draft fixes (for approval, not applied)

**F1 · Imprint block** (footer, under the copyright line, and /privacy §1). Owner fills the brackets.

```
That Layover Life is published by [Nancy Carleton, sole proprietor | The Brand Collective ApS], [Street and number], [Postcode] Copenhagen, Denmark. CVR [xxxxxxxx]. Email hello@thatlayover.life. Responsible editor: Nancy Carleton.
```
Privacy §1 "Who runs this thing": replace "Business location: Copenhagen, Denmark" with the same address line, and add "Registration: CVR [xxxxxxxx]" (or "Not VAT registered" if that is the case).

**F2 · Gate Ahrefs under the analytics category** (site head, replace the two Ahrefs lines):

```html
<!-- Ahrefs Web Analytics (runs after analytics consent) -->
<script type="text/plain" data-category="analytics" src="https://analytics.ahrefs.com/analytics.js" data-key="hbUjDXMWTy6UXwJhDa47gw" async></script>
```
Alternative if it stays ungated (NEEDS COUNSEL): keep the tag and add to the cookie page: "Ahrefs Web Analytics counts page views without cookies or device storage. It receives your IP address and browser type for the request only and does not keep an identifier."

**F3 · Self-host fonts** (M effort). Upload woff2 files for Playfair Display 800 (normal, italic), JetBrains Mono 400 and 600, IBM Plex Sans Condensed 400, 500, 600 via Webflow Site settings, Fonts, Custom fonts. Then remove from the site head: the `<link rel="preconnect" href="https://fonts.gstatic.com">`, the `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?…">`, and the four `@font-face{font-family:'DM Sans'…src:url(https://fonts.gstatic.com/…)}` aliases in `tll-proto-parity-v1`, replacing the aliases with `src:url(<webflow asset url>)`. Also change the 404 page head, which links Google Fonts on its own.

**F4 · Cookie declaration table** (/cookies, after the four categories; names to be confirmed by a browser run):

```
| Name | Set by | Category | Purpose | Duration |
| cc_cookie | CookieConsent (this site) | Necessary | Stores your consent choice | 182 days |
| _ms-mid, _ms-mem (Memberstack) | Memberstack | Necessary | Keeps you logged in | Session / 14 days |
| _ga | Google Analytics | Statistics | Distinguishes visitors | 2 years |
| _ga_T1K83PRL1R | Google Analytics | Statistics | Keeps session state | 2 years |
| localStorage: tllPlaces, tllRelaySent, saved shelf keys | This site | Preferences | Your map picks, relay limits, saved stories | Until you clear your browser |
```

**F5 · Privacy §3 link** (element on /privacy): change the link href from `javascript:Cookiebot.show();` to `#` and add the attribute `data-tll-cookie-prefs="1"`; change the sentence to "You can change your cookie choices anytime by clicking Cookie preferences in the footer. The banner is CookieConsent, an open-source tool that runs on this site."

**F6 · Privacy policy rewrite of §2, §4, §9 and a new retention table** (draft; counsel to confirm):

§2 add one line per block:
- Visiting: "Legal basis: consent for analytics cookies (GDPR Art. 6(1)(a)); legitimate interest for security logs and the cookieless page-view count (Art. 6(1)(f))."
- Account: "Legal basis: performance of the membership agreement (Art. 6(1)(b))."
- Submissions and forms: "Legal basis: performance of the agreement to publish your story (Art. 6(1)(b)) and, for optional fields, consent (Art. 6(1)(a))."
- Pet records: replace the microchip sentence with "Pet records (name, species and the details you choose to add), stored privately."

§2b Retention (new):
```
Account data: while your account exists, then deleted within 30 days (backups within 90 days).
Stories and photos: while published; removed within 14 days of your request.
Form submissions (contact relay, group listings, press trips, applications, award nominations): until reviewed, then at most 12 months.
Reader notes: while the story is published.
Analytics (GA4): 14 months.
Travel Wire feed cache: 30 days, contains no personal data.
```

§4 processors (replace the list):
```
Webflow (US): hosting, CMS, form inbox. EU-US Data Privacy Framework.
Memberstack (US): accounts, login, member fields, reader notes. [DPF or SCCs: confirm]
Google (US): Analytics 4 (only with consent), Sign-In (only when you choose it). DPF.
Ahrefs (Singapore): cookieless page-view counting. SCCs.
Cloudflare (US): Workers and storage for the Travel Wire feed and profile sync. DPF.
jsDelivr / Fastly (US): script delivery for the consent banner and the map. Receives your IP for the request only.
Ko-fi (UK): guide and club payments, when live. UK adequacy decision.
```

§9 replace with: "TLL is operated from Copenhagen. Some processors are in the US and Singapore. For each one we rely on the mechanism named in the list above (EU-US Data Privacy Framework certification or Standard Contractual Clauses). You can ask for a copy of the safeguards at hello@thatlayover.life."

Also: update "Effective / Last updated" to the publish date, and add a line "Supervisory authority: Datatilsynet, Carl Jacobsens Vej 35, 2500 Valby, dt@datatilsynet.dk".

**F7 · Newsletter form** (/newsletter): set the form method to POST; add under the field: "By joining you agree to receive the TLL newsletter by email. You can unsubscribe in every issue. Privacy policy." (link to /privacy); change the success message to "Check your inbox. One click to confirm, then the first dispatch lands." once a double opt-in provider (Substack or Resend) is wired. Until then the honest success copy is: "Got it. You will get a confirmation email before anything else."

**F8 · Accessibility statement** (/accessibility, draft page, 680px container):
```
Accessibility
We want every traveler to read TLL. The site is built to WCAG 2.1 AA: keyboard navigation with a visible focus ring, a skip link, 44px touch targets, text contrast of 4.5:1 or better on light and dark surfaces, and no motion for people who switch it off.
Known gaps: [filled from the axe-core run].
If something is in your way, email hello@thatlayover.life with the page address. A human replies within 7 days.
Last checked: [date].
```

**F9 · Reporting illegal content** (section on /community-guidelines):
```
Reporting illegal content
If you believe a story, photo, note or profile on TLL is illegal or breaks these guidelines, email hello@thatlayover.life with the page address, what is wrong and, if it concerns you, your name. This address is TLL's point of contact for readers and authorities. We confirm receipt, review it, tell you the outcome with reasons, and you can contest the decision. Removed content stays removed while an appeal is read.
```

## 7. Changes since last audit
No previous report exists in `reports/`. This is the baseline. Earlier findings live in Notion (Master To-Do List): the cookie preferences link fix, the empty footer components, the Breadcrumb structured-data error, the mobile LCP of 17.3 s, and the duplicate GA4 properties. Of those, the cookie link is fixed at runtime but not at source (L08), and the footer is now a real component (fixed).

## 8. Sources

None of these pages could be re-fetched from the audit container on 30 September 2026 (outbound web access is blocked), so citations are to the official texts as known to the auditor and should be re-checked by counsel.

- Directive 2000/31/EC (E-Commerce Directive), Art. 5: https://eur-lex.europa.eu/eli/dir/2000/31/oj
- Danish E-handelsloven, §7 (oplysningspligt): https://www.retsinformation.dk/eli/lta/2002/227
- Directive 2002/58/EC (ePrivacy), Art. 5(3): https://eur-lex.europa.eu/eli/dir/2002/58/oj
- Danish Cookiebekendtgørelsen (BEK nr 1148 af 09/12/2011) and Erhvervsstyrelsen guidance: https://erhvervsstyrelsen.dk/cookies-og-samtykke
- Regulation (EU) 2016/679 (GDPR): https://eur-lex.europa.eu/eli/reg/2016/679/oj
- Datatilsynet: https://www.datatilsynet.dk
- EDPB Guidelines 05/2020 on consent: https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-052020-consent-under-regulation-2016679_en
- EU-US Data Privacy Framework adequacy decision (10 July 2023): https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/eu-us-data-transfers_en
- Danish Markedsføringsloven (LBK nr 866 af 15/06/2022), §5, §6, §10: https://www.retsinformation.dk/eli/lta/2022/866
- Forbrugerombudsmanden, skjult reklame guidance: https://www.forbrugerombudsmanden.dk/hvad-gaelder/markedsfoeringsloven/skjult-reklame/
- Directive 2011/83/EU (Consumer Rights Directive): https://eur-lex.europa.eu/eli/dir/2011/83/oj
- Directive (EU) 2019/2161 (Omnibus) and Directive 98/6/EC Art. 6a: https://eur-lex.europa.eu/eli/dir/2019/2161/oj
- Regulation (EU) 2024/3228 (ODR platform discontinued 20 July 2025): https://eur-lex.europa.eu/eli/reg/2024/3228/oj
- Regulation (EU) 2018/302 (Geo-blocking): https://eur-lex.europa.eu/eli/reg/2018/302/oj
- Directive (EU) 2019/882 (European Accessibility Act); Danish lov nr 801 af 07/06/2022: https://eur-lex.europa.eu/eli/dir/2019/882/oj
- EN 301 549 v3.2.1; WCAG 2.1: https://www.w3.org/TR/WCAG21/
- Regulation (EU) 2024/1689 (AI Act), Art. 50: https://eur-lex.europa.eu/eli/reg/2024/1689/oj
- Regulation (EU) 2022/2065 (Digital Services Act), Arts. 11, 12, 14, 16, 19: https://eur-lex.europa.eu/eli/reg/2022/2065/oj
- Regulation (EU) 2026/131 (pet travel, as cited on the site): NOT VERIFIED on EUR-Lex; open Notion task
- orestbida CookieConsent v3 docs (script blocking): https://cookieconsent.orestbida.com/
- Ahrefs Web Analytics privacy statement: https://ahrefs.com/web-analytics
- LG München I, 3 O 17493/20 (Google Fonts, 20 Jan 2022): https://www.gesetze-bayern.de/Content/Document/Y-300-Z-GRURRS-B-2022-N-612
- Webflow MCP data read 30 Sep 2026; Memberstack MCP (app thatlayover.life); repo `handoff/`, `wrangler.toml`, `src/`; TLL Brand Kit v2.1 (Google Drive)
