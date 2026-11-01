/* tll-export-v1 (31 Oct 2026, Value Playbook Phase 4: "Download everything"; 1 Nov 2026, Phase 1B: two steps, sized for the Workers
   Free plan). /account only, signed-in members. Step one: the button asks the Worker to prepare the member's copy (POST /export/prepare,
   with the full map from this browser or the member's account), then follows the link it returns (GET /export/zip?t=...): a plain file
   download of the records (README, profile, every story as its own readable page, drafts included, collections and stamps as JSON and
   CSV, pets, companions, the map, and photos/index.html plus photos/photos.csv listing every photo with its link). No photo bytes pass
   through the Worker, which keeps it inside the Free plan's CPU and subrequest limits. Step two, when the member has photos: "Download
   your photos" fetches them four at a time through GET /export/photo?t=&u= (the same token, a same-policy, CORS-safe source, which is
   what iPhone Safari needed: building the zip from cross-origin fetches failed there with "Load failed"), packs them with JSZip in
   parts of 25 photos or about 80 MB and saves each part as soon as it is done, so memory stays small. A photo that will not download
   is listed in photos/not-downloaded.txt in the last part, never silently lost. JSZip 3.10.1 loads from cdnjs only when that button
   is pressed. Card states (data-state): idle, preparing, ready, photos, done, error. No data-ms-* element touched. */
