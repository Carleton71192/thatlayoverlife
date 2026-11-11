/* tll-expert-from-v1 (29 Oct 2026, tester Roberta on the Location Expert application: "It did not ask where I am from"). The
   /for-expats "Claim your desk" form (#tll-expert-apply) gets one more field in its grid, "Where you are from" (name from-country,
   optional), built like the fields beside it, with country suggestions when the page offers its country list. It travels with the
   existing Webflow form submission. Existing fields unchanged; nothing removed; no data-ms-* element touched.
   11 Nov 2026 (Nancy: "OK to rename the two form fields so names arrive? Yes"): field names. The published form serves two inputs
   as name="field" data-name="Field": #le-name ("Your name or pen name") and #le-links ("Where you already write (optional)").
   Webflow collects one value per data-name when the form is sent, so the links answer replaced the name and no application has
   arrived with a name. The Designer already names them name-or-pen-name and published-links; the published page does not carry
   that, so names() sets both attributes on those two inputs, inside the form of #tll-expert-apply only. It writes only when an attribute differs, so
   it does nothing once Webflow serves the right names. It runs when the chunk loads, when the page is parsed, on every later
   change to the page (a re-rendered form is renamed again) and at the start of every submit, ahead of Webflow's own handler,
   which reads the attributes at that moment. Ids, labels, required, type and every other field are left alone. */
(function(){
if(!/^\/for-expats\/?$/.test(location.pathname))return;
function run(){
  var city=document.getElementById('le-city');if(!city||document.getElementById('le-from'))return;
  var grid=city.closest('.tllpr-grid');var years=document.getElementById('le-years');
  var model=(years&&years.parentElement)||city.parentElement;if(!grid||!model)return;
  var wrap=model.cloneNode(true);var lab=wrap.querySelector('label');var inp=wrap.querySelector('input');if(!lab||!inp)return;
  lab.setAttribute('for','le-from');lab.textContent='Where you are from (optional)';
  inp.id='le-from';inp.name='from-country';inp.setAttribute('data-name','from-country');inp.value='';inp.removeAttribute('required');
  inp.placeholder='The country you grew up in';inp.autocomplete='country-name';
  if(document.getElementById('tll-country-list'))inp.setAttribute('list','tll-country-list');
  grid.appendChild(wrap);
}
var NAMES=[['le-name','name-or-pen-name'],['le-links','published-links']];
function names(){
  for(var i=0;i<NAMES.length;i++){var inp=document.querySelector('#tll-expert-apply form input#'+NAMES[i][0]),want=NAMES[i][1];if(!inp)continue;
    if(inp.getAttribute('name')!==want)inp.setAttribute('name',want);
    if(inp.getAttribute('data-name')!==want)inp.setAttribute('data-name',want);}
}
function both(){names();run();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',both);else both();
setTimeout(both,1200);
/* The form can arrive, or be drawn again, after this chunk has run. */
if(window.MutationObserver)new MutationObserver(names).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['name','data-name']});
/* Capture on the document: before Webflow's submit handler, which is delegated on the document in the bubble phase. */
document.addEventListener('submit',names,true);
})();
