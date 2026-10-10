/* TLL story extras v1 (10 Oct 2026): pet-friendly notes, other perspectives (Trip Bundles) and shout-out labels in Links and mentions. */
(function(){
var m=location.pathname.match(/^\/stories\/([a-z0-9-]+)\/?$/);if(!m)return;var me=m[1];
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x)e.textContent=x;return e;}
function go(){
var bs=[].slice.call(document.querySelectorAll('.tll-body')).filter(function(b){return b.id!=='tll-quick-answers';});if(!bs.length)return;
var body=bs.sort(function(a,b){return b.querySelectorAll(':scope > p').length-a.querySelectorAll(':scope > p').length;})[0];
var css=el('style');css.textContent='.tll-x{margin:2.4em 0 0}.tll-x h2{font:800 clamp(22px,2.4vw,30px)/1.15 "Playfair Display",Georgia,serif;margin:0 0 .5em}.tll-x-ey{font:600 11px/1 "JetBrains Mono",monospace;letter-spacing:2.5px;text-transform:uppercase;color:#067A79;margin:0 0 8px}.tll-x li{margin:0 0 .6em}.tll-x a{color:#067A79}.tll-chip{display:inline-block;font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;border:1px solid currentColor;border-radius:999px;padding:4px 8px;margin:0 0 0 6px;vertical-align:2px;color:#C8325B}.tll-chip-c{color:#067A79}';document.head.appendChild(css);
var box=el('div');body.parentNode.insertBefore(box,body.nextSibling);
var pets=[].filter.call(document.querySelectorAll('[data-tll-pet-note]'),function(n){return n.getAttribute('data-story')===me;});
if(pets.length){var s=el('section','tll-x');s.appendChild(el('p','tll-x-ey','Paw Passport'));s.appendChild(el('h2',0,'Pet-friendly notes'));
pets.forEach(function(n){var p=el('p'),k=n.getAttribute('data-pet-slug'),b=el(k?'a':'b',0,n.getAttribute('data-pet'));if(k)b.href='/pets/'+k;p.appendChild(b);p.appendChild(document.createTextNode(': '+n.getAttribute('data-note')));s.appendChild(p);});box.appendChild(s);}
var bun=[].filter.call(document.querySelectorAll('[data-tll-bundle]'),function(n){return (n.getAttribute('data-slugs')||'').split(',').map(function(x){return x.trim();}).indexOf(me)>-1;})[0];
if(bun){var o=bun.getAttribute('data-slugs').split(',').map(function(x){return x.trim();}).filter(function(x){return x&&x!==me&&/^[a-z0-9-]+$/.test(x);});
if(o.length){var s2=el('section','tll-x');s2.appendChild(el('p','tll-x-ey','Same trip'));s2.appendChild(el('h2',0,'Other perspectives'));var ul=el('ul');
o.forEach(function(x){var li=el('li'),a=el('a',0,x.replace(/-/g,' '));a.href='/stories/'+x;li.appendChild(a);ul.appendChild(li);
fetch('/stories/'+x).then(function(r){return r.ok?r.text():'';}).then(function(h){var d=new DOMParser().parseFromString(h,'text/html'),t=d.querySelector('h1');if(t)a.textContent=t.textContent.trim();}).catch(function(){});});
s2.appendChild(ul);box.appendChild(s2);}}
[].forEach.call(document.querySelectorAll('[data-tll-links-card] li,[data-tll-links-card] p'),function(p){if(!/\b(Affiliate link|Comped)\b/.test(p.textContent)||p.closest('.tll-x'))return;
p.innerHTML=p.innerHTML.replace(/\b(Affiliate link|Comped)\b\.?/g,function(w,k){return '<span class="tll-chip'+(k==='Comped'?' tll-chip-c':'')+'">'+k+'</span>';});
[].forEach.call(p.querySelectorAll('a[href^="http"]'),function(a){a.rel='sponsored nofollow noopener';});});
}
if(document.readyState!=='loading')go();else document.addEventListener('DOMContentLoaded',function(){setTimeout(go,0);});
})();
