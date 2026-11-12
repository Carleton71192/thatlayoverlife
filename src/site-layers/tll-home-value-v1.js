/* tll-home-value-v1 (31 Oct 2026, Value Playbook Phase 1: homepage value messaging). STAGED: renders only for a preview,
   https://www.thatlayover.life/?preview=value (remembered in this browser; ?preview=off clears it). The public home page is
   unchanged until Nancy approves; then PUBLIC below flips to true.
   Under the weekly cover: the value line and the three section 2 lines from the playbook (slide show, uncle deck, lost account),
   then the call to action as one question, "What do you collect?", with the pursuit hubs as answers. Copy is the playbook's own,
   in Nancy's words. Clicks carry division "tll" for GA4 (Phase 7 tagging). No nav or footer touched; no data-ms-* element. */
(function(){
var PUBLIC=true;
var P=location.pathname.replace(/\/+$/,'')||'/';if(P!=='/')return;
var q=new URLSearchParams(location.search).get('preview');
try{if(q==='value')localStorage.setItem('tll-preview-value','1');if(q==='off')localStorage.removeItem('tll-preview-value');}catch(e){}
var on=PUBLIC;try{on=on||localStorage.getItem('tll-preview-value')==='1';}catch(e){}
if(!on&&q!=='value')return;
var PURSUITS=[['foodie','Food'],['marathons','Marathons'],['trekking','Trekking'],['dog-travel','Dog travel']];
var LINES=[['The slide show.','Remember when Grandpa pulled out the slide projector after dinner? This is that.'],
  ['The trip deck.','Remember the 80-slide deck someone made of one weekend in Boston? This is that, except people ask to see it.'],
  ['The lost account.','A friend got locked out of Instagram and lost every travel photo with it. TLL is the copy that does not vanish when an app decides you are someone else.']];
/* 12 Nov 2026 (font loading jump): the headline and lede widths are in em, not ch (a ch shrinks while the fallback font shows, so the lines
   rewrapped when the web fonts arrived): 18ch of Playfair Display 800 = 11.88em, 60ch of IBM Plex Sans Condensed = 32.4em, the same once loaded. */
var CSS='.tll-val{background:#FDF9F3;color:#0A0B14;padding:72px var(--h3-g,clamp(20px,5vw,72px)) 80px;font:400 17px/1.55 "IBM Plex Sans Condensed",system-ui,sans-serif}'+
'.tll-val-in{max-width:1240px;margin:0 auto}.tll-val-ey{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:2px;text-transform:uppercase;color:#067A79;margin:0 0 14px}'+
'.tll-val h2{font:800 clamp(30px,4.6vw,52px)/1.04 "Playfair Display",Georgia,serif;margin:0 0 16px;max-width:11.88em}.tll-val h2 em{font-style:italic;color:inherit}'+
'.tll-val-lede{max-width:32.4em;color:#3A3A3A;margin:0 0 36px}'+
'.tll-val-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin:0 0 48px}'+
'.tll-val-card{border-top:2px solid #0A0B14;padding:16px 0 0}.tll-val-card b{display:block;font:800 22px/1.15 "Playfair Display",Georgia,serif;margin:0 0 8px}.tll-val-card p{margin:0;color:#3A3A3A}'+
'.tll-val-ask{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;border:1px solid #E0DACE;background:#fff;border-radius:4px;padding:20px}'+
'.tll-val-ask strong{font:800 24px/1.1 "Playfair Display",Georgia,serif;margin-right:8px}'+
'.tll-val-ask a{display:inline-flex;align-items:center;min-height:44px;color:#0A0B14}'+
'.tll-val-ask a:not(.p){padding:0 16px;border:1.5px solid #0A0B14;border-radius:999px;text-decoration:none;font:600 12px/1 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase}'+
'.tll-val-ask a:not(.p):hover,.tll-val-ask a:not(.p):focus-visible{background:#0A0B14;color:#F7F1E8}'+
'.tll-val-ask a.p{font:600 16px/1.2 "IBM Plex Sans Condensed",system-ui,sans-serif;text-decoration:underline;text-decoration-color:#C8325B;text-decoration-thickness:2px;text-underline-offset:4px}'+
'.tll-val-ask a.p:hover{color:#C8325B}'+
'.tll-val-flag{font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#C8325B;margin:0 0 10px}'+
'@media (max-width:760px){.tll-val{padding:52px var(--h3-g,20px) 60px}.tll-val-grid{grid-template-columns:1fr;gap:22px}}'+
'@media (max-width:400px){.tll-val-ask strong{flex-basis:100%;margin-right:0}}'+
'#tll-val.tll-val-low~[data-h3-guides]{border-top:0}';
/* Nancy's choices of 12 Nov 2026 on the visual audit (claude/tll-visual-audit-fix-list-2026-11-11.md, section 3):
   N5   the italic words "never stop going." take the headline color; the rose italic word is kept for two section headlines only
        ("payday." and "Write it down.", set in the home embed).
   N8a  the four answers are the one site chip: JetBrains Mono 12px / 600, 1.5px letter spacing, capitals through CSS (the words in
        the page stay as written), 44px tall, 16px side padding, 1.5px Midnight outline, pill; on hover Midnight with a Cream label.
        Up to 400px wide the question "What do you collect?" keeps a row to itself, as it already does there once the web fonts are in;
        without that rule the narrower chips let "FOOD" sit beside it in the fallback fonts, and the box jumped 18px when the fonts arrived.
   N8b  "Countries, too: join free" is the kit text link (IBM Plex Sans Condensed 600, 16px, Midnight, 2px #C8325B underline, as
        .h3-shelf-all and .tll-link-arrow in tll-buttons-v1), same words, same element, same value_join_click event.
   N9   (separate block, OFF: see N9_PHONES_AFTER_LIBRARY below) on phones the section goes in after the library, so the first story
        is about one screen nearer the top. "Phones" is this layer's own breakpoint, max-width 760px, where the three cards stack into
        one column and the section is 1,050px tall at 390px wide (730px in three columns). Wider windows keep the section under the
        cover, as before. The order is chosen once, when the section goes in; turning the phone afterwards does not move it. Below the
        library the section sits right above the Layover guides band, whose cream pause was made for the library's foot line, so the
        last rule above takes that pause away (only when this section is the one above the band). */
/* ---- N9 block begins. Measured 12 Nov 2026 (build:home CHANGES.md): a fresh load does not shift more than today, but a reload that
   restores a phone to a scrolled position shifts more, because the section then sits where the reader is when the web fonts arrive.
   That misses the bar set for N9, so the block is switched off. true = on phones, after the library; false = under the cover, as today. */
var N9_PHONES_AFTER_LIBRARY=false;
var PHONE='(max-width:760px)';
function phone(){try{return !!(window.matchMedia&&window.matchMedia(PHONE).matches);}catch(e){return false;}}
function library(){var s=document.querySelector('[data-h3-shelf]');return s&&s.closest?s.closest('.w-embed'):null;}
/* ---- N9 block ends. N9 also owns the last CSS rule (#tll-val.tll-val-low) and the lines marked N9 in run(); all are inert while false. */
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function track(name,extra){try{window.gtag&&gtag('event',name,Object.assign({division:'tll'},extra||{}));}catch(e){}}
function run(){
  if(document.getElementById('tll-val'))return;
  var hero=document.querySelector('[data-h3-hero]');if(!hero)return;
  /* N9 (only when N9_PHONES_AFTER_LIBRARY is true): on phones wait for the library embed to be complete (its next sibling exists, or
     the page is parsed), then go in after it, under everything that has been painted. If the element right after the cover is not an
     embed, the library is not where it was on 12 Nov, so the section goes under the cover at once, as today. */
  var after=hero,low=false;
  if(N9_PHONES_AFTER_LIBRARY&&phone()){var lib=library(),parsing=document.readyState==='loading';
    if(lib){if(parsing&&!lib.nextElementSibling)return;after=lib;low=true;}
    else if(parsing){var nx=hero.nextElementSibling;if(!nx||(nx.classList&&nx.classList.contains('w-embed')))return;}}
  if(!document.getElementById('tll-home-value-v1')){var s=el('style');s.id='tll-home-value-v1';s.textContent=CSS;document.head.appendChild(s);}
  var sec=el('section',low?'tll-val tll-val-low':'tll-val');sec.id='tll-val';sec.setAttribute('aria-labelledby','tll-val-h');
  var inn=el('div','tll-val-in');sec.appendChild(inn);
  if(!PUBLIC)inn.appendChild(el('p','tll-val-flag','Preview · not live'));
  inn.appendChild(el('p','tll-val-ey','Why That Layover Life'));
  var h=el('h2');h.id='tll-val-h';h.appendChild(document.createTextNode('The family slide show, rebuilt for people who '));h.appendChild(el('em','','never stop going.'));inn.appendChild(h);
  inn.appendChild(el('p','tll-val-lede',"It keeps your trips somewhere that is yours and puts you next to people who travel the way you do. Free to join if you're 16 or older."));
  var g=el('div','tll-val-grid');LINES.forEach(function(l){var c=el('div','tll-val-card');c.appendChild(el('b','',l[0]));c.appendChild(el('p','',l[1]));g.appendChild(c);});inn.appendChild(g);
  var ask=el('div','tll-val-ask');ask.appendChild(el('strong','','What do you collect?'));
  PURSUITS.forEach(function(p){var a=el('a','',p[1]);/* Phase 0 (31 Oct): the pursuit hubs are not built yet (/pursuits/* answered 404), so these open the library search instead. */
    var Q={foodie:'food',marathons:'marathon',trekking:'trek'};a.href=(p[0]==='dog-travel'?'/the-paw-passport?':'/stories?q='+Q[p[0]]+'&')+'utm_source=home&utm_medium=value&utm_campaign='+(p[0]==='dog-travel'?'paw-passport':'tll');a.addEventListener('click',function(){track('value_pursuit_click',{pursuit:p[0]});});ask.appendChild(a);});
  var j=el('a','p','Countries, too: join free');j.href='/signup?utm_source=home&utm_medium=value&utm_campaign=tll';j.addEventListener('click',function(){track('value_join_click');});ask.appendChild(j);
  inn.appendChild(ask);
  after.insertAdjacentElement('afterend',sec);
}
/* 7 Nov 2026 (baseline audit): inserted at DOMContentLoaded, the section landed after the phone had painted the cover and pushed
   "01 · The stories" about 1,000 px down (layout shift 0.70 on the live home page). Now it goes in as soon as the parser has
   created the hero, before the first paint; DOMContentLoaded and the 1.5 s timer stay as fallbacks. This layer is in the core.
   12 Nov 2026 (N9, only when N9_PHONES_AFTER_LIBRARY is true): on phones run() returns until the library embed is complete, so the
   observer below keeps watching until then; the section goes in during the same parser step that adds the element after the library,
   before that element is painted. */
if(document.readyState==='loading'){
  if(window.MutationObserver){var mo=new MutationObserver(function(){if(document.querySelector('[data-h3-hero]')){run();if(document.getElementById('tll-val'))mo.disconnect();}});
    mo.observe(document.documentElement,{childList:true,subtree:true});
    document.addEventListener('DOMContentLoaded',function(){mo.disconnect();});}
  document.addEventListener('DOMContentLoaded',run);
}else run();
setTimeout(run,1500);
})();
