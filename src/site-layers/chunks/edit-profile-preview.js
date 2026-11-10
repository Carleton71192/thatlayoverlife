/* tll-site-layers-v16 chunk edit-profile-preview: loaded by the core loader on paths matching /^\/edit-profile/, after the core and in this order. Built by src/site-layers/build-site-layers-v16.py; each layer keeps its own path guard. No data-ms-* element is touched. */
/* src/components/edit-profile-fixes/tll-ep-country-v1.js */
(function(){
  if(!/^\/edit-profile/.test(location.pathname)) return;
  var ALIAS={'usa':'us','u.s.a.':'us','u.s.a':'us','u.s.':'us','u.s':'us','america':'us','united states of america':'us','the united states':'us',
    'uk':'gb','u.k.':'gb','u.k':'gb','britain':'gb','great britain':'gb','england':'gb','scotland':'gb','wales':'gb','northern ireland':'gb','the united kingdom':'gb',
    'holland':'nl','the netherlands':'nl','uae':'ae','u.a.e.':'ae','emirates':'ae','the emirates':'ae','korea':'kr','republic of korea':'kr',
    'czech republic':'cz','burma':'mm','swaziland':'sz','macedonia':'mk','east timor':'tl','cabo verde':'cv',"cote d'ivoire":'ci',"côte d'ivoire":'ci',
    'vatican':'va','holy see':'va','turkiye':'tr','türkiye':'tr','russian federation':'ru','drc':'cd','democratic republic of the congo':'cd','republic of ireland':'ie'};
  var ST={}; "alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new hampshire|new jersey|new mexico|new york|north carolina|north dakota|ohio|oklahoma|oregon|pennsylvania|rhode island|south carolina|south dakota|tennessee|texas|utah|vermont|virginia|washington|west virginia|wisconsin|wyoming|washington dc|washington d.c.|district of columbia|puerto rico".split('|').forEach(function(x){ ST[x]=1; }); /* US states (Georgia is left to the country) */
  function norm(s){ return String(s||'').trim().toLowerCase().replace(/\s+/g,' '); }
  function patch(){
    var E=window.TLLEP; if(!E||!E.ccode||E.ccode.__tll||!E.C) return false;
    var base=E.ccode;
    function exact(p){ for(var i=0;i<E.C.length;i++){ if(E.C[i].c===p||E.C[i].n.toLowerCase()===p) return E.C[i].c; } return ''; }
    var f=function(q){
      var s=norm(q); if(!s) return '';
      var parts=s.split(/\s*[,;\/]\s*|\s+-\s+/).filter(Boolean);
      for(var i=parts.length-1;i>=0;i--){ var p=parts[i]; var c=exact(p)||ALIAS[p]||(ST[p]?'us':''); if(c) return c; }
      return base(q) || (parts.length>1 ? base(parts[parts.length-1]) : '');
    };
    f.__tll=1; E.ccode=f; return true;
  }
  if(!patch()){ var n=0, iv=setInterval(function(){ if(patch()||++n>40) clearInterval(iv); },250); document.addEventListener('DOMContentLoaded',patch); }
  /* Copy on the same page: the pen name note used a banned phrase; the country hint now says a place works. */
  function copy(){
    var pen=document.querySelector('[data-ep-penwrap] .ep-note');
    if(pen&&/real name stays on file/i.test(pen.textContent)) pen.textContent='Only the editor sees your full name. Readers see your pen name, and every byline is still a person.';
    var fn=document.querySelector('[data-ep-flagnote]');
    if(fn&&!fn.hasAttribute('data-hold')&&/^Type a country and press Enter/.test(fn.textContent)) fn.textContent='Type a country, or a place with its country, and press Enter. Up to five.';
  }
  if(document.readyState!=='loading') copy(); else document.addEventListener('DOMContentLoaded',copy);
})();
/* src/site-layers/tll-ep-ux-v1.js */
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
  else if(st==='fail'){photoPending=false;var why=/did not update/.test(t)?(/sign in/i.test(lastErr)||!lastErr?'Saved to your account. Your public page is not updating right now; nothing is lost, and it catches up on your next save once that is fixed.':'Saved to your account. Your public page did not update yet: '+lastErr):t; /* 29 Oct: the Worker answers "Please sign in again" when its own member check fails, not because the writer is signed out */txt.innerHTML='';var d=el('span','tll-eps-dot');txt.appendChild(d);txt.appendChild(D.createTextNode(why));}
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
/* src/site-layers/tll-ep-marks-v1.js */
(function(){
if(!/^\/edit-profile\/?$/.test(location.pathname))return;
var CSS="html body .ep-saved.ep-saved--pending{display:block!important;width:auto!important;max-width:100%!important;margin:4px 0 0!important;padding:0!important;border:0!important;background:transparent!important;color:#5F5A54!important;font:400 12px/1.35 'IBM Plex Sans Condensed',system-ui,sans-serif!important;letter-spacing:0!important;text-transform:none!important;white-space:normal!important;text-align:left!important;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px;cursor:pointer}";
function accountOk(){var s=document.querySelector('[data-ep-status]');return !!s&&/saved to your account/i.test(s.textContent||'');}
function fix(){if(!accountOk())return;[].forEach.call(document.querySelectorAll('.ep-saved--fail:not(.ep-saved--pending)'),function(m){m.classList.add('ep-saved--pending');m.textContent='Saved. Public page pending';m.title='Saved to your account. Tap to try the public page again.';});}
function run(){
  if(!document.getElementById('tll-ep-marks-v1')){var s=document.createElement('style');s.id='tll-ep-marks-v1';s.textContent=CSS;(document.head||document.documentElement).appendChild(s);}
  var t=0;new MutationObserver(function(){clearTimeout(t);t=setTimeout(fix,30);}).observe(document.body,{childList:true,subtree:true,characterData:true});fix();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
/* src/site-layers/tll-ep-linkstack-v1.js */
(function(){
if(!/^\/edit-profile\/?$/.test(location.pathname))return;
var TYPES=[['web','Web link','https://'],['pdf','PDF (menu, resume, schedule)','Link to the PDF file'],['youtube','YouTube video','https://youtu.be/...'],['x','X post','https://x.com/you/status/...'],['tiktok','TikTok','https://www.tiktok.com/@you/video/...'],['twitch','Twitch channel','https://twitch.tv/you'],['music','Music (Spotify, Apple Music)','Song, album or playlist link'],['presave','Music pre-save','Your pre-save page'],['podcast','Podcast','Spotify or Apple Podcasts link'],['book','Book','Where your book is sold'],['shop','Shop or affiliate product','Product or store link'],['digital','Digital product','Where it is sold'],['course','Course','Course page'],['tips','Tips','Ko-fi, Buy Me a Coffee, PayPal...'],['booking','Booking (Calendly and others)','https://calendly.com/you'],['contact','Contact card','Email to include (optional)']];
var MAX=12,PAID={shop:'AFFILIATE',digital:'PAID',course:'PAID',tips:'TIPS'};
var CSS='.tll-ls{margin:22px 0 0;padding:18px 0 0;border-top:1px solid #E0DACE}.tll-ls h3{margin:0 0 4px;font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79}'+
'.tll-ls p{margin:0 0 12px;font:400 13px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#5F5A54}.tll-ls-row{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr) minmax(0,1.4fr) auto;gap:8px;align-items:center;margin:0 0 8px}'+
'.tll-ls-row select,.tll-ls-row input{width:100%;min-height:44px;padding:8px 10px;border:1px solid #E0DACE;border-radius:4px;background:#FDF9F3;color:#0A0B14;font:400 15px/1.3 "IBM Plex Sans Condensed",system-ui,sans-serif}'+
'.tll-ls-row button,.tll-ls-add{min-height:44px;padding:0 12px;border:0;background:transparent;color:#C8325B;font:600 13px/1 "IBM Plex Sans Condensed",system-ui,sans-serif;cursor:pointer}.tll-ls-add{padding:0;border-bottom:1px solid #C8325B;min-height:32px}'+
'.tll-ls-tag{grid-column:1/-1;margin:-4px 0 4px;font:400 12px/1.4 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#5F5A54}@media(max-width:640px){.tll-ls-row{grid-template-columns:1fr 1fr}.tll-ls-row button{grid-column:2;justify-self:end}.tll-ls-row input[data-k=url]{grid-column:1/-1}}';
function E(){return window.TLLEP}
function pt(){try{var p=JSON.parse((E()&&E().get('partners'))||'null');return p&&typeof p==='object'&&!Array.isArray(p)?p:{}}catch(e){return {}}}
var stack=null,box,list,tm;
function save(){var e=E();if(!e)return;var p=pt();p.stack=stack.filter(function(l){return l.t&&(l.url||l.t==='contact')});e.set('partners',JSON.stringify(p))}
function later(){clearTimeout(tm);tm=setTimeout(save,600)}
function row(l,i){var r=document.createElement('div');r.className='tll-ls-row';
  var s=document.createElement('select');s.setAttribute('aria-label','Link type');TYPES.forEach(function(t){var o=document.createElement('option');o.value=t[0];o.textContent=t[1];s.appendChild(o)});s.value=l.t||'web';
  var a=document.createElement('input');a.setAttribute('data-k','label');a.maxLength=60;a.placeholder='Label people see';a.setAttribute('aria-label','Label');a.value=l.label||'';
  var u=document.createElement('input');u.setAttribute('data-k','url');u.setAttribute('aria-label','Link');u.value=l.url||'';
  var x=document.createElement('button');x.type='button';x.textContent='Remove';x.setAttribute('aria-label','Remove this link');
  var tag=document.createElement('div');tag.className='tll-ls-tag';
  function hint(){var t=TYPES.filter(function(z){return z[0]===s.value})[0];u.placeholder=t?t[2]:'https://';u.type=s.value==='contact'?'email':'url';tag.textContent=PAID[s.value]?'Shown with a '+PAID[s.value]+' tag, so readers know.':'';tag.hidden=!tag.textContent}
  s.onchange=function(){l.t=s.value;hint();later()};a.oninput=function(){l.label=a.value;later()};u.oninput=function(){l.url=u.value.trim();later()};
  x.onclick=function(){stack.splice(stack.indexOf(l),1);paint();save()};
  hint();[s,a,u,x,tag].forEach(function(n){r.appendChild(n)});return r}
function paint(){list.innerHTML='';stack.forEach(function(l,i){list.appendChild(row(l,i))});add.hidden=stack.length>=MAX}
var add;
function build(){
  var e=E();if(!e||!e.set||document.querySelector('.tll-ls'))return !!document.querySelector('.tll-ls');
  var u2=document.querySelector('[data-ep-pt="u2"]'),op=document.querySelector('[data-ep-pt-open]');if(!u2)return false;
  var host=u2;while(host.parentElement&&!(op?host.parentElement.contains(op):false))host=host.parentElement;
  var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
  box=document.createElement('div');box.className='tll-ls';box.innerHTML='<h3>More links</h3><p>Up to 12. A web page, a PDF, a video, music, a podcast, a book, a booking page, something you sell or a tip jar. Videos, music, posts and bookings open right on your page when a reader taps them.</p>';
  list=document.createElement('div');box.appendChild(list);
  add=document.createElement('button');add.type='button';add.className='tll-ls-add';add.textContent='+ Add a link';
  add.onclick=function(){if(stack.length>=MAX)return;stack.push({t:'web',label:'',url:''});paint();var r=list.lastChild;if(r)r.querySelector('input').focus()};
  box.appendChild(add);
  (host.parentElement?host:u2).insertAdjacentElement('afterend',box);
  stack=(pt().stack||[]).slice(0,MAX);paint();
  /* keep the stack when the Shop and partners inputs save partners without it */
  var set=e.set;e.set=function(k,v){if(k==='partners'&&stack){try{var p=JSON.parse(v||'{}');if(p&&typeof p==='object'&&!p.stack&&stack.length){p.stack=stack.filter(function(l){return l.t&&(l.url||l.t==='contact')});v=JSON.stringify(p)}}catch(err){}}return set.apply(this,arguments.length>1?[k,v].concat([].slice.call(arguments,2)):[k,v])};
  return true}
var n=0;(function tick(){if(!build()&&++n<40)setTimeout(tick,250)})();
})();
/* src/site-layers/tll-crew-v1.js */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var P=location.pathname.replace(/\/+$/,'')||'/';
var TYPES={partner:'Partner',family:'Family',buddy:'Travel buddy'};
var CSS='.tll-crew{font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-crew [hidden]{display:none!important}.tll-crew-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:18px 0 8px}'+
'.tll-crew-p{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid #E0DACE;border-radius:8px;padding:10px;margin:0 0 8px;text-decoration:none;color:inherit}'+
'.tll-crew-av{width:36px;height:36px;border-radius:50%;flex:none;background:#067A79 center/cover no-repeat;color:#fff;display:grid;place-items:center;font:600 13px/1 "JetBrains Mono",monospace}'+
'.tll-crew-p div{flex:1;min-width:0}.tll-crew-p small{display:block;color:#5F5A54;font-size:13px}'+
'.tll-crew-b{border:1.5px solid #0A0B14;background:transparent;border-radius:4px;padding:8px 12px;font:600 14px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer;min-height:40px;color:#0A0B14}'+
'.tll-crew-inv{margin:10px 0 14px}.tll-crew-inv .tll-crew-row{display:flex;flex-wrap:wrap;gap:8px}a.tll-crew-b{display:inline-flex;align-items:center;text-decoration:none}'+
'.tll-crew-b.p{background:#C8325B;border-color:#C8325B;color:#fff}'+
'.tll-crew-chips{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.tll-crew-chip{border:1px solid #E0DACE;border-radius:999px;padding:6px 12px;font-size:14px;background:#FDF9F3;cursor:pointer;min-height:36px}'+
'.tll-crew-chip[aria-pressed="true"]{background:#0A0B14;color:#FDF9F3;border-color:#0A0B14}'+
'.tll-crew-res{border:1px solid #E0DACE;border-radius:4px;background:#fff;margin:4px 0 8px}.tll-crew-res button{display:flex;width:100%;gap:10px;align-items:center;border:0;background:none;padding:8px 10px;text-align:left;font:inherit;cursor:pointer;min-height:44px}'+
'.tll-crew-res button:hover{background:#F7F1E8}.tll-crew-msg{font-size:13px;color:#5F5A54;margin:6px 0}'+
'.tll-crew-card{max-width:760px;margin:24px auto;padding:16px 18px;border:1px solid #E0DACE;border-left:3px solid #C8325B;border-radius:4px;background:#fff}'+
'.tll-crew-card h3{font:800 20px/1.2 "Playfair Display",Georgia,serif;margin:0 0 10px}.tll-crew-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}'+
'.tll-crew-pub{max-width:760px;margin:28px auto;padding:0 16px}.tll-crew-pub .tll-crew-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px}';
function css(){if(document.getElementById('tll-crew-v1'))return;var s=document.createElement('style');s.id='tll-crew-v1';s.textContent=CSS;document.head.appendChild(s);}
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function post(path,body){var t=tok();if(!t)return Promise.resolve(null);return fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(body||{})}).then(function(r){return r.json().catch(function(){return null;}).then(function(j){return j&&Object.assign(j,{status:r.status});});}).catch(function(){return null;});}
function initials(n){return String(n||'').split(/\s+/).map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase();}
function personRow(p,sub,href){var r=el(href?'a':'div','tll-crew-p');if(href)r.href=href;var av=el('span','tll-crew-av');if(p.avatar)av.style.backgroundImage='url("'+p.avatar+'")';else av.textContent=initials(p.name);
  var d=el('div');d.appendChild(document.createTextNode(p.name||''));if(sub)d.appendChild(el('small','',sub));r.appendChild(av);r.appendChild(d);return r;}
function btn(txt,primary,fn){var b=el('button','tll-crew-b'+(primary?' p':''),txt);b.type='button';b.addEventListener('click',fn);return b;}

/* ---------- /edit-profile ---------- */
function editProfile(){
  var sec=document.getElementById('ep-crew');if(!sec||sec.dataset.tllCrew)return;
  var q=sec.querySelector('[data-ep-crewq]'),oldList=sec.querySelector('[data-ep-crewlist]'),note=sec.querySelector('[data-ep-crewnote]');if(!q)return;
  sec.dataset.tllCrew='wait';
  post('/crew/inbox').then(function(d){
    if(!d||!d.ok){sec.dataset.tllCrew='';return;}   /* Worker not live: keep the old field */
    sec.dataset.tllCrew='live';css();
    var box=el('div','tll-crew');if(oldList){oldList.hidden=true;oldList.insertAdjacentElement('afterend',box);}else sec.appendChild(box);
    if(note)note.textContent='They see the invite on their account and say yes or no. Nothing shows on either profile until they do.';
    var res=el('div','tll-crew-res');res.hidden=true;q.insertAdjacentElement('afterend',res);
    var pick=el('div');pick.hidden=true;res.insertAdjacentElement('afterend',pick);
    var msg=el('p','tll-crew-msg');msg.setAttribute('aria-live','polite');pick.insertAdjacentElement('afterend',msg);
    var me=d.me||{};var inv=el('div','tll-crew-inv');inv.appendChild(el('p','tll-crew-k','Not on TLL yet? Invite them'));
    var link=function(ch){return 'https://www.thatlayover.life/signup?ref='+encodeURIComponent(me.slug||'')+'&utm_source=invite&utm_medium='+ch+'&utm_campaign=tll';};
    var text=function(ch){return 'I keep my trips on That Layover Life. Join me there and we can link up as travel companions. Free, no card: '+link(ch);};
    var row=el('div','tll-crew-row');
    function go(ch,href){var a=el('a','tll-crew-b',ch==='sms'?'Text':ch==='whatsapp'?'WhatsApp':'Email');a.href=href;if(ch==='whatsapp'){a.target='_blank';a.rel='noopener';}
      a.addEventListener('click',function(){try{window.gtag&&gtag('event','crew_invite',{division:'tll',channel:ch});}catch(x){}});row.appendChild(a);}
    go('email','mailto:?subject='+encodeURIComponent('Join me on That Layover Life')+'&body='+encodeURIComponent(text('email')));
    go('sms','sms:?&body='+encodeURIComponent(text('sms')));
    go('whatsapp','https://wa.me/?text='+encodeURIComponent(text('whatsapp')));
    row.appendChild(btn(navigator.share?'Share (Instagram and more)':'Copy invite link',false,function(){
      try{window.gtag&&gtag('event','crew_invite',{division:'tll',channel:'share'});}catch(x){}
      if(navigator.share){navigator.share({title:'That Layover Life',text:text('share').replace(/: https.*$/,'.'),url:link('share')}).catch(function(){});}
      else if(navigator.clipboard){navigator.clipboard.writeText(text('copy')).then(function(){msg.textContent='Invite copied. Paste it into Instagram or anywhere.';});}}));
    inv.appendChild(row);inv.appendChild(el('p','tll-crew-msg','When they join from your link, they can send you a companion request in one tap.'));
    msg.insertAdjacentElement('afterend',inv);
    var chosen=null,type='partner',timer=0,seq=0;
    function render(d){
      box.textContent='';
      if(d.companions.length){box.appendChild(el('p','tll-crew-k','Travels with'));d.companions.forEach(function(c){var r=personRow(c,TYPES[c.type]||TYPES.buddy);r.appendChild(btn('Leave',false,function(){if(!confirm('Remove '+c.name+' from your companions? Only the link goes; nothing else changes.'))return;post('/crew/leave',{kind:'person',other:c.id}).then(refresh);}));box.appendChild(r);});}
      var out=d.outgoing||[];if(out.length){box.appendChild(el('p','tll-crew-k','Waiting for a yes'));out.forEach(function(i){var r=personRow({name:i.toName},i.kind==='pet'?'Co-owner of '+i.petName:(TYPES[i.type]||''));r.appendChild(btn('Cancel',false,function(){post('/crew/cancel',{id:i.id}).then(refresh);}));box.appendChild(r);});}
      var own=(d.pets||[]).filter(function(p){return p.owner;});
      (d.pets||[]).forEach(function(p){box.appendChild(el('p','tll-crew-k',p.name+(p.owner?'':' (shared with you)')));
        if(!p.coOwners.length&&p.owner)box.appendChild(el('p','tll-crew-msg','Not shared yet. Search a traveler above, then pick Share '+p.name+'.'));
        p.coOwners.forEach(function(o){var r=personRow(o,'Co-owner');if(p.owner)r.appendChild(btn('Remove',false,function(){post('/crew/leave',{kind:'pet',pet:p.id,who:o.id}).then(refresh);}));box.appendChild(r);});
        if(!p.owner)box.appendChild(btn('Leave '+p.name,false,function(){post('/crew/leave',{kind:'pet',pet:p.id}).then(refresh);}));});
      pets=own;
    }
    var pets=[];
    function refresh(){post('/crew/inbox').then(function(d){if(d&&d.ok)render(d);});}
    function choose(p){chosen=p;res.hidden=true;q.value=p.name;pick.textContent='';
      var chips=el('div','tll-crew-chips');var opts=[['partner','Partner'],['family','Family'],['buddy','Travel buddy']].concat(pets.map(function(x){return['pet:'+x.id,'Share '+x.name];}));
      opts.forEach(function(o){var c=el('button','tll-crew-chip',o[1]);c.type='button';c.setAttribute('aria-pressed',String(o[0]===type));c.addEventListener('click',function(){type=o[0];[].forEach.call(chips.children,function(x){x.setAttribute('aria-pressed','false');});c.setAttribute('aria-pressed','true');});chips.appendChild(c);});
      pick.appendChild(chips);
      pick.appendChild(btn('Send invite',true,function(){var body=/^pet:/.test(type)?{kind:'pet',pet:type.slice(4),to:chosen.id}:{kind:'person',to:chosen.id,type:type};
        post('/crew/invite',body).then(function(r){if(r&&r.ok){msg.textContent='Invite sent to '+chosen.name+'. You can cancel it any time.';q.value='';pick.hidden=true;refresh();}else msg.textContent=(r&&r.error)||'That did not go through. Try again in a moment.';});}));
      pick.hidden=false;}
    function search(){var v=q.value.trim();if(v.length<2){res.hidden=true;return;}var my=++seq;
      fetch(API+'/crew/people?q='+encodeURIComponent(v)).then(function(r){return r.json();}).then(function(j){if(my!==seq)return;res.textContent='';
        var list=(j&&j.people||[]).filter(function(p){return p.id!==d.me.id;});
        if(!list.length){res.appendChild(el('p','tll-crew-msg','No traveler by that name yet. Invite them with the buttons below, or name them in a story byline.'));res.hidden=false;return;}
        list.forEach(function(p){var b=el('button');b.type='button';var av=el('span','tll-crew-av');if(p.avatar)av.style.backgroundImage='url("'+p.avatar+'")';else av.textContent=initials(p.name);b.appendChild(av);b.appendChild(document.createTextNode(p.name));b.addEventListener('click',function(){choose(p);});res.appendChild(b);});res.hidden=false;}).catch(function(){});}
    /* take Enter and typing away from the old private-name handler */
    q.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();e.stopImmediatePropagation();search();}},true);
    q.addEventListener('input',function(e){e.stopImmediatePropagation();pick.hidden=true;clearTimeout(timer);timer=setTimeout(search,300);},true);
    q.setAttribute('placeholder','Search travelers by name');
    render(d);
  });
}