(function(){
if((location.pathname.replace(/\/+$/,'')||'/')!=='/account')return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/export';
var JSZIP='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
var LINK_MS=15*60*1000,MAX_MAP_BYTES=190*1024,PART_PHOTOS=25,PART_BYTES=80*1024*1024,WORKERS=4,REVOKE_MS=60000;
var CSS='.tll-exp{max-width:760px;margin:24px auto;padding:16px 18px;border:1px solid #E0DACE;border-radius:4px;background:#fff;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-exp-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 6px}'+
'.tll-exp h3{font:800 22px/1.2 "Playfair Display",Georgia,serif;margin:0 0 6px}.tll-exp p{margin:0 0 12px;color:#3a3833}'+
'.tll-exp button{border:0;background:#C8325B;color:#fff;border-radius:4px;min-height:44px;padding:0 18px;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer}.tll-exp button[disabled]{opacity:.6;cursor:wait}'+
'.tll-exp-msg{font-size:13px;color:#5F5A54;margin:8px 0 0}.tll-exp-msg a{color:#067A79;text-decoration:underline}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function lib(){return window.JSZip?Promise.resolve(window.JSZip):new Promise(function(res,rej){var s=document.createElement('script');s.src=JSZIP;s.crossOrigin='anonymous';s.onload=function(){res(window.JSZip);};s.onerror=rej;document.head.appendChild(s);});}
function mapData(){var local=null;try{local=JSON.parse(localStorage.getItem('tllStates')||'null');}catch(e){}if(local)return Promise.resolve(local);
  var ms=window.$memberstackDom;if(!ms||!ms.getMemberJSON)return Promise.resolve(null);return ms.getMemberJSON().then(function(j){var d=j&&j.data||{};return d.tllStates||null;}).catch(function(){return null;});}
function ext(type,url){if(/png/.test(type))return'png';if(/webp/.test(type))return'webp';if(/gif/.test(type))return'gif';var m=/\.(jpe?g|png|webp|gif)(\?|$)/i.exec(url||'');return m?m[1].toLowerCase().replace('jpeg','jpg'):'jpg';}
function run(){
  if(document.getElementById('tll-exp')||!tok())return;
  var box=el('section','tll-exp');box.id='tll-exp';box.appendChild(el('p','tll-exp-k','Your copy'));box.appendChild(el('h3','','Download everything'));
  box.appendChild(el('p','','Your stories, photos, collections, stamps and map in one zip file. Yours to keep, whatever happens to any app.'));
  var b=el('button','','Download everything');b.type='button';var msg=el('p','tll-exp-msg');msg.setAttribute('aria-live','polite');box.appendChild(b);box.appendChild(msg);
  /* Step two, shown once the records link is followed and only when there are photos. */
  var pb=el('button','','Download your photos');pb.type='button';pb.hidden=true;var pmsg=el('p','tll-exp-msg');pmsg.setAttribute('aria-live','polite');box.appendChild(pb);box.appendChild(pmsg);
  var url='',token='',photos=[],stories=0,packed=0,timer=null;
  function state(){return box.getAttribute('data-state');}
  /* The same link again, for a browser that swallowed the first navigation. */
  function again(){var a=el('a','','tap here');a.href=url;a.addEventListener('click',function(ev){ev.preventDefault();window.location.assign(url);});return a;}
  function line(node,text,withLink){node.textContent='';if(text)node.appendChild(document.createTextNode(text));
    if(withLink&&url){node.appendChild(document.createTextNode(' If nothing happened, '));node.appendChild(again());node.appendChild(document.createTextNode('. The link works for 15 minutes.'));}}
  function set(s){box.setAttribute('data-state',s);b.disabled=s==='preparing'||s==='photos';pb.disabled=s==='photos';pb.hidden=!(url&&photos.length);}
  function reset(){clearTimeout(timer);timer=null;url='';token='';photos=[];line(msg,'');line(pmsg,'');set('idle');}
  /* The link and the token end after 15 minutes; a photo step still running is left to finish first. */
  function expire(){if(state()==='photos'){timer=setTimeout(expire,60000);return;}reset();}
  reset();
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
      try{window.gtag&&gtag('event','download_complete',{division:'tll',photos:packed});}catch(e){}
      set('ready');line(msg,'Your copy is on its way.',true);
      timer=setTimeout(expire,LINK_MS);
    }).catch(function(e){reset();set('error');line(msg,(e&&e.fromWorker&&e.message)||'The download did not finish. Try again.');});
  });
  /* Step two: every photo through the Worker's proxy, four at a time, packed in parts and saved as each part is done. */
  pb.addEventListener('click',function(){
    if(!url||!photos.length||state()==='photos')return;
    set('photos');var list=photos.slice(),total=list.length,missing=[],done=0,okCount=0,partNo=0,parts=0;line(pmsg,'Photos 0 of '+total+'…');
    lib().then(function(Z){
      var zip=new Z(),count=0,bytes=0,packing=Promise.resolve();
      function save(blob,name){var a=el('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},REVOKE_MS);}
      /* Takes the current part off the table at once (a new one starts) and packs it after any earlier part is done. */
      function pack(last){var z=zip,n=++partNo;zip=new Z();count=0;bytes=0;
        if(last&&missing.length)z.file('that-layover-life/photos/not-downloaded.txt','These photos could not be downloaded, so here are their links:\n'+missing.join('\n')+'\n');
        packing=packing.then(function(){return z.generateAsync({type:'blob'});}).then(function(blob){parts++;save(blob,'that-layover-life-photos-part-'+n+'.zip');});return packing;}
      function add(p,blob){zip.file('that-layover-life/photos/'+p.folder+'/'+p.name+'.'+ext(blob.type,p.url),blob);count++;bytes+=blob.size;okCount++;
        if(count>=PART_PHOTOS||bytes>=PART_BYTES)pack(false);}
      function one(p){return fetch(API+'/photo?t='+token+'&u='+encodeURIComponent(p.url)).then(function(r){if(!r.ok)throw 0;return r.blob();})
        .then(function(blob){add(p,blob);},function(){missing.push(p.folder+'/'+p.name+': '+p.url);})
        .then(function(){done++;line(pmsg,'Photos '+done+' of '+total+'…');});}
      /* A worker waits for a part being packed before it fetches the next photo, so at most one part and a few photos are in memory. */
      function next(){var p=list.shift();if(!p)return Promise.resolve();return packing.then(function(){return one(p);}).then(next);}
      var ws=[];for(var i=0;i<WORKERS;i++)ws.push(next());
      return Promise.all(ws).then(function(){return packing;}).then(function(){if(count||missing.length)return pack(true);});
    }).then(function(){packed=okCount;set('done');
      line(msg,'Done. '+stories+(stories===1?' story, ':' stories, ')+okCount+(okCount===1?' photo':' photos')+(missing.length?' ('+missing.length+' listed as links)':'')+'.');
      line(pmsg,okCount?okCount+(okCount===1?' photo in ':' photos in ')+parts+(parts===1?' part.':' parts.'):'');
    }).catch(function(){set('error');line(pmsg,'The download did not finish. Try again.');});
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
