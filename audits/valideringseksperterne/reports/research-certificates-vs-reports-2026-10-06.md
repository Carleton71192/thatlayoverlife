# Certificates vs. reports: what the revalidation deliverable is actually called

Research memo for the Valideringseksperterne DA/EN wording decision. Date: 2026-10-06. Method: STORM-style (perspectives, questions, search, synthesis).

**Access note.** Web search worked. Direct page fetches were blocked by the session's egress proxy for every primary source tried (fsta.dk, hygiejne.ssi.dk, oslo-universitetssykehus.no, nss.nhs.scot, england.nhs.uk, iso.org, valitech.dk, sterimedical.no, melag.com, miele.co.uk, ellab.com and others), so every claim rests on search-result snippets of those pages, not a full read. Claims without a snippet are marked "unverified." The Ahrefs keyword API returned "Insufficient plan," so no search-volume numbers are given.

## Bottom line

In Danish and Nordic hospital practice the deliverable from periodic revalidation of autoclaves and washer-disinfectors is a report, built on a protocol of signed test plans and deviation sheets and verified by the customer's quality lead; the governing documents (FSTA, SSI NIR, EN ISO 17665, EN ISO 15883-1, HTM 01-01) describe documented evidence, records and a validation report, never a "certificate." The word certificate legitimately attaches only to the inputs: ISO/IEC 17025 calibration certificates for the loggers and reference thermometers, manufacturer certificates of analysis for Bowie-Dick and biological indicator lots, and pressure-equipment examination certificates. The Danish page is already right; the English page's "ISO 17665 certificates" should become "ISO 17665 revalidation report," while "traceable calibration certificates" can stay because it describes the instruments, not the outcome.

## Perspectives and findings

### 1. FSTA national guidelines (Denmark)

The autoclave guideline, "National vejledende retningslinje for revalidering af store dampautoklaver (Dampautoklaver ≥ 1 STE), Version 1, januar 2019," is published by FSTA and structured as Del I (Forberedelse), Del II (Praktiske test) and Del III (templates and examples for additional documentation tied to the test plans). Test plans include "Testplan 1: Identifikation og kompetencedokumentation (CV) for testpersonale" and "Testplan 6: Dampkvalitets test." Deviations must be approved by the customer's quality manager before corrective action and retest, and are numbered against the test plan (example AV-01-001). The PDF is a fillable form set. Source snippets: [FSTA autoclave PDF](https://fsta.dk/wp-content/uploads/2023/08/National-vejledende-retningslinje-for-revalidering-af-store-dampautoklaver_januar-2019_FSTA.pdf), [FSTA Vejledninger og materialer](https://fsta.dk/fagnetvaerk/vejledninger-og-materialer/).

The washer-disinfector guideline, "REVIDERET National retningslinje for revalidering af instrumentvaskemaskiner," final version 24 November 2022, titles its document "Revalideringsprotokol." Each test plan carries Formål, Metode, Acceptkriterier, Testresultat, Bilag, Afvigelser, Kommentarer, sign-off by the performing technician and verification by the kvalitetsansvarlig. Bilag A is the afvigelsesblad. If not all test plans are run, the risk-based rationale goes in the department's quality system, and the machine cannot be declared fully validated with reference to the standard. Source snippet: [FSTA WD PDF](https://fsta.dk/wp-content/uploads/2023/08/REVIDERET-National-retningslinje-for-revalidering-af-inst-WD_endelig-version-24.-november-2022-1.pdf), [FSTA event page](https://fsta.dk/events/national-retningslinje-for-steril-opvaskemaskiner/).

Neither snippet used the word certifikat. The FSTA vocabulary is protokol, testplan, afvigelsesblad, dokumentation, and the Danish page's "rapport (Del III)" framing matches it. Full-text confirmation that the 2019 autoclave guideline uses "rapport" for Del III was not possible (blocked fetch).

### 2. Standards (EN 285, EN ISO 17665, EN ISO 15883-1, ISO 14937)

