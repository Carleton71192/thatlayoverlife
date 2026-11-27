# Class B page code drafts, 27 Nov 2026

Drafts only. Nothing here was written to Webflow, published or sent anywhere. Each item folder holds the live page custom code block
(`before.html`), the proposed block (`after.html`) and a README. Every one waits for Nancy's OK and a test-site run first.

Source: reports/evidence/sweep-2026-11-21/class-b.md and class-c.md (C01 to C14 all open). Picked only the B items that (1) can be done
entirely in one page's head or footer custom code, (2) wait on no open C question, (3) need no Designer, CMS, nav/footer component,
data-ms-*, form name or field name change, and (4) keep the block under the 50,000 character house limit.

## How the before copies were taken

Read on 27 Nov with the Webflow MCP (`get_page_freeform_code`, read only). The bytes come from the published HTML of the same page
(/submit and /my-pets: reports/evidence/release-16.69.0-live, 25 Nov; /edit-profile: the 21 Nov sweep cache), split out with
tools/page-code-from-html.py, without the trailing newline, and checked against the MCP read block by block (same style and script ids,
same distinctive lines, including the my-pets combining-mark regex). No new page loads were needed for this.
Before any write: read the block again with the MCP, compare its sha384 with `before_sri` in hashes.tsv, and stop if it differs.

`build.py` rebuilds every `after.html` and `hashes.tsv` from the `before.html` files (each replacement must match exactly once).
Tests: test/classb-2026-11-25.test.js (vitest, in the repo's mini DOM; the repo has no jsdom).

## Built drafts

| Item | Page | Page id | Block | Before chars | After chars | Before sha384 | After sha384 |
|---|---|---|---|---|---|---|---|
| B02 last 20 s of typing | /submit | 6a0d5e5eb7804d3a750dc266 | footer | 11,129 | 12,120 | PjyB0x3J... | AQ8YJB34... |
| B15 step bar | /submit | 6a0d5e5eb7804d3a750dc266 | footer | 11,129 | 11,464 | PjyB0x3J... | CEhvYmgi... |
| B02 + B15 in one write | /submit | 6a0d5e5eb7804d3a750dc266 | footer | 11,129 | 12,455 | PjyB0x3J... | Kr1usquP... |
| B18 picker roles | /submit | 6a0d5e5eb7804d3a750dc266 | head | 4,349 | 4,961 | b2Vqnu4U... | jxAINEBf... |
| B17 duplicate id | /edit-profile | 6a0df371cd5b09ac504421ae | footer | 10,269 | 10,272 | fkBzWSiL... | S+FBibXZ... |
| B08 (part 1) heading at 0 pets | /my-pets | 6a0df9ffc4a846ee4db92b63 | footer | 14,468 | 14,774 | FhGcxqRH... | PKRn2IQv... |

Characters are JavaScript string length (UTF-16 code units, what Webflow counts). Full sha384 values (hex and SRI form) are in hashes.tsv.
The largest after block is 12,455 of 50,000 (25%).

B02 and B15 change the same /submit footer block. If both are approved, write `submit-footer-B02-B15/after.html` once. If only one is
approved, write that item's own `after.html`. If one goes live first, rebuild the other from the new live block (copy it into
`before.html` and run build.py) instead of writing its old `after.html`, which would undo the first.

## Every B item, in or out

- B01 /the-map edit link: out. The fix is removing the applied script tllmapaddv2 (a registered script, not freeform code; MCP shows it
  applied in the /the-map footer) plus a Designer href change. A page code workaround would have to fight that script's 1.5 s rewrite.
- B02 /submit last 20 s of typing: IN (footer).
- B03 label For and unique ids: out. Designer (ids and Label For on three forms).
- B04 Layers drawer Tab stops: out. Map 2.0 script and a new map pin.
- B05 Receipts card and controls: out. Map 2.0 CSS and a new pin on two pages.
- B06 "Example text" placeholders: out. Designer placeholders.
- B07 copy with banned words: out. Parts 1 and 2 are Designer text. Part 3, the home JSON-LD with the banned verb (f-i-l-e-d), is the
  page's JSON-LD setting (MCP `query_pages_schema_markup` returns it as jsonLdSchema, not in the head custom code), so it is a page
  settings write, not page custom code. Side find: the same JSON-LD also says "files the logistics", "lived to file the report" and
  "files reports"; not banned words, listed for Nancy.
- B08 /my-pets heading and the /submit gate: part 1 IN (/my-pets footer, heading() at 0 pets). Part 2 (the gate h2) is Designer, out.
- B09 site head and footer near the cap: out. Site code and a core build.
- B10 footer styles to the head: out for now. Single page code, but moving each style changes its order against the five site footer
  styles that stay at the end of the body (tll-pass-a, tll-core-v2-css, tll-forms-v2, tll-note-v1-css, tll-pwa-v1-css), so equal
  rules would start to lose. Needs a per-page selector check against those five, or B09 first; nine pages.
- B11 core one-page code: out. Core build and a registered script.
- B12 four dead page scripts: out. They are applied registered scripts, removed in Page settings, not freeform code (MCP
  get_page_scripts on /stories lists tllstorycountv2 and tllstorycountv3 as applied scripts; the other two, on home and the
  Contributors Template, carry registered script names of the same form and were not read).
- B13 gate layouts: out. Designer.
- B14 button classes: out. Designer.
- B15 /submit step bar: IN (footer). The file says "page head code"; the live rules are in the footer style tll-form-steps-v2, so the
  draft changes them there.
- B16 heading scale: out. The home part has no exact replacement, /the-map part is Designer, and changing /account and /stories alone
  leaves the scale out of step with home; it needs one decision on the scale and a visual check at 390 and 1440.
- B17 /edit-profile duplicate id: IN (footer).
- B18 /submit picker roles: IN (head). The file says Designer custom attribute; the script that already sets aria-pressed on these two
  links lives in the /submit head code, so the role is set there, with Space handling that a role of button needs.
- B19 two contrast repairers: out. Core and site code, one release.
- B20 photo corners: out. Designer variables.
- B21 off-palette colors: out. "As each page is touched"; none of the pages listed is touched here, and most lines have no exact text.
- B22 spacing and left edges: out. No exact text; layout work per page.
- B23 footer headings: out. Footer component.
- B24 /login and /signup copies: out. Proposal is to keep both; no change.
- B25 two site map scripts: out. Site scripts.
- B26 dead :focus-visible rules: out. "As each page is touched"; the one rule in the touched blocks (/edit-profile head,
  `input:focus-visible+.tlled-sw`) is not dead: it draws the ring on the visible switch next to a hidden input, which the core ring
  cannot reach.

## Rollback (any item)

Write that item's `before.html` back into the same page and block with `set_page_freeform_code`, then publish. Nothing else changes:
no Designer element, data-ms-* attribute, form name or field name is touched by any draft.