/* ---------- /account ---------- */
function account(){
  if(document.getElementById('tll-crew-inbox'))return;
  post('/crew/inbox').then(function(d){
    if(!d||!d.ok||!d.incoming.length||document.getElementById('tll-crew-inbox'))return;css();
    var wrap=el('div','tll-crew');wrap.id='tll-crew-inbox';
    d.incoming.forEach(function(i){var card=el('section','tll-crew-card');
      card.appendChild(el('h3','',i.kind==='pet'?'Share '+i.petName:'A travel companion request'));
      card.appendChild(personRow({name:i.fromName,avatar:i.fromAvatar},i.kind==='pet'?'wants you as co-owner of '+i.petName:'wants to add you as '+(TYPES[i.type]||TYPES.buddy)));
      card.appendChild(el('p','tll-crew-msg',i.kind==='pet'?'Every co-owner can log '+i.petName+"'s countries. They never count toward your own total.":'If you accept, you show on each other\'s profile under "Travels with". Your maps stay your own. Either of you can leave any time.'));
      var row=el('div','tll-crew-row');
      row.appendChild(btn('Accept',true,function(){post('/crew/answer',{id:i.id,accept:true}).then(function(r){card.textContent='';card.appendChild(el('p','',r&&r.ok?'Done. You now travel together on That Layover Life.':'That did not go through. Reload and try again.'));});}));
      row.appendChild(btn('Not now',false,function(){post('/crew/answer',{id:i.id,accept:false}).then(function(){card.remove();});}));
      card.appendChild(row);wrap.appendChild(card);});
    var main=document.querySelector('main')||document.body;var h=main.querySelector('h1');
    var anchor=h&&(h.closest('section')||h.parentElement);if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(wrap,anchor.nextSibling);else main.insertBefore(wrap,main.firstChild);
  });
}

