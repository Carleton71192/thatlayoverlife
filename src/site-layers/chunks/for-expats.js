/* tll-site-layers-v16 chunk for-expats: loaded by the core loader on paths matching /^\/for-expats$/, after the core and in this order. Built by src/site-layers/build-site-layers-v16.py; each layer keeps its own path guard. No data-ms-* element is touched. */
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
/* src/site-layers/tll-expert-from-v1.js */
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
/* src/site-layers/tll-expats-map-v1.js */
(function(){
if(!/^\/for-expats\/?$/.test(location.pathname))return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/expats-map';
var CDN='https://cdn.jsdelivr.net/npm/';
var ALIAS={us:'United States of America',cz:'Czechia',ba:'Bosnia and Herz.',do:'Dominican Rep.',cd:'Dem. Rep. Congo',cf:'Central African Rep.',ss:'S. Sudan',gq:'Eq. Guinea',sb:'Solomon Is.',kr:'South Korea',kp:'North Korea',la:'Laos',ru:'Russia',mk:'Macedonia',sz:'eSwatini',ci:"Côte d'Ivoire",tw:'Taiwan',bo:'Bolivia',ve:'Venezuela',ir:'Iran',sy:'Syria',tz:'Tanzania',md:'Moldova',ae:'United Arab Emirates',gb:'United Kingdom',vn:'Vietnam',xk:'Kosovo',ps:'Palestine',fk:'Falkland Is.',eh:'W. Sahara'};
var DN=null;try{DN=new Intl.DisplayNames(['en'],{type:'region'});}catch(e){}
function cname(c){try{return DN?DN.of(c.toUpperCase()):c.toUpperCase();}catch(e){return c.toUpperCase();}}
function norm(s){return String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z]+/g,' ').trim();}
function flag(c){return 'https://cdn.jsdelivr.net/gh/HatScripts/circle-flags/flags/'+c+'.svg';}
function load(src){return new Promise(function(ok,no){var s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=no;document.head.appendChild(s);});}
function libs(){var p=Promise.resolve();
  if(!window.topojson)p=p.then(function(){return load(CDN+'topojson-client@3.1.0/dist/topojson-client.min.js');});
  if(!(window.d3&&window.d3.geoPath&&window.d3.geoNaturalEarth1)){p=p.then(function(){return window.d3&&window.d3.range?0:load(CDN+'d3-array@3.2.4/dist/d3-array.min.js');}).then(function(){return load(CDN+'d3-geo@3.1.1/dist/d3-geo.min.js');});}
  return p;}
