# /edit-profile embeds, 27 October 2026 (look build E1 to E11)

Page 6a0df371cd5b09ac504421ae on site 69d6145cf421c777840c1e25. Files are named by the first eight characters of the HtmlEmbed element id; the two new embeds carry working names until they are created.

- before/: all 23 embeds as live on 27 October before the build (the 26 October UX build's after copies plus the embeds it did not touch).
- after/: 2801598c (the top embed: the band's lower half, the tab-style section row, the bar, section 01), new-css-d and new-css-d2 (CSS parts D and D2, two new HtmlEmbeds after CSS part C 8ec4d875, split to stay under the embed size), new-js-e (script part E, a new HtmlEmbed after script part D 85cbe1b9). Every other embed keeps its before copy; the section numbers (E5) and the band move (E1) are done by script part E at load, so the seven section embeds are not rewritten.

Placement for the writer, in DOM order inside the members-only block of the page:
- 2801598c-...: HtmlEmbed, replace its whole content with after/2801598c.html (the before copy is before/2801598c.html; the embed's full id starts 2801598c).
- CSS part D: a new HtmlEmbed placed directly after the CSS part C embed (id starts 8ec4d875), content after/new-css-d.html.
- CSS part D2: a new HtmlEmbed placed directly after CSS part D, content after/new-css-d2.html.
- Script part E: a new HtmlEmbed placed directly after the script part D embed (id 85cbe1b9-dfb6-fddb-8b53-4df39aa8d723, the last embed), content after/new-js-e.html.
- Sizes: 4,606, 5,266, 4,887 and 3,835 characters. Every other embed stays as in before/.

/account's half of the build (E3) is src/pages/account/a3-account.js and src/pages/account/live-2026-10-27/page-footer-2026-10-27-after.html (the page footer code with the script replaced; before copy beside it).

## T1 to T3, stints (27 October 2026, handoff/CHANGE-LOG-EDIT-PROFILE-DESKS-TWICE-2026-10-27.md)
- after/85cbe1b9.html replaces script part D (the desks leave it; bar, labels and crew invite stay).
- after/new-js-f.html is a new HtmlEmbed, script part F (the desks with stints), placed right after part D (85cbe1b9).
- after/new-css-c3.html is a new HtmlEmbed, CSS part C3, placed right after CSS part C (8ec4d875).
- after/4080e4be.html replaces the directories embed (adds the Add stint button under the desk message).
- Worker: src/profile-sync.js desks years limit 40; redeploy tll-travel-wire after the page goes live (the old limit cuts a second stint).
Independent of the E1 to E11 files above (2801598c, new-css-d, new-css-d2, new-js-e); both sets can be written in one lock.

## Order of the new embeds when both sets are written (27 October 2026)
Styles, after CSS part C (8ec4d875): C3, then D, then D2 (D and D2 last, so the look rules win ties, including on the desk inputs). Scripts, after script part D (85cbe1b9): F, then E (E wraps the page's paint and must come last). Checked together on a local copy of the live page with a stand-in member: no console errors, the desks with the Add stint button inside the look's white 4 px cards, the band, tab row, bar and preview as before.

## Written to Webflow, 27 October 2026 (one write for both sets)
New HtmlEmbed element ids on page 6a0df371cd5b09ac504421ae, in DOM order after CSS part C (8ec4d875): CSS part C3 = 57e2c1d1-9f8b-7b04-d81c-00c1a1c77d44 (after/new-css-c3.html), CSS part D = 84ea086a-c02d-a1cd-062b-66bf2ec0b195 (after/new-css-d.html), CSS part D2 = ad66c9e4-efd8-6c48-4d26-9e9011ac9f2f (after/new-css-d2.html). After script part D (85cbe1b9): script part F = c6629241-3889-08c1-f06c-330b2e4dff31 (after/new-js-f.html), script part E = afd0cded-7eb3-bc8b-3f49-bc440cad511f (after/new-js-e.html). Replaced: 2801598c, 85cbe1b9, 4080e4be. All eight read back identical to the after files (script part E identical except a trailing newline). /account footer code (page 6a0d5c23c57426a9c563e8de) set to ../../account/live-2026-10-27/page-footer-2026-10-27-after.html; the live block matched the before copy first.