/* ---------- public profile and pet pages ---------- */
function publicPage(kind,slug){
  if(document.getElementById('tll-crew-pub'))return;
  fetch(API+'/crew/public?'+(kind==='pet'?'pet=':'slug=')+encodeURIComponent(slug)).then(function(r){return r.ok?r.json():null;}).then(function(d){
    if(!d||!d.ok||document.getElementById('tll-crew-pub'))return;
    var people=kind==='pet'?(d.owners||[]).map(function(o,n){return [o,n?'Co-owner':'Owner','/contributors/'+o.slug];}):
      (d.companions||[]).map(function(c){return [c,c.type,'/contributors/'+c.slug];}).concat((d.pets||[]).map(function(p){return [p,'Shared pet','/pets/'+p.slug];}));
    if(kind==='pet'&&people.length<2)return;   /* show owners only when the pet is shared */
    if(!people.length)return;css();
    var s=el('section','tll-crew tll-crew-pub');s.id='tll-crew-pub';s.appendChild(el('p','tll-crew-k','Travels with'));
    var g=el('div','tll-crew-grid');people.forEach(function(x){g.appendChild(personRow(x[0],x[1],x[2]));});s.appendChild(g);
    var main=document.querySelector('main')||document.body;var h=main.querySelector('h1');var anchor=h&&(h.closest('section')||h.parentElement);
    if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(s,anchor.nextSibling);else main.appendChild(s);
  }).catch(function(){});
}

/* ---------- joined from an invite ---------- */
(function(){try{var ref=new URLSearchParams(location.search).get('ref');if(ref&&/^[a-z0-9-]{2,80}$/.test(ref))localStorage.setItem('tll-ref',JSON.stringify({slug:ref,at:Date.now()}));}catch(e){}})();
function invited(){
  var ref=null;try{ref=JSON.parse(localStorage.getItem('tll-ref')||'null');}catch(e){}
  if(!ref||!ref.slug||Date.now()-ref.at>1000*60*60*24*30||document.getElementById('tll-crew-ref'))return;
  function done(){try{localStorage.removeItem('tll-ref');}catch(e){}}
  post('/crew/inbox').then(function(d){
    if(!d||!d.ok)return;if(d.me&&d.me.slug===ref.slug){done();return;}
    if(d.companions.some(function(c){return c.slug===ref.slug;})||d.outgoing.some(function(i){return i.toSlug===ref.slug;})){done();return;}
    return fetch(API+'/crew/people?q='+encodeURIComponent(ref.slug.replace(/-/g,' '))).then(function(r){return r.json();}).then(function(j){
      var p=(j&&j.people||[]).filter(function(x){return x.slug===ref.slug;})[0];if(!p){done();return;}css();
      var card=el('section','tll-crew-card tll-crew');card.id='tll-crew-ref';card.appendChild(el('h3','','You joined from '+p.name+"'s invite"));
      card.appendChild(personRow(p,'Send a travel companion request?'));
      var row=el('div','tll-crew-row');
      row.appendChild(btn('Send request',true,function(){post('/crew/invite',{kind:'person',to:p.id,type:'buddy'}).then(function(r){done();card.textContent='';card.appendChild(el('p','',r&&r.ok?'Sent. You show on each other\'s profile once '+p.name+' says yes.':(r&&r.error)||'That did not go through.'));});}));
      row.appendChild(btn('No thanks',false,function(){done();card.remove();}));card.appendChild(row);
      var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);if(an&&an.parentNode)an.parentNode.insertBefore(card,an.nextSibling);else main.insertBefore(card,main.firstChild);
    });
  }).catch(function(){});
}

function run(){
  if(P==='/edit-profile')editProfile();
  else if(P==='/account'){account();invited();}
  else{var m=/^\/contributors\/([^/]+)$/.exec(P);if(m)publicPage('person',m[1]);else{m=/^\/pets\/([^/]+)$/.exec(P);if(m)publicPage('pet',m[1]);}}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,900);});else setTimeout(run,900);
setTimeout(run,3000);
})();
/* src/site-layers/tll-collections-v1.js */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var CLOUD='https://api.cloudinary.com/v1_1/idonvlow/image/upload',PRESET='tll_photos',EDGE=2000;
var P=location.pathname.replace(/\/+$/,'')||'/';
var CSS='.tll-col{font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-col [hidden]{display:none!important}'+
'.tll-col-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:18px 0 8px}'+
'.tll-col-group{border:1px solid #E0DACE;border-radius:8px;background:#fff;padding:12px;margin:0 0 12px}'+
'.tll-col-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;margin:0 0 10px}.tll-col-head b{font:800 18px/1.2 "Playfair Display",Georgia,serif}'+
'.tll-col-head label{display:inline-flex;align-items:center;gap:8px;font-size:14px;min-height:36px;cursor:pointer}.tll-col-head input{width:18px;height:18px;accent-color:#C8325B}'+
'.tll-col-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px}'+
'.tll-col-it{position:relative;border-radius:6px;overflow:hidden;background:#F7F1E8;min-height:120px;display:flex;flex-direction:column;justify-content:flex-end}'+
'.tll-col-it img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.tll-col-it span{position:relative;display:block;padding:6px 8px;background:linear-gradient(transparent,rgba(10,11,20,.78));color:#fff;font-size:13px;line-height:1.3}'+
'.tll-col-n{position:absolute;top:6px;left:6px;font:600 11px/1 "JetBrains Mono",monospace;font-style:normal;background:rgba(10,11,20,.7);color:#fff;border-radius:999px;padding:4px 7px}.tll-col-it[role=button]{cursor:pointer}'+
'.tll-col-it button{position:absolute;top:4px;right:4px;width:32px;height:32px;border:0;border-radius:50%;background:rgba(10,11,20,.7);color:#fff;font-size:18px;line-height:1;cursor:pointer}'+
'.tll-col-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;border:1px dashed #E0DACE;border-radius:8px;padding:12px;margin-top:8px}'+
'.tll-col-form label{display:flex;flex-direction:column;gap:4px;font-size:13px;color:#5F5A54}.tll-col-form .w{grid-column:1/-1}'+
'.tll-col-form input,.tll-col-form select{box-sizing:border-box;width:100%;max-width:100%;font:inherit;font-size:16px;padding:9px 10px;border:1px solid #E0DACE;border-radius:4px;background:#FDF9F3;color:#0A0B14;min-height:44px}'+
'.tll-col-b{border:0;background:#C8325B;color:#fff;border-radius:4px;padding:10px 16px;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;min-height:44px;cursor:pointer}'+
'.tll-col-msg{font-size:13px;color:#5F5A54;margin:6px 0}.tll-col-pub{max-width:1120px;margin:32px auto;padding:0 16px}'+
'.tll-col-pub .tll-col-group{background:transparent;border:0;border-top:2px solid #0A0B14;border-radius:0;padding:14px 0 0}'+
'@media (max-width:560px){.tll-col-form{grid-template-columns:1fr}}';
function css(){if(document.getElementById('tll-collections-v1'))return;var s=document.createElement('style');s.id='tll-collections-v1';s.textContent=CSS;document.head.appendChild(s);}
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function post(path,body){var t=tok();if(!t)return Promise.resolve(null);return fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(body||{})}).then(function(r){return r.json().catch(function(){return null;});}).catch(function(){return null;});}
function countries(){var out=[];try{var dn=new Intl.DisplayNames(['en'],{type:'region'});for(var a=65;a<91;a++)for(var b=65;b<91;b++){var c=String.fromCharCode(a,b),n=dn.of(c);if(n&&n!==c&&!/^(EU|EZ|UN|QO|XA|XB|ZZ|FX|YU|SU|ZR|TP|UK)$/.test(c))out.push(n);}}catch(e){}return out.filter(function(v,i,s){return s.indexOf(v)===i;}).sort();}
function clean(file){return new Promise(function(res,rej){var u=URL.createObjectURL(file),im=new Image();im.onload=function(){var w=im.naturalWidth,h=im.naturalHeight,s=Math.min(1,EDGE/Math.max(w,h)),c=document.createElement('canvas');c.width=Math.round(w*s);c.height=Math.round(h*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(function(b){b?res(b):rej('read');},'image/jpeg',0.88);};im.onerror=function(){URL.revokeObjectURL(u);rej('read');};im.src=u;});}
function upload(file){return clean(file).then(function(blob){var fd=new FormData();fd.append('file',blob,'item.jpg');fd.append('upload_preset',PRESET);fd.append('folder','tll/collections');return fetch(CLOUD,{method:'POST',body:fd}).then(function(r){return r.json();}).then(function(j){if(!j.secure_url)throw 'upload';return j.secure_url;});});}
function tile(i,onDel){var t=el('div','tll-col-it'),ph=(i.photos&&i.photos.length?i.photos:(i.photo?[i.photo]:[])),k=0,sz=function(u){return u.replace('/upload/','/upload/c_fill,w_400,h_400,q_auto,f_auto/');};
  if(ph.length){var im=el('img');im.src=sz(ph[0]);im.alt=(i.categoryName||'')+', '+i.country;im.loading='lazy';t.appendChild(im);
    if(ph.length>1){var n=el('em','tll-col-n','1/'+ph.length);t.appendChild(n);t.tabIndex=0;t.setAttribute('role','button');t.setAttribute('aria-label','Next photo of '+i.country);
      var next=function(e){if(e.target.tagName==='BUTTON')return;k=(k+1)%ph.length;im.src=sz(ph[k]);n.textContent=(k+1)+'/'+ph.length;};t.addEventListener('click',next);t.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();next(e);}});}}
  t.appendChild(el('span','',[i.country,i.city,i.year].filter(Boolean).join(' · ')+(i.caption?' · '+i.caption:'')));
  if(onDel){var x=el('button','','×');x.type='button';x.setAttribute('aria-label','Remove '+i.country);x.addEventListener('click',onDel);t.appendChild(x);}return t;}
