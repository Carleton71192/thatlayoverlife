/* tll-site-layers-v16 chunk travelers: loaded by the core loader on paths matching /^\/travelers$/, after the core and in this order. Built by src/site-layers/build-site-layers-v16.py; each layer keeps its own path guard. No data-ms-* element is touched. */
/* src/site-layers/tll-page-heroes-v1.js */
(function(){
var path=location.pathname.replace(/\/+$/,'')||'/';
var PAGES={'/stories':1,'/travelers':1,'/the-map':1,'/about':1,'/for-expats':1};
if(!PAGES[path])return;
var C='https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/';
var P={
 ibiza:{src:C+'6ad72dc3c7e76f61648a3c30_6ad72d77eeadeeb5b887095e_chesney-lish-spain-hero.jpeg',alt:'Sunset over the sea from a beach bar in Ibiza, the sun low behind a thatched roof',place:'Ibiza, Spain',by:'Chesney Lish',href:'/stories/spain-madrid-wedding-ibiza',pos:'50% 88%'},
 jaguar:{src:C+'6ac86ab8eaf54b2878f9344b_6ac86a1e460d26e52c3f8d09_pantanal-hero-jaguar-swimming-the-cuiaba-river.jpeg',alt:'A jaguar swimming across a river in the Pantanal',place:'Pantanal, Brazil',by:'Nancy Carleton',href:'/stories/pantanal-glimmers-in-the-wild',pos:'42% 60%'},
 antarctica:{src:C+'6ab3d9bc5c183888afac103a_6ab3d9295c183888afabcab9_antarctica-hero-landing-in-the-sun.jpeg',alt:'The sun over a snowfield and mountains on a landing in Antarctica',place:'Antarctica',by:'Nancy Carleton',href:'/stories/antarctica-marathon',pos:'60% 50%'},
 fitzroy:{src:C+'6a3e79b1f2ea14b30d7a5e0f_6a0e0225995b48deb53b96e8_Fitz%2520Roy.jpeg',alt:'The granite peaks of Fitz Roy above green hills in Patagonia',place:'Patagonia',by:'Nancy Carleton',href:'/stories/patagonia-w-trek-christmas-new-year',pos:'62% 40%'},
 sortsol:{src:C+'6aba3d42f18f65b8d06aea74_6aba3cbc0a48f32b1687edfc_sortsol-hero-murmuration-over-the-cars.jpeg',alt:'A murmuration of starlings at sunset during Sort Sol in Denmark',place:'Sort Sol, Denmark',by:'Nancy Carleton',href:'/stories/sort-sol-black-sun-denmark',pos:'42% 40%'},
 bulgaria:{src:C+'6aae867b7b616826932f4447_6a1183262f8a632aeff43aed_Bulgaria.jpeg',alt:'A yellow building and wisteria on a quiet tree-lined street in Bulgaria',place:'Bulgaria',by:'Nancy Carleton',href:'/stories/balkans-ev-road-trip-twelve-countries',pos:'50% 45%'},
 montenegro:{src:C+'6a0e027dbb2d090c01c473b4_6a0e02265e2392e5fc632431_Montenegro%2520coast.jpeg',alt:'The Montenegro coast at sunset from a wooded hillside',place:'Montenegro',by:'Nancy Carleton',href:'/stories/montenegro-budva-switchback-roads',pos:'50% 50%'},
 lapaz:{src:C+'6aae867b7b616826932f4444_6a0e022469c0ce59398ce287_La%2520Paz%2520Mexico.jpeg',alt:'A sea lion swimming toward the camera off La Paz',place:'La Paz, Mexico',by:'Nancy Carleton',href:'/stories/la-paz-mexico-whale-sharks',pos:'40% 50%'},
 ghana:{src:C+'6a0e027dbb2d090c01c473b8_6a0e0224fb0e0ee3c092ec01_Ghana%2520kids.jpeg',alt:'Three children sitting together on a bench in Ghana',place:'Ghana',by:'Nancy Carleton',href:'/stories/ghana-easter-everyone-wears-white',pos:'55% 50%'},
 magnus:{src:'https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6ac9f3a6135a91817959e01a_magnus-holi-side.jpg',alt:'Magnus the Samoyed, his white coat dusted with Holi colors',place:'Magnus',by:'Paw Passport',href:'/pets/magnus-waffles',pos:'50% 30%'}
};
var FACES=[
 {name:'Chesney Lish',href:'/contributors/chesney-lish',src:C+'6ad65e8f2780d19349de64e9_6ad65e66249074db2462a667_chesney-lish-avatar.jpeg',pos:'50% 25%'},
 {name:'Barzy Adam',href:'/contributors/barzy-adam',src:C+'6ad72dc2c7c33fe2b4d53be9_6ad72d778e0db3aa7718c140_barzy-adam-avatar.jpeg',pos:'50% 30%'},
 {name:'Magnus',href:'/pets/magnus-waffles',src:P.magnus.src,pos:'50% 30%'},
 {name:'Nancy Carleton',href:'/contributors/nancy-carleton',src:'https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg',pos:'50% 35%'}
];
var CSS=
/* shared: tiles, captions, credit */
".tll-ph-tile{display:block;position:relative;text-decoration:none!important;color:inherit!important;-webkit-tap-highlight-color:transparent}"+
".tll-ph-img{display:block;position:relative;overflow:hidden;border-radius:2px;background:#E9E2D6}"+
".tll-ph-img img{display:block;width:100%!important;height:100%!important;max-width:none!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;box-shadow:none!important;object-fit:cover;opacity:0;transition:opacity 400ms cubic-bezier(.23,1,.32,1),transform 600ms cubic-bezier(.23,1,.32,1)}"+
".tll-ph-img img.tll-ph-in{opacity:1}"+
"@media (hover:hover) and (pointer:fine){.tll-ph-tile:hover .tll-ph-img img{transform:scale(1.03)}}"+
".tll-ph-tile:focus-visible{outline:3px solid #C8325B;outline-offset:3px}"+
".tll-ph-cap{display:block;margin:10px 0 0;font:500 12px/1.45 'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.06em;text-transform:uppercase;color:#5F5A54;text-align:left}"+
".tll-ph-cap b{display:block;font-weight:600;color:#1A1A1A}"+
".tll-ph-label{margin:0 0 16px;font:600 12px/1.4 'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em;text-transform:uppercase;color:#C8325B}"+
"@media (prefers-reduced-motion:reduce){.tll-ph-img img{transition:none;opacity:1}.tll-ph-tile:hover .tll-ph-img img{transform:none}}"+
/* /stories: four covers under the title */
".tll-ph-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px;max-width:960px;margin:36px auto 12px;padding:0 24px;box-sizing:border-box}"+
".tll-ph-row .tll-ph-img{aspect-ratio:4/5}"+
".tll-ph-row.tll-ph-row-below{margin:28px auto 8px}"+
"@media (max-width:767px){.tll-ph-row{display:flex;overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x mandatory;gap:12px;margin:22px 0 6px;padding:0 24px 6px;scroll-padding:0 24px;scrollbar-width:none}"+
".tll-ph-row::-webkit-scrollbar{display:none}.tll-ph-row>.tll-ph-tile{flex:0 0 46%;scroll-snap-align:start}.tll-ph-row .tll-ph-cap b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tll-ph-row .tll-ph-img{aspect-ratio:3/4}}"+
/* /travelers: the writers' faces */
".tll-ph-faces{display:flex;gap:14px;margin:0 0 28px;padding:0;list-style:none}"+
".tll-ph-faces li{margin:0;padding:0;list-style:none}"+
".tll-ph-faces .tll-ph-img{width:64px;height:64px;border-radius:50%;box-shadow:0 0 0 2px #F7F1E8,0 0 0 3.5px #C8325B}"+
".tll-ph-faces .tll-ph-cap{margin-top:8px;width:72px;margin-left:-4px;text-align:center;letter-spacing:.02em;text-transform:none;font-size:12px;color:#1A1A1A}"+
".tll-ph-faces .tll-ph-cap b{font-weight:600}"+
"@media (min-width:1200px){"+
".tll-travelers-hero .tll-travelers-hero-inner.tll-ph-grid{max-width:1232px!important;display:grid!important;grid-template-columns:minmax(0,1fr) 300px;column-gap:72px;align-items:center}"+
".tll-travelers-hero .tll-travelers-hero-inner.tll-ph-grid{grid-template-rows:1fr auto auto auto 1fr}"+
".tll-ph-grid>:not(.tll-ph-faces){grid-column:1}.tll-ph-grid>:nth-child(2){grid-row:2}.tll-ph-grid>:nth-child(3){grid-row:3}.tll-ph-grid>:nth-child(4){grid-row:4}"+
".tll-ph-grid>.tll-ph-faces{grid-column:2;grid-row:1/-1;display:grid;grid-template-columns:repeat(2,1fr);gap:18px 18px;margin:0}"+
".tll-ph-grid>.tll-ph-faces li:nth-child(even){transform:translateY(36px)}"+
".tll-ph-grid>.tll-ph-faces .tll-ph-img{width:100%;height:auto;aspect-ratio:4/5;border-radius:2px;box-shadow:none}"+
".tll-ph-grid>.tll-ph-faces .tll-ph-cap{width:auto;margin:8px 0 0;text-align:left}}"+
/* /the-map: a story photo behind the hero */
".tll-ph-hasbg{position:relative!important;isolation:isolate;overflow:hidden;border-radius:0!important}"+
".tll-ph-bg{position:absolute;inset:0;z-index:-1;pointer-events:none;background:#0A0B14}"+
".tll-ph-bg .tll-ph-img{position:absolute;inset:0;border-radius:0;background:#0A0B14}"+
".tll-ph-bg::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,11,20,.95) 0%,rgba(10,11,20,.88) 42%,rgba(10,11,20,.5) 100%),linear-gradient(0deg,#0A0B14 0%,rgba(10,11,20,0) 34%)}"+
".tll-ph-credit{position:absolute;right:24px;bottom:18px;z-index:1;font:500 12px/1.4 'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.06em;text-transform:uppercase;color:#C9C2B8!important;text-decoration:none!important}"+
".tll-ph-credit b{color:#F7F1E8;font-weight:600}"+
".tll-ph-credit:hover b,.tll-ph-credit:focus-visible b{text-decoration:underline;text-decoration-color:#F0507A;text-underline-offset:3px}"+
".tll-ph-credit:focus-visible{outline:3px solid #F0507A;outline-offset:3px}"+
"@media (max-width:767px){html body section.tll-map-hero.tll-ph-hasbg{padding-top:244px!important;padding-bottom:64px!important}.tll-ph-bg .tll-ph-img{bottom:auto;height:270px}"+
".tll-ph-bg::after{background:linear-gradient(180deg,rgba(10,11,20,.1) 0,rgba(10,11,20,.35) 130px,rgba(10,11,20,.9) 225px,#0A0B14 268px)}"+
".tll-ph-credit{bottom:20px;left:24px;right:24px}}"+
/* /about: a filmstrip along the bottom of the hero */
".tll-ph-strip{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;margin:56px 0 0;padding:0}"+
".tll-ph-strip .tll-ph-tile{height:320px}"+
".tll-ph-strip .tll-ph-img{height:100%;border-radius:0;background:#1A1C28}"+
".tll-ph-strip .tll-ph-img::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,11,20,0) 52%,rgba(10,11,20,.86) 100%);pointer-events:none}"+
".tll-ph-strip .tll-ph-cap{position:absolute;left:16px;right:16px;bottom:14px;margin:0;z-index:1;color:#D9D3C9}"+
".tll-ph-strip .tll-ph-cap b{color:#F7F1E8}"+
".tll-ph-strip .tll-ph-tile:focus-visible{outline-color:#F0507A;outline-offset:-3px}"+
"@media (max-width:767px){.tll-ph-strip{display:flex;overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x mandatory;margin-top:40px;scrollbar-width:none}"+
".tll-ph-strip::-webkit-scrollbar{display:none}.tll-ph-strip>.tll-ph-tile{flex:0 0 72%;height:240px;scroll-snap-align:start}}"+
/* /for-expats: a photo beside the hero, a row of three after the directory */
"@media (min-width:1100px){"+
"section.tll-ph-split{max-width:1072px!important;display:grid!important;grid-template-columns:minmax(0,1fr) 320px;column-gap:56px;align-items:center}"+
"section.tll-ph-split h1{font-size:clamp(56px,5.2vw,76px)!important;line-height:1!important}}"+
".tll-ph-side .tll-ph-img{aspect-ratio:4/5}"+
"@media (max-width:1099px){.tll-ph-side{margin-top:32px}.tll-ph-side .tll-ph-img{aspect-ratio:4/3}}"+
".tll-ph-band{max-width:1072px;margin:0 auto;padding:56px 24px 8px;box-sizing:border-box}"+
".tll-ph-band .tll-ph-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}"+
".tll-ph-band .tll-ph-img{aspect-ratio:3/2}"+
"@media (max-width:767px){.tll-ph-band{padding:40px 0 4px}.tll-ph-band .tll-ph-label{padding:0 24px}"+
".tll-ph-band .tll-ph-three{display:flex;overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x mandatory;gap:12px;padding:0 24px 6px;scroll-padding:0 24px;scrollbar-width:none}"+
".tll-ph-band .tll-ph-three::-webkit-scrollbar{display:none}.tll-ph-band .tll-ph-three>.tll-ph-tile{flex:0 0 72%;scroll-snap-align:start}}";

function el(tag,cls){var e=document.createElement(tag);if(cls)e.className=cls;return e;}
function img(p,eager){var i=document.createElement('img');i.src=p.src;i.alt=p.alt||'';i.decoding='async';if(!eager)i.loading='lazy';
  i.style.objectPosition=p.pos||'50% 50%';function on(){i.classList.add('tll-ph-in');}
  if(i.complete&&i.naturalWidth)on();else{i.addEventListener('load',on);i.addEventListener('error',on);}return i;}
function frame(p,eager){var f=el('span','tll-ph-img');f.appendChild(img(p,eager));return f;}
function cap(p){var c=el('span','tll-ph-cap');var b=el('b');b.textContent=p.place;c.appendChild(b);c.appendChild(document.createTextNode(p.by));return c;}
function tile(p,eager){var a=el('a','tll-ph-tile');a.href=p.href;a.appendChild(frame(p,eager));a.appendChild(cap(p));return a;}

function stories(){var h1=document.querySelector('.tll-library-hero h1');if(!h1)return;
  /* Nancy, 29 Oct: "You can not see the search bar on top of scroll". The photos sit under the search bar, not in the hero, and a search
     (?q=) shows its results first with no photos above them. "on the shelf" reads "in the library" (house words). */
  var w=document.createTreeWalker(h1.closest('section')||h1.parentNode,NodeFilter.SHOW_TEXT),t;while(t=w.nextNode()){if(/next story on the shelf/.test(t.nodeValue))t.nodeValue=t.nodeValue.replace('next story on the shelf','next story in the library');}
  if(document.querySelector('.tll-ph-row'))return;
  if(/[?&]q=[^&]/.test(location.search))return;
  var bar=document.querySelector('section.tllsb-bar');
  var row=el('div','tll-ph-row');['ibiza','jaguar','antarctica','fitzroy'].forEach(function(k){row.appendChild(tile(P[k],!bar));});
  if(bar){row.classList.add('tll-ph-row-below');bar.insertAdjacentElement('afterend',row);}else h1.insertAdjacentElement('afterend',row);}
function travelers(){var inner=document.querySelector('.tll-travelers-hero .tll-travelers-hero-inner');if(!inner||inner.querySelector('.tll-ph-faces'))return;
  var ul=el('ul','tll-ph-faces');ul.setAttribute('aria-label','Some of the travelers');
  FACES.forEach(function(f){var li=el('li');var a=el('a','tll-ph-tile');a.href=f.href;a.appendChild(frame({src:f.src,alt:'',pos:f.pos},true));
    var c=el('span','tll-ph-cap');var b=el('b');b.textContent=f.name;c.appendChild(b);a.appendChild(c);li.appendChild(a);ul.appendChild(li);});
  inner.insertBefore(ul,inner.firstChild);inner.classList.add('tll-ph-grid');}
function map(){var sec=document.querySelector('section.tll-map-hero');if(!sec||sec.querySelector('.tll-ph-bg'))return;var p=P.sortsol;
  var bg=el('div','tll-ph-bg');bg.setAttribute('aria-hidden','true');bg.appendChild(frame(p,true));sec.insertBefore(bg,sec.firstChild);sec.classList.add('tll-ph-hasbg');
  var cr=el('a','tll-ph-credit');cr.href=p.href;var b=el('b');b.textContent='Photo';cr.appendChild(b);cr.appendChild(document.createTextNode(' '+p.by+' · '+p.place));sec.appendChild(cr);}
function about(){var hero=document.querySelector('.tll-about-final-hero');if(!hero||hero.querySelector('.tll-ph-strip'))return;
  var s=el('div','tll-ph-strip');['ibiza','magnus','fitzroy','jaguar'].forEach(function(k){s.appendChild(tile(P[k],false));});hero.appendChild(s);}
function expats(){var h1=document.querySelector('main h1')||document.querySelector('h1');var sec=h1&&h1.closest('section');if(!sec||sec.classList.contains('tll-ph-split'))return;
  var copy=el('div','tll-ph-copy');while(sec.firstChild)copy.appendChild(sec.firstChild);sec.appendChild(copy);
  var fig=el('div','tll-ph-side');fig.appendChild(tile(P.sortsol,true)) /* Nancy, 29 Oct: Denmark, where she lives, makes more sense under her credit */;sec.appendChild(fig);sec.classList.add('tll-ph-split');
  var dir=document.querySelector('[data-tll-x="dir"]');if(!dir||document.querySelector('.tll-ph-band'))return;
  var band=el('section','tll-ph-band');band.setAttribute('aria-labelledby','tll-ph-band-t');var lab=el('p','tll-ph-label');lab.id='tll-ph-band-t';lab.textContent='From the stories';band.appendChild(lab);
  var three=el('div','tll-ph-three');['montenegro','lapaz','ghana'].forEach(function(k){three.appendChild(tile(P[k],false));});band.appendChild(three);
  dir.insertAdjacentElement('afterend',band);}

function run(){if(!document.getElementById('tll-page-heroes-v1')){var s=el('style');s.id='tll-page-heroes-v1';s.textContent=CSS;document.body.appendChild(s);}
  try{({'/stories':stories,'/travelers':travelers,'/the-map':map,'/about':about,'/for-expats':expats})[path]();}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
/* src/site-layers/tll-travelers-fix-v1.js */
(function(){
if((location.pathname.replace(/\/+$/,'')||'/')!=='/travelers')return;
var LABEL={instagram:'Instagram',youtube:'YouTube',website:'Website',blog:'Website',tiktok:'TikTok',strava:'Strava',newsletter:'Newsletter',other:'Link'};
var TILE={
 everyone:{ey:'WRITE FOR TLL',t:'Pitch your layover.',b:'We edit lightly and keep your byline. Your card here comes with it.',c:'Pitch a layover story →',h:'/submit',s:['or join the Travelers','/signup']},
 expats:{ey:'LIVE THERE',t:'Know a place by heart?',b:'Switch on Live there in your profile and your page lists under the city you call home.',c:'Switch on Live there →',h:'/edit-profile'},
 creators:{ey:'MAKE THINGS',t:'Show your work.',b:'Switch on Make things and the links you choose sit on your page.',c:'Add your links →',h:'/edit-profile'},
 press:{ey:'PRESS',t:'Working travel journalist?',b:'Switch on Press. An editor reviews within 48 hours, and hosted trips stay labeled at the top of every story.',c:'Apply as press →',h:'/edit-profile'},
 pets:{ey:'PETS',t:'Travel with a pet?',b:'Any species, with paperwork. A pet gets a passport page of their own.',c:'Add a pet →',h:'/my-pets'}
};
var MONO="'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace";
var CSS=
"html body .tll-trav-linkchips{display:flex!important;flex-wrap:wrap;gap:8px!important;margin:14px 0 0!important;padding:0!important}"+
"html body .tll-trav-linkchips span{width:auto!important;height:auto!important;min-height:32px;padding:0 12px!important;display:inline-flex!important;align-items:center;box-sizing:border-box;"+
"border:1px solid #D9D2C5!important;border-radius:999px!important;background:#FDF9F3!important;color:#1A1A1A!important;font:600 12px/1 "+MONO+"!important;letter-spacing:.06em!important;"+
"text-transform:none;cursor:pointer;transition:border-color 150ms ease}"+
"html body .tll-trav-linkchips span:hover{border-color:#C8325B!important}"+
"html body .tll-trav-linkchips span:focus-visible{outline:2px solid #C8325B!important;outline-offset:2px;border-color:#C8325B!important}"+
"html body [data-tv-open]{display:none!important}"+
"html body .tv-flags span{box-shadow:0 0 0 1px rgba(10,11,20,.24)!important}"+
"html body [data-tll-roster-grid] .tll-tf-gone,html body .tll-tf-pets-grid .tll-tf-gone{display:none!important}"+
"html body [data-tll-roster-grid] .w-embed::before,html body [data-tll-roster-grid] .w-embed::after{content:none!important;display:none!important}"+
"html body [data-tv-chips] [data-tv-filter=\"pets\"]{display:none!important}"+
".tll-tf-pets{margin:64px 0 0}.tll-tf-pets[hidden]{display:none!important}"+
".tll-tf-pets-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 24px;border-top:3px solid #0A0B14;border-bottom:1px solid #E0DACE;padding:16px 0;margin:0 0 32px}"+
".tll-tf-pets-h{font-family:'Playfair Display',Georgia,serif;font-weight:800;font-size:28px;line-height:1.1;letter-spacing:-.02em;color:#0A0B14;margin:0}"+
".tll-tf-pets-a{font:700 12px/1.4 "+MONO+";letter-spacing:1.5px;text-transform:uppercase;color:#067A79!important;text-decoration:none!important;min-height:44px;display:inline-flex;align-items:center}"+
".tll-tf-pets-a:hover{text-decoration:underline!important}.tll-tf-pets-a:focus-visible{outline:3px solid #0A0B14;outline-offset:2px}"+
".tll-tf-pets-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr));gap:24px;align-items:stretch}"+
".tll-tf-pets-grid .w-dyn-item,.tll-tf-pets-grid .w-dyn-item.tv-hide{display:flex!important;min-width:0}"+
".tll-tf-pets-grid .w-dyn-item.tll-tf-pno{display:none!important}"+
".tll-tf-tile{border:1px solid #E0DACE;background:#FDF9F3;padding:24px;display:flex;flex-direction:column;justify-content:space-between;gap:16px;min-height:280px;min-width:0;box-sizing:border-box}"+
".tll-tf-tile[hidden]{display:none!important}"+
".tll-tf-ey{font:600 12px/1.4 "+MONO+";letter-spacing:.18em;color:#C8325B;text-transform:uppercase}"+
".tll-tf-t{font-family:'Playfair Display',Georgia,serif;font-weight:800;font-size:24px;line-height:1.05;letter-spacing:-.02em;margin:10px 0 0;color:#0A0B14}"+
".tll-tf-b{font-family:'IBM Plex Sans Condensed','DM Sans',system-ui,sans-serif;font-size:14px;line-height:1.5;color:#3a3a3a;margin:10px 0 0}"+
".tll-tf-acts{display:flex;flex-direction:column;align-items:flex-start;gap:10px}"+
".tll-tf-c{font-family:'IBM Plex Sans Condensed','DM Sans',system-ui,sans-serif;font-size:15px;font-weight:600;background:#D63859;color:#fff!important;border:0;border-radius:0;padding:12px 20px;min-height:44px;box-sizing:border-box;display:inline-flex;align-items:center;text-decoration:none!important}"+
".tll-tf-c:hover{background:#B82C4B}"+
".tll-tf-c:focus-visible,.tll-tf-s:focus-visible{outline:3px solid #0A0B14;outline-offset:2px}"+
".tll-tf-s{font-family:'IBM Plex Sans Condensed','DM Sans',system-ui,sans-serif;font-size:14px;color:#1A1A1A!important;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}";
function style(){if(document.getElementById('tll-travelers-fix-v1'))return;var s=document.createElement('style');s.id='tll-travelers-fix-v1';s.textContent=CSS;(document.head||document.documentElement).appendChild(s);}
style();
function chips(root){[].forEach.call((root||document).querySelectorAll('.tll-trav-linkchips'),function(row){
  if(!row.dataset.tllTf){row.dataset.tllTf='1';[].forEach.call(row.querySelectorAll('span[data-t]'),function(sp){var l=LABEL[sp.getAttribute('data-t')]||'Link';sp.textContent=l;sp.setAttribute('aria-label',l+', opens in a new tab');});}
  var card=row.closest('[data-tll-trav-card]'),body=card&&card.querySelector('.tv-body');if(body&&row.parentNode!==body)body.appendChild(row);});}
function visible(el){if(!el)return false;var cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden')return false;var r=el.getBoundingClientRect();return r.width>0&&r.height>0;}
function shown(c){if(!c||c.classList.contains('w-condition-invisible'))return false;var cs=getComputedStyle(c);return cs.display!=='none'&&cs.visibility!=='hidden';}
/* An item whose card is hidden (or that has no card) gets its own class; the page script toggles tv-hide on every filter click and would bring the gap back. */
function empties(){[].forEach.call(document.querySelectorAll('[data-tll-roster-grid] .w-dyn-item,.tll-tf-pets-grid .w-dyn-item'),function(it){
  if(!shown(it.querySelector('[data-tll-trav-card]')))it.classList.add('tll-tf-gone');});}
function on(c,k){var m=c.querySelector('[data-tv-on="'+k+'"]');return !!m&&!m.classList.contains('w-condition-invisible');}
function words(){var q=document.querySelector('input[data-tll-trav-search]');return q?q.value.trim().toLowerCase().split(/\s+/).filter(Boolean):[];}
function people(){return [].slice.call(document.querySelectorAll('[data-tll-roster-grid] [data-tll-trav-card]')).filter(function(c){
  var it=c.closest('.w-dyn-item');return c.getAttribute('data-tll-trav-card')!=='pet'&&!(it&&it.classList.contains('tll-tf-gone'));});}
var busy=false;
/* Counts come from the cards on the page: people only, now that pets have their own block. */
function counts(){if(busy)return;busy=true;try{
  var ps=people();
  ['everyone','expats','creators','press'].forEach(function(f){var n=ps.filter(function(c){return f==='everyone'||on(c,f);}).length;
    var sp=document.querySelector('[data-tv-filter="'+f+'"] [data-tv-n]');if(sp&&sp.textContent!==' · '+n)sp.textContent=' · '+n;});
  var line=document.querySelector('[data-tv-countline]');if(line){var cur=current(),w=words();
    var total=ps.filter(function(c){return cur==='everyone'||on(c,cur);}).length;
    var vis=ps.filter(function(c){var it=c.closest('.w-dyn-item');return !(it&&it.classList.contains('tv-hide'));}).length;
    var t=w.length?vis+' OF '+total:total+(total===1?' CARD':' CARDS');if(line.textContent!==t)line.textContent=t;}
  pets();}finally{busy=false;}}
/* The pets block follows the search box, not the chips. */
function pets(){var box=document.querySelector('.tll-tf-pets');if(!box)return;var w=words(),n=0;
  [].forEach.call(box.querySelectorAll('.w-dyn-item'),function(it){if(it.classList.contains('tll-tf-gone'))return;var c=it.querySelector('[data-tll-trav-card]');
    var t=c?((c.getAttribute('aria-label')||'')+' '+(c.textContent||'')).toLowerCase():'';var ok=!!c&&w.every(function(x){return t.indexOf(x)>-1;});
    it.classList.toggle('tll-tf-pno',!ok);if(ok)n++;});
  box.hidden=!n;}
function separate(){var grid=document.querySelector('[data-tll-roster-grid]'),list=grid&&grid.querySelector('[data-tv-list="pets"]');
  var ev=document.querySelector('[data-tv-filter="everyone"]');if(ev){var tn=ev.firstChild;if(tn&&tn.nodeType===3&&/everyone/i.test(tn.nodeValue))tn.nodeValue='People';}
  var q=document.querySelector('input[data-tll-trav-search]');if(q&&/breed/i.test(q.getAttribute('placeholder')||''))q.setAttribute('placeholder','Name, city or country');
  var lt=document.querySelector('[data-tll-trav-search-text]');if(lt&&/pet/i.test(lt.getAttribute('data-tll-trav-search-text')))lt.setAttribute('data-tll-trav-search-text','Find a traveler');
  var pp=document.querySelector('[data-tv-filter="pets"][aria-pressed="true"]');if(pp&&ev)ev.click();
  if(list&&!document.querySelector('.tll-tf-pets')){var box=document.createElement('div');box.className='tll-tf-pets';
    box.innerHTML='<div class="tll-tf-pets-head"><h2 class="tll-tf-pets-h">Travel companions</h2><a class="tll-tf-pets-a" href="/the-paw-passport">The Paw Passport →</a></div><div class="tll-tf-pets-grid"></div>';
    box.querySelector('.tll-tf-pets-grid').appendChild(list);grid.parentNode.insertBefore(box,grid.nextSibling);}
  empties();counts();
  var line=document.querySelector('[data-tv-countline]');
  if(line&&!line.__tllTf){line.__tllTf=1;new MutationObserver(function(){counts();}).observe(line,{childList:true,characterData:true,subtree:true});}
  if(q&&!q.__tllTf){q.__tllTf=1;q.addEventListener('input',function(){setTimeout(counts,200);});q.addEventListener('search',function(){setTimeout(counts,0);});}}
function current(){var b=document.querySelector('[data-tv-filter][aria-pressed="true"]');var k=b&&b.getAttribute('data-tv-filter');return TILE[k]?k:'everyone';}
var tile=null;
function paint(){if(!tile)return;var o=TILE[current()];
  tile.innerHTML='<div><div class="tll-tf-ey"></div><div class="tll-tf-t"></div><p class="tll-tf-b"></p></div><div class="tll-tf-acts"><a class="tll-tf-c"></a></div>';
  tile.querySelector('.tll-tf-ey').textContent=o.ey;tile.querySelector('.tll-tf-t').textContent=o.t;tile.querySelector('.tll-tf-b').textContent=o.b;
  var a=tile.querySelector('.tll-tf-c');a.textContent=o.c;a.href=o.h;
  if(o.s){var s=document.createElement('a');s.className='tll-tf-s';s.textContent=o.s[0];s.href=o.s[1];tile.querySelector('.tll-tf-acts').appendChild(s);}}
function mirror(open){if(tile)tile.hidden=open.classList.contains('tv-hide');}
function placeTile(){var open=document.querySelector('[data-tv-open]');if(!open||tile)return;
  tile=document.createElement('div');tile.className='tll-tf-tile';open.parentNode.insertBefore(tile,open.nextSibling);paint();mirror(open);
  new MutationObserver(function(){mirror(open);}).observe(open,{attributes:true,attributeFilter:['class']});
  document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[data-tv-filter]'))setTimeout(paint,0);});}
function run(){style();chips();placeTile();setTimeout(separate,0);
  var grid=document.querySelector('[data-tll-roster-grid]');
  if(grid&&!grid.__tllTf){grid.__tllTf=1;new MutationObserver(function(ms){for(var i=0;i<ms.length;i++)for(var j=0;j<ms[i].addedNodes.length;j++){var n=ms[i].addedNodes[j];
    if(n.nodeType===1&&(n.classList.contains('tll-trav-linkchips')||n.querySelector('.tll-trav-linkchips'))){chips(grid);return;}}}).observe(grid,{childList:true,subtree:true});}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
window.addEventListener('load',function(){run();chips();separate();setTimeout(function(){chips();separate();},600);});
})();

/* Pet cards as posters (29 Oct 2026, Nancy, pointing at the Paw Passport card in the Claude Design prototype 3.4). In the Travel
   companions block each pet card is the photo itself: a slight tilt, the name over the bottom of the photo in Playfair, and one
   mono line under it with the breed and the card's own stats (the CMS values, never typed). The PET chip stays; the one-line bio
   stays on the pet's own page. Same card and link; nothing removed. */
(function(){
if(!/^\/travelers\/?$/.test(location.pathname))return;
var CSS="html body .tll-tf-pets .tv-card{position:relative!important;display:block!important;aspect-ratio:4/5;overflow:hidden!important;padding:0!important;border:0!important;border-radius:2px!important;background:#0A0B14!important;"+
"transform:rotate(-1.2deg);box-shadow:0 14px 30px rgba(10,11,20,.18);transition:transform 260ms cubic-bezier(.23,1,.32,1),box-shadow 260ms cubic-bezier(.23,1,.32,1)}"+
"html body .tll-tf-pets .tv-card:nth-child(even),html body .tll-tf-pets [role=listitem]:nth-child(even) .tv-card{transform:rotate(1deg)}"+
"@media (hover:hover) and (pointer:fine){html body .tll-tf-pets .tv-card:hover{transform:rotate(0) translateY(-4px);box-shadow:0 20px 38px rgba(10,11,20,.24)}}"+
"html body .tll-tf-pets .tv-card:focus-visible{outline:3px solid #C8325B;outline-offset:4px}"+
"html body .tll-tf-pets .tv-photo{position:absolute!important;inset:0!important;height:100%!important;width:100%!important;margin:0!important;aspect-ratio:auto!important}"+
"html body .tll-tf-pets .tv-photo img{width:100%!important;height:100%!important;object-fit:cover!important}"+
"html body .tll-tf-pets .tv-photo::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,11,20,0) 48%,rgba(10,11,20,.78) 100%);pointer-events:none}"+
"html body .tll-tf-pets .tv-label{display:none!important}"+
"html body .tll-tf-pets .tv-body{position:absolute!important;left:0;right:0;bottom:0;z-index:2;padding:0 20px 20px!important;background:none!important;border:0!important}"+
"html body .tll-tf-pets .tv-name{margin:0 0 6px!important;color:#F7F1E8!important;font:800 28px/1.05 'Playfair Display',Georgia,serif!important;letter-spacing:-.01em}"+
"html body .tll-tf-pets .tv-line,html body .tll-tf-pets .tv-stats{display:none!important}"+
"html body .tll-tf-pets .tll-pc-meta{margin:0;font:600 11px/1.5 'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;color:#00C9C8}"+
"@media (prefers-reduced-motion:reduce){html body .tll-tf-pets .tv-card{transition:none}}";
function txt(el){if(!el)return '';var out=[];(function walk(n){[].forEach.call(n.childNodes,function(c){if(c.nodeType===3){var v=c.nodeValue.trim();if(v)out.push(v);}else if(c.nodeType===1)walk(c);});})(el);return out.join(' ').replace(/\s+/g,' ').trim();}
function run(){
  var box=document.querySelector('.tll-tf-pets');if(!box)return;
  if(!document.getElementById('tll-pet-cards-v1')){var s=document.createElement('style');s.id='tll-pet-cards-v1';s.textContent=CSS;(document.body||document.head).appendChild(s);}
  [].forEach.call(box.querySelectorAll('.tv-card'),function(c){if(c.querySelector('.tll-pc-meta'))return;
    var parts=[txt(c.querySelector('.tv-label')),txt(c.querySelector('.tv-stats'))].filter(Boolean);if(!parts.length)return;
    var m=document.createElement('p');m.className='tll-pc-meta';m.textContent=parts.join(' · ');var b=c.querySelector('.tv-body');if(b)b.appendChild(m);});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,0);});else setTimeout(run,0);
setTimeout(run,900);setTimeout(run,2000);
})();