var CSS='[data-tll-x="expats-map"]{padding:clamp(48px,7vw,88px) 0}[data-tll-x="expats-map"] .tll-em-lede{max-width:60ch;color:#5F5A54;margin:0 0 20px}'+
'.tll-em-map{width:100%;height:auto;display:block;margin:0 0 24px}.tll-em-map path{fill:#EFE8DC;stroke:#FDF9F3;stroke-width:.5}.tll-em-map path.on{fill:#067A79}.tll-em-map .dot{fill:#C8325B;stroke:#FDF9F3;stroke-width:2}'+
'.tll-em-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;margin:0;padding:0;list-style:none}'+
'.tll-em-c{border:1px solid #E0DACE;border-radius:4px;background:#FDF9F3;padding:14px 16px}.tll-em-c h3{display:flex;align-items:center;gap:10px;margin:0 0 8px;font:800 20px/1.2 "Playfair Display",Georgia,serif;color:#0A0B14}'+
'.tll-em-c h3 img{width:24px;height:24px;border-radius:50%;box-shadow:0 0 0 1px rgba(10,11,20,.18)}.tll-em-c ul{margin:0;padding:0;list-style:none}'+
'.tll-em-c li{margin:0 0 6px;font:400 15px/1.4 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-em-c a{color:#0A0B14;font-weight:600;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}'+
'.tll-em-c small{display:block;color:#5F5A54;font-size:13px}.tll-em-c small img{width:14px;height:14px;border-radius:50%;vertical-align:-2px;margin:0 4px 0 2px}'+
'.tll-em-join{margin:18px 0 0;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif}.tll-em-join a{color:#0A0B14;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}';
function el(t,a,x){var e=document.createElement(t);if(a)for(var k in a)e.setAttribute(k,a[k]);if(x!=null)e.textContent=x;return e;}
function build(data,world){
  if(document.querySelector('[data-tll-x="expats-map"]'))return;
  var after=document.querySelector('section[data-tll-x="dir"]')||document.getElementById('tll-expert-apply');if(!after)return;
  var st=el('style',{id:'tll-expats-map-v1'});st.textContent=CSS;document.head.appendChild(st);
  var sec=el('section',{'data-tll-x':'expats-map','aria-labelledby':'tll-em-h'}),inner=el('div',{'data-tll-x':'inner'});
  var ey=el('div',{'data-tll-x':'eyebrow'});ey.appendChild(el('div',null,'THE EXPATS MAP · WHERE MEMBERS LIVE'));inner.appendChild(ey);
  inner.appendChild(el('h2',{id:'tll-em-h','data-tll-x':'dir-h2'},'Where our expats call home.'));
  inner.appendChild(el('p',{'class':'tll-em-lede'},'Members who list themselves as expats, shown by the home base on their profile. Only people who switched it on, and only the city they chose to show.'));
  var have={};Object.keys(data.countries||{}).forEach(function(c){have[norm(ALIAS[c]||cname(c))]=c;have[norm(cname(c))]=c;});
  try{
    var feats=topojson.feature(world,world.objects.countries).features.filter(function(f){return f.properties&&f.properties.name!=='Antarctica';});
    var W=960,H=470,proj=d3.geoNaturalEarth1().fitSize([W,H],{type:'FeatureCollection',features:feats}),path=d3.geoPath(proj);
    var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.setAttribute('class','tll-em-map');svg.setAttribute('role','img');
    var names=Object.keys(data.countries).map(function(c){return cname(c);});
    svg.setAttribute('aria-label','World map. Countries with expat members: '+names.join(', ')+'.');
    var dots=[];feats.forEach(function(f){var p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',path(f)||'');var c=have[norm(f.properties.name)];
      if(c){p.setAttribute('class','on');var t=document.createElementNS('http://www.w3.org/2000/svg','title');t.textContent=cname(c);p.appendChild(t);dots.push(f);}svg.appendChild(p);});
    /* a dot on each country with members, so small countries (Denmark) show; country level only */
    dots.forEach(function(f){var xy=path.centroid(f);if(!isFinite(xy[0]))return;var d=document.createElementNS('http://www.w3.org/2000/svg','circle');d.setAttribute('cx',xy[0]);d.setAttribute('cy',xy[1]);d.setAttribute('r',6);d.setAttribute('class','dot');svg.appendChild(d);});
    inner.appendChild(svg);
  }catch(e){}
  var by={};data.expats.forEach(function(x){(by[x.country]=by[x.country]||[]).push(x);});
  var list=el('ul',{'class':'tll-em-list'});
  Object.keys(by).sort(function(a,b){return cname(a).localeCompare(cname(b));}).forEach(function(c){
    var li=el('li',{'class':'tll-em-c'}),h=el('h3');var fi=el('img',{src:flag(c),alt:'',loading:'lazy'});fi.onerror=function(){fi.remove();};h.appendChild(fi);h.appendChild(document.createTextNode(cname(c)));li.appendChild(h);
    var ul=el('ul');by[c].forEach(function(x){var m=el('li'),a=el('a',{href:'/contributors/'+encodeURIComponent(x.slug)},x.name);m.appendChild(a);
      var sm=el('small',null,x.place);if(x.from&&x.from!==c){sm.appendChild(document.createTextNode(' · from '));var ff=el('img',{src:flag(x.from),alt:'',loading:'lazy'});ff.onerror=function(){ff.remove();};sm.appendChild(ff);sm.appendChild(document.createTextNode(cname(x.from)));}
      m.appendChild(sm);ul.appendChild(m);});li.appendChild(ul);list.appendChild(li);});
  inner.appendChild(list);
  var j=el('p',{'class':'tll-em-join'});j.innerHTML='Living abroad? <a href="/edit-profile">Switch on Expats on your profile</a> and you join the map, at the city you choose.';inner.appendChild(j);
  sec.appendChild(inner);after.parentNode.insertBefore(sec,after.nextSibling);
}
function run(){
  Promise.all([fetch(API,{cache:'no-cache'}).then(function(r){return r.ok?r.json():null;}),libs().then(function(){return fetch(CDN+'world-atlas@2.0.2/countries-110m.json').then(function(r){return r.json();});})])
  .then(function(a){var d=a[0];if(!d||!d.expats||!d.expats.length)return;build(d,a[1]);}).catch(function(){});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
/* src/site-layers/tll-series-v1.js */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var P=location.pathname.replace(/\/+$/,'')||'/';
var CSS='.tll-wt-tape{display:inline-block;background:#0A0B14;color:#FDF9F3;font:600 11px/1.3 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;padding:6px 14px;transform:rotate(-1.5deg);clip-path:polygon(0 8%,3% 0,97% 6%,100% 0,99% 92%,96% 100%,4% 94%,1% 100%);margin:0 0 10px;max-width:100%}'+
'.tll-wt-card-tape{position:absolute;top:10px;left:10px;z-index:3;margin:0;font-size:10px;padding:5px 10px}'+
'.tll-sr-chips{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 16px;font:400 14px/1.4 "IBM Plex Sans Condensed",system-ui,sans-serif}.tll-sr-chips button{min-height:44px;padding:0 14px;border:1.5px solid #0A0B14;border-radius:999px;background:#fff;color:#0A0B14;font:600 14px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer}.tll-sr-chips button[aria-pressed=true]{background:#0A0B14;color:#FDF9F3}'+
'.tll-sr-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 8px}'+
'.tll-sr-box{max-width:680px;margin:28px auto;padding:16px 18px;border:1px solid #E0DACE;border-radius:4px;background:#fff;font:400 15px/1.55 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}.tll-sr-box ol{margin:8px 0 0;padding-left:20px}.tll-sr-box p{margin:0 0 6px}.tll-sr-box b{font-weight:600}.tll-sr-box small{display:block;color:#5F5A54;margin-top:8px}'+
'.tll-sr-box a{color:#0A0B14;font-weight:600;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}'+
'.tll-sr-kit a{margin-right:14px}.tll-sr-kit i{font-style:normal;font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#5F5A54;margin-left:4px}'+
'.tll-sr-li{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:4px;background:#0A0B14;color:#FDF9F3!important;text-decoration:none!important;font-weight:600}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-series-v1'))return;var s=el('style');s.id='tll-series-v1';s.textContent=CSS;document.head.appendChild(s);}
function track(n,x){try{window.gtag&&gtag('event',n,Object.assign({division:x&&x.division||'tll'},x||{}));}catch(e){}}
function tape(text,cls){return el('span','tll-wt-tape'+(cls?' '+cls:''),text);}
function get(path){return fetch(API+path).then(function(r){return r.ok?r.json():null;}).catch(function(){return null;});}
function div(group){return group==='pets'?'paw-passport':'tll';}
function line(box,label,val){if(!val)return;var p=el('p');p.appendChild(el('b','',label+': '));p.appendChild(document.createTextNode(val));box.appendChild(p);}

