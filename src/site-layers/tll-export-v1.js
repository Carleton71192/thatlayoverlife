/* tll-export-v1 (31 Oct 2026, Value Playbook Phase 4: "Download everything"; 1 Nov 2026, Phase 1B: two steps, sized for the Workers
   Free plan). /account only, signed-in members. Step one: the button asks the Worker to prepare the member's copy (POST /export/prepare,
   with the full map from this browser or the member's account), then follows the link it returns (GET /export/zip?t=...): a plain file
   download of the records (README, profile, every story as its own readable page, drafts included, collections and stamps as JSON and
   CSV, pets, companions, the map, and photos/index.html plus photos/photos.csv listing every photo with its link). No photo bytes pass
   through the Worker, which keeps it inside the Free plan's CPU and subrequest limits. Step two, when the member has photos: "Download
   your photos" fetches them four at a time through GET /export/photo?t=&u= (the same token, which the proxy honors for 60 minutes; a
   same-policy, CORS-safe source, which is what iPhone Safari needed: building the zip from cross-origin fetches failed there with
   "Load failed") and packs them with JSZip in parts of 25 photos or about 80 MB. Every part, the first included, saves only on its own
   "Save part N of K" tap: a browser allows one download per tap, holds a second behind a permission prompt (Chrome, Edge) or drops it
   (iOS Safari), and the tap that started the step is spent by the time part 1 is packed. While a part waits for its tap nothing more
   is fetched, so at most one part and a few photos are in memory, and the done line only appears once every part is saved. K is an
   estimate: this part, plus the photos still to come divided by how many fit in a part (25, or fewer when the average photo so far
   says a part fills by bytes first), so it holds steady instead of growing by one at every part. File names inside the parts are
   kept apart the way the Worker's writeExportZip keeps them (photo.jpg, photo-2.jpg, photo-3.jpg), counted per run. The records link
   ("tap here") is hidden while the photo step runs and shown again when it ends or fails. Each photo fetch gets 90 s; a photo that
   times out or fails is listed in photos/not-downloaded.txt in the last part, never silently lost, and a fatal error (JSZip missing,
   packing failed) stops the run so a worker still in flight cannot write over the error line. JSZip 3.10.1 loads from cdnjs only when
   the photo button is pressed and gets 60 s to arrive; past that its script element is removed, the fallback line shows and the
   buttons free up. The link ends after 15 minutes: a ready card goes back to idle, a done or error card keeps its lines and loses only
   the link and the photo button, and a photo step still running is left to finish first. The card CSS is added once by css(); the
   31 Oct version defined it and never added it, so the card rendered in the page's defaults. Message lines are hidden while empty.
   Card states (data-state): idle, preparing, ready, photos, done, error. No data-ms-* element touched. */
