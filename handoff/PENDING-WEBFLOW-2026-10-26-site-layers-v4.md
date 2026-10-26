# Pending Webflow change: site layers v4 (26 October 2026)

Nancy, 26 Oct, on the /account Stories tab: "Not a fan of the light blue on hover click." Built and tested offline by the cloud session; NOT applied, because the Mac session holds the Webflow lock (16:00 UTC, /edit-profile). Apply when the lock is released, or on Nancy's say-so.

## What changes
`tll-site-layers-v4.js` = v3 plus one style, `tll-tap-colors-v1` (src/site-layers/tll-tap-colors-v1.html): on the /account Stories tab, a row title and the Edit and Share links keep ink text on hover, focus and tap, with a rose underline (#C8325B). The old rule made the title bright rose on cream (fails contrast), and the site's contrast layer then recolored it from its palette, which is the pale teal Nancy saw on her iPhone. Nothing else in the bundle changes. No data-ms-* element is touched.

Offline test: a page with the account script's own styles plus v4 shows the title at rest rgb(10,11,20), on hover rgb(10,11,20) with a rose underline, and the Edit link on hover rgb(10,11,20).

## Steps
1. Commit is pushed; the pin is the commit that contains `src/site-layers/tll-site-layers-v4.js` (see git log, "site layers v4").
2. Register a hosted script `tllsitelayersv4`, version 1.0.0, hostedLocation https://cdn.jsdelivr.net/gh/carleton71192/thatlayoverlife@<pin>/src/site-layers/tll-site-layers-v4.js, integrity `sha384-DIN9zLtncXZwh1cNDoirMU+sjDezAW7sZ/T1kFW5PLPAzDWTnQCBpufNAs4EY9tv` (recompute from the committed file: git show <pin>:src/site-layers/tll-site-layers-v4.js | openssl dgst -sha384 -binary | openssl base64 -A).
3. set_site_scripts with the same 15 entries as today, `tllsitelayersv3` replaced by `tllsitelayersv4` in the header. The site stays at 15 scripts.
4. Publish to the subdomain, Nancy checks /account Stories on her phone, then the custom domains. Note the writes in WEBFLOW-LOCK.md.