function labelCards(cards){var by={};cards.forEach(function(c){by[c.slug]=c;});
  Object.keys(by).forEach(function(slug){[].slice.call(document.querySelectorAll('a[href="/stories/'+slug+'"],a[href^="/stories/'+slug+'?"]')).forEach(function(a){
    if(a.closest('.tll-wt-rail')||a.closest('nav,header,footer,.tll-sr-box'))return;var card=a.closest('.w-dyn-item')||a;if(card.querySelector('.tll-wt-card-tape'))return;
    if(getComputedStyle(card).position==='static')card.style.position='relative';card.appendChild(tape(by[slug].label,'tll-wt-card-tape'));card.setAttribute('data-tll-series',by[slug].series);});});}
function chips(series){if(document.getElementById('tll-sr-chips'))return;var have=series.filter(function(s){return s.stories.length;});if(!have.length)return;
  var first=document.querySelector('main .w-dyn-item a[href^="/stories/"]'),list=first&&first.closest('.w-dyn-list');if(!list)return;
  var row=el('div','tll-sr-chips');row.id='tll-sr-chips';row.setAttribute('role','group');row.setAttribute('aria-label','Story series');row.appendChild(el('span','tll-sr-k','Series'));var on='';
  have.forEach(function(s){var b=el('button','',s.name);b.type='button';b.setAttribute('aria-pressed','false');b.addEventListener('click',function(){on=on===s.slug?'':s.slug;
    [].slice.call(row.querySelectorAll('button')).forEach(function(x){x.setAttribute('aria-pressed',String(x===b&&on!==''));});
    [].slice.call(list.querySelectorAll('.w-dyn-item')).forEach(function(it){it.hidden=!!on&&it.getAttribute('data-tll-series')!==on;});track('series_filter',{series:on||'all',division:div(s.group)});});row.appendChild(b);});
  list.parentNode.insertBefore(row,list);}

