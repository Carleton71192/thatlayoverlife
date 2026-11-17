(function(){var L=window.__INI=[],last='';
function f(){var t=Math.round(performance.now()),g=document.querySelector('.tll-lib-grid'),s='';
 if(g){var e=document.getElementById('egypt-history-101-by-us'),k=g.firstElementChild,ld=g.querySelector('[data-tll-lead]'),r=e&&e.getBoundingClientRect(),im=e&&e.querySelector('img.tll-lib-img');
  s=[document.readyState[0],g.children.length,e?[].indexOf.call(g.children,e.parentNode):-1,r?Math.round(r.top)+'/'+Math.round(r.height):'-',ld?(ld.querySelector('a')||ld).id.slice(0,12):'nolead',im?(im.currentSrc||'').slice(-22)+'|'+(im.complete?1:0):'-',Math.round(g.getBoundingClientRect().top)].join(' ');}
 if(s!==last){L.push(t+' '+s);last=s;} if(t<2500)requestAnimationFrame(f);}
requestAnimationFrame(f);})();
