# AdSense readiness, 28 October 2026

From the cloud session, for Nancy. Nothing in this file is live. Every change below is staged in the repo only, with no Webflow write and no publish, until Nancy says go. The footer edit is listed on its own, because the footer is a protected component.

Staged files: `src/seo/live-2026-10-28/adsense/` (edits, CMP head code, banner CSS, footer changes) and `src/seo/live-2026-10-28/home/` (live copies of the home embeds as read today, with `-after` versions).

What could not be checked from this session: the live site, Google's help pages, CookieYes's site, PageSpeed and Search Console are all outside this sandbox's network. Those rows say so and name who checks them.

---

## 1. Consent platform (CMP) recommendation, with cost

**Where things stand.** The site runs CookieConsent v3.1.0 by orestbida, an open-source banner. It gates GA4 properly today: the GA4 tags sit as `type="text/plain"` and run only after a visitor accepts analytics. It is not on Google's certified CMP list and does not speak IAB TCF v2.2. AdSense requires a Google-certified CMP that uses TCF to serve ads to visitors in the EEA, the UK and Switzerland. Copenhagen readers are in that zone, so this is a must before ads run, not before the application itself.

**Recommendation: CookieYes, Pro plan, one domain (www.thatlayover.life).**

| | |
|---|---|
| Google-certified | Yes. Listed on Google's certified CMP list with TCF CMP ID 401 (web and app). Read through search results of support.google.com/adsense/answer/13554116; the page itself is blocked from this sandbox, so confirm the listing when signing up. |
| TCF | TCF v2.2 in the Pro tier and above. Some reviews say 2.3; either is accepted by Google. |
| Consent Mode v2 | Built in. One toggle in the CookieYes dashboard. |
| Cost | About $25 a month per domain on monthly billing, about 17% less on annual billing (roughly $250 a year). Third-party reviews, not CookieYes's own page, which this sandbox cannot open. Confirm at checkout. |
| Why not the free tier | Free covers one domain up to 5,000 page views a month and leaves out TCF. TCF starts at Pro. |
| Brand styling | Custom CSS on Pro. Staged CSS in `cmp-cookieyes-brand.css`: cream panel, ink rule, Playfair Display title, Plex Sans Condensed body, JetBrains Mono buttons, rose accept button, teal focus ring, square corners, 44 px buttons. |

**The free alternative.** Google's own Privacy and messaging tool inside AdSense is certified and costs nothing. It only exists once the AdSense account is open, it styles less freely, and the site would then run two banners (orestbida for GA4, Google's for ads) unless GA4 moves to it as well. Fine as a fallback; weaker on brand.

**Install plan (staged, not done).** Nancy creates the CookieYes account herself and copies the site ID it prints. Then:
1. Site head: remove the two orestbida stylesheet lines, the `#cc-main` style block and the two `text/plain` GA4 blocks. Add `cmp-cookieyes-head-staged.html` in their place: Consent Mode v2 defaults (everything denied until a choice), then CookieYes, then GA4 as a normal tag. The Project Settings GA4 field stays empty.
2. Site footer code: the four changes in `cmp-footer-changes.md` (remove orestbida, point the "Cookie preferences" handler at CookieYes, simplify the GA4 events guard, adjust one hide rule).
3. CookieYes dashboard: turn on Google Consent Mode and IAB TCF, add GA4 to the Analytics category, paste the CSS, set the banner text (proposed below).
4. Publish to the subdomain first. Check in a private window: no `_ga` cookie before a choice; after "Accept", `_ga` and `_ga_T1K83PRL1R` appear and GA4 Realtime shows the visit. Then custom domains on Nancy's word.

**Proposed banner text.** Title: "Cookies, briefly." Body: "We use the necessary ones to run the site. With your yes, Google Analytics tells us which stories get read, and later, ads help pay for the magazine. Your call, and you can change it any time." Buttons: "Accept all", "Reject all", "Choose".

**Post-publish GA4 check.** Not done. It needs a browser on the live site, which this session cannot reach. It goes in the publish step above.