function fieldsBox(d){var f=d.fields||{},s=d.series,box=el('aside','tll-sr-box'),name=d.label.split(' · ')[0];box.setAttribute('aria-label',name);box.appendChild(el('p','tll-sr-k',name));
  if(s==='the-free-evening'){var t=[f.time,f.start?'starting from a '+f.start.toLowerCase():''].filter(Boolean).join(', ');if(t)box.appendChild(el('p','',t));
    if(f.stops&&f.stops.length){var ol=el('ol');f.stops.forEach(function(x){ol.appendChild(el('li','',x.stop+(x.move?' · '+x.move:'')));});box.appendChild(ol);}}
  else if(s==='plus-one-day'){if(f.extraDays)box.appendChild(el('p','',f.extraDays+(f.extraDays===1?' extra day':' extra days')));line(box,'Who paid for what',f.whoPaid);line(box,'Best decision',f.best);line(box,'Worst decision',f.worst);}
  else if(s==='the-first-friend'){var a=[f.yearsThere?f.yearsThere+(f.yearsThere===1?' year in':' years in'):'',f.monthsItTook?'it took '+f.monthsItTook+(f.monthsItTook===1?' month':' months'):''].filter(Boolean).join(', ');if(a)box.appendChild(el('p','',a.charAt(0).toUpperCase()+a.slice(1)+'.'));
    line(box,'Where it happened',f.where);line(box,'What worked',f.worked);line(box,'What did not',f.didNot);}
  else if(s==='the-partner-who-moved-too'){var m=[f.from&&f.to?f.from+' to '+f.to:'',f.years].filter(Boolean).join(', ');if(m)box.appendChild(el('p','',m));line(box,'What happened to my work',f.work);line(box,'What I wish someone had told me',f.wish);}
  else if(s==='moving-back'){var mb=[f.from&&f.to?f.from+' back to '+f.to:'',f.yearsAway?f.yearsAway+' away':''].filter(Boolean).join(', ');if(mb)box.appendChild(el('p','',mb));line(box,'The strangest thing about home now',f.strangest);line(box,'What I kept from abroad',f.kept);}
  else if(s==='the-sitter-was-the-hero'){line(box,'The hero',f.sitter);}
  else if(s==='cats-who-travel'){line(box,'Carrier or harness',f.carrier);line(box,'Where they hid',f.hid);}
  if(f.when)box.appendChild(el('small','',(d.group==='pets'?"Writer's experience, ":'Written ')+f.when));
  return box.children.length>1?box:null;}
function petBox(b){var box=el('aside','tll-sr-box');box.setAttribute('aria-label','Pet-friendly or pet-tolerant?');box.appendChild(el('p','tll-sr-k','Pet-friendly or pet-tolerant?'));
  if(b.stayedAt){var p=el('p');p.appendChild(el('b','','Stayed at: '));if(b.url){var a=el('a','',b.stayedAt);a.href=b.url;a.rel=b.rel;a.target='_blank';p.appendChild(a);}else p.appendChild(document.createTextNode(b.stayedAt));if(b.city)p.appendChild(document.createTextNode(', '+b.city));box.appendChild(p);}
  line(box,'What we paid for the pet',b.paid);line(box,'Size or weight rule',b.sizeRule);line(box,'What made it welcoming',b.welcoming);line(box,'What we would tell the next owner',b.tell);
  box.appendChild(el('small','',"Writer's experience"+(b.when?', '+b.when:'')+'. No business can pay to change or remove a note.'));return box;}
