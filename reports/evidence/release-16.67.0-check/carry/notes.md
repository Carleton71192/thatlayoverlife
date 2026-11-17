# Release 16.67.0 carry check (17 Nov 2026, plain GETs only)

Verdict: PASS. The test site HTML differs from www only in the core script tag (pin and SRI), the Last Published stamp and data-wf-domain.

- Pages (17): home, /stories, /about, /the-paw-passport, /travelers, /layovers, /the-map, /for-expats, /cookies, the Vietnam, Lisbon and Balkans stories, /contributors/<profile>, /account, /submit, /login, /signup. The task listed /travelers, /the-map and /for-expats twice, so /login, /signup and the Balkans story were added to reach 17.
- Fetched 10:31 to 10:32 UTC with python requests, GET only, no redirects followed: 34 requests, all 200, about 6.3 MB of HTML. No images, fonts, video or browser. No Webflow tool calls.
- Test site: page stamp 10:29:16 UTC on 17 Nov. Each page carries pin a254306f and SRI sha384-2Bc75us2... once, inside the one tll-site-layers-v16.js tag; 3df16988 and its SRI are absent.
- www: page stamp 09:06:01 UTC on 16 Nov. Each page carries pin 3df16988 and SRI sha384-trfI5wIn... once; a254306f is absent.
- Test against www: after putting the www core tag, stamp and data-wf-domain into the test page, it equals the www page byte for byte on 17 of 17 pages. html-diff-www-vs-test.txt shows the one changed segment per page (host, stamp and jsDelivr owner masked).
- Nav, footer and every form (script and style bodies hashed out) and every data-ms-* attribute are identical on 17 of 17 pages (nav-footer-forms-ms.json; hashes only).
- www did not change: byte identical to the www copies kept by judge-measure (17 Nov 00:59 UTC) on 16 of 16 and by the survey (16 Nov 14:00 UTC) on 14 of 14, and equal to the 16.66.0 carry check test copies (15 Nov) after the stamp and domain swap on 12 of 12 (www-unchanged.json). The Vietnam story has only the 15 Nov copy.
- Core: fetched once from jsDelivr (x-jsd-version a254306f), 277,485 bytes, SRI sha384-2Bc75us2J2jpgsYU/Hger8bd7CrNh9cZyfStM3otS/aENprUVw1HFUruv8eGw3cU matches. It equals git show a254306f:src/site-layers/tll-site-layers-v16.js, the committed core at 50e84bf, and a fresh build from git archive 50e84bf (24 of 24 rebuilt chunks also equal the pin tree).
- git diff 3df16988 to a254306f: one file, src/site-layers/tll-site-layers-v16.js.
- src/site/live-2026-11-17/r1667: before and after differ in one field, the tllsitelayersv16 version 16.66.0 to 16.67.0 (15 scripts, ids and order equal). The before copy equals src/site/live-2026-11-15/r1666/site-scripts.after.json.
- Method note: the first analysis pass flagged /stories nav and form blocks as different only because a form tag inside a head comment spans the core tag; the block check that hashes out script and style bodies is the one reported.
