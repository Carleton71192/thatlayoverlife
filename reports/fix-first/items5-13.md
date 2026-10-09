# TLL fix-first audit · items 5–13 (read-only, 2026-10-09)

Site 69d6145cf421c777840c1e25. Element ids are `{component, element}` verbatim. Footer component "TLL Site Footer" = `710ff458-c06e-d602-a663-e5e88ca1456b` (63 instances). Home page id `69d6145df421c777840c1e46`.

## Real numbers (CMS)
- Stories collection `6a0b29eddc14f1444e935760`: 28 items, **9 published** (isDraft false): pantanal-glimmers-in-the-wild, sort-sol-black-sun-denmark, northern-brazil-sequins-to-sloths, la-paz-mexico-whale-sharks, patagonia-w-trek-christmas-new-year, montenegro-budva-switchback-roads, ghana-easter-everyone-wears-white, balkans-ev-road-trip-twelve-countries, antarctica-marathon. 19 drafts.
- `country-2` (Reference → Countries) and `country-number` are **empty on all 9 live stories**, so no CMS-derived country count exists. By subject: Brazil (×2), Denmark, Mexico, Chile/Argentina (Patagonia), Montenegro, Ghana, Balkans (12 countries), Antarctica → at least **7 distinct countries/territories** if one per story (Brazil, Denmark, Mexico, Chile, Montenegro, Ghana, Antarctica), more if the Balkans route is counted.
- Magnus (Pets `6a0be8194ccc05a63fbdcfa3`, item `6a0be888a0693535d3487303`, live): `countries-visited` = 13; `countries-list` = "Brazil, Germany, Czech Republic, Slovakia, Austria, Albania, Serbia, Kosovo, Bulgaria, Sweden, North Macedonia, Hungary, Poland" (13); `quote` = "Everyone I meet is a new best friend."; `weight-kg` = 35.
- Nancy: no CMS source checked for 87; typed everywhere.

## Item 5 · hardcoded counts
Site-wide scripts that rewrite counts at runtime (all registered + applied site-wide, footer unless noted):
- Site head freeform `<script id="tll-live-stories-v1">`: fetches /sitemap.xml, counts `/stories/` URLs, rewrites a number before "stories, growing weekly" / "stories filed" and any `<strong>N</strong> stories` (skips /account, /profile).
- `tllstorycountv2` (hosted): same sitemap count → rewrites "N stories, counted by hand" and "Six stories, all worth the detour".
- `tllfactsv1`: fetches /pets/magnus-waffles, reads `window.TLL_PET.countries`, replaces `22` before "countries" with the real count (only matches the literal 22).
- Home footer freeform `__tllLiveCounts`: rewrites "N countries, counted by hand", "N countries on", "N of 195" from the **member's** own tllStates (member-only).
- /destinations footer freeform `tll-atlas-v1`: counts `.tlldx-card` flags and rewrites `.tlldx-sub` lede to "Countries with a published story: N. The other M are open until someone files." and `.tlldx-h2` to "N countries, M stories.".

