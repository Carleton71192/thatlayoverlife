/* tll-pwa-hold-v1 (10 Nov 2026, Lighthouse baseline: every page logged "404 /sw.js" in the console). The caller is not in this repo:
   it is the PWA client in the site footer code (script#tll-pwa-v1-js, 9 Nov), which on window load sends HEAD /sw.js and registers
   the service worker only when that answers with JavaScript. The tll-pwa Worker route is not live, so the HEAD 404s on every page.
   Until the PWA exists, this layer answers that one request here, with a 404 that never goes to the network, so the client stops
   quietly (it already returns on a non-ok answer) and nothing is registered. No service worker is created; every other request
   passes through untouched.
   The day the tll-pwa Worker serves /sw.js: set PWA_LIVE to true (or drop this layer) and rebuild. To try the PWA before then, add
   ?preview=pwa to the address or set localStorage tll-preview-pwa to 1. No data-ms-* element touched; nav and footer untouched. */
(function(){
var PWA_LIVE=false;
var pv=/[?&]preview=pwa(&|$)/.test(location.search);try{pv=pv||localStorage.getItem('tll-preview-pwa')==='1';}catch(e){}
if(PWA_LIVE||pv||location.hostname==='pwa-preview.thatlayover.life'||typeof window.fetch!=='function'||typeof window.Response!=='function'||window.__tllPwaHold)return;
window.__tllPwaHold=1;
var f=window.fetch;
function held(input){try{var u=typeof input==='string'?input:(input&&input.url)||String(input||'');var a=new URL(u,location.href);
  return a.origin===location.origin&&a.pathname==='/sw.js';}catch(e){return false;}}
window.fetch=function(input){
  if(held(input))return Promise.resolve(new Response(null,{status:404,statusText:'PWA not live'}));
  return f.apply(this,arguments);};
})();
