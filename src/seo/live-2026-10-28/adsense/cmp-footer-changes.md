# Site footer code changes for the CMP swap (staged 28 Oct 2026, not live)

1. Remove the orestbida script line and the CookieConsent.run block (footer lines 1 to 18 as read at 14:06 UTC; copy in site-code-footer.html).
2. The cookie-preferences wiring (lines 19 to 30) changes one call:
   - before: `if(window.CookieConsent&&CookieConsent.showPreferences)CookieConsent.showPreferences();`
   - after: `if(typeof window.revisitCkyConsent==='function')window.revisitCkyConsent();`
3. tll-ga4-events-v1, one guard:
   - before: `if(window.gtag&&window.CookieConsent&&CookieConsent.acceptedCategory&&CookieConsent.acceptedCategory('analytics'))gtag('event',n,p||{});`
   - after: `if(window.gtag)gtag('event',n,p||{});`
   - Why: with Consent Mode v2, gtag itself holds every event until analytics_storage is granted and sends only cookieless pings before that. The double gate is no longer needed.
4. The #tll-note hide rule keys on `html.show--consent` and `html.show--preferences` (orestbida classes). After the swap, change it to hide while `.cky-consent-container:not(.cky-hide)` is on screen, or leave it; the note sits bottom right and the CookieYes box sits bottom left.