function groupsOf(items){var g={},order=[];items.forEach(function(i){var k=i.category==='other'?'other:'+i.categoryName.toLowerCase():i.category;if(!g[k]){g[k]={category:i.category,name:i.categoryName,items:[]};order.push(k);}g[k].items.push(i);});return order.map(function(k){return g[k];});}

function editProfile(){
  var crew=document.getElementById('ep-crew');if(!crew||document.getElementById('tll-col'))return;
  post('/collections/mine').then(function(d){
    if(!d||!d.ok||document.getElementById('tll-col'))return;css();
    var sec=el('section','ep-sec tll-col');sec.id='tll-col';sec.setAttribute('aria-labelledby','tll-col-h');
    var h=el('h2','ep-eb','04B · My collections');h.id='tll-col-h';sec.appendChild(h);
    sec.appendChild(el('p','ep-lede','Magnets, mugs, postcards, shot glasses: whatever you bring home. Private until you switch a collection on, and only that collection shows on your profile. Year and city only, never dates.'));
    var list=el('div');sec.appendChild(list);
    var f=el('div','tll-col-form');f.setAttribute('role','group');f.setAttribute('aria-label','Add to my collections');
    function field(lbl,node,wide){var l=el('label',wide?'w':'',lbl);l.appendChild(node);f.appendChild(l);return node;}
    var cat=el('select');d.categories.forEach(function(c){var o=el('option','',c.name);o.value=c.slug;cat.appendChild(o);});field('Collection',cat);
    var own=el('input');own.maxLength=40;own.placeholder='Sand, spoons, beer mats…';var ownL=field('Your name for it',own);ownL.parentNode.hidden=true;
    cat.addEventListener('change',function(){ownL.parentNode.hidden=cat.value!=='other';});
    var ctry=el('input');ctry.setAttribute('list','tll-col-countries');ctry.required=true;ctry.autocomplete='off';field('Country',ctry);
    var dl=el('datalist');dl.id='tll-col-countries';countries().forEach(function(n){var o=el('option');o.value=n;dl.appendChild(o);});f.appendChild(dl);
    var city=el('input');city.maxLength=60;field('City (optional)',city);
    var year=el('input');year.type='number';year.inputMode='numeric';year.min='1900';year.max=String(new Date().getFullYear());field('Year (optional)',year);
    var cap=el('input');cap.maxLength=140;field('A line about it (optional)',cap,true);
    var file=el('input');file.type='file';file.multiple=true;file.accept='image/jpeg,image/png,image/webp,image/heic';field('Photos (optional, up to 6: front, back, on the shelf)',file,true);
    var btn=el('button','tll-col-b','Add to my collections');btn.type='button';f.appendChild(btn);
    var msg=el('p','tll-col-msg');msg.setAttribute('aria-live','polite');f.appendChild(msg);
    sec.appendChild(f);
    function render(items,shown){list.textContent='';if(!items.length){list.appendChild(el('p','tll-col-msg','Nothing yet. Add your first piece below.'));return;}
      groupsOf(items).forEach(function(g){var box=el('div','tll-col-group'),hd=el('div','tll-col-head');
        var n=new Set(g.items.map(function(i){return i.country;})).size;hd.appendChild(el('b','',g.name+' · '+n+(n===1?' country':' countries')));
        var lab=el('label'),sw=el('input');sw.type='checkbox';sw.checked=g.items.some(function(i){return i.shown;});lab.appendChild(sw);lab.appendChild(document.createTextNode('Show on my profile'));
        sw.addEventListener('change',function(){sw.disabled=true;post('/collections/show',{category:g.category,own:g.category==='other'?g.name:'',show:sw.checked}).then(function(){sw.disabled=false;refresh();});});
        hd.appendChild(lab);box.appendChild(hd);var grid=el('div','tll-col-grid');
        g.items.forEach(function(i){grid.appendChild(tile(i,function(){if(!confirm('Remove this '+g.name.toLowerCase()+' from '+i.country+'?'))return;post('/collections/delete',{id:i.id}).then(refresh);}));});
        box.appendChild(grid);list.appendChild(box);});}
    function refresh(){post('/collections/mine').then(function(r){if(r&&r.ok)render(r.items,r.shown);});}
    f.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.tagName==='INPUT'){e.preventDefault();e.stopPropagation();add();}},true);
    btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();add();});
    function add(){
      if(!ctry.value.trim()){msg.textContent='Pick a country.';ctry.focus();return;}
      var files=[].slice.call(file.files||[]);if(files.length>6){msg.textContent='Up to 6 photos per piece. Pick your best 6.';return;}
      btn.disabled=true;msg.textContent=files.length?'Cleaning and uploading '+(files.length===1?'the photo':files.length+' photos')+'…':'Adding…';
      files.reduce(function(p,f){return p.then(function(urls){return upload(f).then(function(u){urls.push(u);msg.textContent='Uploaded '+urls.length+' of '+files.length+'…';return urls;});});},Promise.resolve([])).then(function(urls){
        return post('/collections/add',{category:cat.value,own:own.value,country:ctry.value,city:city.value,year:year.value,caption:cap.value,photos:urls});
      }).then(function(r){btn.disabled=false;if(r&&r.ok){msg.textContent='Added. '+(r.item.shown?'It shows on your profile.':'Private until you switch this collection on.');ctry.value='';city.value='';year.value='';cap.value='';file.value='';refresh();}else msg.textContent=(r&&r.error)||'That did not go through. Try again.';})
      .catch(function(){btn.disabled=false;msg.textContent='The photo could not be uploaded. Try another, or add it without a photo.';});
    }
    crew.insertAdjacentElement('afterend',sec);render(d.items,d.shown);
  });
}

function profile(slug){
  if(document.getElementById('tll-col-pub'))return;
  fetch(API+'/collections/public?slug='+encodeURIComponent(slug)).then(function(r){return r.ok?r.json():null;}).then(function(d){
    if(!d||!d.ok||!d.shelves.length||document.getElementById('tll-col-pub'))return;css();
    var s=el('section','tll-col tll-col-pub');s.id='tll-col-pub';s.appendChild(el('p','tll-col-k','Collections'));
    d.shelves.forEach(function(g){var box=el('div','tll-col-group'),hd=el('div','tll-col-head');hd.appendChild(el('b','',g.name+' · '+g.countries+(g.countries===1?' country':' countries')));box.appendChild(hd);
      var grid=el('div','tll-col-grid');g.items.forEach(function(i){grid.appendChild(tile(i));});box.appendChild(grid);s.appendChild(box);});
    var after=document.getElementById('tll-crew-pub');var main=document.querySelector('main')||document.body;
    if(after)after.insertAdjacentElement('afterend',s);else{var h=main.querySelector('h1'),a=h&&(h.closest('section')||h.parentElement);if(a&&a.parentNode)a.parentNode.insertBefore(s,a.nextSibling);else main.appendChild(s);}
  }).catch(function(){});
}

