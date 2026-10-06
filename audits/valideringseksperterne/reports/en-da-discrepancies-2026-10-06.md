# EN (Webflow) versus DA (.dk) revalidation pages, 6 Oct 2026

Compared: `https://damgaard-solutions.com/revalidation/en` (Webflow page 6a5de69ed53727dee37b413b, last edited 6 Oct 09:32) and the Danish static page in this folder (`index.html`, the file now live on valideringseksperterne.dk). The Webflow Danish twin `/revalidation/da` (page 6a5f1a49d664dbb93f36f995) is included because it duplicates the .dk.

Read through the Webflow Data API (page content, page metadata, JSON-LD, assets, shared components). Nothing was changed in Webflow.

## Photos

| Slot | EN today (1 Sep set, 1800 x 1012, dark grade) | Proposed (Nancy's 6 Oct set) |
|---|---|---|
| Scope section | chamber interior (asset 6a96c967fb2cfdda96c92c7f) | new chamber interior |
| Agreement section | reference instruments (6a96c9671aab9a7c4f7ea403) | new reference instruments (probes on blue towel) |
| Why Damgaard section | probe handling (6a96c967bacbcd3d3c264459) | new water quality / pH test |
| Open Graph image | chamber interior, same asset as Scope | new chamber interior (or the probes photo to match the .dk share image) |
| Unused asset | water quality pH (6a96c9670a4b5077d4debcb1) | retire once replaced |

The .dk uses: chamber under the hero, pH in Omfang, sterilizer room beside the installation-validation note, probes as share image. The EN layout has no hero image slot and no installation-validation section, so the mapping above keeps the EN structure and swaps pictures only. The sterilizer-room and wrapped-packs photos stay in reserve unless a new section is added.

The Webflow DA page `/revalidation/da` uses the same three old photos and still points at the OLD headshots (Morten.png from 14 Jul, peter-mastrup-headshot.jpg from 14 Mar, two LinkedIn-export jpegs). EN was switched to the 2026 headshots this morning; DA was not.

## Copy and facts

1. **Guidance versus law.** EN: "Regulation requires it." Webflow DA: "Loven kræver det." The .dk says FSTA's national guidelines and never calls it law. The FSTA documents are vejledende retningslinjer. Recommend EN "Guidelines require it" or "The guidelines require it", DA "Retningslinjerne kræver det".
2. **Certificates versus reports.** EN meta description, FAQ and scope promise "ISO 17665 certificates" and "traceable calibration certificates, every visit". The .dk promises a revalideringsrapport approved by the quality lead, plus deviation sheets, and never says certificate. One of the two is the real deliverable. NEEDS CONFIRMATION from Kasper or Peter before either page is edited.
3. **FSTA missing on EN.** The .dk is built on FSTA (16 and 17 test plans, water quality, Testplan 4, 5, 6). EN mentions FSTA only inside Peter's bio. For a page that targets Denmark first, the scope block and standards chips should name FSTA. Norway and Sweden readers lose nothing.
4. **"Capacity is scarce. The pharma boom is absorbing Nordic validation talent."** Not on the .dk, not sourced. Suggest replacing with the .dk's "an in-house department is expensive to keep alive" argument, which is verifiable.
5. **"NIR / SSI" chip.** Appears on EN and Webflow DA, not on the .dk. NIR are SSI's infection-hygiene guidelines, which is a fair reference, but the .dk roster of standards (FSTA, DS/EN 285, DS/EN ISO 17665, DS/EN ISO 15883-1 and -2, DS/EN ISO 14937) is the agreed set. Align or keep deliberately.
6. **Installation validation disclaimer** ("Vi laver ikke den første installationsvalidering") exists only on the .dk. It is a useful expectation-setter and belongs on EN too.
7. **Four steps differ.** EN: Schedule, Revalidate on site, Certify, Renew. The .dk: Planlægning, Forberedelse Del I, Praktisk test Del II, Rapport Del III, which mirrors the FSTA three-part structure. If the FSTA framing is the strategy, EN should adopt it.
8. **FAQ count.** EN five, the .dk six (adds "Hvad hvis vi ikke vil køre alle testplaner?"). Worth porting.
9. **Valeria's bio** opens with "CQV engineer" on all three pages. Flagged earlier as a copy-rule question for Damgaard; unchanged here.
10. **Hero eyebrow** on EN reads "DAMGAARD SOLUTIONS · Revalidation SERVICE" in the source (mixed case). CSS uppercases it, so it renders fine, but the text node should be consistent.

## Technical and SEO

11. **Duplicate Danish page.** `/revalidation/da` on Webflow and `valideringseksperterne.dk` now both target the same Danish queries. Until 6 Oct the .dk declared the Webflow page canonical, so Google kept the Webflow one. The .dk is now self-canonical, so the two compete. Options: (a) 301 the Webflow DA page to `https://valideringseksperterne.dk/` (Webflow site settings, Redirects), which is the clean fix, or (b) set the Webflow DA page to draft after the redirect is in place. Page-level canonical is not available on Webflow, so a redirect is the native tool. Decision for Nancy.
12. **No hreflang either way.** EN has no `hreflang="da"` pointing to the .dk and the .dk has no `hreflang="en"` pointing to EN. Add `<link rel="alternate" hreflang="en" href="https://www.damgaard-solutions.com/revalidation/en">` to the .dk head, and the matching `hreflang="da"` plus `x-default` in the EN page's custom head code.
13. **JSON-LD.** EN has Service, FAQPage and BreadcrumbList; Webflow DA has Service and BreadcrumbList only (no FAQPage although it has FAQs). Neither names the parent company's legal name or CVR, which the .dk does via ProfessionalService. EN provider url is `www.damgaard-solutions.com`; the Breadcrumb uses the same host. Consistent with itself. If the DA page is redirected, its JSON-LD becomes moot.
14. **Fonts.** The Webflow site's global embed imports Montserrat 500 and Inter 400/500 from Google Fonts. The .dk now self-hosts Montserrat. Same legal note as before (Google Fonts request on every EN page view). Site-wide change, not page-level.
15. **Footer legal line.** Webflow footer shows "Damgård Solutions ApS · CVR 43424092" and both addresses, and the copyright says "Damgaard Solutions". Matches the .dk in substance. The .dk also lists the VAT number (DK43424092); Webflow does not. Minor.
16. **CTA link.** EN sends readers to "valideringseksperterne.dk · kca@damgaardgroup.com · +45 30 53 07 93". The .dk is Danish only, so an English reader lands on a Danish page. Keep the email and phone, consider dropping the domain from the EN line.

## Proposed change list (awaiting approval; nothing published)

A. Upload the three new photos to Webflow assets (chamber, water quality pH, reference instruments; 1280 x 720 JPG, 86 quality) with descriptive alt text, and swap them into the EN page's three image slots. Set the EN Open Graph image to the new chamber photo.
B. Apply the same three photo swaps to the Webflow DA page and move its four headshots to the 2026 assets EN already uses.
C. Copy fixes on EN that need no fact check: "Regulation requires it" to "Guidelines require it"; eyebrow casing; add FSTA to the scope block and standards chips.
D. Hold for confirmation: certificates versus reports (item 2); whether to port the FSTA four-step structure, sixth FAQ and installation-validation note (items 6 to 8); the duplicate-page decision (item 11).
E. The .dk side: add the `hreflang="en"` link to `index.html` (one line, re-upload index.html only).

Everything in A to C lands unpublished in the Designer. Publishing stays with Nancy.
