/* tll-ep-ux-v1 (29 Oct 2026). /edit-profile, from the first paid testers' notes relayed by Nancy:
   "It is not clear how to save your profile"; "the page flickers and moves up and down every time I enter and save any information on
   the mobile version"; "it doesn't go back to the same section I was filling"; "Saved to your account ... hard to notice, I just saw this on
   the top of the screen. Maybe it can be at the bottom"; "The names of the countries don't appear in the dropdown list on the mobile version";
   "I was writing the entire names of the countries but couldn't see any indication that it is accepted or not"; "For the profile photo it
   would be great if there could be a crop or readjust feature".
   1. Save bar: one bar fixed to the bottom of the screen says what the page is doing (changes save as you type, Saving, Saved with the time,
      or what went wrong and Try again) next to View my page. The two status lines in the page header and the sticky tab bar are hidden, so a
      long message no longer grows the header and pushes the form down.
   2. The field being typed in stays put: if anything above it changes height while saving, the page scrolls by the same amount
      (iPhone Safari has no scroll anchoring of its own).
   3. The reason: when the site's save service refuses a save, the bar says why, in the service's own words.
   4. Countries: a list of matching countries opens under the From, Has lived in and expat desk boxes on every phone; tapping one adds it.
      Leaving the box with a full country name typed adds it too. UK, USA, England and other common short forms work. A line says
      "Added {country}." Same stored value as before (two letter codes).
   5. Photo: choosing a profile photo opens a square crop first. Drag to move, slider or pinch to zoom, Use photo. The cropped copy is a fresh
      1080 px JPEG, so it carries no location data either. Then the page's own upload runs as before.
   Namespaced tll-eps-; nothing removed; no data-ms-* element touched; Memberstack is called only by the page's own scripts. */