function run(){if(P==='/edit-profile')editProfile();else{var m=/^\/contributors\/([^/]+)$/.exec(P);if(m)profile(m[1]);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1200);});else setTimeout(run,1200);
setTimeout(run,3500);
})();
/* src/site-layers/tll-stamps-v1.js */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var CLOUD='https://api.cloudinary.com/v1_1/idonvlow/image/upload',PRESET='tll_photos',EDGE=2000;
var P=location.pathname.replace(/\/+$/,'')||'/';
var WT_PUBLIC=false,WTQ=new URLSearchParams(location.search).get('preview');
try{if(WTQ==='worktrips')localStorage.setItem('tll-preview-worktrips','1');if(WTQ==='off')localStorage.removeItem('tll-preview-worktrips');}catch(e){}
var WT=WT_PUBLIC||WTQ==='worktrips';try{WT=WT||localStorage.getItem('tll-preview-worktrips')==='1';}catch(e){}
var MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
var CSS='.tll-st{font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-st [hidden]{display:none!important}'+
'.tll-st-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:18px 0 8px}'+
'.tll-st-group{border:1px solid #E0DACE;border-radius:8px;background:#fff;padding:12px;margin:0 0 12px}'+
'.tll-st-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;margin:0 0 10px}'+
'.tll-st-badge{display:inline-flex;align-items:center;gap:8px;font:600 12px/1 "JetBrains Mono",monospace;letter-spacing:1px;text-transform:uppercase;border:1.5px solid #0A0B14;border-radius:999px;padding:8px 12px}'+
'.tll-st-badge i{font-style:normal;color:#C8325B}'+
'.tll-st-head label{display:inline-flex;align-items:center;gap:8px;font-size:14px;min-height:36px;cursor:pointer}.tll-st-head input{width:18px;height:18px;accent-color:#C8325B}'+
'.tll-st-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px}'+
'.tll-st-it{display:flex;gap:10px;align-items:center;border:1px dashed #C8B9A6;border-radius:6px;padding:8px;background:#FDF9F3;position:relative}'+
'.tll-st-it img{width:52px;height:52px;object-fit:cover;border-radius:4px;flex:none}.tll-st-it b{display:block;font-weight:600}.tll-st-it small{color:#5F5A54;font-size:13px}'+
'.tll-st-it button{position:absolute;top:4px;right:4px;width:28px;height:28px;border:0;border-radius:50%;background:#0A0B14;color:#fff;cursor:pointer}'+
'.tll-st-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;border:1px dashed #E0DACE;border-radius:8px;padding:12px;margin-top:8px}'+
'.tll-st-form label{display:flex;flex-direction:column;gap:4px;font-size:13px;color:#5F5A54}.tll-st-form .w{grid-column:1/-1}'+
'.tll-st-form input,.tll-st-form select{box-sizing:border-box;width:100%;font:inherit;font-size:16px;padding:9px 10px;border:1px solid #E0DACE;border-radius:4px;background:#FDF9F3;color:#0A0B14;min-height:44px}'+
'.tll-st-b{border:0;background:#C8325B;color:#fff;border-radius:4px;padding:10px 16px;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;min-height:44px;cursor:pointer}'+
'.tll-st-form label.c{flex-direction:row;align-items:flex-start;gap:8px;color:#0A0B14;font-size:14px}.tll-st-form label.c input{width:18px;height:18px;min-height:0;accent-color:#C8325B;margin-top:2px;flex:none}'+
'.tll-st-wt{font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1px;text-transform:uppercase;background:#0A0B14;color:#FDF9F3;padding:3px 6px;border-radius:2px;margin-left:6px;vertical-align:middle}'+
'.tll-st-msg{font-size:13px;color:#5F5A54;margin:6px 0}.tll-st-pub{max-width:1120px;margin:32px auto;padding:0 16px}'+
'@media (max-width:560px){.tll-st-form{grid-template-columns:1fr}}';
function css(){if(document.getElementById('tll-stamps-v1'))return;var s=document.createElement('style');s.id='tll-stamps-v1';s.textContent=CSS;document.head.appendChild(s);}
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function post(path,body){var t=tok();if(!t)return Promise.resolve(null);return fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(body||{})}).then(function(r){return r.json().catch(function(){return null;});}).catch(function(){return null;});}
function countries(){var out=[];try{var dn=new Intl.DisplayNames(['en'],{type:'region'});for(var a=65;a<91;a++)for(var b=65;b<91;b++){var c=String.fromCharCode(a,b),n=dn.of(c);if(n&&n!==c&&!/^(EU|EZ|UN|QO|XA|XB|ZZ|FX|YU|SU|ZR|TP|UK)$/.test(c))out.push(n);}}catch(e){}return out.filter(function(v,i,s){return s.indexOf(v)===i;}).sort();}
function upload(file){return new Promise(function(res,rej){var u=URL.createObjectURL(file),im=new Image();im.onload=function(){var w=im.naturalWidth,h=im.naturalHeight,s=Math.min(1,EDGE/Math.max(w,h)),c=document.createElement('canvas');c.width=Math.round(w*s);c.height=Math.round(h*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(function(b){b?res(b):rej('read');},'image/jpeg',0.88);};im.onerror=function(){rej('read');};im.src=u;})
  .then(function(blob){var fd=new FormData();fd.append('file',blob,'stamp.jpg');fd.append('upload_preset',PRESET);fd.append('folder','tll/stamps');return fetch(CLOUD,{method:'POST',body:fd}).then(function(r){return r.json();}).then(function(j){if(!j.secure_url)throw 'upload';return j.secure_url;});});}
function item(s,onDel){var t=el('div','tll-st-it');if(s.photo){var im=el('img');im.src=s.photo.replace('/upload/','/upload/c_fill,w_120,h_120,q_auto,f_auto/');im.alt=s.what;im.loading='lazy';t.appendChild(im);}
  var d=el('div'),bt=el('b','',s.what);if(s.workTrip)bt.appendChild(el('span','tll-st-wt','Work trip'));d.appendChild(bt);d.appendChild(el('small','',[s.city,s.country,s.year].filter(Boolean).join(' · ')));t.appendChild(d);
  if(onDel){var x=el('button','','×');x.type='button';x.setAttribute('aria-label','Remove '+s.what);x.addEventListener('click',onDel);t.appendChild(x);}return t;}
function badge(name,count,countries){var b=el('span','tll-st-badge');b.appendChild(document.createTextNode(name+' '));var i=el('i','',count+(count===1?' stamp':' stamps')+' · '+countries+(countries===1?' country':' countries'));b.appendChild(i);return b;}

function editProfile(){
  var anchor=document.getElementById('tll-col')||document.getElementById('ep-crew');if(!anchor||document.getElementById('tll-st'))return;
  post('/stamps/mine').then(function(d){
    if(!d||!d.ok||document.getElementById('tll-st'))return;css();
    var sec=el('section','ep-sec tll-st');sec.id='tll-st';var h=el('h2','ep-eb','05C · Pursuit stamps');sec.appendChild(h);
    sec.appendChild(el('p','ep-lede','A stamp is one thing you did: the race, the trail, the library, the dish. Where, the year and one photo. Private until you switch a pursuit on; profiles show the year only.'));
    var list=el('div');sec.appendChild(list);
    var f=el('div','tll-st-form');f.setAttribute('role','group');f.setAttribute('aria-label','Add a stamp');
    function field(l,n,w){var x=el('label',w?'w':'',l);x.appendChild(n);f.appendChild(x);return n;}
    var ps=d.pursuits.filter(function(p){return WT||!p.draft;}).sort(function(a,b){return (b.picked?1:0)-(a.picked?1:0);});
    var pur=el('select');ps.forEach(function(p){var o=el('option','',p.name);o.value=p.slug;pur.appendChild(o);});field('Pursuit',pur);
    var what=el('input');what.maxLength=80;what.placeholder='Tokyo Marathon, the W Trek, Trinity College Library';field('What',what);
    var ctry=el('input');ctry.setAttribute('list','tll-st-countries');ctry.autocomplete='off';field('Country',ctry);
    var dl=el('datalist');dl.id='tll-st-countries';countries().forEach(function(n){var o=el('option');o.value=n;dl.appendChild(o);});f.appendChild(dl);
    var city=el('input');city.maxLength=60;field('City (optional)',city);
    var mon=el('select');mon.appendChild(el('option','','Month (optional)'));MONTHS.forEach(function(m,i){var o=el('option','',m);o.value=String(i+1);mon.appendChild(o);});field('Month',mon);
    var yr=el('input');yr.type='number';yr.inputMode='numeric';yr.min='1900';yr.max=String(new Date().getFullYear());field('Year',yr);
    var file=el('input');file.type='file';file.accept='image/jpeg,image/png,image/webp,image/heic';field('One photo (optional)',file,true);
    var wt=el('input'),named=el('input'),wtBox=el('div','w');wt.type='checkbox';named.type='checkbox';
    if(WT){var wl=el('label','c');wl.appendChild(wt);wl.appendChild(document.createTextNode('Work trip. Back home? Good. Now tell us.'));wtBox.appendChild(wl);
      var nl=el('label','c');nl.hidden=true;nl.appendChild(named);nl.appendChild(document.createTextNode('I have permission to name them (the company, client or colleague in "What"). Leave this off and your profile says "A work trip".'));wtBox.appendChild(nl);
      f.appendChild(wtBox);var sync=function(){if(pur.value==='work-trips')wt.checked=true;wt.disabled=pur.value==='work-trips';nl.hidden=!wt.checked;if(!wt.checked)named.checked=false;};
      wt.addEventListener('change',sync);pur.addEventListener('change',sync);sync();}
    var btn=el('button','tll-st-b','Add the stamp');btn.type='button';f.appendChild(btn);var msg=el('p','tll-st-msg');msg.setAttribute('aria-live','polite');f.appendChild(msg);sec.appendChild(f);
    function render(stamps){list.textContent='';if(!stamps.length){list.appendChild(el('p','tll-st-msg','No stamps yet. Add your first below.'));return;}
      var g={},order=[];stamps.forEach(function(s){if(!g[s.pursuit]){g[s.pursuit]={name:s.pursuitName,items:[]};order.push(s.pursuit);}g[s.pursuit].items.push(s);});
      order.forEach(function(k){var box=el('div','tll-st-group'),hd=el('div','tll-st-head'),it=g[k].items;
        hd.appendChild(badge(g[k].name,it.length,new Set(it.map(function(s){return s.country;})).size));
        var lab=el('label'),sw=el('input');sw.type='checkbox';sw.checked=it.some(function(s){return s.shown;});lab.appendChild(sw);lab.appendChild(document.createTextNode('Show on my profile'));
        sw.addEventListener('change',function(){sw.disabled=true;post('/stamps/show',{pursuit:k,show:sw.checked}).then(function(){sw.disabled=false;refresh();});});
        hd.appendChild(lab);box.appendChild(hd);var grid=el('div','tll-st-list');
        it.forEach(function(s){var card=item(s,function(){if(!confirm('Remove '+s.what+'?'))return;post('/stamps/delete',{id:s.id}).then(refresh);});
          /* A single work-trip stamp can stay private while the rest of the pursuit shows (Nancy, 31 Oct). */
          if(WT&&s.workTrip){var pl=el('label');pl.style.cssText='display:flex;gap:6px;align-items:center;font-size:12px;color:#5F5A54;margin-top:4px';var pc=el('input');pc.type='checkbox';pc.checked=!!s.private;pc.style.cssText='width:16px;height:16px;accent-color:#C8325B';
            pl.appendChild(pc);pl.appendChild(document.createTextNode('Keep this one private'));pc.addEventListener('change',function(){pc.disabled=true;post('/stamps/private',{id:s.id,private:pc.checked}).then(function(){refresh();});});var d=card.querySelector('div');(d||card).appendChild(pl);}
          grid.appendChild(card);});box.appendChild(grid);list.appendChild(box);});}
    function refresh(){post('/stamps/mine').then(function(r){if(r&&r.ok)render(r.stamps);});}
    function add(){if(!what.value.trim()&&!wt.checked){msg.textContent='Say what it was.';what.focus();return;}if(!ctry.value.trim()){msg.textContent='Pick a country.';ctry.focus();return;}if(!yr.value){msg.textContent='Add the year.';yr.focus();return;}
      btn.disabled=true;msg.textContent=file.files[0]?'Cleaning and uploading the photo…':'Adding…';
      (file.files[0]?upload(file.files[0]):Promise.resolve('')).then(function(url){return post('/stamps/add',{pursuit:pur.value,what:what.value,country:ctry.value,city:city.value,month:mon.value,year:yr.value,photo:url,workTrip:wt.checked,namedOk:named.checked});})
      .then(function(r){btn.disabled=false;if(r&&r.ok){try{window.dispatchEvent(new CustomEvent('tll:stamp-added',{detail:{country:ctry.value,workTrip:!!r.stamp.workTrip}}));}catch(e){}msg.textContent='Stamped. '+(r.stamp.shown?'It shows on your profile.':'Private until you switch this pursuit on.');what.value='';ctry.value='';named.checked=false;city.value='';mon.value='';yr.value='';file.value='';refresh();}else msg.textContent=(r&&r.error)||'That did not go through. Try again.';})
      .catch(function(){btn.disabled=false;msg.textContent='The photo could not be uploaded. Try another, or add the stamp without a photo.';});}
    btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();add();});
    f.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.tagName==='INPUT'){e.preventDefault();e.stopPropagation();add();}},true);
    anchor.insertAdjacentElement('afterend',sec);render(d.stamps);
  });
}
function profile(slug){
  if(document.getElementById('tll-st-pub'))return;
  fetch(API+'/stamps/public?slug='+encodeURIComponent(slug)).then(function(r){return r.ok?r.json():null;}).then(function(d){
    if(!d||!d.ok||!d.shelves.length||document.getElementById('tll-st-pub'))return;css();
    var s=el('section','tll-st tll-st-pub');s.id='tll-st-pub';s.appendChild(el('p','tll-st-k','Pursuits'));
    d.shelves.forEach(function(g){var box=el('div','tll-st-group'),hd=el('div','tll-st-head'),a=el(g.live===false?'span':'a');if(g.live!==false)a.href='/pursuits/'+g.pursuit;a.style.textDecoration='none';a.style.color='inherit';a.appendChild(badge(g.name,g.count,g.countries));hd.appendChild(a);box.appendChild(hd);
      var grid=el('div','tll-st-list');g.stamps.forEach(function(x){grid.appendChild(item(x));});box.appendChild(grid);s.appendChild(box);});
    var after=document.getElementById('tll-col-pub')||document.getElementById('tll-crew-pub'),main=document.querySelector('main')||document.body;
    if(after)after.insertAdjacentElement('afterend',s);else{var h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);if(an&&an.parentNode)an.parentNode.insertBefore(s,an.nextSibling);else main.appendChild(s);}
  }).catch(function(){});
}
function hub(slug){
  var m=document.querySelector('meta[name="robots"]');if(!m){m=document.createElement('meta');m.name='robots';document.head.appendChild(m);}
  m.content='noindex, follow';m.setAttribute('data-tll-hub','pending');
  fetch(API+'/pursuits/status?slug='+encodeURIComponent(slug)).then(function(r){return r.ok?r.json():null;}).then(function(d){if(d&&d.ok&&d.indexable){m.content='index, follow';m.setAttribute('data-tll-hub','indexable');}}).catch(function(){});
}
var m=/^\/pursuits\/([^/]+)$/.exec(P);if(m)hub(m[1]);
function run(){if(P==='/edit-profile')editProfile();else{var c=/^\/contributors\/([^/]+)$/.exec(P);if(c)profile(c[1]);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1600);});else setTimeout(run,1600);
setTimeout(run,4000);
})();
/* src/site-layers/tll-expat-v1.js */
(function(){
var EX_PUBLIC=false,q=new URLSearchParams(location.search).get('preview');
try{if(q==='expat')localStorage.setItem('tll-preview-expat','1');if(q==='off')localStorage.removeItem('tll-preview-expat');}catch(e){}
var ON=EX_PUBLIC||q==='expat';try{ON=ON||localStorage.getItem('tll-preview-expat')==='1';}catch(e){}
window.__tllExpatOn=ON;if(!ON)return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var P=location.pathname.replace(/\/+$/,'')||'/';
var FLAGS='https://cdn.jsdelivr.net/gh/HatScripts/circle-flags/flags/';
var BADGES={'first-move-abroad':'First move abroad','lived-on-two-continents':'Lived on 2 continents','moved-back':'Moved back'};
var CSS='.tll-ex{font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-ex [hidden]{display:none!important}'+
'.tll-ex-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 8px}'+
'.tll-ex-flag{font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#C8325B;margin:0 0 8px}'+
'.tll-ex-stat{background:none;border:0;padding:0;text-align:left;cursor:pointer;color:inherit;font:inherit;min-height:44px}.tll-ex-stat:focus-visible{outline:2px solid #C8325B;outline-offset:2px}'+
'.tll-ex-pop{max-width:760px;margin:12px 0;padding:14px 16px;border:1px solid #E0DACE;border-radius:6px;background:#fff}.tll-ex-pop ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}.tll-ex-pop li{display:flex;gap:10px;align-items:center}.tll-ex-pop img{width:24px;height:24px}.tll-ex-pop small{color:#5F5A54;display:block}'+
'.tll-ex-badges{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}.tll-ex-badge{font:600 11px/1 "JetBrains Mono",monospace;letter-spacing:1px;text-transform:uppercase;border:1.5px solid #0A0B14;border-radius:999px;padding:8px 12px}'+
'.tll-ex-btn{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:4px;border:0;background:#C8325B;color:#fff;text-decoration:none;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer}.tll-ex-btn.ink{background:#0A0B14;color:#FDF9F3}.tll-ex-btn.ghost{background:#fff;color:#0A0B14;border:1.5px solid #0A0B14}'+
'.tll-ex-sec{background:#FDF9F3}.tll-ex-in{max-width:1120px;margin:0 auto;padding:44px 16px}.tll-ex h2{font:800 clamp(28px,4vw,46px)/1.05 "Playfair Display",Georgia,serif;margin:0 0 12px}.tll-ex h3{font:800 24px/1.15 "Playfair Display",Georgia,serif;margin:0 0 12px}'+
'.tll-ex-lede{max-width:62ch;color:#3a3833;margin:0 0 16px}.tll-ex-small{font:600 12px/1.4 "JetBrains Mono",monospace;letter-spacing:1px;text-transform:uppercase;color:#5F5A54;margin:10px 0 0}'+
'.tll-ex-prom{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.tll-ex-prom a{display:block;border-top:2px solid #0A0B14;padding:14px 0 0;color:#0A0B14;text-decoration:none}.tll-ex-prom b{display:block;font:800 20px/1.2 "Playfair Display",Georgia,serif;margin:0 0 6px}'+
'.tll-ex-row{border-top:2px solid #0A0B14;padding:22px 0 0;margin:30px 0 0}.tll-ex-rail{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(240px,1fr);gap:14px;overflow-x:auto;padding:6px 0 10px}'+
'.tll-ex-rail a{position:relative;display:block;border:1px solid #E0DACE;border-radius:6px;background:#fff;color:#0A0B14;text-decoration:none;overflow:hidden}.tll-ex-rail .ph{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;background:#E0DACE}.tll-ex-rail b{display:block;font:800 19px/1.2 "Playfair Display",Georgia,serif;padding:12px}'+
'.tll-ex-tape{display:inline-block;background:#0A0B14;color:#FDF9F3;font:600 10px/1.3 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;padding:5px 10px;transform:rotate(-1.5deg);clip-path:polygon(0 8%,3% 0,97% 6%,100% 0,99% 92%,96% 100%,4% 94%,1% 100%)}.tll-ex-rail .tll-ex-tape{position:absolute;top:10px;left:10px}'+
'.tll-ex-books{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}.tll-ex-book{border:1px solid #E0DACE;border-radius:6px;background:#fff;padding:14px;display:flex;flex-direction:column;gap:6px}'+
'.tll-ex-book header{display:flex;gap:10px;align-items:center}.tll-ex-book header img{width:48px;height:48px;border-radius:50%;object-fit:cover}.tll-ex-book b{font:800 19px/1.2 "Playfair Display",Georgia,serif}.tll-ex-book small{color:#5F5A54;display:block}'+
'.tll-ex-book .acts{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:8px}.tll-ex-book .rep{font-size:13px;color:#5F5A54}'+
'.tll-ex details{border:1px dashed #C8B9A6;border-radius:6px;padding:12px 14px;background:#fff;margin:0 0 16px}.tll-ex summary{cursor:pointer;font-weight:600;min-height:28px}'+
'.tll-ex-set label{display:flex;gap:10px;align-items:flex-start;border:1px solid #E0DACE;border-radius:6px;padding:10px 12px;background:#fff;margin:0 0 8px;cursor:pointer}.tll-ex-set input[type=checkbox]{width:18px;height:18px;margin-top:2px;accent-color:#C8325B;flex:none}'+
'.tll-ex-set input[type=text]{box-sizing:border-box;width:100%;font:inherit;font-size:16px;padding:9px 10px;border:1px solid #E0DACE;border-radius:4px;background:#FDF9F3;min-height:44px}'+
'@media (max-width:760px){.tll-ex-prom{grid-template-columns:1fr}}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-expat-v1'))return;var s=el('style');s.id='tll-expat-v1';s.textContent=CSS;document.head.appendChild(s);}
function track(n,x){try{window.gtag&&gtag('event',n,Object.assign({division:'tll'},x||{}));}catch(e){}}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function post(path,body){var t=tok();if(!t)return Promise.resolve(null);return fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(body||{})}).then(function(r){return r.json().catch(function(){return null;});}).catch(function(){return null;});}
function get(path){return fetch(API+path).then(function(r){return r.ok?r.json():null;}).catch(function(){return null;});}
function cname(c){c=String(c||'').toUpperCase();try{return new Intl.DisplayNames(['en'],{type:'region'}).of(c)||c;}catch(e){return c;}}
function plural(n,one,many){return n+' '+(n===1?one:many);}

