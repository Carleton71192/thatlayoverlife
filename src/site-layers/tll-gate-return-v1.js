/* tll-gate-return-v1 (22 Nov 2026, sweep of 21 Nov, item A08; reports/evidence/sweep-2026-11-21/ux.md U12 and verify-1.md). The
   sign-in gates on /submit, /my-pets and /share-photos link plain /login and /signup, and a signed-in visit to /login is sent on to
   /account (site footer loginRedirect), so a member who signs in from a gate does not come back to what they were doing.
   On those three pages a click on a Log in or Join link inside the gate (the page's anonymous block, never the nav) stores the page in
   sessionStorage (tll-gate-return, with the time). On the next page the member reaches signed in, wherever Memberstack or the site
   sends them, one small card offers the way back ("Back to your story", "Back to your pets", "Back to your photos"), fixed at the
   bottom right so nothing on the page moves (on /account at 960px and wider it sits above the Tell the editor pill, which A09 moves there). The key is cleared when the member is back on that page, clicks the link or closes the
   card, and after 30 minutes. It reads the member the way tll-phase0-v1 does (getCurrentMember, read only) and writes nothing to
   Memberstack; the gate links and every data-ms-* element are left as they are (the click is only read). Every page (site chunk).
   22 Nov 2026 (check of the sweep, note 2): the card's words wait for Nancy (class-c C14), so the layer rides only in the site-preview
   chunk until she answers: it runs with a preview flag (?preview=, ?qr=) or a tll-preview-* localStorage key, which a tester keeps
   across the sign-in. To make it public, move it back to the site chunk's public list in build-site-layers-v16.py and rebuild.
   22 Nov 2026 (check of the sweep, note 1): on the home page the site head's parallax rule .tllp-home :has(> img[data-tll-parallax=
   "hero"]) ~ * (0,2,1) also matches the card and made it position:relative, z-index 2, so it sat at the foot of the page. The card's
   rule now carries an id and html body (1,1,2) and !important on position, the offsets and z-index, so it stays fixed bottom right on
   every page; the /account rule above the Tell the editor pill keeps one class more. */
(function(){
var KEY='tll-gate-return',TTL=30*60*1000,P=location.pathname.replace(/\/+$/,'')||'/';
var WORDS={'/submit':'Back to your story','/my-pets':'Back to your pets','/share-photos':'Back to your photos'};
function ss(){try{return window.sessionStorage;}catch(e){return null;}}
function get(){var s=ss();if(!s)return null;try{var v=JSON.parse(s.getItem(KEY)||'null');if(v&&WORDS[v.p]&&Date.now()-v.t<TTL)return v;}catch(e){}try{s.removeItem(KEY);}catch(e){}return null;}
function clear(){var s=ss();try{if(s)s.removeItem(KEY);}catch(e){}}
if(WORDS[P])document.addEventListener('click',function(e){
  var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a||a.closest('nav'))return;
  var h=(a.getAttribute('href')||'').replace(/[?#].*$/,'').replace(/\/+$/,'');if(h!=='/login'&&h!=='/signup')return;
  if(!a.closest('[data-ms-content="anonymous"]'))return;
  var s=ss();try{if(s)s.setItem(KEY,JSON.stringify({p:P,t:Date.now()}));}catch(err){}
},true);
function member(cb){var n=0,iv=setInterval(function(){var ms=window.$memberstackDom;if(ms&&ms.getCurrentMember){clearInterval(iv);ms.getCurrentMember().then(function(r){cb(!!(r&&r.data));}).catch(function(){cb(false);});}else if(++n>40){clearInterval(iv);cb(false);}},150);}
var CSS='html body #tll-gate-back.tll-gate-back{position:fixed !important;right:16px !important;bottom:16px !important;left:auto !important;top:auto !important;z-index:2147483000 !important;display:flex;align-items:center;gap:4px;max-width:min(360px,calc(100% - 92px));box-sizing:border-box;padding:4px 4px 4px 16px;background:#0A0B14;color:#F7F1E8;border:1.5px solid #F7F1E8;font:600 16px/1.2 "IBM Plex Sans Condensed",system-ui,sans-serif}'+
'.tll-gate-back a{display:inline-flex;align-items:center;min-height:44px;color:#F7F1E8 !important;text-decoration:underline;text-decoration-color:#F0507A;text-decoration-thickness:2px;text-underline-offset:4px}'+
'@media(min-width:960px){html[data-wf-page="6a0d5c23c57426a9c563e8de"] body #tll-gate-back.tll-gate-back{bottom:76px !important}}'+
'.tll-gate-back button{flex:none;width:44px;height:44px;margin:0;padding:0;border:0;background:transparent;color:#F7F1E8;font:400 22px/1 system-ui,sans-serif;cursor:pointer}';
function show(v){
  if(document.getElementById('tll-gate-back'))return;
  var st=document.createElement('style');st.id='tll-gate-return-v1';st.textContent=CSS;(document.head||document.documentElement).appendChild(st);
  var box=document.createElement('div');box.id='tll-gate-back';box.className='tll-gate-back';box.setAttribute('role','status');
  var a=document.createElement('a');a.href=v.p;a.textContent=WORDS[v.p]+' →';a.addEventListener('click',clear);
  var x=document.createElement('button');x.type='button';x.setAttribute('aria-label','Close');x.textContent='×';x.addEventListener('click',function(){clear();box.remove();});
  box.appendChild(a);box.appendChild(x);document.body.appendChild(box);
}
function run(){
  var v=get();if(!v||P==='/login'||P==='/signup')return;
  member(function(signed){if(!signed)return;if(P===v.p){clear();return;}show(v);});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