(function(){
if((location.pathname.replace(/\/+$/,'')||'/')!=='/edit-profile')return;
var D=document;
var CSS=
".ep-hero-save [data-ep-status],.ep-hero-save [data-ep-retry],.ep-bar-st{display:none!important}"+
"body.tll-eps-on{padding-bottom:84px!important}"+
"body.tll-eps-on #tll-note{bottom:84px!important}"+
".tll-eps{position:fixed;left:0;right:0;bottom:0;z-index:70;background:#FDF9F3;border-top:1.5px solid #0A0B14;box-shadow:0 -6px 18px rgba(10,11,20,.08);padding:10px max(16px,env(safe-area-inset-left)) calc(10px + env(safe-area-inset-bottom));font-family:'IBM Plex Sans Condensed',system-ui,sans-serif}"+
".tll-eps-in{max-width:1120px;margin:0 auto;display:flex;align-items:center;gap:12px;min-height:44px}"+
".tll-eps-t{flex:1;min-width:0;font-size:15px;line-height:1.3;color:#1A1A1A}"+
".tll-eps-t b{font-weight:700}"+
".tll-eps-dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#067A79;margin-right:8px;vertical-align:1px}"+
".tll-eps[data-s=busy] .tll-eps-dot{background:#B07A1A}"+
".tll-eps[data-s=fail] .tll-eps-dot{background:#C8325B}"+
".tll-eps[data-s=fail] .tll-eps-t{color:#8E1F3D}"+
".tll-eps-btn{flex:none;display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border:1.5px solid #0A0B14;background:#0A0B14;color:#F7F1E8!important;font:600 15px/1 'IBM Plex Sans Condensed',system-ui,sans-serif;text-decoration:none!important;cursor:pointer;border-radius:0}"+
".tll-eps-btn[hidden]{display:none!important}"+
".tll-eps-btn--ghost{background:transparent;color:#0A0B14!important}"+
".tll-eps-btn:focus-visible{outline:3px solid #C8325B;outline-offset:2px}"+
/* preview card: "80-something +AQ" broke mid-word in a third of the card; stats now wrap as whole words */
"html body .ep-pv-stats b .tll-eps-aq{display:block;margin-top:4px;font:600 12px/1.3 'JetBrains Mono',ui-monospace,monospace!important;letter-spacing:.12em;text-transform:uppercase;color:inherit}"+
"html body p.ep-note.tll-eps-lived,html body p.tll-eps-optin{margin:8px 0 0;font-size:14px;line-height:1.45;color:#5F5A54}html body p.tll-eps-optin{margin:0 0 16px;padding:10px 12px;border-left:3px solid #067A79;background:#FFFFFF}"+
"html body p.ep-note.tll-eps-lived a,html body p.tll-eps-optin a{color:#067A79;font-weight:600;text-decoration:underline;text-underline-offset:3px}html body p.ep-note.tll-eps-lived a:hover,html body p.tll-eps-optin a:hover{color:#C8325B}"+
"html body #ep-dirs-h>span:not(.tll-eps-chip){display:none}"+
".tll-eps-quick{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:12px 0 4px}.tll-eps-quick[hidden]{display:none}.tll-eps-quick>span{width:100%;font-size:14px;color:#5F5A54}"+
".tll-eps-qb{min-height:40px;padding:8px 12px;border:1.5px solid #0A0B14;border-radius:999px;background:#FFFFFF;color:#0A0B14;font:600 14px/1.2 'IBM Plex Sans Condensed',system-ui,sans-serif;cursor:pointer}.tll-eps-qb:hover{border-color:#C8325B;color:#C8325B}.tll-eps-qb:focus-visible{outline:3px solid #C8325B;outline-offset:2px}"+
"html body .ep-pv-stats{display:flex!important;flex-wrap:wrap;gap:12px 22px}html body .ep-pv-stats>*{min-width:0}html body .ep-pv-stats b{white-space:nowrap;overflow-wrap:normal!important;word-break:keep-all;font-size:28px!important}"+
/* blocks (Nancy: "too long. Should be in blocks. Also should identify optional vs required") */
"html body section.ep-sec.tll-eps-blk{position:relative;background:#FDF9F3;border:1.5px solid #E0DACE;border-radius:4px;padding:22px 22px 24px!important;margin:0 0 16px!important}"+
"html body section.ep-sec.tll-eps-blk>h2.ep-eb{cursor:pointer;padding-right:96px;margin-bottom:12px}"+
"html body section.ep-sec.tll-eps-shut{padding-bottom:22px!important}html body section.ep-sec.tll-eps-shut>h2.ep-eb{margin-bottom:0}"+
"html body section.ep-sec.tll-eps-shut>*:not(h2.ep-eb):not(.tll-eps-tog){display:none!important}"+
".tll-eps-chip{display:inline-block;vertical-align:middle;margin-left:10px;padding:4px 8px;border:1px solid #D9D2C5;border-radius:999px;font:600 12px/1 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase;color:#5F5A54;background:#FFFFFF}"+
".tll-eps-chip--req{border-color:#C8325B;color:#C8325B}"+
".tll-eps-tog{position:absolute;top:16px;right:16px;min-height:44px;padding:0 14px;border:1.5px solid #0A0B14;background:transparent;color:#0A0B14;font:600 14px/1 'IBM Plex Sans Condensed',system-ui,sans-serif;cursor:pointer;border-radius:0}"+
".tll-eps-tog:focus-visible{outline:3px solid #C8325B;outline-offset:2px}"+
"@media (max-width:520px){.tll-eps-t{font-size:13px}.tll-eps-btn{padding:0 12px;font-size:14px}.tll-eps-btn--ghost{display:none}}"+
/* country suggestions */
".tll-eps-ac{position:relative}"+
".tll-eps-list{position:absolute;left:0;right:0;top:100%;z-index:65;margin:4px 0 0;padding:4px 0;list-style:none;background:#FDF9F3;border:1.5px solid #0A0B14;box-shadow:0 10px 24px rgba(10,11,20,.14);max-height:264px;overflow:auto}"+
".tll-eps-list li{margin:0;padding:0;list-style:none}"+
".tll-eps-list button{display:flex;align-items:center;gap:10px;width:100%;min-height:44px;padding:0 14px;border:0;background:transparent;color:#1A1A1A;font:500 16px/1.2 'IBM Plex Sans Condensed',system-ui,sans-serif;text-align:left;cursor:pointer}"+
".tll-eps-list button[aria-selected=true],.tll-eps-list button:hover{background:#F0E8DA}"+
".tll-eps-added{display:block;margin:6px 0 0;font-size:14px;color:#067A79;font-weight:600}"+
/* crop dialog */
".tll-eps-crop{position:fixed;inset:0;z-index:90;background:rgba(10,11,20,.72);display:flex;align-items:center;justify-content:center;padding:16px}"+
".tll-eps-card{background:#FDF9F3;width:min(100%,420px);padding:20px;border:1.5px solid #0A0B14;font-family:'IBM Plex Sans Condensed',system-ui,sans-serif;color:#1A1A1A}"+
".tll-eps-card h2{margin:0 0 4px;font:800 24px/1.1 'Playfair Display',Georgia,serif!important;color:#0A0B14;letter-spacing:-.01em}"+
".tll-eps-card p{margin:0 0 14px;font-size:14px;line-height:1.45;color:#3a3a3a}"+
".tll-eps-stage{position:relative;width:100%;aspect-ratio:1/1;background:#0A0B14;overflow:hidden;touch-action:none;cursor:grab;user-select:none;-webkit-user-select:none}"+
".tll-eps-stage canvas{display:block;width:100%;height:100%}"+
".tll-eps-stage::after{content:'';position:absolute;inset:0;pointer-events:none;border-radius:50%;box-shadow:0 0 0 999px rgba(10,11,20,.45);outline:2px solid rgba(247,241,232,.9);outline-offset:-2px}"+
".tll-eps-zoom{display:flex;align-items:center;gap:10px;margin:14px 0 16px;font-size:14px}"+
".tll-eps-zoom input{flex:1;accent-color:#C8325B;min-height:44px}"+
".tll-eps-acts{display:flex;gap:10px;justify-content:flex-end}";

function el(t,c){var e=D.createElement(t);if(c)e.className=c;return e;}
function $(s,r){return (r||D).querySelector(s);}

/* ---------- 1 and 3: the save bar, and the reason ---------- */
var lastErr='';
(function(){var f=window.fetch;if(!f||f.__tllEps)return;var w=function(u,o){var p=f.apply(this,arguments);var s=String(u&&u.url||u);
  if(/\/profile\/save$/.test(s))p.then(function(r){if(r.ok){lastErr='';return;}r.clone().json().then(function(j){lastErr=String(j&&j.error||'');paint();}).catch(function(){lastErr='';});}).catch(function(){lastErr='';});
  return p;};w.__tllEps=1;window.fetch=w;})();
var bar,txt,btn,retry,save,okTimer=0,photoPending=false;
function hhmm(){var d=new Date();return d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});}
function paint(){var s=$('[data-ep-status]');if(!s||!bar)return;var st=s.getAttribute('data-state')||'',t=(s.textContent||'').trim();
  bar.setAttribute('data-s',st||'idle');
  if(st==='busy'){txt.innerHTML='<span class="tll-eps-dot"></span>'+(photoPending?'Saving your photo…':'Saving…');}
  else if(st==='ok'){txt.innerHTML='<span class="tll-eps-dot"></span><b>'+(photoPending?'Photo saved':'Saved')+'</b> · '+hhmm();photoPending=false;}
  else if(st==='fail'){photoPending=false;var why=/did not update/.test(t)&&lastErr?'Saved to your account. Your public page did not update yet: '+lastErr:t;txt.innerHTML='';var d=el('span','tll-eps-dot');txt.appendChild(d);txt.appendChild(D.createTextNode(why));}
  else{txt.innerHTML='<span class="tll-eps-dot"></span>Changes save as you type, or tap Save.';}
  retry.hidden=st!=='fail';btn.hidden=st==='fail';save.hidden=st==='fail';}