| Where | Element | Current text | Kind | Minimal change |
|---|---|---|---|---|
| /destinations `6a47adad7a97f26b91c7d78e` stat row | `d01ec6db-4cb7-f6d5-438b-e677f524163a` (String in Span `d01ec6db-4cb7-f6d5-438b-e677f524163b`, parent `.tlldx-statrow` `6212315d-879a-3e1e-779a-ff8cced0b6cb`) | "5 COUNTRIES COVERED" | typed; no script touches it | retype to match card count, or let atlas script write it |
| /destinations sibling stat | `d27ca8fe-6e88-0041-640f-f4ce35b0c58c` | "4 CONTINENTS" | typed | check |
| /destinations lede `.tlldx-sub` | `fea58b35-e47d-0fa5-606c-7c115f5f881e` in Paragraph `6212315d-879a-3e1e-779a-ff8cced0b6c0` | "Five countries have published stories so far. The map tracks the rest. No padding…" | typed, **overwritten by script** to "Countries with a published story: 5…" (5 = number of `.tlldx-flag` cards: 🇧🇬 🇨🇱 🇬🇭 🇲🇪 🇲🇽 + 🗺 open card) | the "5" is the card count; add cards for Brazil, Denmark, Antarctica (the live stories) or retype |
| /destinations h2 `.tlldx-h2` `123073d6-a0ff-60fb-c542-413be9635913` | strings `…590f` "Five countries, five ", `…5910` "stories", `…5912` "." | typed, overwritten by atlas script | same as above |
| /destinations cards | `.tlldx-flag` blocks: 🇧🇬 `6212315d-…b6d6`, 🇨🇱 `…b6e1`, 🇬🇭 `…b6ec`, 🇲🇪 `…b6f7`, 🇲🇽 `c116c2dc-d6a8-d97d-97e9-8d3ff3850a31` | static cards (no CMS collection list on page, DynamoWrapper = 0) | Bulgaria card exists but no Bulgaria story is live; Brazil/Denmark/Antarctica have live stories but no card |
| /about `6a0e05a2685ba39d73f2feb7` manifesto stat | `fd48f043-654d-b49b-bcbb-3ebe3ef070ae` "6" (in `.tll-about-stat-num` `…70af`), label `…70b0` "stories, growing weekly" | typed "6"; rewritten by tll-live-stories-v1 (sitemap count) | retype 9 (or leave to script) |
| /about stat | `fd48f043-654d-b49b-bcbb-3ebe3ef070b3` "87", label `…70b5` "Countries, counted by hand" | typed; home-style script does **not** run on /about | retype if 87 is stale |
| /about founder card | `aa3fb94c-49fc-beb3-9d5f-5d23820fde37` "87, counted by hand" (Block `aa3fb94c-…fde36`, attrs `data-tll-count="nc"`) | typed | retype |
| /about founder bio | `94dc06dc-b82b-7356-2409-5540acfbf0ec` "Started this with one passport, 87 countries and a Samoyed in an advisory capacity…" | typed | retype |
| /about Magnus role | `80dc3fa6-9fb6-53cb-c777-34a69a5bcfb2` "Samoyed. Chief supervisor. 13 countries, 0 complaints." (Block `…cfb3`) | typed; tllfactsv1 only rewrites "22" so this stays 13 | already matches CMS (13) |
| Footer component meta row (`710ff458-…14575`) | Strong `…14577`/String `…14578` "6" + `…1457a` "stories"; `…1457d` "87" + `…1457f` "countries"; hidden span `…14580` "1 traveler" (visibility false); `…14587` "1" + `…14589` "pet" | typed; "6" rewritten by tll-live-stories-v1 `<strong>` rule; "87" not | footer currently reads "6 stories · 87 countries · 1 pet" (not "8 stories, 5 countries") — retype 6→9 |
| Footer © line | `…145bf` "© 2026 That Layover Life · Copenhagen, Denmark · Run by humans, supervised by one Samoyed" | typed | — |
| Contributors Template `6a0b29c8a7b1840afe9390ab` | h3 `acffcc4a-5c0c-da24-eeb8-9bfc715cb084` attr `data-tll-prof="n-stories"`, String `75df066f-e0d5-2ea5-8c60-b3500c45acbe` "0"; label `48e92756-e222-7650-af8e-81520e81adea` "Stories filed" | typed "0", **script-written** by template footer code (fetches /stories, counts cards matching byline) | "8 STORIES FILED" not present — already fixed |
| Contributors Template legacy hidden sections | `7b51ad5b-115a-cf91-a9d1-e2542e06af79` "87", `280a12e6-5a1c-d912-b471-95e09211c06e` "87", `f79d267d-b003-9fee-58f4-7feb6759aa0a` "87 of 195 · next stops: Romania, Estonia, Japan", `987bf70b-ce99-c310-1420-8539d911d121` "Visited (87)", `a83eaf6e-d9df-dafa-4714-d931180b8d2d` bio "…87 countries on the board. 7 continents marathoned. 464 cities. 212 states. 97 large airports…", `72ead6cf-d514-27d2-b380-8989dce5f928` "+ 82 more" | typed, inside sections with visibility:false (`ce003350-…6df8`, `987bf70b-…d12c`, `70cb4393-…1288`) | not rendered; optional cleanup |
| Countries Template `6a8afbda8e907b41c4da10a1` | meta Block `b64ebf5e-eb44-e8f2-513c-170f785a0204` (`data-tll-ctry-meta`, text " ") | script-written: footer code `parts.push(n+' stories filed')` with `n=window.TLL_FILED_N` (cards on page) | "8 STORIES FILED" not typed anywhere — already fixed; only "Filed from here" eyebrow `ad9bde0e-c71c-7389-05ea-7eeb3ce0a29a` is typed |
| Pets Template `6a0be81a4ccc05a63fbdcfd2` | Span `.tll-pet-badge.tll-pet-badge-rose` `b1cadd9b-bf14-f9cc-3ded-8d69dda7fd8f`, String `…fd8e` "12 countries logged" | typed "12"; template footer `tll-pet-passport-data-v1` rewrites to `countries-list` length (13) | retype 13 (or bind) |
| Pets Template head | `window.TLL_PET={countries:"{{countries-list}}",weight:"{{weight-kg}}"}` | CMS binding (countries-list) | — |
| /pets index `6a47adad44ed9a20a78bfce4` | `61ab4296-1311-f20c-9a4c-eed0c07cd78b` "22 COUNTRIES SUPERVISED" | typed 22; page footer script rewrites `[data-tll-px="countries"]` from each pet page's TLL_PET | retype 13 |
| Home `69d6145df421c777840c1e46` | `77240a57-705d-72c0-ed6c-2dd1197fb5c3` "13 countries · 0 complaints"; `e646451a-68a7-b183-3a52-6da4762de1e6` "Already on the shelf · 6 stories, counted by hand" (rewritten by tllstorycountv2) | typed | 13 matches CMS; 6 → 9 |
| /the-map `6a0df81df4016d4f78cfb22a` | head code `var STORIES=[Ghana, Mexico, Montenegro, Chile]` (4 pins); `#tll-map-counter` = STORIES.length; second counter from sitemap | script | no 12/13/14 on map; pins list is stale (missing Brazil, Denmark, Antarctica) |
| "14" | not found on any audited page | — | already fixed |

