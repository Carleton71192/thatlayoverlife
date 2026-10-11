import fs from 'node:fs';
const V='/home/user/thatlayoverlife/src/pages/the-map/v3/', NC='../npmcache/';
const footer=fs.readFileSync(process.env.FOOTER||'/home/user/thatlayoverlife/src/pages/the-map/footer-v3-one-count-rule.html','utf8');
const style=fs.readFileSync(V+'mp3-style.html','utf8');
const embed=fs.readFileSync(V+'passport-embed.html','utf8');
const ids=fs.readFileSync('/home/user/thatlayoverlife/src/pages/the-map/map-ids-v1.js','utf8');
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>mock</title>
<style>body{margin:0;background:#F7F1E8;font-family:system-ui}.nav{position:sticky;top:0;z-index:50;height:64px;background:#0A0B14;color:#fff;display:flex;align-items:center;padding:0 20px}
.tll-map-hero{background:#0A0B14;color:#F7F1E8;padding:40px 28px}.tll-map-hero h1{font-size:clamp(44px,6.4vw,112px);line-height:.9;margin:10px 0}
h2:not([class*="-title"]):not([class*="card"] h2){font-size:clamp(34px,5vw,64px)!important;line-height:.95!important}
.tll-map-section{padding:30px 28px}#tll-map-canvas{display:none}.tll-map-explainer{padding:40px 28px;background:#FDF9F3}.tll-map-explainer-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px}.tll-map-explainer-num{font-size:48px;font-weight:800}</style>
<script>${process.env.PUB?'':'localStorage.setItem("_ms-mid","mem_test");'}
(function(){try{var forcePublic=/[?&]view=public/.test(location.search);var member=!!(localStorage.getItem("_ms-mid")||localStorage.getItem("_ms-mem"));if(forcePublic||!member){window.__tllMapV4=1;window.__tllPublic=1;document.documentElement.classList.add("tll-map-public");}}catch(e){}})();</script>
<script>${ids}</script>
</head><body><div class="nav">TLL Nav</div><main>
<section class="tll-section-dark tll-map-hero"><div class="tll-map-eyebrow">THE MAP · EVERY COUNTRY, COUNTED</div><h1>Every country, <em>on the map</em>.</h1><div class="tll-map-hero-counter"><div class="tll-map-counter-num" id="tll-map-counter">0 / 249</div><div>Countries visited</div><div id="tll-map-pct">0%</div></div></section>
<section class="tll-map-section"><div class="tll-container tll-map-section-inner"><p>[Map 2.0 embed]</p><div id="tll-map-canvas"></div></div></section>
<div class="w-embed">${embed}</div>
<section class="tll-map-explainer"><div class="tll-map-explainer-inner"><div class="tll-map-explainer-grid">
<div class="tll-map-explainer-card"><div class="tll-map-explainer-num">87</div><div class="tll-map-explainer-label">Already logged</div><div class="tll-map-explainer-body">The countries on the map painted Rose. The trips that actually happened.</div></div>
<div class="tll-map-explainer-card"><div class="tll-map-explainer-num">108</div><div class="tll-map-explainer-label">Still to go</div><div class="tll-map-explainer-body">The cream. The next 108 conversations at 9am in someone's kitchen.</div></div>
<div class="tll-map-explainer-card"><div class="tll-map-explainer-num">1,273</div><div class="tll-map-explainer-label">World Heritage sites</div><div class="tll-map-explainer-body">UNESCO's number, natural and cultural, across 173 countries.</div><a class="tll-park-cta" href="/submit">File a park you have walked →</a></div>
</div></div></section></main>
<script src="${NC}d3-array-3.2.4/package/dist/d3-array.min.js"></script><script src="${NC}d3-geo-3.1.1/package/dist/d3-geo.min.js"></script><script src="${NC}topojson-client-3.1.0/package/dist/topojson-client.min.js"></script>
<script>fetch('${NC}world-atlas-2.0.2/package/countries-110m.json').then(r=>r.json()).then(function(topo){var N='http://www.w3.org/2000/svg',svg=document.createElementNS(N,'svg');svg.setAttribute('viewBox','0 0 960 500');var path=d3.geoPath(d3.geoEqualEarth().fitSize([960,500],{type:'Sphere'}));topojson.feature(topo,topo.objects.countries).features.forEach(function(f){var p=document.createElementNS(N,'path');p.setAttribute('d',path(f)||'');p.__data__=f;svg.appendChild(p);});document.getElementById('tll-map-canvas').appendChild(svg);});</script>
${footer}
${style}
</body></html>`;
fs.writeFileSync('page.html',html);console.log('ok',html.length);
