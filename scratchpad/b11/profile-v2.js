/* TLL public profile v2 (2026-09-29, screen 11). Links rows come from the CMS; the href is copied from the bound URL line so no row ever points at "#".
   Stories are read from the live /stories shelf by byline name, never typed. Counts on this page are counted, not written. */
(function(){
function q(s,r){return [].slice.call((r||document).querySelectorAll(s));}
function first(n){return (n||'').trim().split(/\s+/)[0]||'';}
function run(){
var nameEl=document.querySelector('[data-tll-prof="name"]');var name=nameEl?nameEl.textContent.trim():'';var fn=first(name);
/* badges: drop empties */
q('[data-tll-prof="badges"] > *').forEach(function(b){if(!b.textContent.trim())b.style.display='none';});
q('[data-tll-prof="meta"],[data-tll-prof="home"],[data-tll-prof="pronouns"]').forEach(function(e){if(!e.textContent.trim())e.style.display='none';});
/* since: year only */
var since=document.querySelector('[data-tll-prof="n-since"]');if(since){var d=new Date(since.textContent.trim());if(!isNaN(d.getTime()))since.textContent=String(d.getFullYear());else if(!since.textContent.trim())since.closest('[data-tll-prof="stat"]').style.display='none';}
q('[data-tll-prof="n-countries"],[data-tll-prof="n-continents"]').forEach(function(e){if(!e.textContent.trim())e.closest('[data-tll-prof="stat"]').style.display='none';});
/* voice cards: hide when the field is empty */
q('[data-tll-prof="voice-card"]').forEach(function(c){var t=c.querySelector('[data-tll-prof="trust"],[data-tll-prof="opinion"]');if(!t||!t.textContent.trim())c.style.display='none';});
if(!q('[data-tll-prof="voice-card"]').some(function(c){return c.style.display!=='none';})){var vs=document.querySelector('[data-tll-prof="voice"]');if(vs)vs.style.display='none';}
/* links */
var lt=document.querySelector('[data-tll-prof="links-title"]');if(lt&&fn)lt.textContent='Find '+fn+' elsewhere';
var live=0;q('[data-tll-link]').forEach(function(a){var u=a.querySelector('[data-tll-prof="link-url"]');var href=u?u.textContent.trim():'';if(!/^https?:\/\//i.test(href)){a.style.display='none';return;}a.setAttribute('href',href);u.textContent=href.replace(/^https?:\/\/(www\.)?/i,'').replace(/\/$/,'');live++;});
var le=document.querySelector('[data-tll-prof="links-empty"]');if(le)le.style.display=live?'none':'';
/* filed by */
var ft=document.querySelector('[data-tll-prof="filed-title"]');if(ft&&fn)ft.textContent='Filed by '+fn;
var list=document.querySelector('[data-tll-prof="filed-list"]'),fe=document.querySelector('[data-tll-prof="filed-empty"]'),ns=document.querySelector('[data-tll-prof="n-stories"]');
if(!list||!name)return;
fetch('/stories').then(function(r){return r.text();}).then(function(h){
var doc=new DOMParser().parseFromString(h,'text/html');var cards=q('a.tll-lib-card,[data-tll-card]',doc).filter(function(c){var img=c.querySelector('.tll-lib-byline-img');var by=(img&&img.getAttribute('alt'))||'';var txt=c.textContent||'';return by.trim().toLowerCase()===name.toLowerCase()||txt.toLowerCase().indexOf(name.toLowerCase())>-1;});
var seen={};cards=cards.filter(function(c){var h=c.getAttribute('href')||c.id;if(!h||seen[h])return false;seen[h]=1;return true;});
if(ns)ns.textContent=String(cards.length);
if(!cards.length){if(fe)fe.style.display='';return;}
if(fe)fe.style.display='none';
cards.slice(0,6).forEach(function(c){var href=c.getAttribute('href')||('/stories/'+c.id);if(href&&!/^\/stories\//.test(href)&&c.id)href='/stories/'+c.id;var title=(c.querySelector('h3,h2,.tll-lib-title')||{}).textContent||'';var meta=(c.querySelector('.tll-lib-meta')||{}).textContent||'';
var a=document.createElement('a');a.href=href;a.className='tll-prof-story';a.innerHTML='<span class="tll-prof-story-meta"></span><span class="tll-prof-story-title"></span>';a.querySelector('.tll-prof-story-meta').textContent=meta.trim().replace(/\s+/g,' ');a.querySelector('.tll-prof-story-title').textContent=title.trim();list.appendChild(a);});
}).catch(function(){if(fe)fe.style.display='';});
}
if(document.readyState!=='loading')run();else document.addEventListener('DOMContentLoaded',run);
})();
