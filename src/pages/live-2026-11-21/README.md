# Page code read from the published HTML, Nov 21, 2026

Sweep of Nov 21, item A21 (reports/evidence/sweep-2026-11-21/defrag.md F13). These pages' head and footer code had no saved copy. Each
file was split out of the plain-GET HTML of Nov 21 by tools/page-code-from-html.py (read only, no Webflow access), which finds the saved
site head and footer (src/site/live-2026-11-13/fonts) byte for byte and keeps what follows each, less the registered scripts.
Template pages are refused by the script (CMS fields can carry member data), so the Contributors and Pets template code is not here.
/login and /signup are not here either: their head style and footer already have one saved source in src/pages/auth (au3-auth.css,
au3-footer-block.html; the script's split of the live /login footer equals au3-footer-block.html byte for byte).
Pages: home, stories, the-map, account, gallery, destinations, for-press, the-paw-passport (head and footer each).
