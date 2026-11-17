(function(){var L=window.__INI=[],last='';
function vis(n){for(var a=n;a&&a.nodeType===1;a=a.parentElement){var c=getComputedStyle(a);if(c.display==='none')return 'none@'+(a.id||a.className.split(' ')[0]||a.tagName);if(c.visibility==='hidden')return 'hidden';if(+c.opacity===0)return 'op0@'+(a.id||a.className.split(' ')[0]);}return 'shown';}
function f(){var t=Math.round(performance.now()),s='';
 var p=document.querySelector('#tll-main.tll-account-greeting > p.tll-body-l'),h=document.querySelector('.tll-account-gateout-card > h2'),nav=document.querySelector('nav.tll-nav-v1');
 function d(n){if(!n)return '-';var r=n.getBoundingClientRect();return Math.round(r.top)+'/'+Math.round(r.width)+'x'+Math.round(r.height)+' '+vis(n)+' len'+n.textContent.trim().length;}
 s=document.readyState[0]+' greet['+d(p)+'] gate['+d(h)+'] nav['+d(nav)+'] cls='+document.documentElement.className.replace(/wf-\S+/g,'').replace(/\s+/g,' ').trim();
 if(s!==last){L.push(t+' '+s);last=s;} if(t<1500)requestAnimationFrame(f);}
requestAnimationFrame(f);})();
