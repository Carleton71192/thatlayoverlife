/* tll-division-v1 (31 Oct 2026, Value Playbook Phase 7: revenue wiring). Two divisions, That Layover Life ("tll") and Paw Passport
   ("paw-passport"), told apart on every money surface.
   1. Every page sets the GA4 parameter division (paw-passport on /the-paw-passport, /pets/*, /my-pets and the dog-travel hub;
      tll everywhere else), so every event carries it.
   2. A click on a revenue link (rel sponsored, a partner or shop link on a profile, a Ko-fi, tip or shop link, a Pro's author
      link, a sponsor link) sends a revenue_click event with division, surface and the link's domain, and adds UTM tags
      (utm_source=thatlayoverlife, utm_medium=<surface>, utm_campaign=<division>) when the link has none. Ads are not touched.
   3. Elements marked data-tll-entity="legal-name" (registration-number, registered-city-and-country, legal-contact-email,
      tll-division-name, paw-passport-division-name) are filled from the one Site settings item (GET /settings), so no page
      carries a typed company name. Empty settings leave the page's own text. No data-ms-* element touched. */
(function(){
if(window.__tllDivision)return;window.__tllDivision=1;
var P=location.pathname.replace(/\/+$/,'')||'/';
var D=/^\/(the-paw-passport|my-pets|pets\/|pursuits\/dog-travel)/.test(P)?'paw-passport':'tll';
window.tllDivision=D;
try{window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments);};gtag('set',{division:D});}catch(e){}
var SHOP=/(^|\.)(ko-fi\.com|buymeacoffee\.com|patreon\.com|gumroad\.com|etsy\.com|shopify\.com|myshopify\.com|amazon\.[a-z.]+|amzn\.to|booking\.com|getyourguide\.[a-z]+|viator\.com)$/i;
function surface(a){if(a.closest('.tll-pro-box'))return'pro-author';if(a.closest('[data-tll-partner],.tll-pf-partner,.tll-partners'))return'partner';
  if(/sponsored/.test(a.rel||''))return'sponsored';if(a.hasAttribute('data-tll-kofi'))return'shop';try{if(SHOP.test(new URL(a.href).hostname))return'shop';}catch(e){}return'';}
document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a)return;var u;try{u=new URL(a.href,location.href);}catch(x){return;}
  if(u.hostname===location.hostname||!/^https?:$/.test(u.protocol))return;var s=surface(a);if(!s)return;
  if(!u.searchParams.has('utm_source')){u.searchParams.set('utm_source','thatlayoverlife');u.searchParams.set('utm_medium',s);u.searchParams.set('utm_campaign',D);a.href=u.toString();}
  try{gtag('event','revenue_click',{division:D,surface:s,link_domain:u.hostname});}catch(x){}
},true);
var marks=document.querySelectorAll('[data-tll-entity]');
function fill(){var m=document.querySelectorAll('[data-tll-entity]');if(!m.length)return;
  fetch('https://tll-travel-wire.thatlayoverlife.workers.dev/settings').then(function(r){return r.ok?r.json():null;}).then(function(d){var e=d&&d.entity||{};
    [].forEach.call(m,function(n){if([].some.call(n.attributes,function(x){return x.name.indexOf('data-ms-')===0;}))return;var v=e[n.getAttribute('data-tll-entity')];if(v)n.textContent=v;});}).catch(function(){});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fill);else fill();
})();