function storyPage(slug){get('/series/story?slug='+encodeURIComponent(slug)).then(function(d){if(!d||!d.ok||document.getElementById('tll-sr-story'))return;
  var main=document.querySelector('main')||document.body,h1=main.querySelector('h1');var bodies=[].slice.call(document.querySelectorAll('.tll-body,.tll-story-body')),body=bodies.sort(function(a,b){return b.textContent.length-a.textContent.length;})[0];
  var wrap=el('div');wrap.id='tll-sr-story';css();
  if(d.series){if(h1&&!document.querySelector('.tll-sr-head-tape')){var t=tape(d.label,'tll-sr-head-tape');h1.parentNode.insertBefore(t,h1);}
    var fb=fieldsBox(d);if(fb)wrap.appendChild(fb);
    if(d.safetyNote){var sn=el('aside','tll-sr-box');sn.appendChild(el('p','tll-sr-k','Safety, from the writer'));sn.appendChild(el('p','',d.safetyNote));wrap.appendChild(sn);}
    var sh=el('div','tll-sr-box'),li=el('a','tll-sr-li','Share on LinkedIn');li.href='https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(location.origin+location.pathname);li.target='_blank';li.rel='noopener';
    li.addEventListener('click',function(){track('share_click',{channel:'linkedin',series:d.series,division:div(d.group)});});sh.appendChild(li);wrap.appendChild(sh);}
  /* Linked sponsor label (staged with the expat and pet previews): the existing "Reklame for" label gets the sponsor's name as a link. */
  var prev=false;try{prev=localStorage.getItem('tll-preview-pets')==='1'||localStorage.getItem('tll-preview-expat')==='1';}catch(e){}
  if(prev&&d.sponsor){var rk=document.querySelector('[data-tll-reklame]');if(!rk&&h1){rk=el('div','tll-reklame');rk.setAttribute('data-tll-reklame','1');rk.setAttribute('lang','da');h1.parentNode.insertBefore(rk,h1);}
    if(rk&&!rk.querySelector('a')){rk.textContent='Reklame for ';var sa=el('a','',d.sponsor.name);sa.href=d.sponsor.url;sa.target='_blank';sa.rel=d.sponsor.rel;sa.style.color='inherit';sa.addEventListener('click',function(){track('revenue_click',{slot:'sponsor_label',division:div(d.group)});});rk.appendChild(sa);}}
  if(d.petBox)wrap.appendChild(petBox(d.petBox));
  if(d.tripKit&&d.tripKit.length){var k=el('aside','tll-sr-box tll-sr-kit');k.appendChild(el('p','tll-sr-k','Trip Kit · reklamelink'));var p=el('p');
    d.tripKit.forEach(function(x){var a=el('a','',x.label);a.href=x.url;a.rel=x.rel;a.target='_blank';a.addEventListener('click',function(){track('revenue_click',{slot:'trip_kit',label:x.label,division:'tll'});});p.appendChild(a);});
    p.appendChild(el('i','','reklamelink'));k.appendChild(p);wrap.appendChild(k);}
  if(!wrap.children.length)return;var share=document.querySelector('.tll-story-share-row');if(share)share.parentNode.insertBefore(wrap,share);else if(body)body.insertAdjacentElement('afterend',wrap);else main.appendChild(wrap);});}

function run(){var m;
  if((m=/^\/stories\/([^/]+)$/.exec(P))){storyPage(m[1]);return;}
  if(!(P==='/stories'||/^\/countries\/[^/]+$/.test(P)||P==='/for-expats'||P==='/the-paw-passport'||P==='/pursuits/work-trips'))return;
  get('/series').then(function(d){if(!d||!d.ok)return;var cards=[];d.series.forEach(function(s){cards=cards.concat(s.stories);});if(!cards.length)return;css();
    labelCards(cards);if(P==='/stories')chips(d.series);setTimeout(function(){labelCards(cards);},2500);window.__tllSeries=d;});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1200);});else setTimeout(run,1200);
})();
