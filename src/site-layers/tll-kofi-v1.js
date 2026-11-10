/* tll-kofi-v1 (prepared 10 Nov 2026 for launch blocker 5; NOT in the build until Nancy supplies the Ko-fi product URL).
   Set KOFI to the product link (a ko-fi.com/s/... address, never the profile) and add 'tll-kofi-v1' to CORE in
   build-site-layers-v16.py. Then:
     home      the hidden "Get the guide · €9" button and its "On Ko-fi" note in .h3-c5-kofi get the href and lose hidden;
     /the-paw-passport  the dark "In the guide" card gets the price line and the buy button after its fifth row, above the fine print.
   Both open in a new tab; data-tll-kofi lets the footer's click tracker fire kofi_click and guide_checkout_click.
   Copy: "Get the guide · €9", "On Ko-fi · opens in a new tab". No count typed, no words from the banned list. */
(function(){
var KOFI='';
if(!KOFI)return;
var P=location.pathname.replace(/\/+$/,'')||'/';
function run(){
  if(P==='/'){var a=document.querySelector('.h3-c5-kofi a[data-h3-kofi]'),n=document.querySelector('.h3-c5-kofi [data-h3-kofi-note]');
    if(a){a.href=KOFI;a.target='_blank';a.rel='noopener';a.setAttribute('data-tll-kofi','1');a.removeAttribute('hidden');}
    if(n)n.removeAttribute('hidden');}
  if(P==='/the-paw-passport'){var card=document.querySelector('[data-tll-guide-paid]');if(!card||card.querySelector('[data-tll-kofi]'))return;
    var rows=card.querySelectorAll('[data-tll-t^="paid"]'),last=rows[rows.length-1]||card.lastElementChild;
    var price=document.createElement('p');price.className='tll-kofi-price';price.textContent='€9 PDF · V1.0 · incl. 25% moms · free updates when the rules change';
    var btn=document.createElement('a');btn.className='tll-pp-btn';btn.href=KOFI;btn.target='_blank';btn.rel='noopener';btn.setAttribute('data-tll-kofi','1');btn.textContent='Get the guide · €9';
    var note=document.createElement('span');note.className='tll-kofi-note';note.textContent='On Ko-fi · opens in a new tab';
    var wrap=document.createElement('div');wrap.className='tll-kofi-wrap';wrap.appendChild(price);wrap.appendChild(btn);wrap.appendChild(note);
    if(last&&last.parentNode===card)last.insertAdjacentElement('afterend',wrap);else card.appendChild(wrap);
    if(!document.getElementById('tll-kofi-v1-css')){var s=document.createElement('style');s.id='tll-kofi-v1-css';
      s.textContent='.tll-kofi-wrap{margin-top:18px}.tll-kofi-price,.tll-kofi-note{font:600 12px/1.5 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#00C9C8;margin:0 0 10px}.tll-kofi-note{display:block;margin:8px 0 0;text-transform:none;letter-spacing:0;font-weight:400}.tll-pp-btn{display:inline-flex;align-items:center;min-height:44px;padding:0 18px;border-radius:4px;border:0;background:#C8325B;color:#fff;text-decoration:none;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif}.tll-pp-btn:focus-visible{outline:2px solid #C8325B;outline-offset:2px}';
      document.head.appendChild(s);}}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();setTimeout(run,1500);
})();
