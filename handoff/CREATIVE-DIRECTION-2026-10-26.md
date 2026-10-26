# That Layover Life: creative direction (26 October 2026)

Nancy, 26 Oct: "I want the site not only to not look AI but to look professionally designed, not as home grown. Think big, add agency recommendations."

This is the brief an agency would write back. It is a direction and a plan, not a build. Nothing here touches the live site.

## 1. The diagnosis

The site has the hard part: a real idea (a travel magazine written by the people who went), real stories, a real editor, a dog with a passport, and a map people build themselves. What it lacks is a single point of view carried through every pixel. Today the home page is a sequence of good sections designed one at a time. Professional design is the opposite: a few decisions made once, then obeyed everywhere.

The tells that read as template or AI today, in order of damage:

1. The type. Playfair Display, IBM Plex Sans Condensed and JetBrains Mono is a pairing thousands of templates ship with. It is the single biggest reason the site reads as assembled rather than designed.
2. Decoration standing in for identity: numbered monospace eyebrows, tracked uppercase labels, dot separators, rotating words, coordinates in several places. Each is fine. Together they are noise.
3. Four accent treatments (rose, bright teal, dark teal, rose on light) with no rule for which means what.
4. Every section centered and stacked, the same padding, the same heading size, the same button. Rhythm without hierarchy.
5. Photos used without a treatment: different crops, different color, captions sometimes, credits never. Magazines are recognizable by how they handle photographs.
6. Icons and illustrations that could be on any site.

None of this is fixed by better copy or more polish. It is fixed by committing to one direction.

## 2. The idea to commit to

**It is a magazine. Design it like one.**

Not a platform, not a community site, not a travel app. A magazine has a masthead, a cover, a cover story, departments, a contributors page, an editor's letter and an issue rhythm. Everything on the site already maps onto that:

- Home is this week's cover and contents.
- The library is the archive.
- The Layover Letter on Sunday is the issue.
- Paw Passport, For expats, the Lounge are departments.
- The map is the reader's own page in the magazine.
- "Written by people who went" is the editorial policy, printed on the masthead.

That reframing does three things at once. It gives every page a known shape, so decisions get faster. It makes "written by the people who went" a masthead line rather than a tagline. And it is a look people already trust as professional, because the conventions are a century old.

## 3. Two directions, one recommendation

**A. The Magazine.** Editorial and calm. One serious display serif, a workhorse text face, a strict grid, big photographs with small captions, generous white space, asymmetry on purpose (a photo across eight columns, the words in three). References: Monocle, The Gentlewoman, Condé Nast Traveler's redesign, Kinfolk. Risk: too quiet if the copy is not strong. The copy is strong.

**B. The Passport.** Document-inspired and playful. Stamps, perforations, boarding-pass stubs, mono numbers used as a system, a condensed grotesque, ink on cream. References: airline ephemera, Wes Anderson title cards, Field Notes. Risk: kitsch within a year, and it competes with the photos.

**Recommendation: A, with one device borrowed from B.** The magazine as the system, and a single stamp as the brand mark: every story is stamped with its coordinates, place and date. One device, designed once, used everywhere (cards, story heads, the map, the letter, social). That is the memorable thing, and it is already in the DNA (the hero coordinates).

## 4. The system (what an agency would hand over)

### Typography
- One display face with character, licensed for web. Shortlist, all editorial and none of them template defaults: Tiempos Headline (Klim), Reckless (Displaay), GT Sectra (Grilli), Canela (Commercial), Editorial New (Pangram). Expect roughly 100 to 400 USD a year for a web license at this traffic.
- One text face that is not condensed. Candidates: Söhne, Inter Tight, Untitled Sans, or the display face's own text cut.
- Monospace retired from headings and labels. It survives in one place only: the stamp.
- Four sizes on a phone (display, heading, body, caption) and six on desktop. No clamp soup.

### Color
- Ink, cream, one rose. That is the palette.
- Rose means "you can press this", and nothing else, with the two exceptions of LIFE. in the wordmark and the stamp.
- Teal is retired as a brand color. It stays only as the layover marker on the map, where it has a job.
- Dark sections are rare and earned: the cover, the map, the letter.

