# TLL launch blockers: recheck and change log, 9 November 2026

Session: cloud Claude Code session_01GTTttGvX2VTwovAB2g1cLf, prompt claude/tll-cc-blockers-2026-11-09.md. Nothing published by the session; the CMS unpublishes below took effect live at once because Webflow unpublishes items immediately. Everything else is staged for Nancy's publish.

## Recheck table (filled as items close)

| # | Item | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Consent before ads | in progress | Decision stands (31 Oct): Google's certified message is the only consent UI, wired to Consent Mode v2; TLL's CookieConsent banner retired (its library left the footer 7 Nov). /cookies and /privacy rewritten to what loads. Verification from a Danish IP is Nancy's step; the test is written below. From this non-EEA machine Google reports gdprApplies false and GA4, Ahrefs and AdSense load at once, by design since 7 Nov. |
| 2 | Footer Cookie settings | checked | `a[data-tll-cookie-prefs]` calls Google's showRevocationMessage; no console error on click. For a visitor outside the EEA, UK and Switzerland there is no message to reopen, so nothing shows (documented on /cookies). |
| 3 | Marathon diary privacy | done | Item unpublished (404 live); flags and replacements below; sweep of all stories and pages in progress. |
| 4 | Member data templates | in progress | Only Visits has a live item (one, Nancy's own). Bookmarks, Comments, Photo submissions, Press applications, Pet notes have zero items, so no URL serves. Decision on the Visits item and the Designer password step below. |
| 5 | Guide buyable | blocked on Nancy | The Ko-fi product URL is not in the project (only ko-fi.com/thatlayoverlife, the profile). Buttons prepared; the URL is needed. |
| 6 | Contact relay and Thailand stub | done (staged) | Relay section and its head code removed on /contact (three mailto doors kept); stub unpublished (404 live). Featured slot: see counts and featured notes below. |
| C | Counts | in progress | Home chapter label and map header traced; see below. |

## Blocker 3: marathon recap, lines to review (Nancy's prose, not edited)

Item 6a16a04aa8d1d5f4ec9bc44d, Marathons collection, now a draft. Each line below quotes the live text and offers a neutral replacement in the same voice. Nancy picks; the session applies nothing.

| Where | Live text | Why | Suggested replacement |
| --- | --- | --- | --- |
| Recap, km 11 | "I passed the bike-lane corner of Vesterbrogade and Værnedamsvej at km 11. Our bike commute corner. Mama Pizza on the corner had a man named Per on the sidewalk yelling... Per is the owner of the dry-cleaner three doors down. Per knows me from the cardigan I dropped off in February." | Two street names plus "our bike commute corner" and a daily shop pin the home neighborhood; a named neighbor. | "At km 11 I passed our everyday corner in Vesterbro. The pizza place had a man on the sidewalk yelling, in Danish and then in English, that I was doing fantastic. He runs a shop nearby and knows me from a cardigan I dropped off in February." |
| Recap, km 32 | "The child's name was Asger. Asger was four. Asger said, in Danish, that it was sour..." | A named four-year-old. | "A small Danish kid, maybe four, handed me a slice of orange and said, in Danish, that it was sour, pointed to me, pointed to himself, and laughed." |
| Recap, km 38 | "our apartment building came into view across the harbor. On the third floor balcony, against the harbor wind, a 45-kilo Samoyed in a sit-stay. Magnus was on the balcony." | The home building, the floor and the harbor-facing side locate the apartment. | "the waterfront opened up and, somewhere in the crowd across the harbor, a 45-kilo Samoyed held a sit-stay. Magnus was supervising. Jay was holding the leash and a small printed sign that read, in Danish, Mor er hurtig (Mom is fast)." |
| Recap, after | "The smørrebrød at the Vesterbrogade lunch place... The Trip Ledger now reads: 88 countries, 7 continents marathoned, 1 home marathon PR." | Street name again; the word on the banned list; a typed count that now disagrees with the footer (87). | "The smørrebrød at the lunch place we always end up at. The sauna at La Banchina the next day... The record now reads: another country, 7 continents marathoned, 1 home marathon PR." (or bind the count to tllCounts) |
| Recap, last line | "The Tokyo Major is in 9 months and 22 days. The training has begun." | A dated future trip. | "Tokyo is next on the list. The training has begun." |
| Recap, km 40 | "Jay's parents who had taken the train from Aarhus... Jay's mother, whose name is Tove" | Companions' whereabouts and a named relative. | "Jay's parents, who had taken the train in with a flag from a former Czechoslovakian national team that has been in the family since 1984." |
| Pre-race guide | "The Hyltebjerg pharmacy at Vesterbrogade 124 has the good blister tape" | A street address near home. | "A pharmacy near the start has the good blister tape and opens at 7:00 on race day." |
| Pre-race guide | "(The Carletons keep a windbreaker in a saddlebag in case.)" | Fine; no change. | |

## Change log (every Webflow element and item touched)

| Page or collection | Element or item | Change | Rollback |
| --- | --- | --- | --- |
| Marathons collection | item 6a16a04aa8d1d5f4ec9bc44d | Unpublished (draft) | Publish the item |
| Stories collection | item 6ae32ce61ed3557855012cb8 (Thailand stub) | Unpublished (draft) | Publish the item |
| /contact 69d61469f421c777840c204f | Section a6a41b6f-1ac5-f12d-21cd-12383f85353b `[data-tll-relay]` | Removed (the relay form, its heading, fields and limit note) | Rebuild from src/pages/contact (C13 markup) or the Webflow backup |
| /contact | Page head code | tll-relay-v1 style and tll-relay-js-v1 script removed; canonical and og:url kept | Re-add from the Webflow tool log (this session) |
| /cookies 6a89d2fde90b577397cb4611 | Paragraphs 8b31a0ec-...58e2, 58e6, 58ee, 58f2, 58f4, 58fa | Text rewritten (consent tool, Necessary, Statistics, Advertising, settings panel, withdrawing) | Old text in scratchpad p0/_cookies.html |
| /privacy 6a0f0846441306de87ab07cd | Paragraphs 91da74f3-...84c9, 38c12766-...aa8f, 91da74f3-...8495, 91da74f3-...84d2 | Text rewritten (consent, advertising, analytics line, processor intro) | Old text in scratchpad p0/_privacy.html |
| /privacy | List item 91da74f3-...84e2 (CookieConsent) | Removed from the processor list | Re-add a list item "CookieConsent" (retired tool; not recommended) |