/* Profile */
function profile(slug){get('/album?slug='+encodeURIComponent(slug)).then(function(d){if(!d||!d.ok||!d.homes||document.getElementById('tll-ex-lived'))return;css();var h=d.homes;
  var S=document.querySelector('[data-pf5="stats"]'),ranges=S&&/under 10|-something/.test(S.textContent||'');
  if(S&&h.total>0&&!ranges){var cell=el('div'),b=el('button','tll-ex-stat');b.type='button';b.id='tll-ex-lived';b.setAttribute('aria-expanded','false');
    b.appendChild(el('div','pf5-stat-v',String(h.total)));b.appendChild(el('div','pf5-stat-k',h.total===1?'COUNTRY LIVED IN':'COUNTRIES LIVED IN'));cell.appendChild(b);
    var info=S.querySelector('.pf5-stat-i');if(info)S.insertBefore(cell,info);else S.appendChild(cell);
    var pop=el('div','tll-ex tll-ex-pop');pop.hidden=true;pop.id='tll-ex-lived-list';b.setAttribute('aria-controls',pop.id);pop.appendChild(el('p','tll-ex-k','Places I have lived'));
    if(h.places.length){var ul=el('ul');h.places.forEach(function(p){var li=el('li'),im=el('img');im.src=FLAGS+p.c+'.svg';im.alt='';li.appendChild(im);var t=el('div');t.appendChild(document.createTextNode(cname(p.c)));if(p.years)t.appendChild(el('small','',p.years));li.appendChild(t);ul.appendChild(li);});pop.appendChild(ul);}
    else pop.appendChild(el('p','','Counted from the map. The places and years appear here once they are added on the profile.'));
    S.insertAdjacentElement('afterend',pop);b.onclick=function(){pop.hidden=!pop.hidden;b.setAttribute('aria-expanded',String(!pop.hidden));};}
  var head=S||document.querySelector('main h1');
  if(head&&h.badges&&h.badges.length){var bd=el('div','tll-ex tll-ex-badges');bd.setAttribute('aria-label','Milestones');h.badges.forEach(function(k){bd.appendChild(el('span','tll-ex-badge',BADGES[k]||k));});head.insertAdjacentElement('afterend',bd);}
  if(d.moves&&window.__tllAlbumShow){var mv=el('div','tll-ex');var btn=el('button','tll-ex-btn ink','▶ My moves');btn.type='button';mv.style.margin='10px 0';mv.appendChild(btn);(head||document.body).insertAdjacentElement('afterend',mv);
    btn.onclick=function(){track('slideshow_play',{show:'my-moves'});window.__tllAlbumShow({key:'moves',name:'My moves',photos:d.moves.map(function(m){return{img:m.img||FLAGS+m.c+'.svg',alt:m.alt||cname(m.c),line:m.line||cname(m.c),sub:[cname(m.c),m.years].filter(Boolean).join(' · '),href:m.href};})},d.name);};}
}).catch(function(){});
  /* Person schema: the home base keeps its country only. */
  [].slice.call(document.querySelectorAll('script[type="application/ld+json"]')).forEach(function(s){try{var j=JSON.parse(s.textContent);if(j&&j.homeLocation&&j.homeLocation.name){var parts=String(j.homeLocation.name).split(',');j.homeLocation.name=parts[parts.length-1].trim();s.textContent=JSON.stringify(j);}}catch(e){}});
}

/* Edit profile */
function editProfile(){var anchor=document.getElementById('tll-alb-set')||document.getElementById('tll-st')||document.getElementById('tll-col');if(!anchor||document.getElementById('tll-ex-set'))return;
  post('/album/settings',{read:true}).then(function(s){if(!s||!s.ok||document.getElementById('tll-ex-set'))return;css();
    var sec=el('section','ep-sec tll-ex tll-ex-set');sec.id='tll-ex-set';sec.appendChild(el('h2','ep-eb','05E · Your moves'));
    sec.appendChild(el('p','ep-lede','For the places you have lived. Everything here is off until you switch it on.'));
    var msg=el('p','tll-ex-small');msg.setAttribute('aria-live','polite');
    function sw(key,label,sub){var l=el('label'),i=el('input');i.type='checkbox';i.checked=s[key]===true;l.appendChild(i);var t=el('span');t.appendChild(el('b','',label));if(sub){t.appendChild(el('br'));t.appendChild(el('small','',sub));}l.appendChild(t);
      i.addEventListener('change',function(){var b={};b[key]=i.checked;i.disabled=true;post('/album/settings',b).then(function(r){i.disabled=false;msg.textContent=r&&r.ok?'Saved.':'That did not save. Try again.';if(!(r&&r.ok))i.checked=!i.checked;});});sec.appendChild(l);}
    sw('showHomeBase','Show my home base on my profile','City and country only. Off: your profile and cards leave it out.');
    sw('coffee','Open to coffee with newcomers','Puts your card in the Living Library on For Expats. No contact details on the card; people reach you through your profile after they sign in.');
    sw('moves','Show "My moves" on my profile','A slide show, one slide per place you have lived, in order.');
    sw('movedBack','I moved back','Adds the Moved back milestone to your profile.');
    if(s.desks&&s.desks.length){sec.appendChild(el('p','tll-ex-k','One line per home, for My moves (optional)'));var lines=Object.assign({},s.moveLines||{}),t0=null;
      s.desks.forEach(function(dk){var l=el('label');l.style.display='block';l.appendChild(el('span','',cname(dk.c)+(dk.years?' · '+dk.years:'')));var i=el('input');i.type='text';i.maxLength=90;i.value=lines[dk.c]||'';i.placeholder='The moving boxes won.';l.appendChild(i);sec.appendChild(l);
        i.addEventListener('input',function(){lines[dk.c]=i.value;clearTimeout(t0);t0=setTimeout(function(){post('/album/settings',{moveLines:lines}).then(function(r){msg.textContent=r&&r.ok?'Saved.':'That did not save.';});},900);});});}
    sec.appendChild(msg);anchor.insertAdjacentElement('afterend',sec);});}

