/* TLL story count v3 (11 Oct 2026, Nancy: 10 stories on the page, headline said 9). The old count read the sitemap, which only
   updates on a full site publish, and cached it per visit. This counts the published story cards on /stories itself (never typed),
   keeps the headline in step if another script rewrites it, and shares the number with other pages for this visit. */
(function(){
var W=['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'],T=['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
function word(n){if(n<20)return W[n];if(n<100)return T[Math.floor(n/10)]+(n%10?'-'+W[n%10].toLowerCase():'');return String(n);}
function count(){var s={};[].forEach.call(document.querySelectorAll('a.tll-lib-card[href*="/stories/"]'),function(a){s[a.getAttribute('href').split('?')[0].replace(/\/$/,'')]=1;});return Object.keys(s).length;}
var h=null,n=0,busy=0;
function fix(){if(!h||!n||busy)return;var t=h.firstChild;while(t&&t.nodeType!==3)t=t.firstChild;if(!t)return;var v=t.nodeValue,m=v.match(/^\s*([A-Za-z-]+|\d+)(\s+stor(?:y|ies)\b)/);if(!m)return;
var want=word(n)+(n===1?' story':' stories');var cur=m[1]+m[2];if(cur.trim()===want)return;busy=1;t.nodeValue=v.replace(m[0],want);busy=0;}
function run(){h=document.querySelector('h1.tll-library-title');n=count();if(!n)return;try{sessionStorage.setItem('tllStoryN',String(n));}catch(e){}fix();
if(h&&window.MutationObserver)new MutationObserver(fix).observe(h,{childList:true,subtree:true,characterData:true});}
if(document.readyState!=='loading')run();else document.addEventListener('DOMContentLoaded',run);
setTimeout(function(){if(!n)run();else fix();},1500);
})();
