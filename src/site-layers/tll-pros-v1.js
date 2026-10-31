/* tll-pros-v1 (31 Oct 2026, Value Playbook Phase 6: "From the Pros"). Reads GET /pros (the pros Nancy published in the CMS).
   Story pages by a pro: a "From the Pros" label above the headline and an author box after the story with their pro line and
   ONE link, anchored on their name or brand, with the rel the Worker decided (ugc nofollow until trusted, sponsored when paid
   or hosted). Profiles of a pro: a PRO badge with their line. Pursuit hubs: a "From the Pros" row of the pros in that hub.
   Nothing shows while no pro is published. No data-ms-* element touched; nav and footer untouched. */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/pros';
var P=location.pathname.replace(/\/+$/,'')||'/';
var CSS='.tll-pro-label{display:inline-block;font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:2px;text-transform:uppercase;color:#C8325B;border:1.5px solid #C8325B;border-radius:2px;padding:3px 8px;margin:0 0 12px}'+
'.tll-pro-box{max-width:680px;margin:36px auto;padding:16px 18px;border:1px solid #E0DACE;border-left:3px solid #067A79;border-radius:4px;background:#fff;display:flex;gap:14px;align-items:center;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-pro-box img{width:56px;height:56px;border-radius:50%;object-fit:cover;flex:none}.tll-pro-box p{margin:0}.tll-pro-k{font:600 11px/1.4 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79}'+
'.tll-pro-box a{color:#0A0B14;font-weight:600;text-decoration:underline;text-decoration-color:#C8325B;text-underline-offset:3px}'+
'.tll-pro-badge{display:inline-flex;gap:6px;align-items:center;font:600 11px/1 "JetBrains Mono",monospace;letter-spacing:1.5px;text-transform:uppercase;background:#0A0B14;color:#FDF9F3;border-radius:999px;padding:6px 10px;margin:8px 0}'+
'.tll-pro-badge b{color:#00C9C8;font-weight:600}'+
'.tll-pro-row{max-width:1120px;margin:32px auto;padding:0 16px;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif}.tll-pro-row .tll-pro-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}'+
'.tll-pro-row a.tll-pro-card{display:flex;gap:10px;align-items:center;border:1px solid #E0DACE;border-radius:8px;padding:10px;background:#fff;color:#0A0B14;text-decoration:none}.tll-pro-card img{width:40px;height:40px;border-radius:50%;object-fit:cover}.tll-pro-card small{display:block;color:#5F5A54}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function css(){if(document.getElementById('tll-pros-v1'))return;var s=el('style');s.id='tll-pros-v1';s.textContent=CSS;document.head.appendChild(s);}
function story(pros){
  var main=document.querySelector('main')||document.body,by=main.querySelector('a[href^="/contributors/"]');if(!by)return;
  var slug=(by.getAttribute('href').split('/')[2]||'').replace(/[?#].*$/,''),p=pros.filter(function(x){return x.slug===slug;})[0];if(!p||document.querySelector('.tll-pro-label'))return;css();
  var h1=main.querySelector('h1');if(h1)h1.parentNode.insertBefore(el('div','tll-pro-label','From the Pros'),h1);
  var box=el('aside','tll-pro-box');box.setAttribute('aria-label','About the writer');if(p.avatar){var im=el('img');im.src=p.avatar;im.alt='';box.appendChild(im);}
  var t=el('div');t.appendChild(el('p','tll-pro-k','From the Pros'));var line=el('p');line.appendChild(document.createTextNode(p.name+(p.line?', '+p.line:'')+'. '));
  if(p.url){var a=el('a','',p.linkName);a.href=p.url;a.rel=p.rel;a.target='_blank';line.appendChild(a);}t.appendChild(line);box.appendChild(t);
  var bodies=[].slice.call(document.querySelectorAll('.tll-body,.tll-story-body')),body=bodies.sort(function(a,b){return b.textContent.length-a.textContent.length;})[0];
  var share=document.querySelector('.tll-story-share-row');
  if(share)share.parentNode.insertBefore(box,share);else if(body)body.insertAdjacentElement('afterend',box);else main.appendChild(box);
}
function profile(pros,slug){var p=pros.filter(function(x){return x.slug===slug;})[0];if(!p||document.querySelector('.tll-pro-badge'))return;css();
  var h1=(document.querySelector('main')||document.body).querySelector('h1');if(!h1)return;var b=el('div','tll-pro-badge');b.appendChild(el('b','','Pro'));if(p.line)b.appendChild(document.createTextNode(p.line));h1.insertAdjacentElement('afterend',b);}
function hub(pros,slug){var list=pros.filter(function(x){return x.pursuit&&x.pursuit.slug===slug;});if(!list.length||document.getElementById('tll-pro-row'))return;css();
  var s=el('section','tll-pro-row');s.id='tll-pro-row';var k=el('p','tll-pro-k','From the Pros');s.appendChild(k);var g=el('div','tll-pro-grid');
  list.forEach(function(p){var a=el('a','tll-pro-card');a.href='/contributors/'+p.slug;if(p.avatar){var im=el('img');im.src=p.avatar;im.alt='';a.appendChild(im);}var d=el('div');d.appendChild(document.createTextNode(p.name));if(p.line)d.appendChild(el('small','',p.line));a.appendChild(d);g.appendChild(a);});
  s.appendChild(g);var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);if(an&&an.parentNode)an.parentNode.insertBefore(s,an.nextSibling);else main.appendChild(s);}
var m;
if(!/^\/(stories|contributors|pursuits)\/[^/]+$/.test(P))return;
function run(){fetch(API).then(function(r){return r.ok?r.json():null;}).then(function(d){var pros=d&&d.pros||[];if(!pros.length)return;
  if((m=/^\/stories\/([^/]+)$/.exec(P)))story(pros);else if((m=/^\/contributors\/([^/]+)$/.exec(P)))profile(pros,m[1]);else if((m=/^\/pursuits\/([^/]+)$/.exec(P)))hub(pros,m[1]);}).catch(function(){});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,800);});else setTimeout(run,800);
})();
