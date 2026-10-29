/* tll-email-hello-v1 (29 Oct 2026, Nancy: "Any mentions of emails on the site should go to hello@thatlayover.life"). The only mailbox
   is hello@thatlayover.life. Any other @thatlayover.life address on a page (press@, partnerships@ on the writer page contact cards,
   or any other) is shown and linked as hello@thatlayover.life; a mailto subject line is kept. Runs on every page and again for content
   that arrives late. The page sources are being corrected too; this is the safety net. Nothing removed; no data-ms-* element touched. */
(function(){
var HELLO='hello@thatlayover.life';
var RE=/\b(?!hello@)[A-Za-z0-9._%+-]+@thatlayover\.life\b/gi;
function fix(root){
  [].forEach.call((root||document).querySelectorAll('a[href^="mailto:"]'),function(a){var h=a.getAttribute('href');var n=h.replace(/^mailto:[^?]*/i,function(m){return /@thatlayover\.life$/i.test(m)&&!/^mailto:hello@/i.test(m)?'mailto:'+HELLO:m;});if(n!==h)a.setAttribute('href',n);});
  var w=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT),t;
  while(t=w.nextNode()){if(t.nodeValue.indexOf('@thatlayover.life')>-1){var v=t.nodeValue.replace(RE,HELLO);if(v!==t.nodeValue)t.nodeValue=v;}}
  [].forEach.call((root||document).querySelectorAll('input[placeholder*="@thatlayover.life"],[aria-label*="@thatlayover.life"]'),function(el){['placeholder','aria-label'].forEach(function(k){var v=el.getAttribute(k);if(v)el.setAttribute(k,v.replace(RE,HELLO));});});
}
function run(){if(!document.body)return;fix(document.body);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1200);setTimeout(run,3000);
})();
