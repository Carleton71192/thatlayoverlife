# Change log: Microsoft Clarity on That Layover Life (17 November 2026)

Status: **waiting for Nancy's approval.** Nothing is built yet.

Nancy pasted the Clarity tag for project `zezb8azwov` on 17 November 2026. This log puts it on TLL. The other sites get their own projects and logs later (see the end).

## What Clarity does and what it costs us

Clarity records how people move through pages (clicks, scrolls, rage clicks, dead clicks, session replays) and draws heatmaps. It is free. The script loads from clarity.ms, so it adds nothing to Webflow bandwidth.

## How consent works (no change to the consent script)

- TLL already runs Google Consent Mode: everything starts as denied, and Google's consent message updates it (the site head, `tll-consent-v3`).
- Microsoft's docs (Support for Google Consent Mode in Clarity) say Clarity reads Google Consent Mode signals by itself, with no extra code.
- In the EEA, the UK and Switzerland, Clarity sets no cookies until analytics consent is yes. Without consent it still counts visits, but each page view is separate and replays across pages are limited.
- Google's European message still does not show (board row ads-03). Until it does, European visits stay in this cookie-free mode, which is the correct outcome.
- Outside those regions TLL's own cookie page says analytics run by default, and Clarity follows the same signal.

## Rows

| Row | Who | Change |
|---|---|---|
| CL1 | Nancy, in Clarity | In the project for `zezb8azwov`: check the site address is `https://www.thatlayover.life`. Settings, Consent: turn **Consent Mode on** for all visitors, so Google's consent signal governs everywhere. Settings, Masking: keep **Balanced** and add Mask by element `[data-ms-content="members"]` and `[data-ms-member]`, so signed-in names, emails and member panels are blanked on every page. |
| CL2 | Session | Register one inline site script, `tll-clarity-v1`, in the site head (code below). It loads Clarity only on www and the apex, and on the test site only when the address has `?clarity=test` (so our test runs do not fill Clarity with robot visits). On the signed-in pages `/account`, `/edit-profile`, `/profile`, `/share-photos`, `/submit`, `/login` and `/signup` it masks the whole page. No `data-ms-*` element is touched. |
| CL3 | Session | `/cookies`, Statistics paragraph: add the Clarity sentence below. |
| CL4 | Session | `/privacy`, section 2, "When you visit the site": add the Clarity sentence below, and add "Microsoft Clarity" to the short-version analytics line. |
| CL5 | Session | Publish to the test site. Light checks, keeping to the bandwidth rule (a handful of page loads): the script is on the page; with `?clarity=test` a request goes to clarity.ms; from the Mac (counted as Europe, consent not given) no `_clck` or `_clsk` cookie appears; on `/account` the page root carries `data-clarity-mask="True"`; no console errors. Consent behavior itself cannot be tested on the test site (memory note), so the European check is only "no cookies". |
| CL6 | Nancy | Says "publish www". Then within a couple of hours she checks the Clarity dashboard shows sessions, and plays one recording to confirm member areas are blanked. |

### CL2 code (`tll-clarity-v1`, about 640 characters)

```html
<script>
(function(){
  var h=location.hostname, live=(h==='www.thatlayover.life'||h==='thatlayover.life');
  if(!live && !(/\.webflow\.io$/.test(h) && /[?&]clarity=test\b/.test(location.search))) return;
  if(/^\/(account|edit-profile|profile|share-photos|submit|login|signup)(\/|$)/.test(location.pathname)){
    document.documentElement.setAttribute('data-clarity-mask','True');
  }
  (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","zezb8azwov");
})();
</script>
```

### CL3 text (`/cookies`, Statistics, after the Ahrefs sentence)

> Microsoft Clarity shows us where people click and scroll, as heatmaps and replays with personal details blanked out. It sets _clck and _clsk on this site, and Microsoft may set CLID, MUID, MR, SM and ANONCHK on its own domains, only after you say yes to analytics. Without your yes it still counts the visit, without cookies.

### CL4 text (`/privacy`, section 2, after the Ahrefs sentence)

> We also use Microsoft Clarity to see where pages confuse people: it records clicks, scrolling and page layout, with what you type and anything about your account blanked out. It uses cookies only with your consent.

Short version line becomes: "We use Google Analytics, Microsoft Clarity and Ahrefs to understand what works, and Google AdSense to help pay for the magazine. In the EEA, the UK and Switzerland all of them wait for your consent."

## Rollback (for a session, not a chat command)

Remove the site script `tll-clarity-v1` from the site's registered scripts, put the two page paragraphs back from the before copies saved under `src/pages/clarity-2026-11-17/`, and publish. In Clarity, the project can be paused under Settings.

## Other sites (separate projects, later)

- **TBC and Lub Bub:** each needs its own Clarity project and a cookie banner that sends Google Consent Mode or Clarity's consent call. Lub Bub's /privacy is still placeholder text (board row other-13), so that comes first.
- **DS, DG and CR:** Damgaard's sites. Ask Damgaard before adding any tracking.
