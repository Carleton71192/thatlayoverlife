# /share-photos v3: contract between tll-photos-form-v1 (script) and tll-photos-v3 (CSS)

Source of truth: reports/page-simplify-2026-10-12/share-photos.md, sections 3, 4 and 8. This file lists only what the script creates or toggles, so the CSS stage can match it. Nothing here changes any input, name, id, data-ms-* attribute or the form's attributes.

## Where things land after the script runs (form children, in order)

1. `fieldset` Your photos: `legend`, `p.tll-pen-help`, `label.tll-photos-drop` (drop zone, holds `#photos-upload`), then new: `span#tll-err-photos.tll-pen-error[hidden]`, `div#tll-photos-file-errors.tll-photos-file-errors[aria-live=polite]`, `ul#tll-photos-list.tll-photos-list[role=list][hidden]`, `p#tll-photos-count.tll-photos-count[role=status][hidden]`.
2. `fieldset` The story: `legend`, `p.tll-pen-help`, `div.tll-pen-grid-2` now holding the Country label then the Caption label (moved, reorder only), then new: `button#tll-more-detail-btn.tll-pen-disclosure`, `p.tll-pen-disclosure-help`, `div#tll-more-detail.tll-pen-panel > div.tll-pen-panel-inner` holding (moved) City label, Year label, Trip type label and the whole pet `fieldset` (its legend is now a nested legend; its `span.tll-pen-label` …86c4 carries `.tll-photos-vh`, added by the script).
3. `fieldset` Your credit: `legend`, `p.tll-pen-help`, the credit `label.tll-pen-field` (radios), then new `p#tll-credited-as.tll-credited-as` (hidden unless "My name" is checked), `button#tll-more-share-btn.tll-pen-disclosure`, `div#tll-more-share.tll-pen-panel > div.tll-pen-panel-inner` holding (moved) the syndication `label.tll-pen-field` with its `div.tll-pen-checkboxes`.
4. New `div.tll-pen-promises[role=group][aria-labelledby=tll-promises-label]`, a DIRECT CHILD OF THE FORM after the credit fieldset. In the Designer tree the promises label and the three promise rows sit inside the credit fieldset (not at form level as row 9/21 describe), so the script reorders the wrapper to form level; this is what makes section 8's `form > .tll-pen-promises > .tll-pen-legend::before` counter rule match. Children, in order: `div.tll-pen-legend#tll-promises-label` (the existing label div, id added), new `p#tll-photos-summary.tll-photos-summary[hidden]`, then the three promise `label.tll-pen-field.tll-pen-field-inline` rows, each followed by its new error span `span#tll-err-rights`, `span#tll-err-license`, `span#tll-err-people` (`.tll-pen-error[hidden]`).
5. `div.tll-pen-actions`: submit input, `span.tll-pen-status[role=status][aria-live=polite]`.

Also: `span#tll-err-country.tll-pen-error` right after the Country label (inside the grid), `span#tll-err-year.tll-pen-error` right after the Year label (inside the More detail panel).

Without the script: the promises label is `form > fieldset > div.tll-pen-legend` (inside the credit fieldset). If the no-script counter should still number it, add `form > fieldset > div.tll-pen-legend::before` beside the two selectors in section 8; with the script that selector no longer matches, so there is no double number.

## Classes and attributes the script toggles (style these)