function buildBar(){if($('.tll-eps'))return;bar=el('div','tll-eps');bar.setAttribute('data-s','idle');
  var i=el('div','tll-eps-in');txt=el('p','tll-eps-t');txt.setAttribute('role','status');txt.setAttribute('aria-live','polite');txt.style.margin='0';
  var v=$('[data-ep-view]');btn=el('a','tll-eps-btn tll-eps-btn--ghost');btn.textContent='View my page →';btn.href=v?v.getAttribute('href'):'/travelers';btn.target='_blank';btn.rel='noopener';
  retry=el('button','tll-eps-btn');retry.type='button';retry.textContent='Try again';retry.hidden=true;
  save=el('button','tll-eps-btn');save.type='button';save.textContent='Save';
  save.addEventListener('click',function(){var a=D.activeElement;if(a&&a.blur&&a!==D.body)a.blur();var before=Date.now();txt.innerHTML='<span class="tll-eps-dot"></span>Saving\u2026';bar.setAttribute('data-s','busy');
    setTimeout(function(){var r=$('[data-ep-retry]');if(r)r.click();setTimeout(function(){var st=$('[data-ep-status]'),k=st&&st.getAttribute('data-state');if(k!=='busy'&&k!=='fail'){bar.setAttribute('data-s','ok');txt.innerHTML='<span class="tll-eps-dot"></span><b>Saved</b> \u00b7 '+hhmm();}},700);},80);});
  retry.addEventListener('click',function(){var r=$('[data-ep-retry]');if(r)r.click();});
  i.appendChild(txt);i.appendChild(save);i.appendChild(btn);i.appendChild(retry);bar.appendChild(i);D.body.appendChild(bar);D.body.classList.add('tll-eps-on');
  var s=$('[data-ep-status]');if(s)new MutationObserver(paint).observe(s,{attributes:true,childList:true,characterData:true,subtree:true});
  if(v)new MutationObserver(function(){btn.href=v.getAttribute('href');}).observe(v,{attributes:true,attributeFilter:['href']});
  paint();}

