# Sign-off needed: items 5 and 13 (9 Oct 2026)

Nothing below is applied. Each item waits for Nancy's yes.

## Item 13: "Tell the editor" button

**Where it comes from:** the hosted site script `tll_feedback_widget_v1`. It is a fixed pill in the bottom right corner on every page, 16px from the edges on phones. On phones it sits over story text and over the cookie banner's buttons.

**Proposal (CSS override in site head only; the script stays as it is):**
1. Phones (767px and under): the pill shrinks to a 48px round ✉ button. The aria-label "Open feedback" stays, so screen readers still get a name. It gets a visible focus ring.
2. Story pages (/stories/<slug>, /paw-passport/<slug>, /marathon-diaries/<slug>): the button is hidden while the reader is in the article body. It comes back once they scroll past the end.
3. The button is hidden while the cookie banner is open.
4. Optional, needs footer sign-off: add a plain "Tell the editor" text link to TLL Site Footer that opens the same panel. With that link in place, step 2 could hide the button on story pages entirely.

Undo: delete one style block.

## Item 5: one source for counts

**The problem:** the "countries" number for Nancy is typed by hand as 87 in four places: /about (three) and the footer. Her live number lives only in her member record, and logged-out visitors cannot read it.

**Options:**
- **A (recommended):**
  - Add one field, "Countries visited", to a single CMS item. This adds a field and deletes nothing.
  - Every count on the site becomes `<span data-tll-nancy-countries>87</span>`. One small script fills those spans from the CMS item.
  - If the script fails, the typed number still shows.
  - Claude refreshes the field on request by reading her map total. That read is read-only and changes nothing in Memberstack.
- **B:** Keep the number typed, but in one place. A single script constant fills every span, so changing it once updates the whole site. This is simpler, but it is still a hand-typed count.
- **C:** Show no number to visitors who are not signed in, for example "Nancy's map →" instead of "87 countries".

**Needs Nancy:**
- Pick A, B or C.
- Approve touching the footer, because it is a shared component.
- Confirm the current number. The map dedup left 84 tokens in the old data-visited list, so 87 and 84 do not agree. Her map total is the one to trust.
