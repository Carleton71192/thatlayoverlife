# Homepage 3.0: proposed changes (for Nancy's approval)

Sources:
- handoff/claude-design-source/v3/ (TLL Site Prototype 3.0, tll-system.css, PROMPT.md, "Homepage 3.0 feedback 2026-10-09.md", audit-2026-10-09.md)
- The live homepage (page 69d6145df421c777840c1e46), read 11 Oct 2026.

## How it gets built

- **Draft page first.** It goes on a new draft page, `/home-3-preview`, which is never published. Nancy can review it in the Designer. The live homepage does not change until Nancy approves.
- **Moving it onto the homepage.** The new sections are HTML embeds plus one page style block that uses the tll-system.css tokens. Because of that, moving them onto the homepage after approval is a copy, not a rebuild.
- **Old sections are hidden, not deleted.** Every element ID, data-* attribute and form name stays.
- **Not touched:**
  - TLL Nav v1, TLL Site Footer and the floating button.
  - Memberstack blocks.
  - Story CMS items and slugs.
- **tll-system.css loads on the homepage only for now.** Its classes only take effect inside .tll-page, so other pages cannot shift.

## Section by section

| # | Section | Change | Live parts kept |
|---|---|---|---|
| 1 | Hero | Keep the photo, the eyebrow, the h1 "Find your next *somewhere*." and the sub line. Replace the two buttons with four: Read the stories (/stories), Send your trip (/submit), Send a photo (/share-photos), Build your map (/the-map, which asks to sign up or log in). Add the vertical side line "A travel magazine for people who get lost on purpose" and the scroll cue. | The h1, the image asset and its alt text |
| 2 | Intro and chips | New heading, "Trips worth putting on *Klarna.*", with Nancy's final paragraph. Pillar chips (All plus the five lenses) with aria-pressed; they filter the shelf. | None |
| 3 | Shelf | "Chapter 01 · Already on the shelf": a pinned shelf that scrolls sideways. 8 stories, newest first, with the same daily rotation as today. Each card links to its live /stories/ URL. No "The Library" label. | The stories come from the live CMS (the same data the current shelf embed uses) |
| 4 | Search | "Search it", with the new helper line. The existing GET search form to /stories is kept and restyled, so its id, its name and its Turnstile bypass stay. The "Try" terms come from real stories. | Form c618aa80 |
| 5 | Ch.02 contributor | "You went. *Write it down.*" Nancy's heading and paragraph. Luggage tag reading "CPH → anywhere", without "Handle with opinions". Two buttons: Send your trip and Send a photo. Replaces the current "tll-comm" block, which gets hidden. | None |
| 6 | Ch.03 passport | "Track how you *see your world.*" A big counter, the stamp copy and the button "Open the passport". No "sample data". | Counter source (see open point 4) |
| 7 | Ch.04 map | "THE MAP, WITH RECEIPTS": "Every place you have been, *in one spot.*" with Nancy's line and "Build your map". This merges in the summary block that went live on 9 Oct. Story countries shown in rose come from the live country pages. The "countries still open" figure is calculated, never typed. | The profile summary embed's content moves in here |
| 8 | Ch.05 Paw Passport | Rose panel, "Traveling with your bestie, *whatever the species.*", Nancy's line, and "Open the Paw Passport". The photo is magnus-holi-side.jpg, uploaded as a site asset. Magnus's country count comes from his CMS list (tllfactsv1), not typed. Replaces the current #paw-passport section, which gets hidden. | His CMS count |
| 9 | Ch.06 Layover Lounge | "The photos that made the next trip look *affordable.*" with Nancy's paragraph. Postcards, "See the Lounge" and "Send a photo". Replaces the current #layover-lounge section, which gets hidden. | Photos (see open point 5) |
| 10 | Ch.07 newsletter | "Your inbox deserves *better than deals.*" with "Send It →" (protected lines), wired to the same newsletter form the site uses now. | The existing newsletter form and its action |

Removed from the homepage (hidden, not deleted):
- The boarding pass.
- "Handle with opinions".
- The Doha ad-slot image under the shelf.
- The already-hidden hero strip, side hero and old map wrapper stay hidden.

## SEO, AEO and accessibility

- **Headings:** one h1 in the hero and one h2 per chapter.
- **Alt text and contrast:** alt text on every image; teal text on light is #067A79 and small rose text on light is #C8325B, both 4.5:1 or better.
- **Search:** the search input keeps its label.
- **Focus:** visible focus on every control.
- **Motion:** prefers-reduced-motion turns off the pinned scroll and the tilts.
- **Structured data and metadata:** existing JSON-LD is checked first, then Organization and WebSite (with a SearchAction to /stories?q=) are added if missing. The title, meta description and canonical are kept unique, and "library" stays in the title.

## Open points (Nancy)

1. **"48 hours" line.** The contributor paragraph's "reply within 48 hours" would become "review it within 48 hours", per the kit rule. OK?
2. **"actually" in the Klarna paragraph.** It appears once. OK?
3. **Hero coordinates.** The prototype shows "12.17° N 68.99° W CURAÇAO" on the hero. Is the hero photo Curaçao? If not, the coordinates come out.
4. **Passport counter.** The prototype says "0/193". The site's counting rule uses 249 (confirmed 9 Oct). Proposal: show "0 / 249" signed out, and the member's own Lived + Stayed total signed in.
5. **Lounge postcards.** The prototype shows Doha, Patagonia, Accra, Rio and Paris. The bundle has no Paris photo. Proposal: use five real Lounge photos with their real places.
6. **Slug changes.** Moving /share and /gallery to new slugs is still waiting on the 301 redirects. The new buttons use /submit and /share-photos, which work today.