## Item 6 · guides
Both pages: `draft: false`, published; page head freeform code contains `<!-- tll-guide-noindex-v1 : remove together with the DRAFT banner once Nancy has checked every answer -->` `<meta name="robots" content="noindex,follow">` (page metadata has no noindex flag; it is custom code).

/copenhagen-stopover `6abbdbbadcc11e6928b4481c`:
- Draft box `7887ab5d-1ab1-fac5-1ac9-cb0bc1cb0eff` (`data-tll-draft="1" data-tll-gd="draft"`): tag Span `…0efc` String `…0efb` "DRAFT"; Paragraph `…0efe` String `…0efd` "Every answer below is checked against the linked official source before this page goes live. Rules change; the "Last checked" date is the promise."
- Ledger `…0f44` → dt `…0f2d` "LAST CHECKED" / dd `…0f32` String `…0f30` "Draft, not yet checked"; dt `…0f3b` "UPDATED" / dd `…0f40` String `…0f3e` "When the rules change"; dt `…0f26` "CHECKED BY" / `…0f29` "Nancy Carleton, editor"; "SOURCES"/"Official, linked per answer".
- Source link: Link `…0f21` href `https://foedevarestyrelsen.dk/english` rel noopener, String `…0f20` "SOURCE: DANISH VETERINARY AND FOOD ADMINISTRATION ↗".
- €9: Paragraph `…0f48` (`data-tll-gd="cta-b"`) String `…0f47` "The Paw Passport guide covers the order of operations. €9."