/* ---------- 2: keep the field being typed in still ---------- */
var anchor=null,top0=0,raf=0;
function track(){var a=D.activeElement;if(a&&a!==D.body&&a.matches&&a.matches('input,textarea,select,[contenteditable]')&&!a.closest('.tll-eps,.tll-eps-crop')){anchor=a;top0=a.getBoundingClientRect().top;}else anchor=null;}
function hold(){raf=0;if(!anchor||!anchor.isConnected)return;var t=anchor.getBoundingClientRect().top,dy=t-top0;if(Math.abs(dy)>1){window.scrollBy(0,dy);}top0=anchor.getBoundingClientRect().top;}
D.addEventListener('focusin',track);D.addEventListener('input',track,true);
addEventListener('scroll',function(){if(anchor&&!raf)top0=anchor.getBoundingClientRect().top;},{passive:true});
function watchShifts(){var root=$('main')||D.body;new MutationObserver(function(){if(anchor&&!raf)raf=requestAnimationFrame(hold);}).observe(root,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['hidden','class','style','data-state']});}

/* ---------- 4: countries ---------- */
var ALIAS={'uk':'United Kingdom','u.k.':'United Kingdom','britain':'United Kingdom','great britain':'United Kingdom','england':'United Kingdom','scotland':'United Kingdom','wales':'United Kingdom','northern ireland':'United Kingdom',
 'usa':'United States','u.s.':'United States','u.s.a.':'United States','america':'United States','united states of america':'United States','the us':'United States','the usa':'United States',
 'uae':'United Arab Emirates','dubai':'United Arab Emirates','holland':'Netherlands','the netherlands':'Netherlands','czech republic':'Czechia','korea':'South Korea','republic of korea':'South Korea',
 'russian federation':'Russia','cote d\'ivoire':'Ivory Coast','côte d\'ivoire':'Ivory Coast','türkiye':'Turkey','turkiye':'Turkey','vatican':'Vatican City','holy see':'Vatican City','burma':'Myanmar',
 'swaziland':'Eswatini','cabo verde':'Cape Verde','macedonia':'North Macedonia','bosnia':'Bosnia and Herzegovina','drc':'DR Congo','democratic republic of the congo':'DR Congo','east timor':'Timor-Leste',
 'viet nam':'Vietnam','the bahamas':'Bahamas','the gambia':'Gambia','persia':'Iran'};
function names(){var o=D.querySelectorAll('#ep-countries option');return [].map.call(o,function(x){return x.value;}).filter(Boolean);}
function norm(s){return String(s||'').trim().toLowerCase().replace(/\s+/g,' ');}
function resolve(q){q=norm(q);if(!q)return '';var N=names(),i;for(i=0;i<N.length;i++)if(norm(N[i])===q)return N[i];if(ALIAS[q]){var a=ALIAS[q];for(i=0;i<N.length;i++)if(N[i]===a)return a;}return '';}
function matches(q){q=norm(q);if(!q)return [];var N=names(),out=[],seen={};function add(n){if(!seen[n]){seen[n]=1;out.push(n);}}
  if(ALIAS[q])add(ALIAS[q]);N.forEach(function(n){if(norm(n).indexOf(q)===0)add(n);});N.forEach(function(n){if(out.length<8&&norm(n).indexOf(' '+q)>0)add(n);});
  Object.keys(ALIAS).forEach(function(k){if(k.indexOf(q)===0&&q.length>1)add(ALIAS[k]);});return out.slice(0,6);}