---

## 2. Change log (tasks 1 to 4). Staged, not live

Home page is page 69d6145df421c777840c1e46. Embed ids in short form. Each edit is a single find-and-replace in `staged-edits.json`, applied only if the old text occurs exactly once.

| # | Page, element | Before | After | Why |
|---|---|---|---|---|
| A1 | Site head code | orestbida stylesheet, `#cc-main` styles, GA4 as `text/plain` | Consent Mode v2 defaults, CookieYes, GA4 normal tag | Certified TCF CMP for AdSense; Consent Mode v2 keeps GA4 behind consent |
| A2 | Site footer code | orestbida script and config; prefs link calls `CookieConsent.showPreferences()` | Removed; prefs link calls `revisitCkyConsent()` | Same banner swap. See footer section below |
| A3 | /cookies, paragraphs 2 to 8 | Names CookieConsent; four categories in prose; "Marketing. Not currently used." | Rewritten with a per-cookie table (section 4 of this file) | The page promises "every cookie, who sets it, why, and for how long" and lists categories only |
| A4 | /privacy, section 3 first paragraph | "a consent banner (CookieConsent, an open-source tool) asks you to choose." | "a consent banner (CookieYes, certified by Google for the IAB Transparency and Consent Framework) asks you to choose." | Names the tool in use |
| A5 | /privacy, new paragraph in section 3 and section 4 | No advertising language; section 4 says third parties "cannot use your data for their own purposes" | Advertising paragraph and Google vendor wording (section 5 of this file) | AdSense requires the Google third-party vendor disclosure; the current section 4 line would become untrue for Google |
| A6 | /privacy, meta line | "Effective: 20 May 2026 · Last updated: 20 May 2026" | "Effective: 20 May 2026 · Last updated:" plus the publish date | Changes need a date |
| C1 | Home, library rail 94ce12c0, heading | "{total} published so far · six of them here" | "{shown} stories here · {total} published so far" | "six" was typed and the rail holds eleven cards. {shown} counts the cards; {total} comes from the site story count |
| C1b | Same embed, script | total = the number of cards in the rail | shown = cards; total = `window.tllCounts.s` from tll-live-counts (the sitemap story count), shown only when it is known and larger | No typed number; the total now means the whole library |
| C2 | Home, Paw Passport a4c1009d, Magnus caption | "Magnus · Samoyed · 35 kg · … places" | "Magnus · Samoyed · 35 kg", and " · {n} places" appears once his pet page answers | The ellipsis showed whenever the fetch was slow or a reader had no script. The count still comes from his pet page (CMS field countries-list), never typed |
| C2b | Same embed, script | writes the count | writes the count and reveals the clause | Pairs with C2 |
| C2c | Home, founders strip a0d1cd97, Founding 03 | "Samoyed · 35 kg · … places · advisory capacity" | Same clause hidden until filled | Same fix in chapter 06 |
| C3 | Home, dashboard 405baa84, label | "This is Nancy's map. Log in to see yours." | "Sample passport: the editor's map. Log in and yours takes its place." | Reads as a deliberate demo; keeps Nancy one byline among many; no whereabouts beyond what the map already shows |
| C3b | Same embed, map aria-label | "Nancy's map. Countries she has lived in..." | "Sample passport map, the editor's own. Countries she has lived in..." | Screen readers get the same framing |
| C4 | Home, search head d3ac79f6 | Webflow form "Library search" (GET to /stories) can trip Webflow's form handler, whose fail text is "That search did not run. Try again, or browse every story on the Stories page." | A small capture-phase script sends the words to `/stories?q=` before Webflow's handler runs | The Try links already use `/stories?q=`, so the Stories page reads it. Verify on the subdomain: type "Patagonia", land on the filtered list |
| C5 | Home, founders strip a0d1cd97, Open slot 05 | "Ninety-six more seats. Window or aisle?" | Option B below | "Ninety-six" is a typed count that goes stale with the next founder |

