/* tll-expats-map-v1 (31 Oct 2026, Roberta's beta idea; Nancy: "build the expats map of where people live on the expats page,
   maybe with flags"). /for-expats gets a section after the directory: a world map with the countries where opted-in expats
   live filled in teal, and under it each country with its flag and the members there, each linking to their profile with the
   place they show on it. Data: the Worker's GET /expats-map, which lists only members who switched on Expats (or are in the
   expat directory), with a public profile, at the city they already show; never a live location, never coordinates.
   Map shapes: world-atlas 2.0.2 with topojson-client 3.1.0 and d3-geo 3.1.1, the same sources the map page uses. If the data
   or the map cannot load, the section stays hidden. Nothing removed; no data-ms-* element touched. */
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