/* The Living Library */
function shuffle(list){var seed;try{seed=sessionStorage.getItem('tll-ll-seed');if(!seed){seed=String(Math.floor(Math.random()*1e9));sessionStorage.setItem('tll-ll-seed',seed);}}catch(e){seed=String(Math.floor(Math.random()*1e9));}
  var x=Number(seed)||1,a=list.slice();for(var i=a.length-1;i>0;i--){x=(x*1103515245+12345)%2147483648;var j=x%(i+1),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function library(books){var signed=!!tok(),wrap=el('div','tll-ex-row');wrap.id='living-library';wrap.appendChild(el('p','tll-ex-k','The Living Library'));wrap.appendChild(el('h3','','People you can borrow for coffee'));
  var det=el('details'),sum=el('summary','','Borrow a book: how it works');det.appendChild(sum);
  [['Every card is a member who moved to this city and said yes to coffee with newcomers. Think of them as a book you can borrow for an hour.'],
   ['Good to ask: how they made their first friend here, which neighborhood felt like home, what they wish they had known in month one.'],
   ['Please do not ask for legal, immigration or tax advice, for their address or workplace, or for favors they did not offer. For rules, use the official sources on our guides.'],
   ['Saying thank you: buy the coffee. Nobody is paid through That Layover Life, so please do not offer money.']].forEach(function(t){det.appendChild(el('p','',t[0]));});
  wrap.appendChild(det);var g=el('div','tll-ex-books');
  shuffle(books).forEach(function(b){var c=el('article','tll-ex-book'),h=el('header');if(b.avatar){var im=el('img');im.src=b.avatar;im.alt='';im.loading='lazy';h.appendChild(im);}var hn=el('div');hn.appendChild(el('b','',b.name));
    var sub=[b.homeCity,b.years?b.years.replace(/now/i,'today'):''].filter(Boolean).join(' · ');if(sub)hn.appendChild(el('small','',sub));h.appendChild(hn);c.appendChild(h);
    if(b.knowsWell.length)c.appendChild(el('p','','Knows well: '+b.knowsWell.join('; ')));if(b.languages.length)c.appendChild(el('small','','Speaks '+b.languages.join(', ')));if(b.interests.length)c.appendChild(el('small','','Into '+b.interests.join(', ')));
    if(b.stories.length){var p=el('p');p.appendChild(document.createTextNode('Wrote: '));b.stories.forEach(function(s,i){var a=el('a','',s.title);a.href='/stories/'+s.slug;p.appendChild(a);if(i<b.stories.length-1)p.appendChild(document.createTextNode(' · '));});c.appendChild(p);}
    var acts=el('div','acts'),go=el('a','tll-ex-btn'+(signed?'':' ghost'),signed?'Get in touch':'Sign in to get in touch');go.href=signed?'/contributors/'+b.slug+'#contact':'/login';go.addEventListener('click',function(){track('living_library_contact',{signed:signed});});acts.appendChild(go);
    var rep=el('a','rep','Report');rep.href='/contact?subject='+encodeURIComponent('Report a Living Library card: '+b.slug);acts.appendChild(rep);c.appendChild(acts);g.appendChild(c);});
  wrap.appendChild(g);return wrap;}

/* For Expats landing */
function landing(){if(document.getElementById('tll-ex-land'))return;Promise.all([get('/series?group=expat'),get('/living-library')]).then(function(v){if(document.getElementById('tll-ex-land'))return;css();
  var series=(v[0]&&v[0].series||[]).filter(function(s){return s.stories.length;}),books=v[1]&&v[1].books||[];
  var sec=el('section','tll-ex tll-ex-sec');sec.id='tll-ex-land';var inn=el('div','tll-ex-in');sec.appendChild(inn);
  if(!EX_PUBLIC)inn.appendChild(el('p','tll-ex-flag','Preview · not live · copy is draft'));
  inn.appendChild(el('p','tll-ex-k','For people who moved abroad'));inn.appendChild(el('h2','','Your homes count too.'));
  inn.appendChild(el('p','tll-ex-lede','For the people who fill their passports and have to get a new one. Mark the places you have lived, keep the move as a story, and find the people who did it before you.'));
  var cta=el('a','tll-ex-btn','Add the places you’ve lived');cta.href='/the-map?mark=lived&utm_source=for-expats&utm_medium=hero&utm_campaign=tll';cta.addEventListener('click',function(){track('signup_start',{from:'for-expats'});});inn.appendChild(cta);
  inn.appendChild(el('p','tll-ex-small','Free. No card. 16+.'));
  var pr=el('div','tll-ex-row');pr.appendChild(el('p','tll-ex-k','The expat group without the comment section'));var pg=el('div','tll-ex-prom');
  var proms=[[series.length?'#tll-ex-series':'/stories','Stories from people who moved','The first friend, the partner who moved too, the move back home, told by the people who lived it.'],
    ['/countries','Pages with their sources','Practical pages link the official source and say when we last checked it.']];
  if(books.length)proms.push(['#living-library','People you can borrow for coffee','Members who said yes to coffee with newcomers. No contact details on cards, no paid places.']);
  proms.forEach(function(p){var a=el('a');a.href=p[0];a.appendChild(el('b','',p[1]));a.appendChild(el('span','',p[2]));pg.appendChild(a);});pr.appendChild(pg);inn.appendChild(pr);
  if(series.length){var sr=el('div');sr.id='tll-ex-series';series.forEach(function(s){var row=el('div','tll-ex-row');row.appendChild(el('h3','',s.name));var r=el('div','tll-ex-rail');
    s.stories.slice(0,12).forEach(function(c){var a=el('a');a.href='/stories/'+c.slug;var im=el(c.image?'img':'div','ph');if(c.image){im.src=c.image;im.alt='';im.loading='lazy';}a.appendChild(im);a.appendChild(el('span','tll-ex-tape',c.label));a.appendChild(el('b','',c.title));r.appendChild(a);});row.appendChild(r);sr.appendChild(row);});inn.appendChild(sr);}
  if(books.length)inn.appendChild(library(books));
  var pr2=el('div','tll-ex-row');pr2.appendChild(el('p','tll-ex-k','Moving with a pet'));var pa=el('a','tll-ex-btn ghost','The Paw Passport');pa.href='/the-paw-passport?utm_source=for-expats&utm_medium=practical&utm_campaign=paw-passport';
  pa.addEventListener('click',function(){track('practical_click',{division:'paw-passport',to:'the-paw-passport'});});pr2.appendChild(pa);inn.appendChild(pr2);
  var club=el('div','tll-ex-row');var cp=el('p','');cp.appendChild(document.createTextNode('That Layover Life stays free because readers chip in. '));var ca=el('a','','The Layover Club');ca.href='/support#layover-club';ca.addEventListener('click',function(){track('revenue_click',{slot:'layover_club',from:'for-expats'});});cp.appendChild(ca);club.appendChild(cp);inn.appendChild(club);
  var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);if(an&&an.parentNode)an.parentNode.insertBefore(sec,an.nextSibling);else main.insertBefore(sec,main.firstChild);});}

function run(){var m;
  if((m=/^\/contributors\/([^/]+)$/.exec(P)))profile(m[1]);
  else if(P==='/edit-profile')editProfile();
  else if(P==='/for-expats')landing();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1800);});else setTimeout(run,1800);
