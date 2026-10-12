# Country page 3.0 build progress (agent opus-5.5|claude-code|k7c3x)
Started 2026-10-12. Template page id (from proposal): 6a8afbda8e907b41c4da10a1

## Applied
(nothing yet)
- Originals saved: orig/template-head-orig.html, orig/template-footer-orig.html, orig/template-jsonld-orig.json, orig/stories-items.json. Page scripts: tllmapaddv2 1.0.0 footer (leave).
- Countries: no Antarctica item and no Kosovo item exist (filters by name/slug/iso2 verified).
- Story picks (live, published): Brazil -> Pantanal 6ac869cbead7f028cee5bcba (newest; Northern Brazil 6ab3fd224172c39c5a9bb87c older);
  Denmark -> Sort Sol 6aba3c84cd900e0a6152a28a; Tanzania -> Kilimanjaro someone was already awake 6aca68363e10fde58370d9a5;
  Mexico -> La Paz whale sharks 6a96a65a420f652aaea264a3; Chile -> Patagonia W trek 6a96a65a420f652aaea264a1; Antarctica -> SKIP (no Countries item).
  Country item ids: BR 6ab4c642bf853b11d9521a51, DK 6a8afc5dbbe4ec84f69815fe, TZ 6ab64ec594788ceb9c9732f1, MX 6ab4cd1af2a356af6daf4f3a, CL 6ab4c642bf853b11d9521a61
- [DONE 05:57Z] Story Ref set on BR, DK, TZ, MX, CL (ids above). Kosovo created 6acc76bd3a9cce2ac9c52ca1 (slug kosovo, XK, Pristina, Europe/Southeast Europe, Albanian, Serbian, EUR Euro, +383, neighbors, flag emoji, data-ok false, data-flags hand-entered note, verdict). Left empty: iso3, tld, population etc, tier, story-ref, one-word.
- [DONE] publish_collection_items on those 6 items: no errors.
- [DONE] Created hero Image e1e1be5d-c8dd-d315-41c5-06536bf91a4b (prepend in hero fe23acf8), attrs data-ct3=hero-img fetchpriority=high aria-hidden=true. Binding: PENDING
- [DONE] hero Image bound assetId -> Story Ref:Hero image (ce80...:::0332...), altText static ''. Ref field id format: <storyref>:::<storyfield>
- [DONE] Created helper DOM div 5068a4a6-2fd9-a58c-2190-1d8a6ddd70fa (append in hero wrap f08ba2cf) data-ct3=src hidden aria-hidden. Attribute bindings: PENDING
- [DONE] helper 5068a4a6 attribute bindings: data-name, data-iso, data-checked, data-adv-url, data-adv-checked, data-fcdo-url, data-fcdo-rev, data-oneword, data-s-name, data-s-slug, data-s-pillar, data-s-rt, data-s-pub (data-ok switch cannot bind to attribute)
- [DONE] Created span 950d5665-1ef1-143f-6861-6293c7dda125 data-ct3=dataok inside helper. Visibility binding to Data OK: PENDING (429)
- [DONE] dataok span visibility bound to Data OK switch.
- [DONE] Created RichText e162b052-2c16-7a8f-f5e9-08835bc5a0b9 (append in QA card 96c39349) data-ct3=qa-src aria-hidden. Binding: PENDING
- [DONE] Created Image 6e59be24-37c5-a37c-0b1a-ca7a9839bd3f (prepend in #tll-filed-link ad9bde0e...a2a0) data-ct3=filed-img. Binding: PENDING
- [DONE] qa-src richText bound -> Story Ref:Quick answers; filed-img assetId bound -> Story Ref:Hero image, altText ''.
- [DONE] Created bar div 00612df1-6bcd-c141-4baf-1d24f66b40d7 (data-ct3=bar, after hero) with child b30ceced-fe14-df5c-6189-86ef5f99f89b (data-ct3=bar-wrap). MOVED places 0a06dc6f (unchanged, children intact) into bar-wrap.
- [DONE] role=heading aria-level=2 added on 002b2ed3 (facts label), 262b2ccb (one word label), ad9bde0e...a29b (filed eyebrow), 74778250 (wire label, data attr kept), 3d2fe7c2 (subs label).
- [DONE] Text: h2 c62b593b 'Open slot.' -> 'What do travelers say about this country?'; facts label string 002b2ed3...4812 'Quick facts · checked against public data' -> 'At a glance' (script writes '{Country} at a glance').
- [DONE] Template HEAD written (og:image line commented + <style id=tll-ct3-country-v1>); readback == template-head-new.html byte for byte (24590 chars).
- [DONE] Template FOOTER written (orig + <script id=tll-ct3-country-js-v1>). Readback verified (see below).
- [DONE] Countries Template JSON-LD: crumb 2 Countries(/countries) -> Destinations(/destinations); verified.
- [DONE] /countries (6a8b07db18f836c65f4a3dfe) JSON-LD description: removed "Six filed, 189 to go." (open point 20). Original in orig/countries-forward-jsonld-orig.json.
- [FAILED, Designer step] loading=eager / width / height attributes on the hero and filed images are reserved (API internal error). Set Load: Eager on hero image in Designer.
- [DONE] Mock tests in test/ (gen.py, shot.mjs; screenshots bulgaria/denmark/chad/kosovo at 1280 and 375): no JS errors, no horizontal scroll, no visible target under 44px, FAQPage only with answers, noindex only on Chad/Kosovo-type pages.
NOT published. Site publish left to main session.