**Slots 04 and 05, Nancy chooses.**
- **A. Hide both open slots.** The roster shows the three founders; the "Send your trip" button above stays.
- **B. Stronger open call (staged).** 04 keeps "Your face could be here." 05 becomes "Write one trip. The founding badge is yours." and links to /submit.
- **C. One open slot.** Replace 04 and 05 with one "Open slot · Founding 04" reading "Your face could be here. Window or aisle?"

**Counts elsewhere.** The footer stats and the sign-up strip already read from tll-live-counts (sitemap and /stories), and the dashboard count line reads tllStates. The only typed counts found on the home page were "six" (C1) and "Ninety-six" (C5). Two older typed Magnus counts on /about and the home pet card were logged on 23 Oct in `AUDIT-PERSONAL-STATS-2026-10-23.md` and are still open.

### Footer edit, separate approval

The protected component is TLL Site Footer (710ff458-c06e-d602-a663-e5e88ca1456b, on 63 pages). Its legal column has Privacy, Terms, "Cookie preferences" (href `#`, opens the banner) and Community guidelines. Nothing links to /cookies from the footer.

| # | Element | Before | After |
|---|---|---|---|
| F1 | New link in the legal column, after Terms | none | "Cookies" linking to /cookies |
| F2 | Link 710ff458...145bb | "Cookie preferences", href `#` | Unchanged text and behavior. After the CMP swap, it opens CookieYes |

The brief described the footer "Cookies" link as pointing to "#". The live link is "Cookie preferences", and "#" is deliberate: a script turns it into the banner opener. F1 adds the missing page link without breaking that.

---

## 3. Thin-page audit

Table in `handoff/THIN-PAGES-2026-10-28.md` (written by a read-only pass over the sitemap, the CMS and page text). Nothing is deleted; each row is fill, merge, noindex, hide from nav or keep.

---

## 4. Proposed /cookies wording (A3)

Lede, unchanged: "Every cookie, who sets it, why, and for how long. Change your mind any time."

Paragraph 2: "Consent runs through CookieYes, a banner certified by Google for the IAB Transparency and Consent Framework. Nothing optional runs until you choose. Google Analytics and, later, Google ads both wait for your yes."

| Cookie or storage | Set by | Category | Why | How long |
|---|---|---|---|---|
| cookieyes-consent | CookieYes | Necessary | Remembers your choice | 1 year |
| _ms-mid | Memberstack | Necessary | Keeps you signed in | Until you sign out, up to the session length Memberstack sets |
| _ga | Google Analytics 4 | Statistics | Tells one visit from another | 2 years |
| _ga_T1K83PRL1R | Google Analytics 4 | Statistics | Keeps the session state for this site | 2 years |
| __gads, __gpi | Google AdSense | Advertising (once ads run) | Ad frequency and measurement | 13 months |
| __eoi | Google AdSense | Advertising (once ads run) | Ad security and fraud checks | 6 months |
| IDE (on doubleclick.net) | Google | Advertising, personalized ads only | Ad personalization | 13 months |
| tllStates and saved stories | That Layover Life | Preferences (browser storage, not a cookie) | Your passport ticks and saved stories | Until you clear them |
| none | Ahrefs Web Analytics | Statistics, cookieless | Counts page views without cookies or personal data | none |
| none | Webflow (hosting) | n/a | Serves the pages | none expected; confirm in a browser before publish |

Closing paragraph: "Change your choice any time from Cookie preferences in the footer, or here: Cookie settings." The "Cookie settings" link keeps `data-tll-cookie-prefs="1"` so it opens the banner, as the current link does.

Durations come from the vendors' published cookie lists as of this writing. Before publish, open the subdomain in a private window, accept all, and compare the browser's cookie list with this table.

---

## 5. Proposed /privacy wording (A4, A5)

New paragraph in section 3, after the GA4 paragraph:

