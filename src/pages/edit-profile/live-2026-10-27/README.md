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
