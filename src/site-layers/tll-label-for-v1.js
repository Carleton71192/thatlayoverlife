/* tll-label-for-v1 (22 Nov 2026, sweep of 21 Nov, item A07; reports/evidence/sweep-2026-11-21/ranked.md and verify-1.md). On
   /for-expats the Webflow labels carry an empty for="" (the Designer's "For" setting left blank). An empty for points at nothing, so
   the label names no field: tapping the consent sentence beside a required checkbox ("I am 16 or older...", "I run or co-run this
   group...") leaves the box unticked, and both boxes, like the group form fields, have an empty accessible name. Each such label
   gets for= set to the id of the first field inside it, when that id is the field's own (the first element in the page with that
   id). Ids, names, values and everything else on the field stay as they are; labels that already name a field are left alone;
   forms that carry a data-ms-* attribute (Memberstack) are skipped. A stopgap until the Designer sets Label "For" (class-b.md B03).
   Runs when the chunk loads, when the page is parsed, and once more after 1.2 s, in case the forms are drawn late. */
(function(){
if(!/^\/for-expats\/?$/.test(location.pathname))return;
function ms(el){for(var n=el;n&&n.nodeType===1;n=n.parentNode){var a=n.attributes;for(var i=0;a&&i<a.length;i++)if(a[i].name.indexOf('data-ms-')===0)return true;}return false;}
function run(){
  var labs=document.querySelectorAll('form label[for=""]');
  for(var i=0;i<labs.length;i++){var l=labs[i];if(l.getAttribute('for')!=='')continue;
    var f=l.querySelector('input:not([type="hidden"]):not([type="submit"]),textarea,select');if(!f||!f.id)continue;
    if(document.getElementById(f.id)!==f)continue;var form=l.closest('form');if(form&&ms(form))continue;
    l.setAttribute('for',f.id);}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1200);
})();
