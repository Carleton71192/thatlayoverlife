# Legal and functional audit: valideringseksperterne.dk

Site: Valideringseksperterne (en del af Damgaard Solutions), https://valideringseksperterne.dk/
Date: 30 Sep 2026. Status: DRAFT, offline pass only. Live phases pending network access.

This is a technical compliance review, not legal advice. Items tagged NEEDS COUNSEL should be confirmed by a qualified lawyer.

## Update 6 Oct 2026: live HTML received, findings re-checked against it

Nancy supplied the live `index.html` (saved as `../index-live-2026-10-06.html`). Against the live file:
- L01, L02, L16 (CVR, VAT, registered name, seat): absent on live, now in the merged `index.html` footer and JSON-LD.
- L05 (privacy policy): the live legal links go to https://damgaard-solutions.com/privacy-policy and /cookie-policy, which are real policy URLs, so the "links to the homepage" finding came from the older base and does not apply to live. Still open: confirm those policies name the .dk, Google Fonts and the server logs. Severity drops from Critical to Medium.
- L06, L07 (contact form, Web3Forms): the live page has no form, only email and phone. Both findings do not apply. The processor list shrinks to Simply (hosting) and Google (fonts).
- L03 (Google Fonts before consent): still true on live and on the merged file. Fix D still applies.
- New on live, fixed in the merged file: the four team portraits were loaded from cdn.prod.website-files.com (Webflow's CDN), a third-party request on every page load, undisclosed anywhere. They now ship from `img/` on the same host.
- L04 (server cookies), F01 (TLS, headers, redirects, Lighthouse): still NOT VERIFIED, the host is still blocked from this environment.

## What was tested and what was not

Tested (source-based, on the corrected `index.html` built 28 Sep 2026 from the 18 Aug Drive base): company identification in the page, every third-party host referenced in the HTML and JS, the contact form's fields, endpoint and spam guard, cookies or storage set by the page's own JavaScript, presence of a consent banner, image alt text, language attribute, legal page links, claims that need substantiation, and an axe-core run on the local file in headless Chromium at 390px (0 violations, from the 28 Sep site lab).

Not tested (the cloud environment's network policy blocks every outbound host, including the site, valideringseksperterne.com, Google Fonts, Web3Forms, EUR-Lex, retsinformation.dk, Datatilsynet and the CVR register): the live page and whether it matches this file, the three-way consent test in a fresh browser, server-set cookies, TLS certificates and expiry, HTTP to HTTPS redirect, security headers, SPF, DKIM and DMARC, whois, Lighthouse on the live URL, the 404 page, and the .com redirect. Every such item is marked NOT VERIFIED below. `dig` and `whois` are not installed here; DNS records were read with dnspython through Google's public resolvers, which did work (see F05 and F06).

Legal sources could not be re-read from this environment, so the rules cited are as known to the auditor as of mid-2026 and must be re-checked against the Sources list before the report is treated as final.

## Scorecard

| Area | Result | Open items |
| --- | --- | --- |
| 2.1 Company identification | FAIL on live, PASS in corrected file | 3 fixed locally (CVR, registered seat label, registered name spelling); VAT registration unconfirmed |
| 2.2 Cookies and tracking | PARTIAL | 1 verified (Google Fonts from Google servers before any consent), rest NOT VERIFIED |
| 2.3 Privacy and GDPR | FAIL | 4 (no privacy policy on the site, form has no notice, Web3Forms and Simply DPAs unconfirmed) |
| 2.4 Consumer law | NOT APPLICABLE | B2B only, no checkout |
| 2.5 Accessibility | PASS on the local file, scope NEEDS COUNSEL | 0 axe violations locally; EAA scope depends on company size |
| 2.6 AI transparency | PASS pending confirmation | 1 NEEDS OWNER CONFIRMATION (photo provenance) |
| 2.7 Platform duties | NOT APPLICABLE | no user content |
| 2.8 Other legal flags | PARTIAL | 2 (image licenses, "SFDA-aligned" and "30+ års" substantiation) |
| Phase 3 functionality | PARTIAL | 2 verified (no SPF or DMARC on the .dk or .com; DMARC p=none on damgaardgroup.com), live HTTP, TLS and Lighthouse checks pending; local file is clean at 375 and 1440 |

## Top 5 fixes

1. Upload the corrected file, which now carries the registered name "Damgård Solutions ApS", CVR 43424092 and the Birkerød seat in the footer (done locally 1 Oct 2026 after Nancy confirmed the register entry). Danish law requires the CVR on the website, and the E-Commerce Directive requires the name, geographic address and registration number to be easy to find from every page.
2. Publish a privacy policy on the .dk (or link to the real Damgaard Solutions policy page, not its homepage) that names Damgaard Solutions ApS as controller, the contact form processing via Web3Forms, Google Fonts, retention, and the right to complain to Datatilsynet. Add a cookie page with the same accuracy.
3. Put a one-line privacy notice with the policy link directly above the "Send forespørgsel" button.
4. Self-host the Montserrat font files so no request goes to Google before any consent. Today the browser contacts fonts.googleapis.com and fonts.gstatic.com on every load.
5. Fix the valideringseksperterne.com certificate (Simply ticket B, already drafted) so the https redirect to the .dk works and visitors never see a certificate warning.

## Findings

| ID | Area | Severity | Page | What is wrong | Evidence | Rule | Suggested fix | Effort | Tag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| L01 | 2.1 | Critical (live), fixed in corrected file | / (footer) | No CVR number and no VAT number anywhere in the live page. CVR 43424092 and VAT registration confirmed by Nancy on 1 Oct 2026. Corrected `index.html` now shows "CVR 43424092" and "Momsnr. DK43424092" in the Kontakt column, the CVR in the copyright line, and `vatID` in the JSON-LD. | 18 Aug base: `grep -c CVR` = 0; corrected file: Kontakt column and copyright line | E-Commerce Directive 2000/31/EC Art. 5(1)(d) and (g); Danish E-handelsloven §7; CVR display duty for Danish companies | Upload the corrected file. | S | FIX (applied locally) |
| L02 | 2.1 | Medium, fixed in corrected file | / (footer) | Two addresses with no indication which is the registered office. Nancy chose Roskilde as the location the site shows (1 Oct 2026). The register ties the CVR to Kildehøjvej 15A, 3460 Birkerød, so the corrected file shows "Præstemarksvænge 10E / 4000 Roskilde, Denmark" as the address and one line "Hjemsted (CVR): Kildehøjvej 15A, 3460 Birkerød" beneath it. The JSON-LD ProfessionalService address is Roskilde; the parentOrganization address is the Birkerød seat. | footer "Adresser" column | Art. 5(1)(b) geographic address of establishment | Upload the corrected file. If the Birkerød line should go, the register address then appears nowhere on the site; keep it unless counsel says otherwise. | S | FIX (applied locally) |
| L16 | 2.1 | Medium, fixed in corrected file | / (footer) | The registered legal name is "Damgård Solutions ApS" (with å). The page used only the trading spelling "Damgaard Solutions ApS", so the legal name as registered never appeared. Corrected file: copyright line now reads "© 2026 Damgård Solutions ApS (Damgaard Solutions), CVR 43424092", the Kontakt column shows "Damgård Solutions ApS, CVR 43424092", and the JSON-LD parentOrganization carries `legalName`, the CVR as an identifier, and the Birkerød address. | CVR register via proff.dk (Nancy, 1 Oct 2026) | Art. 5(1)(a) name of the service provider; Danish E-handelsloven §7 | Upload the corrected file. Use the same pairing on damgaard-solutions.com and damgaardgroup.com footers (separate task). | S | FIX (applied locally) |
| L03 | 2.2 | High | / | Montserrat is loaded from fonts.googleapis.com and fonts.gstatic.com on page load. The visitor's IP reaches Google before any consent and the site has no banner. Danish and German regulators treat this as a transfer needing a legal basis. | `<link href="https://fonts.googleapis.com/css2?family=Montserrat...">` in head | GDPR Art. 6, 44 to 49; ePrivacy Art. 5(3); Datatilsynet guidance on third-party requests | Download the five Montserrat weights as woff2, upload to /valideringseksperterne.dk/fonts/, replace the link with @font-face. See Draft fix D. | S | FIX |
| L04 | 2.2 | NOT VERIFIED | / | Whether the server (Simply) sets any cookie, and whether any request other than fonts and the form fires. Page JS sets no cookie, localStorage or sessionStorage and loads no analytics, pixel, map, video or chat. | source grep: none of document.cookie, localStorage, gtag, dataLayer, fbq, hotjar, clarity | ePrivacy Art. 5(3); Cookiebekendtgørelsen | Run `scripts/consent-test.js` mode A when the network allows. If no non-essential cookies appear, no banner is required; keep the cookie page truthful ("ingen cookies"). | S | NOT VERIFIED |
| L05 | 2.3 | Critical | / (footer, form) | No privacy policy on the site. The "Privatlivspolitik" and "Cookiepolitik" links both point to https://damgaard-solutions.com (homepage), not to a policy. | `<a href="https://damgaard-solutions.com">Privatlivspolitik</a>` | GDPR Arts. 12 to 14 | Either publish /privatlivspolitik.html on the .dk or link to the exact Damgaard Solutions policy URL, and make sure that policy names the .dk, Web3Forms and Google Fonts. See Draft fix B. | M | FIX, NEEDS COUNSEL for wording |
| L06 | 2.3 | High | /#kontakt | Contact form collects name, email, company, message with no purpose statement, no privacy link near submit, no retention statement. Fields are minimal (good). No marketing consent is requested (good, none needed). | form markup: inputs Navn, E-mail, Virksomhed, Besked; no text containing "privat" inside `<form>` | GDPR Art. 13 at point of collection | One line above the button: "Vi bruger dine oplysninger kun til at besvare din henvendelse. Læs vores privatlivspolitik." See Draft fix C. | S | FIX |
| L07 | 2.3 | High | /#kontakt | Web3Forms (api.web3forms.com) receives every submission and relays it by email. It is a processor. The public access key is in the HTML, which is how Web3Forms works, but it means anyone can send mail through that key to the configured inbox (spam risk, not a data leak). | `fetch('https://api.web3forms.com/submit')`, hidden `access_key` | GDPR Art. 28 | Confirm a DPA with Web3Forms is accepted (their terms include one), record it, and enable domain restriction on the key in the Web3Forms dashboard. | S | NEEDS OWNER CONFIRMATION |
| L08 | 2.3 | Medium | hosting | Simply.com hosts the page and server logs (IP addresses). | site config | GDPR Art. 28 | Confirm Simply's databehandleraftale is signed in the Simply control panel. | S | NEEDS OWNER CONFIRMATION |
| L09 | 2.3 | NOT VERIFIED | / | HTTPS everywhere, HSTS, redirect from http. Form posts over https (verified in source). | `fetch('https://api.web3forms.com/submit')` | GDPR Art. 32 | Run `scripts/net-checks.sh`. | S | NOT VERIFIED |
| L10 | 2.5 | Low | / | axe-core on the corrected local file: 0 violations at 390px. The live file is an older version and, per the 28 Sep site lab, had 29 color-contrast failures. EAA scope: the site is B2B information with a contact form, so the EAA's e-commerce scope most likely does not apply, and a microenterprise service provider is exempt anyway. Company size is unconfirmed. | 28 Sep axe run (audits/valideringseksperterne report) | EAA Directive 2019/882, Danish Lov om tilgængelighedskrav for produkter og tjenester; WCAG 2.1 AA via EN 301 549 | Upload the corrected file (already scheduled). Confirm headcount and turnover to settle scope. No accessibility statement needed if out of scope. | S | FIX (upload), NEEDS COUNSEL (scope) |
| L11 | 2.6 | Low | / | No chatbot, no AI-generated text disclosure needed (marketing copy, human-reviewed). Two photographs embedded: technician in a sterilizer chamber, specialist portrait. If either is AI-generated and looks real, Art. 50(4) labeling applies. | two `<img>` data URIs, alt text present | EU AI Act Art. 50 (applies from 2 Aug 2026) | Confirm both photos are real photographs with usage rights. | S | NEEDS OWNER CONFIRMATION |
| L12 | 2.8 | Medium | / | Claims to substantiate: "30+ års teknisk erfaring", "Kalibrerede referenceinstrumenter (Ellab/Ebro-klasse)", footer "EU GMP Annex 1, SFDA-aligned", "Sporbare certifikater". "SFDA-aligned" is a Saudi regulator reference on a Danish hospital page and reads as a leftover from the Damgaard Solutions footer. | footer `<p>Specialiserede pharma-ingeniører, indlejret fra dag ét. EU GMP Annex 1, SFDA-aligned.</p>` | Markedsføringsloven §5 and §6 (misleading claims); Marketing Practices Act | Keep only claims the team can document on request. Replace the footer line with the .dk's own positioning (hospital revalidering). | S | FIX, NEEDS OWNER CONFIRMATION |
| L13 | 2.8 | Low | / | Image and font licenses: Montserrat is SIL OFL (fine to self-host). Photo rights unconfirmed. | | copyright | Record the source of both photos. | S | NEEDS OWNER CONFIRMATION |
| L14 | 2.8 | Low | / | Legal pages in every offered language: the site is Danish only (lang="da") and links to the English version on damgaard-solutions.com. Once L05 is fixed, the Danish policy covers the .dk. | `<html lang="da">` | Art. 5 and GDPR Art. 12 (clear and plain language) | None beyond L05. | S | FIX (with L05) |
| L15 | 2.4 | NOT APPLICABLE | | B2B only, no checkout, no prices shown as consumer offers ("Fast pris pr. enhed" without a figure). No ODR link present (correct, the platform closed 20 Jul 2025). | | Consumer Rights Directive, Omnibus | None. Revisit if a consumer offer is ever added. | | |
| F01 | Phase 3 | NOT VERIFIED | all | Live status codes, redirect chains, 404 page, TLS validity and expiry, security headers, whois expiry, Lighthouse mobile, console errors on live. | | | Run `scripts/net-checks.sh` and `scripts/consent-test.js` once the network allows. | | NOT VERIFIED |
| F05 | Phase 3 | Medium | DNS | valideringseksperterne.dk has no MX, no SPF and no DMARC record, so anyone can send mail that claims to come from @valideringseksperterne.dk (the form's hidden `from_name` is "Valideringseksperterne.dk", which invites that impression). valideringseksperterne.com has no TXT records at all and resolves to 93.191.156.251, a different Simply host than the .dk (93.191.156.127), which is consistent with the .com serving Simply's own certificate. | dnspython via 8.8.8.8, 30 Sep 2026: .dk A 93.191.156.127, TXT only google-site-verification, MX NoAnswer, _dmarc NoAnswer; .com A 93.191.156.251, _dmarc NXDOMAIN | GDPR Art. 32 (security), general anti-spoofing hygiene | Add a null SPF `v=spf1 -all` and `_dmarc` TXT `v=DMARC1; p=reject; rua=mailto:kontor@damgaardgroup.com` on both the .dk and the .com in the Simply DNS panel, since neither domain sends mail. | S | FIX |
| F06 | Phase 3 | Low | DNS (damgaardgroup.com) | The contact mailbox domain has SPF `v=spf1 include:spf.protection.outlook.com -all` (good) and DMARC `p=none` with strict alignment and reports to kontor@damgaardgroup.com. p=none only monitors; it does not stop spoofed mail. DKIM selector1 and selector2 lookups timed out from this environment. | dnspython, 30 Sep 2026 | Security hygiene | After a few weeks of clean DMARC reports, move to `p=quarantine`, then `p=reject`. Confirm DKIM is enabled in Microsoft 365 (selector1/selector2 CNAMEs). | S | FIX, NOT VERIFIED (DKIM) |
| F02 | Phase 3 | Low | / | The corrected local file renders with no horizontal scroll at 375 and 1440 and has a spam honeypot (`botcheck`) on the form. The live file overflowed by 12px at 390px (fixed in the corrected file). | 28 Sep axe run and width check | | Upload the corrected file. | S | FIX (upload) |
| F03 | Phase 3 | Medium | https://valideringseksperterne.com | Serves the simply.com certificate over https, so the .htaccess 301 to the .dk never runs for https visitors (28 Sep site lab). | 28 Sep lab, not re-verified here | GDPR Art. 32 (security) and plain UX | Simply ticket B, drafted in the site lab report. | S | FIX (ticket) |
| F04 | Phase 3 | Low | / | Favicon: none declared on live (likely the console 404 seen on 28 Sep). Corrected file adds an inline SVG icon. | 28 Sep lab | | Upload the corrected file. | S | FIX (upload) |

Severity note: L01 and L05 are Critical under the prompt's own definition (missing company ID, no privacy information for personal data collected by the form).

## Third-party inventory

| Vendor | Domain | What it does | Loads | Disclosed in privacy policy | Disclosed in cookie declaration |
| --- | --- | --- | --- | --- | --- |
| Google Fonts | fonts.googleapis.com, fonts.gstatic.com | Serves Montserrat CSS and woff2 files; Google receives visitor IP and user agent | On every page load, before any consent, no banner exists | No policy exists on the site | No declaration exists |
| Web3Forms | api.web3forms.com | Receives contact form submissions and emails them to the configured inbox | Only when the visitor submits the form | No | Not a cookie |
| Simply.com | valideringseksperterne.dk (hosting) | Web hosting, server logs | Always | No | NOT VERIFIED whether the server sets a cookie |
| Damgaard Solutions | damgaard-solutions.com | Outbound links only (English version, legal links) | On click | n/a | n/a |

No analytics, tag manager, pixel, heatmap, map, video embed, chat widget or CDN script was found in the source.

## Draft fixes (for approval, not applied)

### A. Footer company identification (Danish): APPLIED to the corrected index.html on 1 Oct 2026

"Kontakt" column now reads:

```html
<div class="foot-col">
  <p class="label">Kontakt</p>
  <p>Damgård Solutions ApS<br>CVR 43424092<br>Momsnr. DK43424092</p>
  <a href="mailto:kca@damgaardgroup.com">kca@damgaardgroup.com</a>
  <a href="tel:+4530530793">+45 30 53 07 93</a>
  <p>Man-fre 8:00-16:00 CET</p>
</div>
```

"Adresser" column (Roskilde chosen by Nancy, 1 Oct 2026; Birkerød kept as the registered seat):

```html
<p>Præstemarksvænge 10E<br>4000 Roskilde, Denmark</p>
<p>Hjemsted (CVR): Kildehøjvej 15A, 3460 Birkerød</p>
```

Copyright line: `© 2026 Damgård Solutions ApS (Damgaard Solutions), CVR 43424092. Alle rettigheder forbeholdes.`

JSON-LD: the ProfessionalService carries `vatID` and the Roskilde address; `parentOrganization` carries `legalName`, the CVR `identifier`, `vatID` and the Birkerød seat. If you transplant into the live file instead of uploading whole, copy these three footer edits across too.

### B. Legal links

```html
<span><a href="https://damgaard-solutions.com/PRIVACY-POLICY-PATH">Privatlivspolitik</a> · <a href="https://damgaard-solutions.com/COOKIE-POLICY-PATH">Cookiepolitik</a></span>
```

Replace the two paths with the real Damgaard Solutions policy URLs, or publish `privatlivspolitik.html` and `cookiepolitik.html` in the /valideringseksperterne.dk folder. The Danish policy must name Damgaard Solutions ApS as dataansvarlig, list Web3Forms and Google Fonts (or state that fonts are self-hosted after fix D), give retention for form submissions, list the rights under GDPR Arts. 15 to 22, and state the right to complain to Datatilsynet. Wording: NEEDS COUNSEL.

### C. Form notice (Danish)

Insert directly above the submit button:

```html
<p class="lf-note">Vi bruger kun dine oplysninger til at besvare din henvendelse. Læs vores <a href="PRIVACY-URL">privatlivspolitik</a>.</p>
```

with CSS `.lf-note { font-size: 13px; color: rgba(255,255,255,0.85); margin: 0 0 12px; } .lf-note a { color: #FFFFFF; text-decoration: underline; }` (white on Navy passes contrast).

### D. Self-host Montserrat

1. Download Montserrat weights 300, 400, 600, 700, 800 as woff2 (Google Fonts download or google-webfonts-helper), place in `/valideringseksperterne.dk/fonts/`.
2. Remove the two `<link rel="preconnect">` lines and the `<link href="https://fonts.googleapis.com/...">` line.
3. Add to the top of `<style>`:

```css
@font-face { font-family: 'Montserrat'; font-weight: 300; font-display: swap; src: url('fonts/montserrat-300.woff2') format('woff2'); }
@font-face { font-family: 'Montserrat'; font-weight: 400; font-display: swap; src: url('fonts/montserrat-400.woff2') format('woff2'); }
@font-face { font-family: 'Montserrat'; font-weight: 600; font-display: swap; src: url('fonts/montserrat-600.woff2') format('woff2'); }
@font-face { font-family: 'Montserrat'; font-weight: 700; font-display: swap; src: url('fonts/montserrat-700.woff2') format('woff2'); }
@font-face { font-family: 'Montserrat'; font-weight: 800; font-display: swap; src: url('fonts/montserrat-800.woff2') format('woff2'); }
```

Montserrat is licensed under the SIL Open Font License, which permits self-hosting.

### E. Footer positioning line

Replace "Specialiserede pharma-ingeniører, indlejret fra dag ét. EU GMP Annex 1, SFDA-aligned." with "Planlagt revalidering af sterilisatorer og vaskedekontaminatorer til hospitaler i Skandinavien." (reuses existing page claims, drops the SFDA reference).

## Changes since last audit

No previous legal audit exists in `reports/`. The 28 Sep 2026 site lab (SEO, accessibility) is the only prior report; its open items (canonical, GPTBot 429, .com certificate, contrast) are carried in L10, F02, F03 and F04.

## Sources (not re-verified from this environment; re-check before finalizing)

- Directive 2000/31/EC (E-Commerce Directive), Art. 5: https://eur-lex.europa.eu/eli/dir/2000/31/oj
- E-handelsloven (Denmark), §7: https://www.retsinformation.dk/eli/lta/2002/227
- Regulation (EU) 2016/679 (GDPR), Arts. 5, 6, 12 to 14, 28, 32, 44 to 49: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- Directive 2002/58/EC (ePrivacy), Art. 5(3): https://eur-lex.europa.eu/eli/dir/2002/58/oj
- Cookiebekendtgørelsen (BEK nr 1148 af 09/12/2011): https://www.retsinformation.dk/eli/lta/2011/1148
- Datatilsynet, vejledning om cookies og tredjepartsindhold: https://www.datatilsynet.dk/
- Markedsføringsloven (LBK nr 866 af 15/06/2022), §5, §6, §10: https://www.retsinformation.dk/eli/lta/2022/866
- Directive (EU) 2019/882 (European Accessibility Act): https://eur-lex.europa.eu/eli/dir/2019/882/oj
- Lov om tilgængelighedskrav for produkter og tjenester (Denmark): https://www.retsinformation.dk/
- EN 301 549 / WCAG 2.1: https://www.w3.org/TR/WCAG21/
- Regulation (EU) 2024/1689 (AI Act), Art. 50: https://eur-lex.europa.eu/eli/reg/2024/1689/oj
- Regulation (EU) 2022/2065 (Digital Services Act): https://eur-lex.europa.eu/eli/reg/2022/2065/oj
- ODR platform discontinuation (Regulation (EU) 2024/3228): https://eur-lex.europa.eu/eli/reg/2024/3228/oj
- Web3Forms privacy and DPA: https://web3forms.com/privacy
- Simply.com databehandleraftale: https://www.simply.com/
- SIL Open Font License (Montserrat): https://openfontlicense.org/