var BOXES=[['[data-ep-fromq]','[data-ep-from-add]'],['[data-ep-livedq]','[data-ep-lived-add]'],['[data-ep-deskq]','[data-ep-desk-add]']];
function wireBox(sel,addSel){var q=$(sel);if(!q||q.__tllEps)return;q.__tllEps=1;var addB=q.parentNode.querySelector(addSel)||$(addSel);
  q.removeAttribute('list');q.setAttribute('role','combobox');q.setAttribute('aria-autocomplete','list');q.setAttribute('aria-expanded','false');q.setAttribute('autocapitalize','words');
  var wrap=q.parentNode;wrap.classList.add('tll-eps-ac');var ul=el('ul','tll-eps-list');ul.id='tll-eps-l-'+(q.id||Math.random().toString(36).slice(2));ul.setAttribute('role','listbox');ul.hidden=true;q.setAttribute('aria-controls',ul.id);wrap.appendChild(ul);
  var note=el('span','tll-eps-added');note.setAttribute('role','status');note.setAttribute('aria-live','polite');wrap.parentNode.insertBefore(note,wrap.nextSibling);
  var cur=-1,picking=false,nt=0;
  function close(){ul.hidden=true;q.setAttribute('aria-expanded','false');q.removeAttribute('aria-activedescendant');cur=-1;}
  function open(list){ul.innerHTML='';if(!list.length){close();return;}list.forEach(function(n,i){var li=el('li');var b=el('button');b.type='button';b.id=ul.id+'-'+i;b.setAttribute('role','option');b.setAttribute('aria-selected','false');b.tabIndex=-1;b.textContent=n;
      b.addEventListener('pointerdown',function(e){e.preventDefault();picking=true;});b.addEventListener('click',function(){commit(n);});li.appendChild(b);ul.appendChild(li);});
    ul.hidden=false;q.setAttribute('aria-expanded','true');}
  function commit(n){picking=false;close();if(!n)return;q.value=n;if(addB)addB.click();
    setTimeout(function(){clearTimeout(nt);if(!q.value){note.textContent='Added '+n+'.';nt=setTimeout(function(){note.textContent='';},4000);}else note.textContent='';},60);}
  q.addEventListener('input',function(){note.textContent='';open(matches(q.value));});
  q.addEventListener('keydown',function(e){var bs=ul.querySelectorAll('button');if(e.key==='ArrowDown'||e.key==='ArrowUp'){if(!bs.length)return;e.preventDefault();cur=(cur+(e.key==='ArrowDown'?1:-1)+bs.length)%bs.length;
      [].forEach.call(bs,function(b,i){b.setAttribute('aria-selected',i===cur?'true':'false');});q.setAttribute('aria-activedescendant',bs[cur].id);bs[cur].scrollIntoView({block:'nearest'});}
    else if(e.key==='Enter'){var n=cur>-1&&bs[cur]?bs[cur].textContent:(resolve(q.value)||'');if(n){e.preventDefault();e.stopImmediatePropagation();commit(n);}}
    else if(e.key==='Escape'){close();}},true);
  if(addB)addB.addEventListener('click',function(e){if(e.isTrusted){var n=resolve(q.value);if(n&&n!==q.value)q.value=n;var v=q.value;setTimeout(function(){if(v&&!q.value){note.textContent='Added '+v+'.';clearTimeout(nt);nt=setTimeout(function(){note.textContent='';},4000);}},60);}},true);
  q.addEventListener('blur',function(){setTimeout(function(){if(picking)return;close();var n=resolve(q.value);if(n)commit(n);},150);});}