if(P==='/edit-profile')setTimeout(run,5200);
})();
/* src/site-layers/tll-work-trips-v1.js */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var P=location.pathname.replace(/\/+$/,'')||'/';
var HUB_PUBLIC=false,q=new URLSearchParams(location.search).get('preview');
try{if(q==='worktrips')localStorage.setItem('tll-preview-worktrips','1');if(q==='off')localStorage.removeItem('tll-preview-worktrips');}catch(e){}
var PREVIEW=q==='worktrips';try{PREVIEW=PREVIEW||localStorage.getItem('tll-preview-worktrips')==='1';}catch(e){}
var N2A={"004":"AF","248":"AX","008":"AL","012":"DZ","016":"AS","020":"AD","024":"AO","660":"AI","010":"AQ","028":"AG","032":"AR","051":"AM","533":"AW","036":"AU","040":"AT","031":"AZ","044":"BS","048":"BH","050":"BD","052":"BB","112":"BY","056":"BE","084":"BZ","204":"BJ","060":"BM","064":"BT","068":"BO","070":"BA","072":"BW","076":"BR","096":"BN","100":"BG","854":"BF","108":"BI","116":"KH","120":"CM","124":"CA","132":"CV","140":"CF","148":"TD","152":"CL","156":"CN","170":"CO","174":"KM","178":"CG","180":"CD","184":"CK","188":"CR","384":"CI","191":"HR","192":"CU","196":"CY","203":"CZ","208":"DK","262":"DJ","212":"DM","214":"DO","218":"EC","818":"EG","222":"SV","226":"GQ","232":"ER","233":"EE","231":"ET","238":"FK","234":"FO","242":"FJ","246":"FI","250":"FR","254":"GF","258":"PF","266":"GA","270":"GM","268":"GE","276":"DE","288":"GH","292":"GI","300":"GR","304":"GL","308":"GD","320":"GT","324":"GN","624":"GW","328":"GY","332":"HT","340":"HN","344":"HK","348":"HU","352":"IS","356":"IN","360":"ID","364":"IR","368":"IQ","372":"IE","376":"IL","380":"IT","388":"JM","392":"JP","400":"JO","398":"KZ","404":"KE","296":"KI","408":"KP","410":"KR","414":"KW","417":"KG","418":"LA","428":"LV","422":"LB","426":"LS","430":"LR","434":"LY","438":"LI","440":"LT","442":"LU","446":"MO","807":"MK","450":"MG","454":"MW","458":"MY","462":"MV","466":"ML","470":"MT","584":"MH","478":"MR","480":"MU","484":"MX","583":"FM","498":"MD","492":"MC","496":"MN","499":"ME","504":"MA","508":"MZ","104":"MM","516":"NA","520":"NR","524":"NP","528":"NL","540":"NC","554":"NZ","558":"NI","562":"NE","566":"NG","570":"NU","578":"NO","512":"OM","586":"PK","585":"PW","275":"PS","591":"PA","598":"PG","600":"PY","604":"PE","608":"PH","616":"PL","620":"PT","630":"PR","634":"QA","638":"RE","642":"RO","643":"RU","646":"RW","659":"KN","662":"LC","670":"VC","882":"WS","674":"SM","678":"ST","682":"SA","686":"SN","688":"RS","690":"SC","694":"SL","702":"SG","703":"SK","705":"SI","090":"SB","706":"SO","710":"ZA","728":"SS","724":"ES","144":"LK","729":"SD","740":"SR","748":"SZ","752":"SE","756":"CH","760":"SY","158":"TW","762":"TJ","834":"TZ","764":"TH","626":"TL","768":"TG","772":"TK","776":"TO","780":"TT","788":"TN","792":"TR","795":"TM","800":"UG","804":"UA","784":"AE","826":"GB","840":"US","858":"UY","860":"UZ","548":"VU","862":"VE","704":"VN","732":"EH","887":"YE","894":"ZM","716":"ZW","531":"CW","798":"TV","652":"BL","535":"BQ","074":"BV","166":"CC","162":"CX","831":"GG","312":"GP","239":"GS","316":"GU","334":"HM","833":"IM","086":"IO","832":"JE","136":"KY","663":"MF","580":"MP","474":"MQ","500":"MS","574":"NF","666":"PM","612":"PN","654":"SH","744":"SJ","534":"SX","796":"TC","260":"TF","581":"UM","336":"VA","092":"VG","850":"VI","876":"WF","175":"YT","900":"XK"};
window.__tllN2A=window.__tllN2A||N2A;
var CSS='.tll-wt-tape{display:inline-block;background:#0A0B14;color:#FDF9F3;font:600 11px/1.3 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;padding:6px 14px;transform:rotate(-1.5deg);clip-path:polygon(0 8%,3% 0,97% 6%,100% 0,99% 92%,96% 100%,4% 94%,1% 100%);margin:0 0 10px;max-width:100%}'+
'.tll-wt-card-tape{position:absolute;top:10px;left:10px;z-index:3;margin:0;font-size:10px;padding:5px 10px}'+
'.tll-wt{font:400 16px/1.55 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14;background:#FDF9F3}.tll-wt [hidden]{display:none!important}'+
'.tll-wt-in{max-width:1120px;margin:0 auto;padding:40px 16px}.tll-wt-k{font:600 11px/1.4 "JetBrains Mono",monospace;letter-spacing:2px;text-transform:uppercase;color:#067A79;margin:0 0 10px}'+
'.tll-wt h2{font:800 clamp(28px,4vw,44px)/1.05 "Playfair Display",Georgia,serif;margin:0 0 14px}.tll-wt h3{font:800 24px/1.15 "Playfair Display",Georgia,serif;margin:0 0 12px}'+
'.tll-wt-sec{border-top:2px solid #0A0B14;padding:22px 0 0;margin:34px 0 0}.tll-wt-lede{max-width:62ch;color:#3a3833}'+
'.tll-wt-rail{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(240px,1fr);gap:14px;overflow-x:auto;padding:6px 0 10px}'+
'.tll-wt-rail a{position:relative;display:block;border:1px solid #E0DACE;border-radius:6px;background:#fff;color:#0A0B14;text-decoration:none;overflow:hidden}'+
'.tll-wt-rail .tll-wt-ph{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;background:#E0DACE}.tll-wt-rail b{display:block;font:800 19px/1.2 "Playfair Display",Georgia,serif;padding:12px 12px 4px}.tll-wt-rail small{display:block;padding:0 12px 12px;color:#5F5A54}'+
'.tll-wt-wall{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px}.tll-wt-wall a{border:1px dashed #C8B9A6;border-radius:6px;padding:10px;background:#fff;color:#0A0B14;text-decoration:none}.tll-wt-wall b{display:block}.tll-wt-wall small{color:#5F5A54}'+
'.tll-wt-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;counter-reset:s}.tll-wt-steps div{border:1px solid #E0DACE;border-radius:6px;background:#fff;padding:16px}.tll-wt-steps b{display:block;font:800 20px/1.2 "Playfair Display",Georgia,serif;margin:0 0 6px}'+
'.tll-wt-btn{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:4px;background:#C8325B;color:#fff;text-decoration:none;font-weight:600;margin:8px 8px 0 0}.tll-wt-btn.li{background:#0A0B14}'+
'.tll-wt-flag{font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#C8325B;margin:0 0 8px}.tll-wt-empty{color:#5F5A54;font-style:italic}'+
'.tll-wt-chips{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 16px}.tll-wt-chips button{min-height:40px;padding:0 14px;border:1.5px solid #0A0B14;border-radius:999px;background:#fff;color:#0A0B14;font:600 14px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer}.tll-wt-chips button[aria-pressed=true]{background:#0A0B14;color:#FDF9F3}'+
'.tll-wt-box{max-width:680px;margin:28px auto;padding:16px 18px;border:1px solid #E0DACE;border-radius:4px;background:#fff;font:400 15px/1.55 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-wt-box ol{margin:8px 0 0;padding-left:20px}.tll-wt-box p{margin:0 0 6px}'+
'.tll-wt-kit a{color:#0A0B14;font-weight:600;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px;margin-right:14px}.tll-wt-kit i{font-style:normal;font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#5F5A54;margin-left:4px}'+
'@media (max-width:760px){.tll-wt-steps{grid-template-columns:1fr}}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-work-trips-v1'))return;var s=el('style');s.id='tll-work-trips-v1';s.textContent=CSS;document.head.appendChild(s);}
function track(n,x){try{window.gtag&&gtag('event',n,Object.assign({division:'tll'},x||{}));}catch(e){}}
function tape(text,cls){return el('span','tll-wt-tape'+(cls?' '+cls:''),text);}
function liBtn(url,where){var a=el('a','tll-wt-btn li','Share on LinkedIn');a.href='https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(url);a.target='_blank';a.rel='noopener';a.addEventListener('click',function(){track('linkedin_share',{where:where});});return a;}
function get(path){return fetch(API+path).then(function(r){return r.ok?r.json():null;}).catch(function(){return null;});}

/* 1. Map */
function a2(name){var n=String(name||'').trim().toLowerCase();if(!n)return'';try{var dn=new Intl.DisplayNames(['en'],{type:'region'});for(var num in N2A){var c=N2A[num],x=c==='XK'?'kosovo':String(dn.of(c)||'').toLowerCase();if(x===n)return num;}}catch(e){}return'';}
window.addEventListener('tll:stamp-added',function(ev){var d=ev.detail||{};if(!d.workTrip)return;var num=a2(d.country),ms=window.$memberstackDom;if(!num||!ms||!ms.getMemberJSON)return;
  ms.getMemberJSON().then(function(j){var json=(j&&j.data)||{},r=json.tllStates;
    if(!r||r.v!==2||!r.states){try{r=JSON.parse(localStorage.getItem('tllStates')||'null');}catch(e){r=null;}}
    if(!r||r.v!==2||!r.states)r={v:2,travelers:[{id:'t1',name:'Me',color:'#F0507A',pet:false}],states:{}};
    var me=(r.travelers||[]).filter(function(t){return t&&!t.pet;})[0],id=me?me.id:'t1',e=Object.assign({},r.states[num]||{});
    if(e[id])return;e[id]='visited';r.states[num]=e;var t=Date.now();json.tllStates=r;json.tllStatesAt=t;
    return ms.updateMemberJSON({json:json}).then(function(){try{localStorage.setItem('tllStates',JSON.stringify(r));localStorage.setItem('tllStatesAt',String(t));}catch(e){}
      var m=document.querySelector('#tll-st .tll-st-msg');if(m)m.textContent+=' '+d.country+' is on your map now.';});
  }).catch(function(){});});

/* 3. The hub */
var INTRO_DRAFT='Work sends you somewhere for three days of meetings. This is for the hours around them: the free evening after the last session, and the one day you add on your own time. Written by members once they are home, never during. Nobody names a company, a client or a colleague unless they have permission.';
function hub(d){if(document.getElementById('tll-wt-hub'))return;css();var sec=el('section','tll-wt');sec.id='tll-wt-hub';var inn=el('div','tll-wt-in');sec.appendChild(inn);
  if(!HUB_PUBLIC)inn.appendChild(el('p','tll-wt-flag','Preview · not live'));inn.appendChild(el('p','tll-wt-k','Work trips'));inn.appendChild(el('h2','',(d.hub&&d.hub.name)||'That Work Trip Life'));
  var intro=String(d.hub&&d.hub.intro||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();if(intro)inn.appendChild(el('p','tll-wt-lede',intro));else{inn.appendChild(el('p','tll-wt-lede',INTRO_DRAFT));inn.appendChild(el('p','tll-wt-flag','Draft intro · Nancy to approve or rewrite'));}
  inn.appendChild(liBtn(location.origin+location.pathname,'hub'));
  d.series.forEach(function(s){var b=el('div','tll-wt-sec');b.appendChild(tape(s.name));b.appendChild(el('h3','',s.slug==='the-free-evening'?'A few hours after the last session':'The work trip, plus one day'));
    if(!s.stories.length)b.appendChild(el('p','tll-wt-empty','No stories in this series yet.'));else{var r=el('div','tll-wt-rail');s.stories.slice(0,12).forEach(function(c){var a=el('a');a.href='/stories/'+c.slug;var im=el(c.image?'img':'div','tll-wt-ph');if(c.image){im.src=c.image;im.alt='';im.loading='lazy';}a.appendChild(im);a.appendChild(tape(c.label,'tll-wt-card-tape'));a.appendChild(el('b','',c.title));if(c.excerpt)a.appendChild(el('small','',c.excerpt.slice(0,120)));r.appendChild(a);});b.appendChild(r);}inn.appendChild(b);});
  var cc=el('div','tll-wt-sec');cc.appendChild(el('h3','','Conference Cities'));cc.appendChild(el('p','tll-wt-empty','Copenhagen first. The guide is a draft until a writer who went fills it in.'));inn.appendChild(cc);
  var w=el('div','tll-wt-sec');w.appendChild(el('h3','','The stamps wall'));var wall=d.wall||{stamps:[]};
  if(!wall.stamps.length)w.appendChild(el('p','tll-wt-empty','No work-trip stamps shown yet.'));else{w.appendChild(el('p','tll-wt-lede',wall.countries+(wall.countries===1?' country':' countries')+' so far, from members who chose to show their work trips.'));var g=el('div','tll-wt-wall');
    wall.stamps.forEach(function(s){var a=el('a');a.href='/contributors/'+s.memberSlug;a.appendChild(el('b','',[s.city,s.country].filter(Boolean).join(', ')));a.appendChild(el('small','',[s.what,s.year,s.member].filter(Boolean).join(' · ')));g.appendChild(a);});w.appendChild(g);}inn.appendChild(w);
  if(d.roadWarriors&&d.roadWarriors.length){var rw=el('div','tll-wt-sec');rw.appendChild(el('h3','','Road warrior picks'));var rg=el('div','tll-wt-wall');d.roadWarriors.forEach(function(p){var a=el('a');a.href='/contributors/'+p.slug;a.appendChild(el('b','',p.name));a.appendChild(el('small','',[p.line,p.employer].filter(Boolean).join(' · ')));rg.appendChild(a);});rw.appendChild(rg);inn.appendChild(rw);}
  var j=el('div','tll-wt-sec');j.appendChild(el('h3','','How to join'));var st=el('div','tll-wt-steps');
  [['Join free','A profile, your map and your stamps. No card.'],['Add a work-trip stamp','Switch on Work trip. Your profile says "A work trip" unless you choose to name the company.'],['Back home? Good. Now tell us.','Write The Free Evening or Plus One Day for the city you just left.']].forEach(function(x){var c=el('div');c.appendChild(el('b','',x[0]));c.appendChild(el('p','',x[1]));st.appendChild(c);});
  j.appendChild(st);var jb=el('a','tll-wt-btn','Join free');jb.href='/signup?utm_source=work-trips&utm_medium=hub&utm_campaign=tll';jb.addEventListener('click',function(){track('work_trips_join');});j.appendChild(jb);
  var sb=el('a','tll-wt-btn li','Write your story');sb.href='/submit?utm_source=work-trips&utm_medium=hub&utm_campaign=tll';j.appendChild(sb);inn.appendChild(j);
  var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);if(an&&an.parentNode)an.parentNode.insertBefore(sec,an.nextSibling);else main.appendChild(sec);}

function run(){if(P!=='/pursuits/work-trips'||!(HUB_PUBLIC||PREVIEW))return;
  get('/work-trips').then(function(d){if(!d||!d.ok)return;css();hub(d);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1200);});else setTimeout(run,1200);
})();
