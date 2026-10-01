# EU Website Legal + Functional Audit: valideringseksperterne.dk

Filled from the site source, the 28 Sep 2026 site lab, Drive documents, and the brand profile. Every value marked "inferred, confirm" needs Nancy or Kasper to confirm before the report is final.

## SITE CONFIG

```
Site name:            Valideringseksperterne (en del af Damgaard Solutions)
Live URL:             https://valideringseksperterne.dk/
Other domains/langs:  https://valideringseksperterne.com/ and https://www.valideringseksperterne.com/
                      (intended 301 to the .dk via .htaccess; https currently serves the simply.com
                      certificate). English version lives on damgaard-solutions.com/revalidation/en.
                      damgaard-solutions.com/revalidation/da links out to the .dk (deliberate).
                      No staging URL known.
Platform:             Static index.html on Simply.com shared hosting (web hotel damgaardsolutions.dk,
                      server linux244, 93.191.156.127, folder /valideringseksperterne.dk). Not Webflow.
Legal entity:         Damgård Solutions ApS (registered name, with å; the site uses the trading
                      spelling "Damgaard Solutions"). Director: Kasper Wolter Carlsen. Founded 2 Aug 2022.
                      Confirmed by Nancy 1 Oct 2026 from the CVR register via proff.dk.
Registration no.:     CVR 43424092 (confirmed 1 Oct 2026)
VAT no.:              DK43424092 (VAT registration confirmed by Nancy 1 Oct 2026)
Registered address:   Kildehøjvej 15A, 3460 Birkerød (registered seat per the CVR register).
                      Site address shown, per Nancy 1 Oct 2026: Præstemarksvænge 10E, 4000 Roskilde, Denmark.
Country of establishment: Denmark
Audience:             B2B only (hospital sterile supply departments and technical departments,
                      secondary pharma QA). No consumer offer.
What the site does:   info only + one contact form (Web3Forms). No newsletter, bookings, checkout,
                      logins, user content, chatbot, or AI-generated media. Two photos are real
                      photographs embedded as data URIs (technician, specialist portrait): inferred, confirm
                      they are not AI-generated and that image rights are held.
Company size:         unsure (Damgaard Solutions ApS is a small specialist firm; fewer than 10 staff
                      and under EUR 2M is plausible but not confirmed). Confirm.
Known third parties:  Google Fonts (fonts.googleapis.com, fonts.gstatic.com, Montserrat),
                      Web3Forms (api.web3forms.com, form endpoint, public access key in HTML),
                      Simply.com (hosting). No analytics, pixels, maps, video, or chat found in source.
Cookie banner tool:   none
Test mode available:  no (Web3Forms has no sandbox; do not submit the live form)
Owner for fixes:      Nancy Carleton drafts; Kasper Carlsen (kca@damgaardgroup.com) approves.
```

Contact facts on the page: kca@damgaardgroup.com, +45 30 53 07 93, Mon to Fri 08:00 to 16:00 CET.

## Local source available

`../index.html` is the corrected file built 28 Sep 2026 on the 18 Aug Drive base. The live file may differ in body copy. Phase 1 must fetch the live page and diff before any finding is attributed to "live".

## Run order

1. Phase 1 to 3 need network access to valideringseksperterne.dk, valideringseksperterne.com, damgaard-solutions.com, fonts.googleapis.com, fonts.gstatic.com, api.web3forms.com. Scripts: `scripts/consent-test.js` (Playwright, fresh profile, A/B/C), `scripts/net-checks.sh` (status, redirects, TLS, headers, DNS).
2. Evidence goes to `reports/evidence/YYYY-MM-DD/`, the report to `reports/legal-functional-audit-YYYY-MM-DD.md`.
3. Everything below the SITE CONFIG in the original prompt (`/root/.claude/uploads/.../526b5dce-eu-site-legal-functional-audit-prompt.md`) applies unchanged.