/* ---------- 5: photo crop ---------- */
function cropFlow(file,input){var url=URL.createObjectURL(file),img=new Image();img.onload=function(){show(img,url,input);};img.onerror=function(){URL.revokeObjectURL(url);pass(input,file);};img.src=url;}
function pass(input,file){try{var dt=new DataTransfer();dt.items.add(file);input.files=dt.files;}catch(e){}input.__tllEpsPass=1;input.dispatchEvent(new Event('change',{bubbles:true}));input.__tllEpsPass=0;}
function show(img,url,input){var back=D.activeElement,ov=el('div','tll-eps-crop'),card=el('div','tll-eps-card');card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-labelledby','tll-eps-ch');
  card.innerHTML='<h2 id="tll-eps-ch">Place your photo</h2><p>Drag to move it, zoom to fit. The circle is what shows on your card.</p>';
  var st=el('div','tll-eps-stage'),cv=el('canvas');cv.width=720;cv.height=720;st.appendChild(cv);st.tabIndex=0;st.setAttribute('aria-label','Photo position. Arrow keys move it, plus and minus zoom.');
  var zw=el('label','tll-eps-zoom');zw.innerHTML='<span>Zoom</span>';var z=el('input');z.type='range';z.min='1';z.max='3';z.step='0.01';z.value='1';z.setAttribute('aria-label','Zoom');zw.appendChild(z);
  var acts=el('div','tll-eps-acts'),cancel=el('button','tll-eps-btn tll-eps-btn--ghost'),use=el('button','tll-eps-btn');cancel.type=use.type='button';cancel.textContent='Cancel';use.textContent='Save photo';acts.appendChild(cancel);acts.appendChild(use);
  card.appendChild(st);card.appendChild(zw);card.appendChild(acts);ov.appendChild(card);D.body.appendChild(ov);
  var W=img.naturalWidth,H=img.naturalHeight,base=Math.max(720/W,720/H),s=base,x=(720-W*s)/2,y=(720-H*s)/2,ctx=cv.getContext('2d');
  function clamp(){var w=W*s,h=H*s;x=Math.min(0,Math.max(720-w,x));y=Math.min(0,Math.max(720-h,y));}
  function draw(){clamp();ctx.fillStyle='#0A0B14';ctx.fillRect(0,0,720,720);ctx.drawImage(img,x,y,W*s,H*s);}
  function zoomTo(ns,cx,cy){ns=Math.max(base,Math.min(base*3,ns));cx=cx==null?360:cx;cy=cy==null?360:cy;x=cx-(cx-x)*ns/s;y=cy-(cy-y)*ns/s;s=ns;z.value=String(s/base);draw();}
  draw();var pts={},startD=0,startS=s;
  function scale(){return 720/st.getBoundingClientRect().width;}
  st.addEventListener('pointerdown',function(e){st.setPointerCapture(e.pointerId);pts[e.pointerId]={x:e.clientX,y:e.clientY};var k=Object.keys(pts);if(k.length===2){var a=pts[k[0]],b=pts[k[1]];startD=Math.hypot(a.x-b.x,a.y-b.y);startS=s;}});
  st.addEventListener('pointermove',function(e){var p=pts[e.pointerId];if(!p)return;var k=Object.keys(pts),f=scale();
    if(k.length===2){p.x=e.clientX;p.y=e.clientY;var a=pts[k[0]],b=pts[k[1]],d=Math.hypot(a.x-b.x,a.y-b.y);if(startD)zoomTo(startS*d/startD);return;}
    x+=(e.clientX-p.x)*f;y+=(e.clientY-p.y)*f;p.x=e.clientX;p.y=e.clientY;draw();});
  function up(e){delete pts[e.pointerId];startD=0;}st.addEventListener('pointerup',up);st.addEventListener('pointercancel',up);
  st.addEventListener('wheel',function(e){e.preventDefault();zoomTo(s*(e.deltaY<0?1.06:1/1.06));},{passive:false});
  z.addEventListener('input',function(){zoomTo(base*parseFloat(z.value));});
  st.addEventListener('keydown',function(e){var m={ArrowLeft:[12,0],ArrowRight:[-12,0],ArrowUp:[0,12],ArrowDown:[0,-12]}[e.key];if(m){e.preventDefault();x+=m[0];y+=m[1];draw();}else if(e.key==='+'||e.key==='='){zoomTo(s*1.06);}else if(e.key==='-'){zoomTo(s/1.06);}});
  function done(){ov.remove();URL.revokeObjectURL(url);D.removeEventListener('keydown',esc,true);if(back&&back.focus)back.focus();}
  function esc(e){if(e.key==='Escape'){e.preventDefault();done();input.value='';}if(e.key==='Tab'){var f=[st,z,cancel,use],i=f.indexOf(D.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();use.focus();}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();st.focus();}}}
  D.addEventListener('keydown',esc,true);
  cancel.addEventListener('click',function(){done();input.value='';});
  use.addEventListener('click',function(){var out=el('canvas');out.width=out.height=1080;var o=out.getContext('2d'),k=1080/720;o.fillStyle='#FFFFFF';o.fillRect(0,0,1080,1080);o.drawImage(img,x*k,y*k,W*s*k,H*s*k);
    use.disabled=true;use.textContent='Saving…';out.toBlob(function(b){done();if(!b)return;var f=new File([b],'profile-photo.jpg',{type:'image/jpeg'});photoPending=true;pass(input,f);},'image/jpeg',.9);});
  setTimeout(function(){st.focus();},30);}
