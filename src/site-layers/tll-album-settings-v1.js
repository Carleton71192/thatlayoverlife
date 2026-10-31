/* tll-album-settings-v1 (31 Oct 2026, Nancy: "Yes make the posted change"; "some people see 6 continents and other 7. It's cultural.").
   /the-map: after each map save (the page's own POST /map-snapshot), counts the countries a member has lived in or visited per
   continent from the saved map in this browser and sends only those seven numbers to the Worker (POST /album/settings), so the
   album can say "Africa · 9 countries". The country list itself never leaves the map.
   /edit-profile: "05D · Your album" asks how the member counts continents (7, 6 with one America, 6 with Eurasia, or the 5 of the
   Olympic rings). The first time, the choice is suggested from the browser language; nothing is saved until the member picks.
   No data-ms-* element touched. */
(function(){
var API='https://tll-travel-wire.thatlayoverlife.workers.dev';
var P=location.pathname.replace(/\/+$/,'')||'/';
var M49={"as": "004 031 048 050 051 064 086 096 104 116 144 156 158 162 166 196 268 275 344 356 360 364 368 376 392 398 400 408 410 414 417 418 422 446 458 462 496 512 524 586 608 626 634 682 702 704 760 762 764 784 792 795 860 887 901", "eu": "008 020 040 056 070 100 112 191 203 208 233 234 246 248 250 276 292 300 336 348 352 372 380 428 438 440 442 470 492 498 499 528 578 616 620 642 643 674 688 703 705 724 744 752 756 804 807 826 831 832 833 900", "an": "010 074 239 260 334", "af": "012 024 072 108 120 132 140 148 174 175 178 180 204 226 231 232 262 266 270 288 324 384 404 426 430 434 450 454 466 478 480 504 508 516 562 566 624 638 646 654 678 686 690 694 706 710 716 728 729 732 748 768 788 800 818 834 854 894 902", "oc": "016 036 090 184 242 258 296 316 520 540 548 554 570 574 580 583 584 585 598 612 772 776 798 876 882", "na": "028 044 052 060 084 092 124 136 188 192 212 214 222 304 308 312 320 332 340 388 474 484 500 531 533 534 535 558 581 591 630 652 659 660 662 663 666 670 780 796 840 850", "sa": "032 068 076 152 170 218 238 254 328 600 604 740 858 862"};
var SHORT={af:'africa',an:'antarctica',as:'asia',eu:'europe',na:'north-america',oc:'oceania',sa:'south-america'};
var BY={};Object.keys(M49).forEach(function(k){M49[k].split(' ').forEach(function(c){BY[c]=SHORT[k];});});
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function post(path,body){var t=tok();if(!t)return Promise.resolve(null);return fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(body||{})}).then(function(r){return r.json().catch(function(){return null;});}).catch(function(){return null;});}
function counts(){var d;try{d=JSON.parse(localStorage.getItem('tllStates')||'null');}catch(e){d=null;}if(!d||!d.states)return null;
  var people=(d.travelers||[]).filter(function(t){return t&&!t.pet;}).map(function(t){return t.id;});
  var out={africa:0,antarctica:0,asia:0,europe:0,'north-america':0,oceania:0,'south-america':0};
  Object.keys(d.states).forEach(function(code){var s=d.states[code]||{},k=BY[code];if(!k)return;
    var hit=Object.keys(s).some(function(id){return (!people.length||people.indexOf(id)>-1)&&(s[id]==='lived'||s[id]==='visited');});if(hit&&out[k]<80)out[k]++;});
  return out;}
if(P==='/the-map'&&!window.__tllAlbumCounts){window.__tllAlbumCounts=1;var f0=window.fetch;
  window.fetch=function(u,o){var p=f0.apply(this,arguments);try{if(String(u).indexOf('/map-snapshot')>-1&&o&&String(o.method).toUpperCase()==='POST')p.then(function(r){if(r&&r.ok){var c=counts();if(c)post('/album/settings',{counts:c});}}).catch(function(){});}catch(e){}return p;};}
var OPTS=[['seven','7 continents','North and South America apart, as taught in the US, UK, China and India'],['americas','6 continents, one America','As taught across Latin America, Spain, Portugal, France, Italy and Greece'],['eurasia','6 continents, with Eurasia','Europe and Asia as one, as taught in Russia and parts of Eastern Europe'],['olympic','5 continents, the Olympic rings','The five inhabited continents, America as one, no Antarctica']];
function suggest(){var l=(navigator.language||'en').toLowerCase().slice(0,2);if(['es','pt','fr','it','el','ro','ca'].indexOf(l)>-1)return'americas';if(['ru','be','kk','uk'].indexOf(l)>-1)return'eurasia';return'seven';}
function editProfile(){
  var anchor=document.getElementById('tll-st')||document.getElementById('tll-col')||document.getElementById('ep-crew');if(!anchor||document.getElementById('tll-alb-set'))return;
  post('/crew/inbox').then(function(me){if(!me||!me.ok||!me.me||document.getElementById('tll-alb-set'))return null;
    return fetch(API+'/album?slug='+encodeURIComponent(me.me.slug)).then(function(r){return r.ok?r.json():{};}).catch(function(){return{};});}).then(function(a){
    if(!a||document.getElementById('tll-alb-set'))return;
    var saved=a.model&&a.mapCounts!==undefined?a.model:null,cur=saved||a.model||'seven',sug=suggest();
    var sec=document.createElement('section');sec.className='ep-sec';sec.id='tll-alb-set';
    sec.innerHTML='<h2 class="ep-eb">05D · Your album</h2><p class="ep-lede">How do you count continents? It depends where you learned it. Your album groups its slides your way.</p>';
    var box=document.createElement('div');box.setAttribute('role','radiogroup');box.setAttribute('aria-label','How you count continents');box.style.cssText='display:grid;gap:8px;margin:8px 0';
    var msg=document.createElement('p');msg.setAttribute('aria-live','polite');msg.style.cssText='font-size:13px;color:#5F5A54;margin:6px 0';
    OPTS.forEach(function(o){var l=document.createElement('label');l.style.cssText='display:flex;gap:10px;align-items:flex-start;border:1px solid #E0DACE;border-radius:6px;padding:10px 12px;background:#fff;cursor:pointer;font:400 15px/1.4 "IBM Plex Sans Condensed",system-ui,sans-serif';
      var r=document.createElement('input');r.type='radio';r.name='tll-continents';r.value=o[0];r.checked=o[0]===cur;r.style.cssText='width:18px;height:18px;margin-top:2px;accent-color:#C8325B';
      var t=document.createElement('span');t.innerHTML='<b></b><br><small style="color:#5F5A54"></small>';t.querySelector('b').textContent=o[1]+(o[0]===sug&&o[0]!==cur?' (suggested for your language)':'');t.querySelector('small').textContent=o[2];
      r.addEventListener('change',function(){post('/album/settings',{model:o[0]}).then(function(x){msg.textContent=x&&x.ok?'Saved. Your album now shows '+o[1].toLowerCase()+'.':'That did not save. Try again.';});});
      l.appendChild(r);l.appendChild(t);box.appendChild(l);});
    sec.appendChild(box);sec.appendChild(msg);anchor.insertAdjacentElement('afterend',sec);
  });
}
if(P==='/edit-profile'){var go=function(){editProfile();};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(go,2200);});else setTimeout(go,2200);setTimeout(go,5000);}
})();