### Photography
- One crop on phones (4:5), one on desktop cards (3:2), full-bleed for covers.
- One grade applied to everything: a touch warm, slightly lifted blacks, no HDR. A single Lightroom preset, applied by the editor on upload, makes two hundred phone photos look like one magazine.
- Every photo carries a caption, a place, a date and a credit, set small and in the same spot. Credits are what separate a magazine from a feed.
- A commissioned cover shoot: half a day with a Copenhagen photographer, members and the editor, at an airport, a gate, a train, a kitchen table. Not a portrait series of the editor; the magazine is the members. Six to ten usable frames for the hero, the about page, the letter and social. Expect roughly 600 to 1,500 USD. This is the single most convincing spend on the list.

### The stamp
- A custom mark, designed once as vector: a circle or oval with the coordinates around the edge, place and date inside, the TLL monogram. Slightly imperfect in print terms (an inked edge), but drawn, not a filter.
- Used on every story card, at the top of every story, on the map's country cards, on the letter, on share images.
- The stamp replaces the chapter numbers, the dot separators and most of the monospace.

### Illustration
- No generic icons. Either a commissioned set of 12 spot illustrations in one hand (an illustrator on a flat fee, roughly 1,000 to 3,000 USD), or none, and photographs do the work. The second option is honest and cheaper, and it is what most magazines do.

### Grid and layout
- 12 columns on desktop, 4 on phones, one gutter, one margin. Every element sits on it.
- Hierarchy by size and position, not by section count. The cover story gets the biggest photo and the biggest headline. The next three stories get a third of that. The departments get a row.
- Asymmetry on desktop: photo across eight columns, words in three, the stamp in the remaining space.
- White space is the luxury signal. Cut the number of sections on the home page by half and give the rest room.

### Motion
- One signature move only: the stamp landing on a story as it comes into view, or the map painting itself in. Everything else is instant. Many small animations read as template; one considered one reads as a studio.

### Voice and editorial furniture
- Headline and deck, like print: a short headline, then one sentence of deck. No UI language ("Build your free map" becomes "Your map", with the deck explaining it).
- Bylines with place and date, always: "Nancy Carleton, Copenhagen, 12 October 2026".
- The masthead line, printed once on the cover and once in the footer: "Written by the people who went. Travel stories from members around the world, edited in Copenhagen." (Nancy, 26 Oct: the site never claims that no story was written by AI, because that cannot be promised for every member; "written by the people who went" is the claim. And the site is about everyone's travel, not the editor and her dog: the cover, the contents and the contributors strip lead with members, and the editor is one byline among them.)
- Contributors page with photographs, like a magazine's.

### Components
Eight, built once as Webflow components and used everywhere: masthead, cover, story card, stamp, byline, department row, map card, letter form. If a page needs a ninth, the page is wrong.

## 5. What it would cost, three ways

**Tier 1, this session and Nancy (weeks, under 1,000 USD).** Type license, the stamp designed as vector here, the grade preset, the grid and the eight components built as phone and desktop layers over the current Webflow pages, the photo shoot booked by Nancy. Everything in sections 2 to 4 except the illustrations. Honest limit: no photographer's eye on the layouts and no second opinion.

**Tier 2, a freelance editorial designer for two weeks (roughly 3,000 to 6,000 USD).** They own the type choice, the stamp, the grid and the cover and story page designs in Figma. This session builds them in Webflow. The sweet spot for a magazine at this stage. Look for someone who has designed an actual magazine or a newspaper's digital edition, not a startup landing page portfolio.

**Tier 3, a small studio (roughly 15,000 to 40,000 USD).** Strategy, identity refresh including the wordmark, art direction, the shoot, templates for every page, a brand book. Worth it after there are fifty stories and a reason to raise money or sell ads. Not before.

Recommendation: Tier 1 now, with the photo shoot and the type license as the two real purchases, and Tier 2 in the new year if the magazine idea holds.

## 6. Order of work, Tier 1

1. Decide the direction (A with the stamp) and the display face. One day, with specimens set in our actual headlines.
2. The stamp, designed and tested at 32px and 320px.
3. The home cover at phone and desktop, as a standalone prototype with the new type, the grade and the stamp, using existing photos. Approve.
4. The story page the same way. Approve.
5. Build: type loaded, components in Webflow, pages switched over one at a time behind the lock, with before and after screenshots.
6. The shoot, then the hero swap.
7. The masthead line, the contributors page, captions and credits on every photo in the CMS.

## 7. What to decide now

1. Direction A with the stamp, or B.
2. Pick a display face from the shortlist, or ask for specimens set in our headlines first.
3. Tier 1 now, Tier 2 later, or Tier 2 now.
4. Yes or no to booking a half-day shoot in Copenhagen.