D.addEventListener('change',function(e){var t=e.target;if(!t||t.id!=='ep-f-photo'||t.__tllEpsPass)return;var f=t.files&&t.files[0];if(!f||!/^image\//.test(f.type||'image/'))return;
  e.stopImmediatePropagation();e.preventDefault();cropFlow(f,t);},true);

/* ---------- 6: the page as blocks ---------- */
var CHIP={'ep-who':['Name required','req'],'ep-dirs':['Opt in','']};
function setShut(sec,shut){sec.classList.toggle('tll-eps-shut',shut);var b=sec.querySelector(':scope>.tll-eps-tog');if(b){b.textContent=shut?'Open':'Close';b.setAttribute('aria-expanded',shut?'false':'true');}}
function openTo(id){var sec=D.getElementById(id);if(sec&&sec.classList.contains('tll-eps-blk'))setShut(sec,false);}
/* Some parts of a section are their own embeds after it (Shown as, One line, From and lived in after Who you are; the bio note after
   About you). Each part with no section of its own moves into the section before it, so the block holds all of its fields. */
function gather(){var secs=[].slice.call(D.querySelectorAll('section.ep-sec[id]'));if(!secs.length)return;
  [].forEach.call(D.querySelectorAll('div[data-ep]'),function(d){var k=d.getAttribute('data-ep');if(k==='top'||d.querySelector('section.ep-sec')||d.closest('section.ep-sec'))return;
    var prev=null;secs.forEach(function(s){if(s.compareDocumentPosition(d)&Node.DOCUMENT_POSITION_FOLLOWING)prev=s;});
    if(!prev)return;var next=secs[secs.indexOf(prev)+1];if(next&&(next.compareDocumentPosition(d)&Node.DOCUMENT_POSITION_FOLLOWING))return;
    prev.appendChild(d);});}
function blocks(){gather();[].forEach.call(D.querySelectorAll('section.ep-sec[id]'),function(sec,i){if(sec.classList.contains('tll-eps-blk'))return;sec.classList.add('tll-eps-blk');
  var h=sec.querySelector(':scope>h2.ep-eb');var c=CHIP.hasOwnProperty(sec.id)?CHIP[sec.id]:['Optional',''];
  if(h&&c){var chip=el('span','tll-eps-chip'+(c[1]?' tll-eps-chip--req':''));chip.textContent=c[0];h.appendChild(chip);}
  var t=el('button','tll-eps-tog');t.type='button';t.setAttribute('aria-controls',sec.id);sec.appendChild(t);
  t.addEventListener('click',function(){setShut(sec,!sec.classList.contains('tll-eps-shut'));});
  if(h)h.addEventListener('click',function(e){if(e.target.closest('a,button,[tabindex]'))return;setShut(sec,!sec.classList.contains('tll-eps-shut'));});
  setShut(sec,sec.id!=='ep-who'&&location.hash!=='#'+sec.id);});
  D.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="#ep-"]');if(a){openTo(a.getAttribute('href').slice(1));return;}
    if(e.target.closest&&e.target.closest('[data-ep-dev-next],[data-ep-next]'))[].forEach.call(D.querySelectorAll('section.tll-eps-shut'),function(x){setShut(x,false);});},true);
  addEventListener('hashchange',function(){openTo(location.hash.slice(1));});}

