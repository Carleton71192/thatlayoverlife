/* TLL Consent Mode v2 (28 Oct 2026, AdSense readiness, approved by Nancy). Google tags start with every storage denied.
   CookieConsent (orestbida v3) still keeps GA4 from loading at all until analytics is accepted; this adds the Consent Mode signal
   on top, so GA4 and, later, Google's own ads consent message read the same state. */
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
(function(){function u(){try{var a=!!(window.CookieConsent&&CookieConsent.acceptedCategory&&CookieConsent.acceptedCategory('analytics'));gtag('consent','update',{analytics_storage:a?'granted':'denied'});}catch(e){}}
window.addEventListener('cc:onConsent',u);window.addEventListener('cc:onChange',u);})();
