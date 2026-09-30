# Third-party hosts found in site-level custom code and registered scripts (read 30 Sep 2026)
Source files: site-head.html, site-footer.html, site-scripts.json (this folder). Not verified in a browser: the live site is egress-blocked from the audit container.

| Host | What | Where | Consent gating in code |
|---|---|---|---|
| www.googletagmanager.com (gtag/js, G-T1K83PRL1R) | Google Analytics 4 | site head | GATED: `<script type="text/plain" data-category="analytics">` under CookieConsent v3 |
| analytics.ahrefs.com/analytics.js (data-key hbUjDX…) | Ahrefs Web Analytics | site head | NOT GATED: loads on every page before any choice |
| fonts.googleapis.com / fonts.gstatic.com | Google Fonts (Playfair Display, JetBrains Mono) + @font-face aliases to gstatic (IBM Plex Sans Condensed) | site head | NOT GATED (font requests send visitor IP to Google) |
| cdn.jsdelivr.net | orestbida/cookieconsent@3.1.0 (footer), d3@7, topojson-client@3, world-atlas@2 (map script) | site footer, tll_world_map_v1 | NOT GATED (CDN, no cookies known) |
| static.memberstack.com/scripts/v2/memberstack.js (app_cmpdpi625001s0slnhgz17hgs) | Memberstack login/session | registered script tll_memberstack_init_v2 (header) | NOT GATED (necessary: login session) |
| lh3.googleusercontent.com/d/1sbjvhec… | Founder avatar image served from Google Drive | site footer tll-core-v2 | NOT GATED (image request to Google) |
| cdn.prod.website-files.com | Webflow asset/script hosting | everywhere | platform |
| www.linkedin.com/sharing, twitter.com/intent | Share links | site footer share-fix script | click only, no script |
| tll-travel-wire.thatlayoverlife.workers.dev | Cloudflare Worker (travel wire feed, profile sync hook) | per Notion tasks and repo wrangler.toml | first-party operated, Cloudflare processor |

CookieConsent v3 config (site footer): categories necessary (readOnly) + analytics; consent modal box bottom-left with Accept all / Reject all / Manage preferences on the first layer; preferences modal lists Necessary and Analytics ("Google Analytics") with no per-cookie table (name, provider, duration). Withdrawal: links with data-tll-cookie-prefs or javascript: hrefs containing "cookie" are rewired to CookieConsent.showPreferences().
Feedback widget (tll_feedback_widget_v1): mailto links only, no third party. Reader notes form: Memberstack data table story_comments (member id, display name, body, status pending).