/* ---------- 7: where you have lived, and the expat desks (Nancy: "We ask the expat question twice"; "The expat desk should still be
   tied here with this form tied to the expat submission. This is definitely opt in.") ----------
   Has lived in under Who you are stays the everyday question. The Directories block is marked Opt in, with a line at its top that points
   to the location expert application on /for-expats. Under Has lived in, a line points to the desks. Inside the desks, each country
   from From and Has lived in with no desk yet is offered as one tap ("Add a desk for Denmark"), which runs the page's own desk Add, so
   nothing new is stored and nothing is added without a tap. The preview's Antarctica mark reads "+ Antarctica" in place of AQ. */
var LIVED_NOTE='Know one of these well? Add it as a desk in <a href="#ep-dirs">Directories</a> (opt in).';
var OPTIN_NOTE='Add a desk only for a place you know well enough to help a visitor. Want to be listed as a location expert? <a href="/for-expats#tll-expert-apply">Claim your desk →</a>';
function livedPaint(E){var lf=D.querySelector('[data-ep-livedflags]'),sub=lf&&lf.closest('.ep-sub'),L=E.list(E.get('from-and-lived-in'));
  if(sub){var n=D.getElementById('tll-eps-lived');if(!n){n=el('p','ep-note tll-eps-lived');n.id='tll-eps-lived';n.innerHTML=LIVED_NOTE;sub.appendChild(n);}
    var h=L.length<2;if(n.hidden!==h)n.hidden=h;}
  var dirs=D.getElementById('ep-dirs');if(dirs&&!D.getElementById('tll-eps-optin')){var o=el('p','tll-eps-optin');o.id='tll-eps-optin';o.innerHTML=OPTIN_NOTE;
    var ld=dirs.querySelector(':scope>p.ep-lede'),h2=dirs.querySelector(':scope>h2.ep-eb'),at=ld||h2;if(at)at.parentNode.insertBefore(o,at.nextSibling);else dirs.insertBefore(o,dirs.firstChild);}
  var box=D.querySelector('[data-ep-desks]'),add=box&&box.querySelector('.ep-desk-add');
  if(add){var qk=D.getElementById('tll-eps-quick');if(!qk){qk=el('div','tll-eps-quick');qk.id='tll-eps-quick';add.parentNode.insertBefore(qk,add);}
    var have={};(E.desksShown||E.jsonList('desks')).forEach(function(d){if(d&&d.c)have[d.c]=1;});
    var todo=L.filter(function(c,i){return c&&!have[c]&&L.indexOf(c)===i;}),key=todo.join(',');
    if(qk.getAttribute('data-k')!==key){qk.setAttribute('data-k',key);qk.innerHTML='';
      if(todo.length){var t=el('span');t.textContent='From your profile:';qk.appendChild(t);
        todo.forEach(function(c){var b=el('button','tll-eps-qb');b.type='button';b.setAttribute('data-tll-desk',c);b.textContent='Add a desk for '+E.cname(c);qk.appendChild(b);});}}
    var hid=!todo.length;if(qk.hidden!==hid)qk.hidden=hid;}
  var pc=D.querySelector('[data-ep-pv-countries]');
  if(pc&&!pc.querySelector('.tll-eps-aq')&&/ \+AQ$/.test(pc.textContent)){var t2=pc.textContent.replace(/ \+AQ$/,'');pc.textContent=t2;var a=el('small','tll-eps-aq');a.textContent='+ Antarctica';pc.appendChild(a);}}
function lived(){var E=window.TLLEP;if(!E||!E.paint||!E.list)return false;if(E.__tllLived)return true;E.__tllLived=1;
  D.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-tll-desk]');if(!b)return;
    var q=D.querySelector('[data-ep-deskq]'),ab=D.querySelector('[data-ep-desk-add]');if(!q||!ab)return;
    q.value=E.cname(b.getAttribute('data-tll-desk'));ab.click();});
  var P=E.paint;E.paint=function(){var r=P.apply(this,arguments);livedPaint(E);return r;};livedPaint(E);return true;}

function run(){if(!D.getElementById('tll-ep-ux-v1')){var s=el('style');s.id='tll-ep-ux-v1';s.textContent=CSS;D.head.appendChild(s);}
  buildBar();watchShifts();blocks();if(!lived())addEventListener('load',lived);BOXES.forEach(function(b){wireBox(b[0],b[1]);});
  /* boxes the page draws later (the expat desks open when Live there is switched on) */
  new MutationObserver(function(){BOXES.forEach(function(b){wireBox(b[0],b[1]);});}).observe(D.body,{childList:true,subtree:true});}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',run);else run();
})();
