# Brand kit sync, 11 November 2026: TLL Brand Kit v2.4 to v2.6

```
BRAND KIT SYNC: 11 November 2026
================================
Synced: That Layover Life (TLL) Brand Kit from v2.4 to v2.6
        (v2.6, 11 November 2026, adds section 06B "Where TLL Fits";
        the file also carries v2.5, the copy voice rules of 10 November 2026)
Cowork prompt: v1.3 to v1.4
File: handoff/Cowork_ContentGen_Prompt_v1.4.md
Kit files compared: handoff/TLL-BrandKit-v2.1.html (content is v2.4)
                    and handoff/TLL-BrandKit-v2.6.html
Method: both kits stripped of tags and compared section by section by script,
        plus a raw line diff and a hex-value comparison. The [v2.5] and [v2.6]
        tags were not relied on.

WHAT THE KIT DIFF FOUND
-----------------------
- Identical in v2.4 and v2.6: sections 01, 02, 03, 04, 07, 08, 09, 10, 11
  and the Claude Design section (14). No CSS change. The set of hex values
  in the two files is the same (14 distinct values).
- Changed: title, cover and footer (v2.4 → v2.6); table of contents (06B added);
  section 05 (hero and sign-up line added, one line retired, working tagline
  marked under review); section 06 (USP 04 loses "Truth over polish.");
  section 06B (new, 199 text lines); section 12 (v2.6 and v2.5 update blocks,
  two new decisions, two version history entries); section 13 (sentence
  patterns table, filler list, four-question test, paste prompt).

CHANGES
-------
- Prompt header version: v1.3 · 10 November 2026 → v1.4 · 11 November 2026
- Prompt header, brand kits referenced: TLL v2.4 (10 November 2026) → TLL v2.6 (11 November 2026)
- TLL status line: Synced from TLL Brand Kit v2.4 (10 November 2026) → Synced from TLL Brand Kit v2.6 (11 November 2026)
- TLL colors label: (Brand Kit v2.4) → (Brand Kit v2.6, unchanged from v2.4). No hex value changed.
- TLL voice label: (Brand Kit v2.4, sections 03, 09, 10 and 13) → (Brand Kit v2.6, sections 03, 09, 10 and 13)
- TLL tagline status: working line "Real places, by the people who actually went.", not yet confirmed → the same working line, not confirmed AND under review (kit v2.5: it shares the patterns retired on 10 November). The block now opens with "None is locked."
- TLL retired lines: "The world is your layover." → "The world is your layover." plus "Real places and real opinions, written by the people who went. Free to join, no card, no paywall." (retired 10 November 2026)
- TLL lists of three: "At most one triad per post" → "No lists of three" (kit v2.5 rule 2; the older kit line allowed one per page, and the v2.5 block says it wins where an older line disagrees)
- Kit USP 04: "Truth over polish." removed from the kit text (retired by Nancy, 21 September 2026). No prompt change: the phrase was already on the TLL never list and stays there.

NEW SPECS ADDED
---------------
- TLL hero and sign-up line: "Travel stories from people who left the airport. (Most of them, anyway.)" followed by "Free to join." (chosen by Nancy, 10 November 2026; new in v2.5). Quoted word for word or not at all. Not the tagline.
- TLL public promise line: OPEN DECISION with four candidates, none chosen (new in v2.6). The prompt lists them only so they are recognized, bars all four from posts, graphics, bios and captions, and says none is a tagline.
- TLL Positioning block (new in v2.6, section 06B):
  - The gap: every platform owns one moment of a trip, and nobody owns the traveler. Internal reference.
  - Home turf: remembering, and being known for it.
  - Internal line "Other platforms rent you a moment. TLL keeps the trip.": never public copy.
  - The five standing positioning rules: compare by job and never name and roast a platform; socials are on-ramps and every post points home; feed AI planners; free stays free and paid is new features only; lead with the traveler's life, not platform features.
  - What sets TLL apart (five internal labels).
  - Niche order: dog travel in Europe, then layovers, then expats.
  - More pictures, fewer words.
  - Roadmap, not live features: the borrowed practices (Strava, Letterboxd, Polarsteps, Atlas Obscura) and the improvement list are not described as live unless Nancy says so in the session.
  - What TLL does not borrow: paywalled year-in-review, live location tracking, moving free features to paid, streaks or guilt nudges.
  - 06B survey and growth figures: internal reference, out of posts unless Nancy gives figure and source in the session (prompt Rule 4).
  - Channel roles: each social channel is an on-ramp; short clips end on "the whole story lives on TLL".
- TLL sentence patterns (new in v2.5, section 13): no lists of three; no mirrored pairs or repeated words for rhythm; no answers to worries nobody raised; always someone talking; no vague praise; no line played straight.
- TLL four-question test (new in v2.5), run on every line before it goes out.
- TLL standalone lines (v2.5 paste prompt): three options, a one-line note on each, a flagged favorite.
- TLL never list additions (new in v2.5 and v2.6): authentic, curated, unforgettable, journey, discover, unlock, elevate, seamless, community-driven, "join thousands", "real stories", "no card", "no credit card", "no hidden fees", "no paywall", "no strings attached", the six sentence patterns, the retired line, the internal line in public copy, a platform named and roasted, streaks and guilt nudges.
- TLL hard rules 10, 11 and 12 (new in this prompt, from v2.6): positioning; no tagline is locked; nothing from the 06B roadmap described as live, free stays free.

CARRIED FORWARD
---------------
- TLL colors: all 13 palette values (carried from v2.4, identical in v2.6)
- TLL Midnight: #0A0B14 (carried from v2.4; the kit still asks Nancy to confirm, see action 9)
- TLL fonts: Playfair Display 800, IBM Plex Sans Condensed, JetBrains Mono, Syne in the logo only (carried from v2.4, identical in v2.6)
- TLL logo and URL marker (carried from v2.4; the URL marker comes from the prompt, not the kit)
- TLL layout patterns: story photo card, pull quote card, map count card, layover route diagram (carried from v1.3; the kit describes neither the map count card nor the route diagram; the route diagram is still NANCY TO CONFIRM)
- TLL voice: tone line, five signatures, every-post list, LinkedIn length and structure, hashtags 5 to 8 with 1 or 2 unhinged, date format (carried from v2.4, sections identical in v2.6)
- TLL never list: every v1.3 entry, line unchanged (carried, nothing removed)
- TLL hard rules 1 to 9 (carried from v1.3, unchanged)
- TLL working tagline: "Real places, by the people who actually went." (carried from v2.4, now under review; confirm or replace)

CONSISTENCY CHECK
-----------------
- Hex codes valid: ✓ 15 hex values in the TLL block, all 6 characters, no shorthand. No hex was added or changed in v1.4. 14 match the kit. The 15th, #FFFFFF, is the v1.3 line that tells Cowork what the TLL headline fill is never. The kit still shows two Midnight values (see action 9).
- Tagline current: ✓ no retired line is presented as current; the retired list grew by one; no tagline is presented as locked; none of the four promise candidates is presented as the tagline.
- US English consistent: ✓ in all 44 new or rewritten lines (scripted scan, then read by eye).
- No em dashes in locked copy: ✓ none in the TLL block and none in the 44 new or rewritten lines. Existing text outside the TLL block was left exactly as it was, as instructed; it still holds em dashes (see action 12).
- Published cases match: not applicable to this sync. DS Rule 3 and the five Damgaard cases are unchanged, and the live projects page was not rechecked.
- Never list is a union: ✓ the v1.3 never list line is unchanged byte for byte; additions sit on a new line under it; nothing was removed. "Truth over polish" stays banned.
- No exclamation marks and neither of the two house-banned words (the s-h-i-p word, the bookkeeping-book word) in any new line: ✓ (scripted scan). The unchanged v1.3 never list line still names both, as it must.
- Untouched text: ✓ 419 of 426 v1.3 lines are carried byte for byte. Every section except the header and the TLL block is identical (checked heading by heading).

CHANGED LINE RANGES (v1.3 line → v1.4 lines)
--------------------------------------------
- 3 → 3: version and date
- 5 → 5: brand kits referenced
- after 7 → 8: new "Changes in v1.4" line
- 209 → 210: TLL status
- 211 → 212: TLL colors label
- 243 → 244 to 266: tagline block (244 to 248), blank line (249), new Positioning block (250 to 266)
- 245 → 268: voice label
- 253 → 276 to 285: lists of three, sentence patterns, four-question test, standalone lines
- after 255 → 288 and 289: never list additions (one blank line, one new line)
- after 266 → 301 to 303: hard rules 10, 11 and 12
Totals: 7 v1.3 lines rewritten, 44 lines new or rewritten in v1.4, 426 lines → 463 lines.

NANCY ACTION REQUIRED
---------------------
1. OPEN DECISION, public promise line under the hero (kit 06B: for the home page under the hero, the app store listing and the media kit). Pick one or supply another. The four candidates, quoted from the kit:
   - "Where your trips go after the trip."
   - "Grandpa's slide show, now with a search bar."
   - "Every country you've been to, kept somewhere that won't lose them. (Even the layovers.)"
   - "The travel diary for people who fill their passports."
   Until you pick, v1.4 keeps all four out of posts, graphics, bios and captions. The kit also words the second one differently in the 06B gap paragraph: "Grandpa's slide projector show, with a search bar."
2. OPEN DECISION, primary tagline (kit, Decisions to Make): keep "Real places, by the people who actually went." or replace it. The kit's own candidate is the hero line, "Travel stories from people who left the airport. (Most of them, anyway.)". Until you decide, v1.4 puts no tagline on a graphic or in a bio. v1.4 also keeps the working line out of new post copy while it is under review; that last part is this prompt's reading, so say if you want it back.
3. Kit contradiction, "anyway". Section 09 Never list: the tics "honestly", "look" and "anyway" as voice markers. Section 05 hero line, chosen by you: "(Most of them, anyway.)". v1.4 keeps both: the hero line word for word, the ban everywhere else. Confirm.
4. Kit contradiction, lists of three. Section 12 overuse list: Triads, "One per page", "Keep the one with a joke." v2.5 rule 2 and section 13: "No lists of three". v1.4 follows v2.5, because that block says it wins. Section 09 also asks for "at least three sensory anchors"; v1.4 reads that as three anchors spread through a post, never stacked in one sentence. Confirm that reading.
5. Kit contradiction, the four-question test. 06B says each promise candidate passes "the section 13 four-question test (someone talking, one concrete image, no list of three, no mirrored pair)". Section 13's four questions are different: could it appear on any other travel site; would Nancy say it out loud; is there a list of three, a mirrored pair or a reassurance nobody asked for; is there one specific visual detail or a bit of humor. v1.4 uses section 13's wording.
6. Kit contradiction, banned filler used in the kit's own text. Section 13 bans "community-driven" and "curated" as filler. 06B describes Atlas Obscura as "Community-driven, editor-curated". Two of the five "What sets TLL apart" labels, "A voice, not a template" and "No politics, no algorithm", have the shapes the kit bans ("Not X, it is Y" comparisons; "No X. No Y."). v1.4 treats all of 06B's table text as internal labels that never become public copy. Confirm, or reword them in the kit.
7. Kit contradiction, older examples not tagged [v2.5]. The section 13 content mix still gives "Pen a tale and we publish it. Free. Fast." and "Join the crew for free, no email required." as Hard Sell examples; the first is slogan fragments, the second answers a worry nobody raised. The section 05 pitch still ends on three "Currently" sentences in a row. None of these is in the prompt; they need a tag or a rewrite in the kit.
8. Kit contradiction, stamps and moderation. 06B: "milestone stamps and a share card". Claude Design section: never "passport-stamp graphics". v1.4 keeps hard rule 8, so Cowork draws no stamp. 06B: "Light human check on every submission (photo plus title)". v2.2 rule 8 (draft): "Flag harmful content rather than edit or pre-approve." v1.4 says neither in copy.
9. Kit contradiction, Midnight hex (carried from v1.3, still open). v2.4 rule 1 and the swatch: #0A0B14. The CSS variable, the Claude Design token table and the paste block: #0D0F1A. v1.4 keeps #0A0B14.
10. Free, said how. Positioning rule 4: "Free stays free. Paid is for new features only, and the copy says so plainly." Section 13: say "free" once and move on, and "no paywall" is listed as reassurance nobody asked for. v1.4 tells Cowork to say "free" once in a post. Confirm how paid-tier copy should word the promise.
11. Things the kit does not settle, where v1.4 took the careful side:
    - Which 06B features are live. v1.4 treats every borrowed practice and improvement item as not live until you say so in the session.
    - Naming a platform neutrally (for example an import source). The kit bans naming and roasting; v1.4 bans a platform in a comparison or a joke and is silent on a plain factual mention.
    - "One concrete image or aside per line": does it bind every line of a 150 to 300 word LinkedIn post, or only standalone lines such as hooks, headlines, bios and captions? v1.4 quotes the kit and does not narrow it.
    - "Story pins with the washi-tape place label": named in 06B with no spec. v1.4 tells Cowork not to build it until you give one.
    - The 06B figures (the three survey percentages, the two growth numbers). The kit links a source for each, several of them secondhand ("via PPC Land", "via Bike Magazin", "via SGB Online", Wikipedia). The links were not opened or verified in this sync. v1.4 keeps the figures out of posts unless you give figure and source in the session.
12. Left untouched outside the TLL block, as instructed, but worth a later pass: the Nancy Carleton, TBC and Lub Bub flag lines still say "so v1.3 can lock these specs"; the title line, several shared sections and the Nancy Carleton interim sign-off still contain em dashes; the layover route diagram is still NANCY TO CONFIRM.
13. Kit housekeeping: in the version history the v2.6 entry sits between v1.0 and v2.0 and v2.5 sits above v2.4; in section 12 the v2.6 block sits above the v2.5 and v2.4 blocks. Nothing was committed, pushed or uploaded in this sync, and the Drive copy was not touched.

NEXT STEPS
----------
1. Review changelog above
2. Save the new prompt file
3. Replace Cowork's current system prompt with the new version
4. No re-render needed for visuals: no TLL color, font, logo or layout value changed. Recheck any TLL post drafted on v1.3 that names a platform, stacks three items, or uses a line that is now retired or undecided.
```

Brand kit sync complete. New prompt is at handoff/Cowork_ContentGen_Prompt_v1.4.md. Paste into Cowork before your next content generation session. The changelog above tells you what changed and what (if anything) needs your confirmation before this version is final.
