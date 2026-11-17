(function(){var L=window.__INI=[];
function h(s){var x=5381;for(var i=0;i<s.length;i++)x=((x<<5)+x+s.charCodeAt(i))|0;return (x>>>0).toString(16);}
function snap(tag){var d=document,H=d.documentElement,nav=d.querySelector('nav.tll-nav-v1'),w=d.querySelector('.tll-account-wrap>[data-ms-content="members"],.tll-share-wrap>[data-ms-content="members"]');
 var p=nav&&nav.parentNode,c=w?w.cloneNode(true):null;
 if(c){[].forEach.call(c.querySelectorAll('script,style,iframe'),function(n){n.textContent='';});}
 L.push(tag+' t='+Math.round(performance.now())+' a3on='+(H.classList.contains('a3-on')?1:0)+' grid='+(w&&w.classList.contains('a3-grid')?1:0)+' rail='+d.querySelectorAll('.a3-rail').length+' tabs='+d.querySelectorAll('.a3-tab').length+' ph='+d.querySelectorAll('.a3-ph').length+
  ' navParent='+(p?(p.getAttribute('data-ms-content')?'ms:'+p.getAttribute('data-ms-content'):(p.className||p.tagName)):'-')+' wrapKids='+(w?w.children.length:-1)+' wrapLen='+(c?c.outerHTML.length:-1)+' wrapHash='+(c?h(c.outerHTML):'-')+
  ' sheet='+(d.getElementById('tll-es-nav-v1')?1:0)+' mark='+(nav&&nav.hasAttribute('data-tll-es-nav')?1:0));}
window.addEventListener('DOMContentLoaded',function(){snap('parsed');});
window.addEventListener('load',function(){snap('load');});
})();