/ees-etias-layover `6abbdbbbbcdc0c05aaa893fc`:
- Draft box `7f7414e4-d299-8e6d-ee11-7235276fc673`: Span `…c670` String `…c66f` "DRAFT"; Paragraph `…c672` String `…c671` (same sentence).
- Ledger `…c6b8`: "LAST CHECKED" `…c6a1` / dd `…c6a6` String `…c6a4` "Draft, not yet checked"; "UPDATED" `…c6af` / dd `…c6b4` String `…c6b2` "When the rules change".
- Sources: Links `…c679`, `…c680`, `…c68e`, `…c695` → https://travel-europe.europa.eu/ees_en; `…c687` → https://travel-europe.europa.eu/etias_en. No € mention.
Minimal change: set real dates in the two dd strings, remove the draft box, delete the robots meta line from each page's head code.

## Item 7 · marathon recap
Collection Marathons `6a0b29e90328ffc0e30375ac`, item `6a16a04aa8d1d5f4ec9bc44d` slug `copenhagen-marathon-2026-recap`, **published** (isDraft false, lastPublished 2026-05-27). Fields: `date` = 2026-05-17T09:30:00Z; `city` = Copenhagen; `race-time` = 4:08:42; `one-line-take` = "Home marathon, 3-minute PR, the orange slice from a Danish four-year-old that moved the wall."
- `recap-body` (RichText): "🇩🇰 Copenhagen, May 17, 2026. The bib number was 8842…"; "At km 38, the Islands Brygge waterfront opened up…"; "The finish was at Islands Brygge. 4:08:42."; "The Trip Ledger now reads: 88 countries, 7 continents marathoned, 1 home marathon PR."; "a 45-kilo Samoyed in a sit-stay" (CMS weight-kg = 35).
- `pre-race-city-guide` (RichText): "The Copenhagen Marathon is the home race. May 17, 2026. Start and finish at Islands Brygge."
Collection page (Marathons Template `6a0b29ea0328ffc0e30375d1`) is not draft, has no noindex in page code or metadata. Live items: this recap + tokyo-marathon-2027-prerace; 3 archived drafts.

## Item 8 · Paw Passport `6a3e5e3ed36c8c6a1df1d12e`
- Ko-fi button: Block `89499c2b-3a7e-bc05-5bd4-14612ea0dc80` class `tll-btn-disabled`, attrs `data-tll-kofi="1" aria-disabled="true" role="button"` (div, not a link), String `…dc81` "Get it on Ko-fi".
- Note: Block `6e3b1e70-3e41-8d96-8239-78908f34a833` (`.tll-trav-meta`, `data-tll-t="kofi-note"`) String `…a834` "Coming soon · the Ko-fi link goes live when the guide ships" (sentence case, not all-caps in source).
- Free story: Link `93e63429-e565-c0a5-fa20-f45b94e09d37` (`.tll-fos-cta`, `data-tll-guide-free-link="1"`) href `/stories` (generic shelf), String `529de9d4-d7a8-57b4-d8c7-8cb6a4501fa7` "Read the free story →". Intro `6d824ed8-85b0-5c1a-3fb7-37d6bc3c2ca4` "The four mistakes, in full, because they are the most searched and the most useful…"
- No Stories item mentions "mistake" in name, slug or body (searched all 28). The closest dog story is draft `magnus-refuses-goats-montenegro`; the live Balkans story `balkans-ev-road-trip-twelve-countries` is the live Magnus story. The "four mistakes" story does not exist yet.
- Cards: "EU Pet Passport" Block `a0617c54-c5e1-de56-7c0d-828bc6659d35` (div `.inline-div-14`) inside Block `…d38`, with Paragraph `…d37` "What it is, who issues it, and how long it takes."; "Large-dog-friendly hotels" Block `…d44` (`.inline-div-20`) inside `…d47`, Paragraph `…d46` "Real "large" means over 25kg welcome, verified." Both are plain divs, **not links**, under `…d48` (`.inline-div-22`), section `…d49`.

