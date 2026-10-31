/* tll-album-v1 (31 Oct 2026, Value Playbook Phase 3: the continent album and Slide Show mode). /contributors/<slug> only.
   Seven slide mounts, one per continent: the cover photo, a washi-tape label in mono ("Europe · 23 photos · 4 countries").
   Empty continents read "Not yet" in grey; Antarctica shows a penguin until earned. A mount with photos opens Slide Show:
   full screen, one photo per slide, caption in mono, the story title as the line, the projector click as the only sound (off by
   default). Keys: arrows or space, Esc to close; swipe on phones. The show is a link (?play=europe) and works on a TV browser.
   Photos come from GET /album: the member's live stories plus the collections and stamps they chose to show. Nothing private.
   No data-ms-* element touched. */
(function(){
var m=/^\/contributors\/([^/]+)\/?$/.exec(location.pathname);if(!m)return;var SLUG=m[1];
/* STAGED until Nancy approves: shows with ?preview=album (remembered in this browser; ?preview=off clears) or a shared ?play= link. Flip PUBLIC to true to launch. */
var PUBLIC=false,q=new URLSearchParams(location.search);try{if(q.get('preview')==='album')localStorage.setItem('tll-preview-album','1');if(q.get('preview')==='off')localStorage.removeItem('tll-preview-album');}catch(e){}
var on=PUBLIC||q.get('preview')==='album';try{on=on||localStorage.getItem('tll-preview-album')==='1';}catch(e){}if(!on)return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/album?slug=';
var PENGUIN='<svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true"><ellipse cx="32" cy="38" rx="16" ry="20" fill="#0A0B14"/><ellipse cx="32" cy="41" rx="10" ry="15" fill="#FDF9F3"/><circle cx="32" cy="18" r="11" fill="#0A0B14"/><circle cx="28" cy="16" r="2" fill="#FDF9F3"/><circle cx="36" cy="16" r="2" fill="#FDF9F3"/><path d="M29 21l3 3 3-3z" fill="#E9A23B"/><path d="M24 58l5-3M40 58l-5-3" stroke="#E9A23B" stroke-width="3" stroke-linecap="round"/></svg>';
var CSS='.tll-alb{max-width:1120px;margin:40px auto;padding:0 16px;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-alb-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 6px}'+
'.tll-alb h2{font:800 clamp(26px,3.6vw,38px)/1.1 "Playfair Display",Georgia,serif;margin:0 0 18px}'+
'.tll-alb-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:30px 18px}@media (min-width:640px){.tll-alb-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}@media (min-width:1000px){.tll-alb-grid{grid-template-columns:repeat(7,minmax(0,1fr))}}'+
'.tll-alb-mount{position:relative;display:block;width:100%;aspect-ratio:1;background:#F4EEE3;border:10px solid #FBF8F2;box-shadow:0 1px 0 #E0DACE,0 6px 14px rgba(10,11,20,.10);border-radius:3px;padding:0;cursor:pointer;overflow:visible;font:inherit;color:inherit;text-align:left}'+
'.tll-alb-mount img{width:100%;height:100%;object-fit:cover;display:block}'+
'.tll-alb-mount:focus-visible{outline:3px solid #C8325B;outline-offset:3px}'+
'.tll-alb-tape{position:absolute;left:50%;bottom:-14px;transform:translateX(-50%) rotate(-2deg);background:rgba(232,201,120,.85);padding:5px 8px;font:600 10px/1.3 "JetBrains Mono",monospace;letter-spacing:.8px;text-transform:uppercase;white-space:normal;text-align:center;width:max-content;max-width:calc(100% + 8px);color:#0A0B14;box-shadow:0 1px 2px rgba(0,0,0,.12)}'+
'.tll-alb-tape b,.tll-alb-tape small{display:block;white-space:nowrap}.tll-alb-tape small{font-size:9px;font-weight:500;letter-spacing:.5px;text-transform:none;margin-top:2px}'+
'.tll-alb-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;height:100%;color:#9A948B;font:600 12px/1 "JetBrains Mono",monospace;letter-spacing:1px;text-transform:uppercase;cursor:default}'+
'.tll-alb-play{position:absolute;top:8px;right:8px;background:rgba(10,11,20,.72);color:#fff;border-radius:999px;padding:5px 10px;font:600 11px/1 "JetBrains Mono",monospace;letter-spacing:1px}'+
'.tll-ss{position:fixed;inset:0;z-index:99999;background:#0A0B14;color:#F3EEE6;display:flex;flex-direction:column}'+
'.tll-ss-stage{flex:1;display:flex;align-items:center;justify-content:center;min-height:0;padding:16px}.tll-ss-stage img{max-width:100%;max-height:100%;object-fit:contain;box-shadow:0 0 0 12px #F3EEE6}'+
'.tll-ss-cap{padding:12px 20px 18px;display:flex;flex-wrap:wrap;gap:6px 18px;align-items:baseline;justify-content:space-between}'+
'.tll-ss-cap p{margin:0}.tll-ss-m{font:600 12px/1.4 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#00C9C8}.tll-ss-line{font:800 20px/1.25 "Playfair Display",Georgia,serif}.tll-ss-sub{color:#B9B2A8}'+
'.tll-ss-bar{display:flex;gap:8px;align-items:center}.tll-ss-bar button,.tll-ss-bar a{background:transparent;border:1.5px solid #F3EEE6;color:#F3EEE6;border-radius:4px;min-height:40px;padding:0 12px;font:600 14px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center}'+
'.tll-ss-nav{position:absolute;top:50%;transform:translateY(-50%);width:56px;height:96px;border:0;background:transparent;color:#F3EEE6;font-size:40px;cursor:pointer}.tll-ss-prev{left:0}.tll-ss-next{right:0}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-album-v1'))return;var s=el('style');s.id='tll-album-v1';s.textContent=CSS;document.head.appendChild(s);}
function sized(u,w){return /res\.cloudinary\.com/.test(u)?u.replace('/upload/','/upload/c_limit,w_'+w+',q_auto,f_auto/'):u;}
var audio=null,sound=false;
function click(){if(!sound)return;try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();var n=audio.sampleRate*0.06,b=audio.createBuffer(1,n,audio.sampleRate),d=b.getChannelData(0);for(var i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,6)*0.6;var s=audio.createBufferSource();s.buffer=b;s.connect(audio.destination);s.start();}catch(e){}}
function show(c,name){
  var i=0,ss=el('div','tll-ss');ss.setAttribute('role','dialog');ss.setAttribute('aria-modal','true');ss.setAttribute('aria-label',name+', '+c.name+' slide show');
  var stage=el('div','tll-ss-stage'),img=el('img');stage.appendChild(img);ss.appendChild(stage);
  var prev=el('button','tll-ss-nav tll-ss-prev','‹'),next=el('button','tll-ss-nav tll-ss-next','›');prev.setAttribute('aria-label','Previous');next.setAttribute('aria-label','Next');ss.appendChild(prev);ss.appendChild(next);
  var cap=el('div','tll-ss-cap'),txt=el('div'),mono=el('p','tll-ss-m'),line=el('p','tll-ss-line'),sub=el('p','tll-ss-sub');txt.appendChild(mono);txt.appendChild(line);txt.appendChild(sub);cap.appendChild(txt);
  var bar=el('div','tll-ss-bar'),read=el('a','','Read the story'),snd=el('button','','Sound off'),share=el('button','','Share'),close=el('button','','Close');
  bar.appendChild(read);bar.appendChild(snd);bar.appendChild(share);bar.appendChild(close);cap.appendChild(bar);ss.appendChild(cap);
  function draw(){var p=c.photos[i];img.src=sized(p.img,1800);img.alt=p.alt||p.line||c.name;mono.textContent=c.name+' · '+(i+1)+' / '+c.photos.length;line.textContent=p.line||'';sub.textContent=p.sub||'';read.hidden=!p.href;if(p.href)read.href=p.href;
    var n=c.photos[(i+1)%c.photos.length];if(n){var pre=new Image();pre.src=sized(n.img,1800);}}
  function go(d){i=(i+d+c.photos.length)%c.photos.length;click();draw();}
  function end(){document.removeEventListener('keydown',key,true);ss.remove();document.documentElement.style.overflow='';try{var u=new URL(location.href);u.searchParams.delete('play');history.replaceState(null,'',u);}catch(e){}}
  function key(e){if(e.key==='Escape'){e.preventDefault();end();}else if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();go(1);}else if(e.key==='ArrowLeft'){e.preventDefault();go(-1);}}
  prev.onclick=function(){go(-1);};next.onclick=function(){go(1);};stage.onclick=function(){go(1);};close.onclick=end;
  snd.onclick=function(){sound=!sound;snd.textContent=sound?'Sound on':'Sound off';if(sound)click();};
  share.onclick=function(){var u=location.origin+location.pathname+'?play='+c.key;try{window.gtag&&gtag('event','slideshow_share',{division:'tll',continent:c.key});}catch(e){}
    if(navigator.share)navigator.share({title:name+' · '+c.name,url:u}).catch(function(){});else if(navigator.clipboard)navigator.clipboard.writeText(u).then(function(){share.textContent='Link copied';});};
  var x0=null;ss.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});ss.addEventListener('touchend',function(e){if(x0==null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)go(dx<0?1:-1);x0=null;});
  document.addEventListener('keydown',key,true);document.documentElement.style.overflow='hidden';document.body.appendChild(ss);draw();close.focus();
  try{var u=new URL(location.href);u.searchParams.set('play',c.key);history.replaceState(null,'',u);window.gtag&&gtag('event','slideshow_open',{division:'tll',continent:c.key});}catch(e){}
}
function run(){
  if(document.getElementById('tll-alb'))return;
  fetch(API+encodeURIComponent(SLUG)).then(function(r){return r.ok?r.json():null;}).then(function(d){
    if(!d||!d.ok||!d.continents||!d.continents.length||document.getElementById('tll-alb'))return;
    if(!d.continents.some(function(c){return c.photos.length;}))return;css();
    var sec=el('section','tll-alb');sec.id='tll-alb';sec.appendChild(el('p','tll-alb-k','The album'));sec.appendChild(el('h2','','Seven continents, one slide each.'));
    var grid=el('div','tll-alb-grid');
    d.continents.forEach(function(c){var b;
      if(c.photos.length){b=el('button','tll-alb-mount');b.type='button';b.setAttribute('aria-label','Play '+c.name+', '+c.photos.length+' photos');
        var im=el('img');im.src=sized(c.cover.img,600);im.alt='';im.loading='lazy';b.appendChild(im);b.appendChild(el('span','tll-alb-play','▶ Play'));
        var tp=el('span','tll-alb-tape');tp.appendChild(el('b','',c.name));tp.appendChild(el('small','',c.photos.length+(c.photos.length===1?' photo':' photos')+' · '+c.countries+(c.countries===1?' country':' countries')));b.appendChild(tp);
        b.onclick=function(){show(c,d.name);};}
      else{b=el('div','tll-alb-mount');var e=el('div','tll-alb-empty');if(c.key==='antarctica')e.innerHTML=PENGUIN;e.appendChild(el('span','','Not yet'));b.appendChild(e);b.appendChild(el('span','tll-alb-tape',c.name));}
      grid.appendChild(b);});
    sec.appendChild(grid);
    var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);
    if(an&&an.parentNode)an.parentNode.insertBefore(sec,an.nextSibling);else main.appendChild(sec);
    var want=new URLSearchParams(location.search).get('play');if(want){var c=d.continents.filter(function(x){return x.key===want&&x.photos.length;})[0];if(c)show(c,d.name);}
  }).catch(function(){});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,700);});else setTimeout(run,700);
})();
