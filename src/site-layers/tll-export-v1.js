/* tll-export-v1 (31 Oct 2026, Value Playbook Phase 4: "Download everything"; 1 Nov 2026, Phase 1B: the Worker makes the zip).
   /account only, signed-in members. One button asks the Worker to prepare the member's copy (POST /export/prepare, with the full
   map from this browser or the member's account), then follows the link it returns (GET /export/zip?t=...): a plain file download,
   which works on iPhone Safari where building the zip in the page failed ("Load failed") and a 100-photo zip could run out of
   memory. The zip holds README, profile, every story as its own readable page (drafts included), collections and stamps (JSON and
   a spreadsheet-friendly CSV), pets, companions, the map (full map plus summary) and every photo, in folders; a photo that will not
   download is listed in photos/not-downloaded.txt, never silently lost. The card has five states (data-state): idle, preparing,
   ready (the link, good for 15 minutes), error and done. No library loads. No data-ms-* element touched. */
(function(){
if((location.pathname.replace(/\/+$/,'')||'/')!=='/account')return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/export';
var LINK_MS=15*60*1000,DONE_AFTER_MS=5000,MAX_MAP_BYTES=190*1024;
var CSS='.tll-exp{max-width:760px;margin:24px auto;padding:16px 18px;border:1px solid #E0DACE;border-radius:4px;background:#fff;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-exp-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 6px}'+
'.tll-exp h3{font:800 22px/1.2 "Playfair Display",Georgia,serif;margin:0 0 6px}.tll-exp p{margin:0 0 12px;color:#3a3833}'+
'.tll-exp button{border:0;background:#C8325B;color:#fff;border-radius:4px;min-height:44px;padding:0 18px;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer}.tll-exp button[disabled]{opacity:.6;cursor:wait}'+
'.tll-exp-msg{font-size:13px;color:#5F5A54;margin:8px 0 0}.tll-exp-msg a{color:#067A79;text-decoration:underline}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function mapData(){var local=null;try{local=JSON.parse(localStorage.getItem('tllStates')||'null');}catch(e){}if(local)return Promise.resolve(local);
  var ms=window.$memberstackDom;if(!ms||!ms.getMemberJSON)return Promise.resolve(null);return ms.getMemberJSON().then(function(j){var d=j&&j.data||{};return d.tllStates||null;}).catch(function(){return null;});}
function run(){
  if(document.getElementById('tll-exp')||!tok())return;
  var box=el('section','tll-exp');box.id='tll-exp';box.appendChild(el('p','tll-exp-k','Your copy'));box.appendChild(el('h3','','Download everything'));
  box.appendChild(el('p','','Your stories, photos, collections, stamps and map in one zip file. Yours to keep, whatever happens to any app.'));
  var b=el('button','','Download everything');b.type='button';var msg=el('p','tll-exp-msg');msg.setAttribute('aria-live','polite');box.appendChild(b);box.appendChild(msg);
  var url='',timers=[];
  function stop(){timers.forEach(clearTimeout);timers=[];}
  /* The same link again, for a browser that swallowed the first navigation. */
  function again(){var a=el('a','','tap here');a.href=url;a.addEventListener('click',function(ev){ev.preventDefault();window.location.assign(url);});return a;}
  function set(state,text,withLink){box.setAttribute('data-state',state);msg.textContent='';if(text)msg.appendChild(document.createTextNode(text));
    if(withLink&&url){msg.appendChild(document.createTextNode(' If nothing happened, '));msg.appendChild(again());msg.appendChild(document.createTextNode('. The link works for 15 minutes.'));}
    b.disabled=state==='preparing'||state==='ready';}
  set('idle','');
  b.addEventListener('click',function(){stop();url='';set('preparing','Gathering your stories and records…');
    try{window.gtag&&gtag('event','download_everything',{division:'tll'});}catch(e){}
    mapData().then(function(map){var body={};
      /* The Worker takes the map up to 200 KB; a map is a few KB, so this only guards a broken save. */
      if(map&&map.v===2&&map.states&&JSON.stringify(map).length<=MAX_MAP_BYTES)body.states=map;
      return fetch(API+'/prepare',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tok()},body:JSON.stringify(body)});
    }).then(function(r){return r.json().catch(function(){return {};});}).then(function(d){
      if(!d||!d.ok||!d.url){var err=new Error((d&&d.error)||'');err.fromWorker=!!(d&&d.error);throw err;}
      url=d.url;window.location.assign(url);set('ready','Your download has started.',true);
      timers.push(setTimeout(function(){var n=d.stories||0,p=d.photos||0;
        set('done','Done. '+n+(n===1?' story, ':' stories, ')+p+(p===1?' photo.':' photos.'),true);
        try{window.gtag&&gtag('event','download_complete',{division:'tll',photos:p});}catch(e){}},DONE_AFTER_MS));
      timers.push(setTimeout(function(){url='';set('idle','');},LINK_MS));
    }).catch(function(e){url='';set('error',(e&&e.fromWorker&&e.message)||'That did not download. Not you, us. Try again?');});
  });
  /* Site owner only: the Paw Passport waitlist (the Worker answers 403 to everyone else, and nothing shows). */
  fetch(API.replace('/export','/paw/waitlist/export'),{method:'POST',headers:{Authorization:'Bearer '+tok()}}).then(function(r){if(r.status!==200)return;var n=r.headers.get('X-Count')||'0';return r.blob().then(function(blob){
    var p=el('p','tll-exp-msg'),a=el('a','','Download the CSV');a.href=URL.createObjectURL(blob);a.download='paw-passport-waitlist.csv';p.appendChild(document.createTextNode('Paw Passport waitlist: '+n+(n==='1'?' sign-up · ':' sign-ups · ')));p.appendChild(a);box.appendChild(p);});}).catch(function(){});
  var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);
  var after=document.getElementById('tll-wn')||document.getElementById('tll-crew-inbox');
  if(after)after.insertAdjacentElement('afterend',box);else if(an&&an.parentNode)an.parentNode.insertBefore(box,an.nextSibling);else main.appendChild(box);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1600);});else setTimeout(run,1600);
})();