## Item 9 · pet quote
Pets Template: Block `.tllpq-quote` `e2272be1-199a-05ba-ebab-81d5866b90b8` → `.tllpq-mark` `…90b5` "“" (color #00C9C8) + `.tllpq-text` `…90b7` **bound to CMS Pets › Quote** (fieldId `afcfb3d462e97aa66fd106a4972961ec`). `.tllpq-text` style: color **#F6F1E7** (cream), 19px, italic. It sits in `.tll-pet-hero-inner` inside `.tll-pet-hero`, whose background is `linear-gradient(180deg, var(--tll-bone,#EFEAE1), var(--tll-paper,#F7F4EE))` — cream text on cream background. Fix: set `.tllpq-text` color to Ink `#0A0B14` (or `var(--tll-midnight,#1C1C1C)`). Footer script hides the block when the field is empty.

## Item 10 · cookie preferences
- Consent tool: orestbida **cookieconsent v3.1.0** (site footer code loads `cookieconsent.umd.js`, runs `CookieConsent.run({...})` on load; categories necessary + analytics; preferencesModal title "Cookie preferences"). CSS loaded in site head.
- Hook: site footer `wire()` selects `[data-tll-cookie-prefs], a[href^="javascript:"]`, keeps only those with the attribute or "cookie" in text, sets `href="#"`, and on click calls `CookieConsent.showPreferences()`.
- Footer component: Link `710ff458-c06e-d602-a663-e5e88ca145bb` (`.inline-a-19`) attrs `data-tll-cookie-prefs="1" href="#"`, String `…145bc` "Cookie preferences" → works.
- /privacy `6a0f0846441306de87ab07cd`: Link `91da74f3-d449-21c3-b5e4-b762e55684cc` href `javascript:Cookiebot.show();` (Cookiebot is not installed), String `…84cb` "Cookie Preferences" → caught by the `a[href^="javascript:"]` + "cookie" rule, so it works but relies on the fallback; change href to `#` and add `data-tll-cookie-prefs="1"`.
- /cookies `6a89d2fde90b577397cb4611`: Link `8b31a0ec-caf6-2af2-f885-28aaf88958f8` href `#`, no data attribute, String `…58f7` "open the cookie preferences" → **not wired** (neither selector matches); add `data-tll-cookie-prefs="1"`.

## Item 11 · editorial charter `6a47b43244ed9a20a78dec63`
- Rule list item `d1e316d5-f8ff-0fab-ef87-cb7f228829fe` (`data-tll-rule="08"`): numeral h6 `…ac0f` "VIII"; rule h6 `640a856e-7be9-ff28-fbc0-70b94ba66e38` String `a15e0b2d-99b8-2e65-c4c0-e2729c5749ae` "Paid work never buys a verdict."; draft span `15a36f1d-3d15-2271-1d5d-a89d3e88608d` (`data-tll-draft="1"`) → h6 `7622b01a-fed1-ec48-e904-ebd0e7832ed3` String `495651aa-265e-9bc2-f1a8-96f223a5e576` "DRAFT · EDITOR TO APPROVE"; copy `98006add-…8ecf` String `7922707b-ca38-e599-09d3-a66fb7c42df8` "Brands hire The Brand Collective, never space on TLL. If paid work touches a story, it says Reklame at the top and names who paid. Full policy below."
- Section `#rule-08` `91b419c6-ba56-0aab-d470-4a34e3dcce08`: eyebrow h6 `b8312ea6-925d-f6e5-999d-37b390eb8645` String `02dd02da-c015-a851-d5a7-858b3a62c8fa` "RULE 08 IN FULL · DRAFT, EDITOR TO APPROVE"; h2 `…6900` "Paid work, in plain view."; sub "TLL is also the portfolio for The Brand Collective, Nancy's studio. Here is exactly where the money goes and where it stops."; list `96491c51-5e3d-2c46-04dc-38e9e53b3039` (3 empty ListItems `…303a/b/c` + 6 `.tllec-item`); mail link `9671e650-…dada` String `597ad80f-…ffe4` "HELLO@THATLAYOVER.LIFE · RULE 08 →".
Minimal change: remove span `15a36f1d-…608d` and set `02dd02da-…c8fa` to "RULE 08 IN FULL".

## Item 12 · forms
/for-expats `6a3e5c68993a0f9ad19ee39d`. **No input has a placeholder set** (settings show only domId/name/required/type) → "Example text" count = 0; already fixed. No label carries a `for` attribute (domId empty, no attributes).
Form "Location Expert application" `dddf0a0b-b9ec-ae3d-0bdf-bc6616448b53` (labels are siblings, not wrapping → no association):
- `…8b36` text id `le-name` name `name-or-pen-name` req · label `…8b35` "Your name or pen name"
- `…8b3a` email id `le-email` name `email` req · label `…8b39` "Email"
- `…8b3e` text id `le-city` name `city-country` req · label `…8b3d` "City and country"
- `…8b42` text id `le-years` name `years-there` req · label `…8b41` "How long you have lived there"
- `…8b47` textarea id `le-pitch` name `local-truth` req · label `…8b46` "The local truth · one thing visitors always get wrong"
- `…8b4a` text id `le-links` name `published-links` · label `…8b49` "Where you already write (optional)"
- checkbox `…8b4b` id `checkbox` name `age-and-terms` req; inline label `…8b4d` hidden "age-and-terms"; visible text "I am 16 or older and I have read the Editorial Charter…"
Form "Expat group listing" `88e25396-1a9b-55c1-4243-5a07684b0d08` (inputs are **inside** the FormBlockLabel → implicit association, OK):
- `…0cf0` id `xg-name` name `group-name` ("GROUP NAME"); `…0cf3` `xg-area` `city-or-area`; `…0cf6` `xg-country` `country` (attr list=tll-country-list); `…0cf9` `xg-link` `group-link` url; `…0cfc` `xg-email` `email`; checkbox `…0cff` `xg-check` `runs-group-and-open`.
No selects on either page. Site script `tllformlabelsv1` hides raw checkbox placeholder names.
/for-press `6a3e5c68288bde39aeeed7de` form "Press trip" `e3528c03-…825d`: `pt-org` organization req (label "Organization"), `pt-email` email req ("Contact email"), `pt-dest` destination-dates req ("Destination and dates"), `pt-cov` covered ("What is covered"), textarea `pt-pitch` pitch req ("The pitch · what story do you hope comes out of it"), checkbox `disclosure-accepted` req. No placeholders, labels are siblings without `for`.
Minimal change: set each label's `for` to the input's id (6 on expats Location Expert form, 5 on press).

## Item 13 · "Tell the editor"
Not a component or page element (0 matches on pages/components). Injected by registered hosted script **`tll_feedback_widget_v1`** ("TLL Feedback Widget v1", applied site-wide, footer, v1.0.0, created 2026-05-20). It appends `<button class="tll-fbk-btn" aria-label="Open feedback">✉ Tell the editor</button>` and a `.tll-fbk-panel` dialog (mailto options to hello@thatlayover.life + /about link). CSS: `.tll-fbk-btn{position:fixed;bottom:24px;right:24px;z-index:9000;background:#1C1C1C;color:#F7F4EE;border-radius:999px;padding:14px 22px;font-family:Inter…}` (mobile ≤500px: bottom/right 16px); panel `position:fixed;bottom:88px;right:24px;z-index:9001;width:340px`. Hover lifts 2px (translateY). To remove/relocate: `remove_site_script tll_feedback_widget_v1` or edit the script.
