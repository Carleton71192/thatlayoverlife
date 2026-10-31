/* TLL Consent Mode (v2 28 Oct; Phase 0, 31 Oct 2026). The site head now carries the one consent tool (tll-consent-v3: Google's certified
   message, Consent Mode v2 defaults, GA4 and ads only after consent). This file only sets the same denied defaults when that head code is
   missing, for example on a page served before the head change was published. */
window.dataLayer=window.dataLayer||[];if(typeof window.gtag!=='function'){window.gtag=function(){dataLayer.push(arguments);};}
if(!window.__tllConsent){gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});}
