/* tll-submit-long-v1 (29 Oct 2026, Nancy: "Expand the forms for longer stories"). Roberta's Pompeii story arrived cut off mid-word
   at about 4,900 characters: Webflow keeps only about 5,000 characters of any one form field. The body box on /submit has no limit
   of its own, so the full text is now also sent in numbered pieces of up to 3,500 characters (hidden fields body-part-1 to
   body-part-12, about 7,000 words in all), cut at a space. The body field itself is unchanged and still sent; whoever builds the
   story joins body-part-1, body-part-2 and on in order. A short help line says long stories are fine. /submit only; nothing
   removed; no data-ms-* element touched. */
(function(){
if(!/^\/submit\/?$/.test(location.pathname))return;
var SIZE=3500,MAXP=12;
function parts(t){var out=[];while(t.length>SIZE&&out.length<MAXP-1){var cut=t.lastIndexOf(' ',SIZE);if(cut<SIZE*0.6)cut=SIZE;out.push(t.slice(0,cut));t=t.slice(cut);}out.push(t);return out;}
function sync(ta){
  var f=ta.form;if(!f)return;var t=ta.value||'';
  [].forEach.call(f.querySelectorAll('input[data-tll-part]'),function(h){h.parentNode.removeChild(h);});
  if(t.length<=SIZE)return;
  parts(t).forEach(function(p,i){var h=document.createElement('input');h.type='hidden';h.name='body-part-'+(i+1);h.setAttribute('data-name','body-part-'+(i+1));h.setAttribute('data-tll-part','1');h.value=p;f.appendChild(h);});
}
function run(){
  var ta=document.querySelector('form textarea[name="body"]');if(!ta||ta.dataset.tllLong)return;ta.dataset.tllLong='1';
  ta.removeAttribute('maxlength');
  var tm=0;ta.addEventListener('input',function(){clearTimeout(tm);tm=setTimeout(function(){sync(ta);},400);});
  if(ta.form)ta.form.addEventListener('submit',function(){sync(ta);},true);
  var p=document.createElement('p');p.className='tll-long-hint';p.textContent='Write as long as the story needs. Long stories arrive in full.';
  p.style.cssText='margin:6px 0 0;font:400 13px/1.45 "IBM Plex Sans Condensed","Inter Tight",system-ui,sans-serif;color:#5F5A54';
  ta.insertAdjacentElement('afterend',p);sync(ta);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1500);
})();