ISO 17665:2024, "Sterilization of health care products - Moist heat - Requirements for the development, validation and routine control of a sterilization process for medical devices," is a process standard: conformance means the process is defined, validated, monitored and controlled, not that a body issues a certificate ([TÜV SÜD overview](https://www.tuvsud.com/en-ae/industries/healthcare-and-medical-devices/sterilisation-practices-control-and-validation), [ISO listing](https://committee.iso.org/standard/80271.html)). Practitioner guidance on ISO 17665-1 PQ describes records (cycle printouts, logger files, who tested and approved, test equipment with calibration information, indicator lots) attached to a report ([consteril PQ](https://consteril.com/performance-qualification/)); requalification is clause 12.4 of the 2006 edition ([R&D World](https://www.rdworldonline.com/steam-sterilizer-validation-requirements-per-the-new-standard-iso-17665-12006/)). The normative text of ISO 17665:2024 could not be read (paywalled); clause-level claims are unverified.

ISO 15883-1:2024 "specifies the methods and instrumentation required for validation, routine control and monitoring and requalification, periodically and after essential repairs," with a routine test programme in Annex A, and the test methods "can also be employed by users to demonstrate continued conformity of the installed washer-disinfector throughout its service life" ([ISO 15883-1:2024](https://www.iso.org/standard/81249.html), [AFNOR](https://www.boutique.afnor.org/en-gb/standard/iso-1588312024/washerdisinfectors-part-1-general-requirements-terms-and-definitions-and-te/xs138360/425763)). EN 285 is a product standard with test methods and "Documentation to be supplied by the manufacturer," plus Annex D guidance on IQ/OQ tests ([BSI EN 285 contents](https://accord-checkout.bsigroup.com/products/sterilization-steam-sterilizers-large-sterilizers), [Dansk Standard listing DS/EN 285](https://standards.globalspec.com/std/9984122/ds-en-285)). Dansk Standard sells these as DS/EN 285, DS/EN ISO 17665 and DS/EN ISO 15883 (Danish title of the 2024 edition not located). ISO 14937 and EN 17141 returned nothing on the deliverable name.

### 3. Danish and Nordic quality systems and audit

SSI's NIR for genbehandling (1st edition 2019) states that new autoclaves are validated to EN ISO 17665 before use, autoclaves are revalidated annually to EN ISO 17665, validation is "written documentation that the process yields reproducible results," and all processing equipment must be covered by a validation program, a planned periodic testing program and a planned maintenance program within a documented, traceable system ([SSI NIR Genbehandling](https://hygiejne.ssi.dk/NIRGenbehandling)). DDKM accreditation (IKAS) ended 30 June 2022, so it is historical only ([ISQua IKAS](https://isqua.org/ikas-accreditation/)). Oslo University Hospital's "Faglig anbefaling for tester ved validering av store vanndampsterilisatorer" (2020) and its "Forslag til valideringsprotokoll" are built on NS-EN ISO 17665, NS-EN 285:2015 and HTM 01-01 Part C, and the protocol contains sections for validation reports, test protocols and summaries ([OUS anbefaling](https://www.oslo-universitetssykehus.no/4a9543/contentassets/b55897e01c464eaeae801811c4151245/faglig-anbefaling-for-tester-ved-validering-2020.pdf), [OUS protokoll](https://oslo-universitetssykehus.fnsp.prep.nhn.no/4a954b/contentassets/b55897e01c464eaeae801811c4151245/forslag-valideringsprotokoll-2020.pdf)). A Swedish dental review says "a protocol should be compiled when the validation/performance qualification is complete" ([Tandläkartidningen](https://www.tandlakartidningen.se/media/1137/Edwardsson_6_2002.pdf)). Across DK/NO/SE the auditor-facing object is protokol/rapport.

### 4. Vendor language in DK/SE/NO

Valitech (DK) promises "comprehensive reports including all raw data, test results, deviations, attachments and recommendations" and lists revalidations at Rigshospitalet, Kysthospitalet and Slagelse ([valitech.dk](https://valitech.dk/validering)). Sterimedical (NO) says validation reports are fully digital PDFs alongside service reports ([sterimedical.no](https://www.sterimedical.no/validering/)). Belimed "creates validation reports" ([search snippet](https://api.belimed.com/assets/33483)). Miele Professional describes repeat performance qualification with data loggers and "validation" documentation ([Miele](https://miele.ie/p/validation-qualification-3097.htm)). Ellab's DANAK ISO 17025 lab supplies "a traceable calibration certificate" with each logger ([Ellab brochure](https://www.ellab.com/wp-content/uploads/2020/08/ellab-validation-solutions-brochure.pdf)); Ebro/Xylem supplies traceable factory and DAkkS calibration certificates ([Xylem](https://www.xylem.com/en-qa/products--services/services/equipment-analysis-upgrades/ebro-datalogger-calibration-and-repair-service/)). The one vendor that says "certificate" is MELAG, aimed at dental practices: "a certificate and final report" ([MELAG](https://melag.com/en/service/customer-service/validation)). Getinge Nordic wording was not found (unverified).

### 5. UK/US comparison

HTM 01-01 Part C: "The validation report should be given to the user for the plant history file and a copy retained by the test person"; the yearly test schedule equals the revalidation schedule and includes performance requalification ([HTM 01-01 Part C](https://www.england.nhs.uk/wp-content/uploads/2021/05/HTM0101PartC.pdf), [SHTM 01-01 Part C](https://www.nss.nhs.scot/media/2047/shtm-01-01-part-c-v1-sep-2018.pdf)). The UK "certificate" is the PSSR "Report of Examination Certificate" from a competent person, a pressure-safety document, not a validation outcome ([BDNJ](https://bdnj.co.uk/2024/08/06/meeting-regulations-and-maintaining-equipment-functionality/)). AAMI ST79 "is verified at the process level, not by a certificate on a box" and requires IQ/OQ/PQ records ([3M ST79 guide](https://engage.3m.com/st79guidelines), [lac.us](https://lac.us/standards/aami-st79)). Certificates of analysis accompany indicator lots ([Terragene COA](https://terragene.com/wp-content/uploads/COA/quimico/BD8948X/COA%20BD8948X.05%20-%20B30432.pdf)). An EN-reading Scandinavian buyer expects "validation report" or "requalification report."

### 6. SEO and plain language

No volume data (Ahrefs plan limit; no public comparison found). Qualitatively, Nordic vendor and guideline pages surface for "validering autoklave," "valideringsrapport" and "validation report," while "valideringscertifikat" returned no Nordic hospital pages at all. Keep "certificate" only in the calibration-certificate sense.

## What each governing document calls the output

| Document | Output term | Who signs or verifies | Uses "certificate"? |
|---|---|---|---|
| FSTA dampautoklaver, Jan 2019 | Revalideringsprotokol, testplaner, Del III dokumentation, afvigelser | Testpersonale; deviations approved by customer's quality manager | No (snippet) |
| FSTA instrumentvaskemaskiner, 24 Nov 2022 | Revalideringsprotokol, testplaner, Bilag A afvigelsesblad | Udførende tekniker signs; kvalitetsansvarlig verifies | No (snippet) |
| SSI NIR Genbehandling 2019 | Written documentation; validation, periodic test and maintenance programs | Department's documented system | No |
| EN ISO 17665 / 17665-1 | Records, report of PQ and requalification | Review and approval per QMS | No; process standard |
| EN ISO 15883-1:2024 | Validation, requalification, Annex A routine test records | User | No |
| EN 285 | Manufacturer documentation, test methods, Annex D IQ/OQ | Manufacturer | No |
| HTM 01-01 Part C (UK) | Validation report, yearly test, plant history file | Test Person, User, AE(D) | Only PSSR examination certificate |
| AAMI ST79 (US) | IQ/OQ/PQ records | Facility | No |
| ISO/IEC 17025 | Calibration certificate (clause 7.8.4) | Accredited lab | Yes, for instruments |
| Indicator manufacturers | Certificate of analysis per lot | Manufacturer | Yes, for consumables |

## Recommended wording

**Danish page (keep, tighten).** Current: "En revalideringsrapport, der konkluderer på maskinens validerede tilstand, godkendt af den kvalitetsansvarlige" and "Afvigelser føres på afvigelsesblad med nummer, rationale og korrigerende handling, og lukkes før rapporten afleveres." Both align with FSTA. Suggested addition where instruments are listed: "Alle loggere og referencetermometre har sporbare kalibreringscertifikater (ISO/IEC 17025)." Avoid "certifikat" for the outcome.

**English page (change).** Replace "ISO 17665 certificates" with "ISO 17665 revalidation report" or "a signed requalification report to EN ISO 17665 and EN ISO 15883-1, with test plans and deviation sheets, verified by your quality lead." Keep "traceable calibration certificates, every visit" but anchor it: "every logger and reference thermometer carries a traceable ISO/IEC 17025 calibration certificate." Replace the step "Certify" with "Report (Part III)" to mirror the FSTA structure, as flagged in the EN/DA discrepancy audit.

## Open questions for Kasper and Peter

1. Does the actual deliverable title read "Revalideringsrapport," "Revalideringsprotokol" or both (protocol with a concluding report section)?
2. Who signs Del III: your technician plus the hospital's kvalitetsansvarlig, or also a Valideringseksperterne quality reviewer?
3. Are logger calibration certificates appended to every report, and from which ISO 17025 lab (Ellab DANAK 520, Ebro DAkkS, other)?
4. Do any Danish hospital customers ever ask for a "certifikat"? If yes, is it the PSSR-style pressure-vessel inspection they mean?
5. Has anyone confirmed the 2019 autoclave guideline's own word for the Del III document? A full-text read was not possible here.

## Sources

- FSTA autoclave guideline PDF (snippet only): https://fsta.dk/wp-content/uploads/2023/08/National-vejledende-retningslinje-for-revalidering-af-store-dampautoklaver_januar-2019_FSTA.pdf
- FSTA washer-disinfector guideline PDF (snippet only): https://fsta.dk/wp-content/uploads/2023/08/REVIDERET-National-retningslinje-for-revalidering-af-inst-WD_endelig-version-24.-november-2022-1.pdf
- FSTA guidelines index: https://fsta.dk/fagnetvaerk/vejledninger-og-materialer/
- FSTA event page: https://fsta.dk/events/national-retningslinje-for-steril-opvaskemaskiner/
- SSI NIR Genbehandling (snippet only): https://hygiejne.ssi.dk/NIRGenbehandling
- ISQua on IKAS/DDKM: https://isqua.org/ikas-accreditation/
- ISO 15883-1:2024: https://www.iso.org/standard/81249.html
- ISO 17665:2024 listing: https://committee.iso.org/standard/80271.html
- TÜV SÜD on ISO 17665: https://www.tuvsud.com/en-ae/industries/healthcare-and-medical-devices/sterilisation-practices-control-and-validation
- R&D World on ISO 17665-1 requalification: https://www.rdworldonline.com/steam-sterilizer-validation-requirements-per-the-new-standard-iso-17665-12006/
- Consteril PQ records: https://consteril.com/performance-qualification/
- BSI EN 285 contents: https://accord-checkout.bsigroup.com/products/sterilization-steam-sterilizers-large-sterilizers
- DS/EN 285 listing: https://standards.globalspec.com/std/9984122/ds-en-285
- OUS faglig anbefaling 2020 (snippet only): https://www.oslo-universitetssykehus.no/4a9543/contentassets/b55897e01c464eaeae801811c4151245/faglig-anbefaling-for-tester-ved-validering-2020.pdf
- OUS valideringsprotokoll (snippet only): https://oslo-universitetssykehus.fnsp.prep.nhn.no/4a954b/contentassets/b55897e01c464eaeae801811c4151245/forslag-valideringsprotokoll-2020.pdf
- Tandläkartidningen (snippet only): https://www.tandlakartidningen.se/media/1137/Edwardsson_6_2002.pdf
- Valitech (snippet only): https://valitech.dk/validering
- Sterimedical (snippet only): https://www.sterimedical.no/validering/
- Belimed: https://api.belimed.com/assets/33483
- Miele Professional: https://miele.ie/p/validation-qualification-3097.htm
- MELAG: https://melag.com/en/service/customer-service/validation
- Ellab brochure (snippet only): https://www.ellab.com/wp-content/uploads/2020/08/ellab-validation-solutions-brochure.pdf
- Xylem/Ebro calibration: https://www.xylem.com/en-qa/products--services/services/equipment-analysis-upgrades/ebro-datalogger-calibration-and-repair-service/
- HTM 01-01 Part C (England, snippet only): https://www.england.nhs.uk/wp-content/uploads/2021/05/HTM0101PartC.pdf
- SHTM 01-01 Part C (snippet only): https://www.nss.nhs.scot/media/2047/shtm-01-01-part-c-v1-sep-2018.pdf
- BDNJ on PSSR certificate: https://bdnj.co.uk/2024/08/06/meeting-regulations-and-maintaining-equipment-functionality/
- 3M ST79 guide: https://engage.3m.com/st79guidelines
- lac.us on AAMI ST79: https://lac.us/standards/aami-st79
- Terragene certificate of analysis: https://terragene.com/wp-content/uploads/COA/quimico/BD8948X/COA%20BD8948X.05%20-%20B30432.pdf
- NIST on ISO/IEC 17025 clause 7.8: https://www.nist.gov/document/7-8-17025-crosswalk-reporting-results-20180201pdf
