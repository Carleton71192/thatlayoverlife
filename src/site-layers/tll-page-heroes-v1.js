/* tll-page-heroes-v1 (29 Oct 2026, Nancy: "This page needs images" /for-expats; "hero love" for /stories, /travelers, /the-map, /about).
   Photos from the members' own stories, each credited to the writer and linked to the story it came from. No AI-written headline or
   body copy: the only new words are place names, bylines and two short labels. No member's current whereabouts: captions name the place
   of a published story, never where anyone is now. Runs only on the five paths below; namespaced tll-ph-; nothing is removed, and no
   data-ms-* element is touched.
     /stories     four story covers under the title (a swipe row on phones)
     /travelers   the writers' faces beside the title (a row of faces above it on phones)
     /the-map     a story photo behind the hero, under a deep scrim, with its credit
     /about       a filmstrip of four story photos along the bottom of the hero, Magnus included
     /for-expats  a story photo beside the hero, and a row of three story photos after the directory */
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
