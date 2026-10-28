/* tll-ux-1028-v1 (28 Oct 2026 visual review, desktop 1440 and phone 390). Three fixes, namespaced, nothing removed:
   1. Type floor: 14px for selling lines, 12px for meta, captions and photo credits (the card stamps are aria-hidden drawings and stay as drawn).
   2. Contrast: the newsletter and Tell the editor success messages (the site-wide form rule painted ink text on a 7% teal tint, which on the
      note's dark card is close to invisible), the "Opening city by city" note and the newsletter small print reach 4.5:1 or better.
   3. Tell the editor: on a page with the home hero, the button waits until the hero has cleared the bottom of the screen, so it never sits on
      the hero on first load; it fades up in 200ms. It stays reachable by keyboard (focus brings it back) and gets aria-label "Tell the editor". */
(function(){
var HEAD="body:has([data-h3-hero]) #tll-note:not(.tll-note-out):not([data-open=\"true\"]):not(:focus-within){opacity:0;transform:translateY(8px);pointer-events:none}"+
"#tll-note{transition:opacity 200ms cubic-bezier(.23,1,.32,1),transform 200ms cubic-bezier(.23,1,.32,1)}"+
"@media (prefers-reduced-motion:reduce){#tll-note{transition:opacity 120ms linear}body:has([data-h3-hero]) #tll-note:not(.tll-note-out){transform:none}}";
var TAIL="html body:not(.tll-none) [data-h3-hero] .h3.h3-hero-free{font-size:14px!important;letter-spacing:1px!important}"+
"html body:not(.tll-none) [data-h3-hero] .h3.h3-hero-coords{font-size:12px!important}"+
"html body .h3 [data-h3-dash-sub],html body .h3-c2 .h3-ctas .h3-note{font-size:14px!important;letter-spacing:.12em!important}"+
"html body .tll-nav-v1 .tll-nav-signup{font-size:14px!important}"+
"html body .h3-ex-foot .h3-note{color:#6B6660!important;opacity:1!important}"+
"html body [data-h3=\"news\"] .h3-c7-note{color:#0A0B14!important;opacity:1!important}"+
"html body [data-h3=\"news\"] .w-form-done{background:#0D0F1A!important;border:0!important;color:#F7F1E8!important;text-align:left!important}"+
"html body #tll-note .w-form-done{background:#12141F!important;border:1px solid #067A79!important;color:#F7F1E8!important}";
function style(id,css,where){if(document.getElementById(id))return;var s=document.createElement('style');s.id=id;s.textContent=css;where.appendChild(s);}
style('tll-ux-1028-head',HEAD,document.head||document.documentElement);
function run(){style('tll-ux-1028',TAIL,document.body);
  var W=document.getElementById('tll-note');if(!W)return;var pill=W.querySelector('.tll-note-pill');if(pill&&!pill.getAttribute('aria-label'))pill.setAttribute('aria-label','Tell the editor');
  var hero=document.querySelector('[data-h3-hero]');if(!hero){W.classList.add('tll-note-out');return;}
  var t=0;function upd(){t=0;var r=hero.getBoundingClientRect();W.classList.toggle('tll-note-out',!(r.bottom>innerHeight-76&&r.top<innerHeight));}
  upd();addEventListener('scroll',function(){if(!t)t=requestAnimationFrame(upd);},{passive:true});addEventListener('resize',upd);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
