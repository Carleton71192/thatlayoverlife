/*TLL inline photos v2, part B: "Heading | photo-slug" rows place photos at the end of that H2 section. Unlisted photos stay in the gallery. Also real CMS alt.*/
(function(){function go(){var X=window.tllPh,sec=document.querySelector('.tll-story-gallery');if(!X||!sec||sec.getAttribute('data-tll-gallery-built')!=='1')return!1;
var S=X.S,N=X.N,W=X.W,al={},by={};[].forEach.call(document.querySelectorAll('[data-tll-photo-alts] img'),function(m){var a=m.getAttribute('alt');if(a)al[S(m.getAttribute('src'))]=a});
[].forEach.call(sec.querySelectorAll('a.tll-gallery-link'),function(a){var m=a.querySelector('img');if(!m)return;var s=S(m.getAttribute('src'));by[s]=a;if(al[s]){m.alt=al[s];a.setAttribute('aria-label','Open photo: '+al[s])}});
var L=X.P().split(/\r?\n/).map(function(l){return l.trim()}).filter(Boolean);if(!L.length)return!0;
var b=[].slice.call(document.querySelectorAll('.tll-body')).filter(function(x){return x.id!=='tll-quick-answers'}).sort(function(x,y){return y.querySelectorAll(':scope>p').length-x.querySelectorAll(':scope>p').length})[0];if(!b){W('no body');return!0}
var h=[].slice.call(b.querySelectorAll(':scope>h2')),hi={};h.forEach(function(x,i){hi[N(x.textContent)]=i});
var st=document.createElement('style');st.textContent=X.CSS;document.head.appendChild(st);
L.forEach(function(l){var k=l.lastIndexOf('|');if(k<0)return W('bad line: '+l);var i=hi[N(l.slice(0,k))],s=l.slice(k+1).trim().toLowerCase(),a=by[s];if(i===undefined)return W('no H2 "'+l.slice(0,k).trim()+'"');if(!a||!sec.contains(a))return W('no photo '+s);var f=document.createElement('figure');f.className='tll-inline-photo';f.appendChild(a);h[i+1]?b.insertBefore(f,h[i+1]):b.appendChild(f)});
if(!sec.querySelector('a.tll-gallery-link'))sec.style.display='none';try{var lb=Webflow.require('lightbox');lb&&lb.ready&&lb.ready()}catch(e){}return!0}
var n=0;(function t(){if(go())return;if(++n>40)return window.tllPh&&window.tllPh.W('gallery not built');setTimeout(t,150)})()})();
