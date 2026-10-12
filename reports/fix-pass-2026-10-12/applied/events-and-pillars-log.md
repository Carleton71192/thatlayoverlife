# GA4 events + thin-pillar noindex: applied 12 Oct 2026 (UNPUBLISHED)

Site: That Layover Life (Webflow 69d6145cf421c777840c1e25). Both edits are saved in Webflow but **not published**. Nothing was published, no data-ms-* attribute or Memberstack form markup was touched, site head is unchanged (checked on read-back). No git commit.

## Edit 1: consent-gated GA4 events (site footer freeform code)

- What changed: one new `<script id="tll-ga4-events-v1">` appended at the very end of the site footer block. Every byte before it is unchanged (the AFTER file starts with the full BEFORE file). Block size went from 25,654 to 30,103 characters.
- No new registered script, no Consent Mode, no change to the CookieConsent wiring or the GA tags in the head.
- Helper: `window.tllEv(name, params)` calls `gtag('event', ...)` only when `window.gtag` exists AND `CookieConsent.acceptedCategory('analytics')` is true. Everything is wrapped in try/catch, written in ES5 (eslint with ecmaVersion 5 passes), and `window.tllEv` is the only global it adds.
- Events:

| Event | Trigger | Params |
|---|---|---|
| story_submitted | /submit only. Fires when the `.w-form-done` next to the form becomes visible (MutationObserver on style), so failed sends don't count. Fires at most once per form per page load. Write form = `form[data-tll-form="submit-story"]`. Link-out form = form or wrapper named "Link-out story", or a form with `input[name="external-url"]`. | `{type:'write'}` / `{type:'link_out'}` |
| newsletter_signup | Same `.w-form-done` pattern, on any page, for forms whose `.w-form` wrapper has an `input[type=email]`. Skips the submit, link-out and share-photos forms, any form inside `[data-ms-form]` (Memberstack), and the home search form (`#Search-the-library`). | `{location: location.pathname}` |
| sign_up | /signup only. Waits up to 10 s for `$memberstackDom.onAuthChange` and subscribes to it (read only, no other Memberstack calls). Fires the first time a member object appears, unless sessionStorage `tllSignupEv` is already set, and then sets that flag. | `{method:'memberstack'}` |
| kofi_click | Delegated click (capture) on links whose href contains `ko-fi.com` | `{link_domain:'ko-fi.com'}` |
| guide_checkout_click | Delegated click on an http(s) link inside `#guide` or `[data-tll-paw-guide]` whose host is not the current site | `{link_domain: hostname}` |
| affiliate_click | Delegated click on `a[rel~="sponsored"]` or `a[data-tll-affiliate]` | `{link_domain: hostname, story: location.pathname}` |

No full URLs or query strings are sent; only the hostname and the page path.

- Files: `site-footer-ga4-events-before.html`, `site-footer-ga4-events-after.html`, `site-footer-ga4-events-readback.html` (read-back is byte-identical to AFTER, checked with `cmp`), `events-and-pillars-build.py` (builds AFTER from BEFORE and asserts the anchors), `ga4-events-test.mjs`.
- Checks: `node --check` passes for all 6 inline scripts in the AFTER block. The new script also passes an ES5-only parse.

### Offline test (Playwright, Chromium 1194, mock pages on http://tll.test via page.route)

The test loads the full AFTER footer block, with `window.gtag` stubbed to record calls and `CookieConsent.acceptedCategory` stubbed to return true, then false. The CDN request is aborted, so the stub stays in place. Result: **26/26 PASS, no page errors.**
- Consent accepted:
  - Ko-fi click: 1 kofi_click.
  - Write form done shown, hidden, shown again: 1 story_submitted `{type:'write'}`.
  - Link-out form done: 1 `{type:'link_out'}`.
  - Share-photos form done: no event.
  - Newsletter form done shown twice: 1 newsletter_signup `{location:'/newsletter/'}`.
  - Search form and `data-ms-form` form with email fields: no event.
  - Affiliate links (rel sponsored, and data-tll-affiliate): 2 events, each `{link_domain, story}`.
  - Guide links: the external one fired 1 event `{link_domain:'checkout.gumroad.com'}`; the internal one fired none.
  - No payload contains `http`, `?` or a query value.
  - Memberstack stub callback called with null, then the same member twice: 1 sign_up `{method:'memberstack'}`. After a reload, no repeat (sessionStorage flag).
- Consent declined: 0 events of any kind for the same actions.

## Edit 2: noindex for thin pillar pages (Pillars Template 6a0b29c7d081332e9219016e, page footer)

- What changed: one statement added to `tll-pillar-shelf-v2`, right after the last change to `n` (the layover-guides / paw-passport extra-list line) and before the empty-state line:
  `if(n<3&&slug!=='paw-passport'&&slug!=='stories-from-the-road'&&!document.querySelector('meta[name="robots"]')){...append <meta name="robots" content="noindex, follow"> to document.head...}`
  The rest of the block is byte-identical (the diff is exactly one added line).
- Files: `pillars-template-footer-before.html`, `-after.html`, `-readback.html` (byte-identical to AFTER), `pillars-noindex-test.mjs`.
- Test (6/6 PASS):
  - cultural-intelligence with 1 match: noindex added.
  - travel-logistics with 3 matches: no meta.
  - layover-guides with 0: noindex.
  - stories-from-the-road with 1: no meta.
  - paw-passport: no meta.
  - A page that already has a robots meta: left as is, no duplicate.
- With today's data this adds noindex to /pillars/cultural-intelligence, /pillars/travel-logistics and /pillars/layover-guides (unless layover-guides has 3 or more layover items). It keeps /pillars/stories-from-the-road and /pillars/paw-passport indexable.
- Note: Google only sees this noindex after rendering the JavaScript. The pillar items are still `includeInSitemap:true`. Removing the thin ones from the sitemap is a separate step that hasn't been done.

## What Nancy checks after publishing

1. Publish the site in Webflow. Neither edit is live until then.
2. GA4 DebugView. Open the site with `?gtm_debug=x`, or with the Google Analytics Debugger extension, in a fresh window and click **Accept all** on the cookie banner. In GA4 > Admin > DebugView, check that these arrive:
   - **kofi_click**: no Ko-fi link exists yet, so it fires once one is added.
   - **story_submitted**: send a real test story on /submit for both the write form and the link-out form.
   - **newsletter_signup**: sign up on /newsletter with a test email.
   - **affiliate_click**: click any sponsored link in a story.
   - **sign_up**: create a test member on /signup.
   - **guide_checkout_click**: fires once the guide has a checkout link.
3. Repeat in a new private window with **Reject all**. DebugView should show nothing (GA doesn't load at all).
4. Once the events show up, mark story_submitted, newsletter_signup and sign_up (and kofi_click if wanted) as key events in GA4 Admin > Events.
5. Pillars: open /pillars/cultural-intelligence, check in DevTools > Elements that `<meta name="robots" content="noindex, follow">` is in `<head>`, and that /pillars/stories-from-the-road has none. Optionally run URL Inspection in Search Console. Remove the thin pillar items from the sitemap if wanted.

## Caveats

- newsletter_signup applies to any non-excluded Webflow form with an email field. If a contact-style form with an email field is added later, it will count as a newsletter sign-up unless it carries `data-tll-form`.
- sign_up depends on Memberstack calling onAuthChange on /signup before it redirects away. If the redirect happens first, the event is lost. If consent hasn't been given at that moment, the sessionStorage flag is still set and the event is not sent. A signed-in member who opens /signup also counts once per session.
