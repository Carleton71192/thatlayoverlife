# Form evidence read 30 Sep 2026 via Webflow MCP (element trees)
## /signup (page 6a0d5c1fa1d71485d8688f7b)
- Memberstack signup form (data-ms-form="signup", plan pln_traveler-l97086o) plus "Continue with Google" (data-ms-auth-provider="google").
- Fields: First name (required), Email (required), Password (required, minlength 8).
- Checkbox 1 (required, inputName "Checkbox"): "I have read and agree to the Terms of Service, the Editorial Charter and the Privacy Policy." with links to /terms, /editorial-charter, /privacy.
- Checkbox 2 (required, inputName "age-16"): "I am 16 or older."
- No marketing checkbox on signup. Success: "Welcome aboard. Check your inbox to confirm, then come find your shelf." Error copy is specific.
- Stat strip on the brand column shows hardcoded numbers "1 Travelers · 9 Countries · 6 Stories · 1 Pets" (static strings in the tree).
## /newsletter (page 6a89841b8c022c36155d6627)
- Webflow native form "Email Form", method GET, action empty (Webflow form inbox). One field: Email (required). Button label default.
- No consent sentence, no privacy link, no double opt-in mention near the field. Success: "You are on the list. The first dispatch lands in your inbox."
- Copy above the form is an HtmlEmbed (not read).
## /account (page 6a0d5c23c57426a9c563e8de)
- Strings present: "Export my data", "Delete account", "Export everything as JSON + Markdown (a human sends it within one month), or delete the account entirely. No exit interview."
- Memberstack app setting allowMemberSelfDelete is false (see ../memberstack/app-config-summary.md), so the button's behavior could not be verified.