"Advertising. TLL plans to show ads through Google AdSense to help pay for the magazine. Ads only use cookies after you say yes in the banner. Google, as a third-party vendor, uses cookies to serve ads based on your visits to this site and other sites. Google's advertising cookies let it and its partners show you ads based on those visits. You can turn off personalized ads in Google's Ads Settings (adssettings.google.com), and you can opt out of other vendors' personalized ads at aboutads.info. If you say no, you may still see ads, just not ones based on your browsing."

Section 4, first paragraph, after: "We use the following third parties to run TLL. They're bound to GDPR-equivalent standards. Google, when it serves ads, acts as its own controller under its own privacy policy (policies.google.com/technologies/partner-sites)."

Section 4, "We don't sell your data" paragraph: keep. Note for Nancy: under California law, personalized ads can count as "sharing". CookieYes honors Global Privacy Control signals, and the California rights section should add one line: "If your browser sends a Global Privacy Control signal, we treat it as an opt-out of personalized ads."

---

## 6. ads.txt plan (prepared, not published)

Webflow cannot place a file at the domain root. The usual route:
1. Nancy copies the ads.txt line from AdSense (Account, Settings, ads.txt). It looks like `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`, with her own publisher ID.
2. Upload a plain-text file named ads.txt to the Webflow asset manager and copy its CDN URL.
3. Webflow Site settings, Publishing, 301 redirects: old path `/ads.txt`, redirect to that CDN URL. Publish.
4. Check `https://www.thatlayover.life/ads.txt` returns the line. The IAB spec allows one redirect to another domain, and some Webflow sites report AdSense flagging the redirect. If AdSense says "not found" after a few days, host the file on a small Cloudflare Worker route for `/ads.txt` (the site already uses a Worker), which serves it from the root with no redirect.

---

## 7. Pre-application checklist

| Check | Result | Evidence or next step |
|---|---|---|
| About page live and linked | Pass | 200, one H1, linked in the footer |
| Contact page live and linked | Pass | 200, footer link plus hello@thatlayover.life in the footer |
| Privacy policy live, linked, complete | Fail until A4 and A5 | 200 and linked; no advertising or Google vendor language; names the old banner |
| Terms live and linked | Pass | 200, footer link |
| Cookie page live, linked, complete | Fail until A3 and F1 | 200 and in the sitemap; no footer link; categories only, no cookie table |
| Certified TCF CMP | Fail until section 1 | orestbida banner is not certified |
| GA4 respects consent | Pass today | GA4 sits as `text/plain` behind the banner; Consent Mode v2 comes with the swap |
| Placeholders and typed counts on home | Fail until C1 to C5 | "six of them here", "… places", "Ninety-six", sample map wording, search fail text |
| Sitemap | Pass | 101 URLs in the 27 Oct crawl, all 200. Account, login, signup, edit-profile, my-passport, my-pets, submit, share-photos, style-guide and previews are kept out |
| robots.txt | Not checked | Unreachable from this session. Nancy or a browser session: confirm it allows Googlebot and Mediapartners-Google and names the sitemap |
| Search Console sees the site | Not checked | Ahrefs has no Search Console access on this plan. Nancy checks Indexing, Pages in Search Console |
| ads.txt | Prepared | Section 6, after the publisher ID exists |
| Mobile layout, home and one story | Partly | Offline renders at 390 px were clean in the 27 Oct cover and story tests. Not checked on the live site today |
| Page speed, home and one story | Not measured | PageSpeed refused the call without a key. Known weight: six home images over 300 KB (`HOME-IMAGE-WEIGHTS-2026-10-28.md`), about 1.3 MB to save with 960 px WebP |
| Original content, enough of it | See thin-page table | AdSense rejects "low value content" more than anything else on young sites |

---

## 8. Order of work once Nancy approves

1. C1 to C5 on the home embeds (one write each, read back), then A3 to A6 on /cookies and /privacy.
2. Footer F1, if approved separately.
3. CMP swap A1 and A2 after the CookieYes account exists.
4. Publish to the subdomain, run the GA4 and cookie checks, then custom domains on Nancy's word.
5. ads.txt once AdSense gives the publisher ID; apply.