- Drop zone `label.tll-photos-drop`: `.is-dragover` added on dragenter, removed on dragleave and drop. Hover and focus-within are CSS only.
- Disclosure buttons `button.tll-pen-disclosure[type=button]`: `aria-expanded` true/false. Text only; the chevron is a CSS pseudo-element rotated 90° under `[aria-expanded=true]`. Closed by default; the script opens a panel on load when a field inside holds a value or sessionStorage (`tllPhotosPanels`) says it was open. Opening on load happens in the same task as insertion, so no transition plays.
- Panels `div.tll-pen-panel`: `.is-open` added when open. Closed: `grid-template-rows:0fr; visibility:hidden` (nothing inside is tabbable); open: `1fr; visibility:visible`. Inner `div.tll-pen-panel-inner`: `overflow:hidden; min-height:0`. Section 8 timings: 200ms open, 150ms close, cubic-bezier(0.23, 1, 0.32, 1); `transition: visibility 0s 200ms` on close only.
- Explainer `p.tll-pen-disclosure-help`: 13px #6B6660. The chevron is `button.tll-pen-disclosure::after` (no element).
- Invalid field: the control gets `aria-invalid="true"` and its wrapping label gets `.is-invalid` (so no `:has()` is needed for the 1.5px #C8325B border or the card border on a promise row). `.tll-pen-error` is a 13px Rose text span; style `.tll-pen-error[hidden]{display:none}` explicitly because `[hidden]` loses to any `display` rule on the class.
- `p#tll-credited-as.tll-credited-as`: 13px line under the radios. Uses the `hidden` attribute; add `[hidden]{display:none}` for it as well.
- `p#tll-photos-summary.tll-photos-summary`: 13px #6B6660, `hidden` until a photo and a country are in.
- File list rows `li.tll-photos-row`: children `div.tll-photos-thumb` (64px, `overflow:hidden`; holds `img` with an object URL, sized by CSS to the tile: `display:block; width:100%; height:100%; object-fit:cover`, or `.is-blank` with the file extension as text when the preview cannot decode: Cream tile), `div.tll-photos-meta` with `span.tll-photos-name` (ellipsis) and `span.tll-photos-size` ("3.2 MB"), `button.tll-photos-remove[type=button]` (44px, aria-label "Remove {filename}", text "Remove"). Each new row carries `--tll-i` (0, 1, 2 within the batch just added) for the stagger: `animation: tll-row-in 180ms cubic-bezier(0.23, 1, 0.32, 1) both; animation-delay: calc(var(--tll-i, 0) * 40ms)` from `opacity:0; transform:translateY(6px)`. Removal is instant (node removed). Under reduced motion keep an opacity fade of 150ms or less and no transform.
- `p.tll-photos-file-error`: 13px Rose text, one per rejected file, inside `#tll-photos-file-errors`.
- `#tll-photos-list[hidden]` and `#tll-photos-count[hidden]`: nothing shows under the drop zone until a file is chosen; style both `[hidden]{display:none}`.
- `.w-form-done` gets `tabindex="-1"` (focus target). The fade from @starting-style is CSS.

## Strings the script writes (all from section 4, plus two it had to invent)

Section 4, exact: "More detail (optional)", "City, year, trip type and a pet in the shot. None of it is required.", "Where else it may appear (optional)", "Remove" with aria-label "Remove {filename}", "{n} of 12 chosen.", the three file errors, "Credited as {first name} {last name}, from your account.", "Credited with the name on your account.", the summary forms, the four inline errors, "{n} things to fix above." and "One thing to fix above.".

Invented (not in section 4, flagged for Nancy): "Choose your photos again." (count line, only in the row 13 fallback when the browser cannot rebuild a FileList), and the singular-with-year summary "1 photo from {where}, {year}." which follows the section 4 pattern. {where} is "{city}, {country}" when a city is given, else the country.

## Behavior notes the CSS does not need but the reviewer does

- Submit check runs in the capture phase on the form; on failure preventDefault plus stopImmediatePropagation, so Webflow's handler never posts. Focus goes to the first failing control. Whenever the year is among the failures the More detail panel opens first (not only when the year fails first), so its error is visible, counted and reachable by Tab. The button is never disabled by the script. `form.noValidate` is set only when the check is installed.
- The status span's footnote text is captured on load and restored when the last error clears.
- Memberstack: one read-only `getCurrentMember()` once `window.$memberstackDom` exists (polled 40 x 250ms); keys `first-name` and `last-name` (confirmed against the app's custom fields). Absent Memberstack leaves the fallback line.
- Chosen files merge across picks and drops up to 12 (so a second pick adds, it does not replace); duplicates by name, size and lastModified are skipped. Object URLs are revoked on remove. A drop and a Remove change the input without a change event, so after either the script clears the photos error itself when files are present and recounts the status line, the same as onEdit does for the picker path.

## Structural assumptions the CSS makes (keep these when the script moves nodes)

- Every text input and select stays inside `fieldset.tll-pen-fieldset … label.tll-pen-field` (descendants, any depth). The input rules carry that chain, specificity (0,4,2), because tll-forms-v2 reaches the same inputs at (0,4,0) with `!important`. A moved label keeps its input inside it; the panels sit inside their fieldsets (…86bd and …8709).
- The file input …8687 stays inside label.tll-photos-drop …8688 (same reason, (0,4,3)).
- The submit button …870b stays inside div.tll-pen-actions …870e, and the status span …870d stays after it in the same div.
- `#tll-credited-as` sits right after label …86dd (the line pulls itself up by 8px into that label's 16px margin).
- Error spans: `#tll-err-photos` right after label …8688; `#tll-err-country` right after label …8693 inside the grid …86b5; `#tll-err-year` right after label …869b inside the panel; `#tll-err-rights`, `#tll-err-license`, `#tll-err-people` right after their promise cards. The script empties a span to hide it (`:empty` hides it) or sets the hidden attribute.
- `#tll-photos-summary` is the first child of `.tll-pen-promises`, before the legend div; the wrapper is created in place inside fieldset …8709 (a direct child of the form also numbers correctly).
- `.tll-photos-vh` goes on span.tll-pen-label …86c4, never on label …86c6 (the label keeps the input visible). The script adds it in step 5, right after the pet fieldset moves into the panel (no Designer class op); the CSS rule is in section 4 of tll-photos-v3.
- The script adds no Webflow classes (`w-input`, `w-button`) to the elements it creates; the CSS does not rely on them.
- Panels toggle `.is-open` on the panel and `aria-expanded` on the button together; the CSS reads both.
- The site a11y script pads links and buttons on coarse pointers with inline padding; the back link, the Remove buttons and the disclosure buttons already meet 24px / 44px so it leaves them alone.

## Gate block elements the Apply stage adds (row 30; class names as used in tll-photos-v3.html, lines 181 to 190)

Inside `div[data-ms-content=anonymous]` (…872a) > div (…8729) > `div.tll-container.inline-div-1` (…8728), after `p.tll-lede` (…8722) and before the button row `div.inline-div-0` (…8727):

- `div.tll-photos-preview` (Webflow DivBlock) holding three `div.tll-photos-preview-row` (DivBlock). Each row has exactly two children, because the row grid is 64px + 1fr: `div.tll-photos-preview-word` (Webflow TextBlock; the word: Drop, Where, Send) and `p.tll-photos-preview-text` (Paragraph; the sentence from section 4).
- then `p.tll-photos-public-line` (Paragraph): "Every photo in the Lounge was taken by a member and sent with their permission."

After the button row: `div.tll-photos-age` (TextBlock): "Free. Travelers are 16 and older."

The word and the age line are TextBlocks (div), as section 5 step 4 asks ("small text block"), not spans or paragraphs; every gate rule is class-scoped, so the tag does not matter. None of the six class names existed on the site before (query_styles on "tll-photos", 13 Oct); the Apply stage creates them as empty styles only if the element builder refuses unknown names. Nothing here touches data-ms-content, the two buttons or tllgateflashv1. The apply plan is apply-plan.json next to this file (ops 42 and 43).