(function(){
if((location.pathname.replace(/\/+$/,'')||'/')!=='/account')return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/export';
var JSZIP='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
var LINK_MS=15*60*1000,RECHECK_MS=60*1000,PHOTO_MS=90*1000,LIB_MS=60*1000,MAX_MAP_BYTES=190*1024,PART_PHOTOS=25,PART_BYTES=80*1024*1024,WORKERS=4,REVOKE_MS=60000;
var CSS='.tll-exp{max-width:760px;margin:24px auto;padding:16px 18px;border:1px solid #E0DACE;border-radius:4px;background:#fff;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-exp [hidden]{display:none!important}'+
'.tll-exp-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 6px}'+
'.tll-exp h3{font:800 22px/1.2 "Playfair Display",Georgia,serif;margin:0 0 6px}.tll-exp p{margin:0 0 12px;color:#3a3833}'+
'.tll-exp button{border:0;background:#C8325B;color:#fff;border-radius:4px;min-height:44px;padding:0 18px;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer}.tll-exp button[disabled]{opacity:.6;cursor:wait}'+
/* Two classes, so the message rule beats ".tll-exp p" above: the lines keep their smaller size and gray, and a button after one sits 12 px below it. */
'.tll-exp .tll-exp-msg{font-size:13px;color:#5F5A54;margin:8px 0 0}.tll-exp .tll-exp-msg a{color:#067A79;text-decoration:underline}.tll-exp .tll-exp-msg+button{margin-top:12px}';
function css(){if(document.getElementById('tll-export-v1'))return;var s=document.createElement('style');s.id='tll-export-v1';s.textContent=CSS;document.head.appendChild(s);}
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
/* JSZip on demand, with 60 s to arrive: a script that never answers is removed, so the step fails cleanly and can be tried again. */
function lib(){if(window.JSZip)return Promise.resolve(window.JSZip);return new Promise(function(res,rej){var s=document.createElement('script'),t=setTimeout(fail,LIB_MS);
  function fail(){clearTimeout(t);s.onload=s.onerror=null;s.remove();rej(new Error('JSZip did not load.'));}
  s.src=JSZIP;s.crossOrigin='anonymous';s.onload=function(){clearTimeout(t);res(window.JSZip);};s.onerror=fail;document.head.appendChild(s);});}
function mapData(){var local=null;try{local=JSON.parse(localStorage.getItem('tllStates')||'null');}catch(e){}if(local)return Promise.resolve(local);
  var ms=window.$memberstackDom;if(!ms||!ms.getMemberJSON)return Promise.resolve(null);return ms.getMemberJSON().then(function(j){var d=j&&j.data||{};return d.tllStates||null;}).catch(function(){return null;});}
function ext(type,url){if(/png/.test(type))return'png';if(/webp/.test(type))return'webp';if(/gif/.test(type))return'gif';var m=/\.(jpe?g|png|webp|gif)(\?|$)/i.exec(url||'');return m?m[1].toLowerCase().replace('jpeg','jpg'):'jpg';}
function run(){
  if(document.getElementById('tll-exp')||!tok())return;
  css();
  var box=el('section','tll-exp');box.id='tll-exp';box.appendChild(el('p','tll-exp-k','Your copy'));box.appendChild(el('h3','','Download everything'));
  box.appendChild(el('p','','Your stories, photos, collections, stamps and map in one zip file. Yours to keep, whatever happens to any app.'));
  var b=el('button','','Download everything');b.type='button';var msg=el('p','tll-exp-msg');msg.setAttribute('aria-live','polite');box.appendChild(b);box.appendChild(msg);
  /* Step two, shown once the records link is followed and only when there are photos; the save button shows while a part waits for its tap. */
  var pb=el('button','','Download your photos');pb.type='button';pb.hidden=true;var pmsg=el('p','tll-exp-msg');pmsg.setAttribute('aria-live','polite');
  var sb=el('button','','');sb.type='button';sb.hidden=true;box.appendChild(pb);box.appendChild(pmsg);box.appendChild(sb);
  var url='',token='',photos=[],stories=0,timer=null,pending=null;
  function state(){return box.getAttribute('data-state');}
  /* The same link again, for a browser that swallowed the first navigation. */
  function again(){var a=el('a','','tap here');a.href=url;a.addEventListener('click',function(ev){ev.preventDefault();window.location.assign(url);});return a;}
  /* A message line; an empty one is hidden so the card holds no blank space. The link part sits in its own span, so it can be hidden on its own. */
  function line(node,text,withLink){node.textContent='';if(text)node.appendChild(document.createTextNode(text));
    if(withLink&&url){var sp=el('span','tll-exp-again');sp.appendChild(document.createTextNode(' If nothing happened, '));sp.appendChild(again());sp.appendChild(document.createTextNode('. The link works for 15 minutes.'));node.appendChild(sp);}
    node.hidden=!node.childNodes.length;}
  /* What the link allows right now: the tap-here link while the records step is the one in view, the photo button while there are photos. */
  function links(){var sp=msg.querySelector('.tll-exp-again');if(sp)sp.hidden=!url||state()==='photos';pb.hidden=!(url&&photos.length);}
  function set(s){box.setAttribute('data-state',s);b.disabled=s==='preparing'||s==='photos';pb.disabled=s==='photos';links();}
  /* The save button for one part: the tap on it is the gesture the browser wants for every download. */
  function offer(text,fn){pending=fn;sb.textContent=text;sb.hidden=false;}
  function withdraw(){pending=null;sb.hidden=true;}
  function reset(){clearTimeout(timer);timer=null;url='';token='';photos=[];withdraw();line(msg,'');line(pmsg,'');set('idle');}
  /* The link ends after 15 minutes. A photo step still running (or waiting for a tap) is left to finish first and looked at again later;
     a done or error card keeps its lines and loses only the link and the photo button; a ready card goes back to idle. */
  function expire(){var s=state();timer=null;if(s==='photos'){timer=setTimeout(expire,RECHECK_MS);return;}
    if(s==='done'||s==='error'){url='';token='';photos=[];links();return;}reset();}
  reset();
  sb.addEventListener('click',function(){var fn=pending;if(!fn)return;withdraw();fn();});
  b.addEventListener('click',function(){reset();set('preparing');line(msg,'Gathering your stories and records…');
    try{window.gtag&&gtag('event','download_everything',{division:'tll'});}catch(e){}
    mapData().then(function(map){var body={};
      /* The Worker takes the map up to 200 KB; a map is a few KB, so this only guards a broken save. */
      if(map&&map.v===2&&map.states&&JSON.stringify(map).length<=MAX_MAP_BYTES)body.states=map;
      return fetch(API+'/prepare',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tok()},body:JSON.stringify(body)});
    }).then(function(r){return r.json().catch(function(){return {};});}).then(function(d){
      if(!d||!d.ok||!d.url){var err=new Error((d&&d.error)||'');err.fromWorker=!!(d&&d.error);throw err;}
      url=d.url;token=d.token||'';photos=Array.isArray(d.photoList)?d.photoList:[];stories=d.stories||0;
      window.location.assign(url);
      /* download_complete marks the records link being followed; the photo step reports itself with photos_complete. */
      try{window.gtag&&gtag('event','download_complete',{division:'tll'});}catch(e){}
      set('ready');line(msg,'Your copy is on its way.',true);
      timer=setTimeout(expire,LINK_MS);
    }).catch(function(e){reset();set('error');line(msg,(e&&e.fromWorker&&e.message)||'The download did not finish. Try again.');});
  });
  /* Step two: every photo through the Worker's proxy, four at a time, packed in parts; each part saves on its own tap. */
  pb.addEventListener('click',function(){
    if(!url||!photos.length||state()==='photos')return;
    set('photos');var list=photos.slice(),total=list.length,missing=[],done=0,okCount=0,allBytes=0,partNo=0,saved=0,stopped=false,live=[],used=Object.create(null);line(pmsg,'Photos 0 of '+total+'…');
    /* A fatal error stops the run: no more fetches, the ones in flight are cut off, and no worker writes another line. */
    function stop(){stopped=true;withdraw();live.splice(0).forEach(function(c){try{c.abort();}catch(e){}});}
    function progress(){if(!stopped&&!pending)line(pmsg,'Photos '+done+' of '+total+'…');}
    /* A file name not used yet in this run, the way the Worker's writeExportZip keeps names apart: photo.jpg, photo-2.jpg, photo-3.jpg. */
    function unique(name){var n=name,i=2;while(used[n]){n=name.replace(/(\.[^./]+)?$/,'-'+i+'$1');i++;}used[n]=true;return n;}
    /* How many photos fit in a part: 25, or fewer when the average photo so far fills the 80 MB first. */
    function perPart(){var avg=okCount?allBytes/okCount:0;return avg?Math.max(1,Math.min(PART_PHOTOS,Math.floor(PART_BYTES/avg))):PART_PHOTOS;}
    lib().then(function(Z){
      var zip=new Z(),count=0,bytes=0,packing=Promise.resolve();
      function save(blob,n){var a=el('a');a.href=URL.createObjectURL(blob);a.download='that-layover-life-photos-part-'+n+'.zip';document.body.appendChild(a);a.click();saved++;setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},REVOKE_MS);}
      /* Takes the current part off the table at once (a new one starts), packs it after any earlier part is saved, then waits for its own
         tap; every fetch behind it waits too. K is this part plus the parts the photos still to come should need. */
      function pack(last){var z=zip,n=++partNo,k=n+Math.ceil(Math.max(0,last?0:total-done-1)/perPart());zip=new Z();count=0;bytes=0;
        if(last&&missing.length)z.file('that-layover-life/photos/not-downloaded.txt','These photos could not be downloaded, so here are their links:\n'+missing.join('\n')+'\n');
        packing=packing.then(function(){return z.generateAsync({type:'blob'});}).then(function(blob){if(stopped)return;
          return new Promise(function(res){offer('Save part '+n+' of '+k,function(){save(blob,n);if(done<total)progress();res();});line(pmsg,'Part '+n+' of '+k+' is ready to save.');});});
        packing.catch(function(){});return packing;}
      function add(p,blob){zip.file(unique('that-layover-life/photos/'+p.folder+'/'+p.name+'.'+ext(blob.type,p.url)),blob);count++;bytes+=blob.size;allBytes+=blob.size;okCount++;
        if(count>=PART_PHOTOS||bytes>=PART_BYTES)pack(false);}
      /* One photo, with 90 s to arrive in full: a stalled body is cut off and the photo is listed as a link like any other failure. */
      function one(p){var c=window.AbortController?new AbortController():null,t=c?setTimeout(function(){c.abort();},PHOTO_MS):null;if(c)live.push(c);
        return fetch(API+'/photo?t='+token+'&u='+encodeURIComponent(p.url),c?{signal:c.signal}:{}).then(function(r){if(!r.ok)throw 0;return r.blob();})
          .then(function(blob){if(!stopped)add(p,blob);},function(){missing.push(p.folder+'/'+p.name+': '+p.url);})
          .then(function(){clearTimeout(t);var i=live.indexOf(c);if(i>=0)live.splice(i,1);if(stopped)return;done++;progress();});}
      /* A worker waits for a part being packed or saved before it fetches the next photo. */
      function next(){if(stopped)return Promise.resolve();var p=list.shift();if(!p)return Promise.resolve();return packing.then(function(){return one(p);}).then(next);}
      var ws=[];for(var i=0;i<WORKERS;i++)ws.push(next());
      return Promise.all(ws).then(function(){return packing;}).then(function(){if(count||missing.length)return pack(true);});
    }).then(function(){if(stopped)return;set('done');
      line(msg,'Done. '+stories+(stories===1?' story, ':' stories, ')+okCount+(okCount===1?' photo':' photos')+(missing.length?' ('+missing.length+' listed as links)':'')+'.');
      line(pmsg,okCount?okCount+(okCount===1?' photo in ':' photos in ')+saved+(saved===1?' part.':' parts.'):'');
      try{window.gtag&&gtag('event','photos_complete',{division:'tll',photos:okCount,parts:saved,links:missing.length});}catch(e){}
    }).catch(function(){stop();set('error');line(pmsg,'The download did not finish. Try again.');});
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
