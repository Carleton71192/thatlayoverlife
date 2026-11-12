# Layover bridge (prototype)

A block that sits between two sections of a story and asks two things about the story's country: put it on your map, and are you passing through its airport. Open `index.html`, pick the Denmark or Brazil story, and scroll. Mock-up only: nothing here is loaded by the live site.

## How the brief is met

- **Inline, mid-article, slides in at a reading break.** The block sits after the first section of a sample story page, before the second real section heading. An IntersectionObserver brings it in as it enters view: from 0.6 opacity and 8px down to rest in 250ms, transform and opacity only. If the block is already on screen it does not move. With reduced motion, or without JavaScript, it is simply there at full opacity.
- **Left: "Add [Country] to your map".** One press toggles it to "Saved to your map ✓" and back. It is a real `<button>` with `aria-pressed`, and a polite live region says "Denmark saved to your map." or "Denmark taken off your map." The pressed look is the one the site's button layer already gives Been here / Want to go (Midnight fill, cream text), and the block's label, "Denmark, and you?", is the line the live pair already sets.
- **Right: "Have a layover here?".** A disclosure button (`aria-expanded`, `aria-controls`) opens three bullets for CPH and a link to the full guide. The bullets are the guide's own "In short" box, word for word apart from US spelling (center, harbor). If the story's airport has no guide, the right side reads "No layover guide for this airport yet" with "Write the GRU guide →" linking to /submit, the same place the /layovers page sends people to write one.
- **Country is a variable.** `PLACES` holds Denmark (CPH) and Brazil (GRU). Whether a guide exists is computed by looking the airport up in `GUIDES`, the two live guides. Nothing is typed per country.
- **Clean, modular HTML and Tailwind.** The block is one template function (`bridgeHTML`) with Tailwind classes on the brand tokens (configured inline from Brand Kit v2.4). Behavior is one delegated click handler keyed to `data-tll-bridge-*` attributes, with no inline handlers. The "The markup, as built" section shows the exact markup for the selected story and copies it.

## Where I departed from the brief's wording, and why

- **"Ad-free editorial look".** Story pages run ads, so the page never says ad-free. The block avoids looking like an ad: it is a cream panel between hairlines, like the rest of the magazine, with no logo on it.
- **"Two elegant options" that "pull focus".** It uses the kit's outlined button for both. The filled rose button stays free for the story's own main call to action, since the kit allows one per group.
- **"Saved".** The pressed label is "Saved to your map ✓". A bare "Saved" loses its meaning for anyone who scrolls back to it later.
- **US spelling in the CPH bullets.** The live guide's "In short" box says "centre" and "harbour". The bridge uses "center" and "harbor", so it quotes the guide closely rather than letter for letter. The guide's own box is worth the same fix (its "Getting in and out" section already says "city center").
- **The note under the save button** reads "Saves with your Been here and Want to go picks." rather than promising a spot on the profile map, because today the record those buttons write never reaches the map. See decision 1.
- **Brief headline wording** is not used on the page, and no story headline, story text or caption was written. Every title is quoted from the site.

## Real vs SAMPLE

Real: both story titles, places, bylines, dates, read times and deks (from the live pages and the library data), the section headings used as reading breaks (the stories' own h2s), both hero photos (downloaded from each story's hero image, downscaled under 60 KB, credited "Photo: Nancy Carleton" with a link to the story), the two guide titles and URLs, and the three CPH lines. The guide count in the notes is computed from the data.

SAMPLE: the story paragraphs are labeled gray bars ("Sample · Story paragraph"). The save is kept in this browser only (localStorage inside try/catch; the page works without it), which the page says under the block.

## Testing note

The sandbox blocks cdn.tailwindcss.com. For the review pass and the screenshots, the browser was handed the Tailwind Play CDN build 3.4.10 (the closest copy available offline) in place of the blocked `https://cdn.tailwindcss.com/3.4.17` request, so every class on the block was compiled by real Tailwind. The published file still loads 3.4.17. If Tailwind ever fails to load (or JavaScript is off), the page adds `no-tw`/`no-js` and the block falls back to plain CSS on its class hooks, so it still reads properly. Checked at 390, 768 and 1440 with keyboard and pointer: no sideways scroll, no console errors, axe-core finds no violations with the panel open, pressed, or on the Brazil story, every control is at least 44px tall with a visible focus ring, reduced motion shows the block at rest, and the Brazil state renders the no-guide side. Without JavaScript the save half steps aside (it cannot work) and the CPH guide shows open.

## Moving it onto the real site

Production would not use Tailwind (the site has none, and the 15-script cap rules out adding a runtime). The real version is one site layer, `tll-bridge-v1`, made of a small CSS block on the same class hooks (`.tll-bridge`, `.tll-bridge__save`, `.tll-bridge__layover`, `.tll-bridge__panel`) and a script, bundled into the existing site-layers build so it adds no new script tag.

- **Where it goes.** The script inserts the block before the second h2 of the story body (falling back to after the third paragraph) and never at the same break as the in-story ad slot.
- **The save reuses the existing Been here / Want to go code, not a new store.** `tll-places-js-v1` already reads the country from the byline place or breadcrumb, makes the key, and writes Memberstack JSON `tllPlaces[key] = {state, name, at}`. The bridge button would call that same code, writing `state: 'want'` (or whatever Nancy picks below), and repaint both the story's pair and the bridge, so the two always agree. Logged out, it does what the pair does today: sends the reader to log in and come back.
- **The guide lookup.** A small map from country (or story city) to airport code, and from airport code to the live guide's slug and its "In short" lines, read from the layover guides collection rather than kept in the script.

## Nancy needs to decide

1. What "Add to your map" saves: Want to go (my default here), Been here, or a third state. Also whether `tllPlaces` should show on the member map at all; today the places code deliberately leaves `tllStates` (the map's own data) alone, and the live buttons say "Saves to your lists". If the answer is no, the button should say "Add Denmark to your list" instead of "map".
2. How a story picks its airport. One airport per country is fine for Denmark and wrong for Brazil (GRU, GIG, SSA and more). A per-story airport field in the CMS would be the cleanest answer.
3. Whether the no-guide side should show on every story without a guide (most of the library today) or only on stories in countries where someone plausibly lays over.
4. Whether to fix "centre" and "harbour" in the live CPH guide's "In short" box, so the guide and the bridge match.
