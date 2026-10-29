/* tll-expert-from-v1 (29 Oct 2026, tester Roberta on the Location Expert application: "It did not ask where I am from"). The
   /for-expats "Claim your desk" form (#tll-expert-apply) gets one more field in its grid, "Where you are from" (name from-country,
   optional), built like the fields beside it, with country suggestions when the page offers its country list. It travels with the
   existing Webflow form submission. Existing fields unchanged; nothing removed; no data-ms-* element touched. */
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
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1200);
})();
