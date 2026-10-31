/* tll-export-v1 (31 Oct 2026, Value Playbook Phase 4: "Download everything"). /account only, signed-in members.
   One button builds a zip in the browser: README, profile, every story (each as its own readable page, drafts included), collections
   and stamps (JSON and a spreadsheet-friendly CSV), pets, companions, the map (the full saved map from this browser or the member's
   account, plus the summary) and every photo, in folders. The Worker (POST /export) sends only the member's own records; photos are
   fetched straight from where they live. A photo that will not download is listed in photos/not-downloaded.txt, never silently lost.
   JSZip 3.10.1 loads from cdnjs only when the button is pressed. No data-ms-* element touched. */
(function(){
if((location.pathname.replace(/\/+$/,'')||'/')!=='/account')return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/export';
var JSZIP='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
var CSS='.tll-exp{max-width:760px;margin:24px auto;padding:16px 18px;border:1px solid #E0DACE;border-radius:4px;background:#fff;font:400 15px/1.5 "IBM Plex Sans Condensed",system-ui,sans-serif;color:#0A0B14}'+
'.tll-exp-k{font:600 11px/1.4 "JetBrains Mono",ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79;margin:0 0 6px}'+
'.tll-exp h3{font:800 22px/1.2 "Playfair Display",Georgia,serif;margin:0 0 6px}.tll-exp p{margin:0 0 12px;color:#3a3833}'+
'.tll-exp button{border:0;background:#C8325B;color:#fff;border-radius:4px;min-height:44px;padding:0 18px;font:600 15px/1 "IBM Plex Sans Condensed",sans-serif;cursor:pointer}.tll-exp button[disabled]{opacity:.6;cursor:wait}'+
'.tll-exp-msg{font-size:13px;color:#5F5A54;margin:8px 0 0}';
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function tok(){try{var ms=window.$memberstackDom;return ms&&ms.getMemberCookie?ms.getMemberCookie():'';}catch(e){return'';}}
function lib(){return window.JSZip?Promise.resolve(window.JSZip):new Promise(function(res,rej){var s=document.createElement('script');s.src=JSZIP;s.crossOrigin='anonymous';s.onload=function(){res(window.JSZip);};s.onerror=rej;document.head.appendChild(s);});}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function csv(rows,cols){var q=function(v){v=v==null?'':Array.isArray(v)?v.join(' '):String(v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;};return cols.join(',')+'\n'+rows.map(function(r){return cols.map(function(c){return q(r[c]);}).join(',');}).join('\n')+'\n';}
function storyPage(s){return '<!doctype html><meta charset="utf-8"><title>'+esc(s.title)+'</title><style>body{max-width:680px;margin:40px auto;padding:0 16px;font:17px/1.6 Georgia,serif;color:#0A0B14}small{color:#5F5A54}</style>'+
  '<h1>'+esc(s.title)+'</h1><p><small>'+esc([s.place,s.trip,s.status==='draft'?'Draft':''].filter(Boolean).join(' · '))+'</small></p>'+(s.excerpt?'<p><em>'+esc(s.excerpt)+'</em></p>':'')+(s.body||'')+(s.signOff?'<p>'+esc(s.signOff)+'</p>':'')+
  (s.link?'<p><small>Online: <a href="'+esc(s.link)+'">'+esc(s.link)+'</a></small></p>':'')+(s.externalUrl?'<p><small>Published at: <a href="'+esc(s.externalUrl)+'">'+esc(s.externalUrl)+'</a></small></p>':'');}
function mapData(){var local=null;try{local=JSON.parse(localStorage.getItem('tllStates')||'null');}catch(e){}if(local)return Promise.resolve(local);
  var ms=window.$memberstackDom;if(!ms||!ms.getMemberJSON)return Promise.resolve(null);return ms.getMemberJSON().then(function(j){var d=j&&j.data||{};return d.tllStates||null;}).catch(function(){return null;});}
function ext(type,url){if(/png/.test(type))return'png';if(/webp/.test(type))return'webp';if(/gif/.test(type))return'gif';var m=/\.(jpe?g|png|webp|gif)(\?|$)/i.exec(url||'');return m?m[1].toLowerCase().replace('jpeg','jpg'):'jpg';}
function run(){
  if(document.getElementById('tll-exp')||!tok())return;
  var box=el('section','tll-exp');box.id='tll-exp';box.appendChild(el('p','tll-exp-k','Your copy'));box.appendChild(el('h3','','Download everything'));
  box.appendChild(el('p','','Your stories, photos, collections, stamps and map in one zip file. Yours to keep, whatever happens to any app.'));
  var b=el('button','','Download everything');b.type='button';var msg=el('p','tll-exp-msg');msg.setAttribute('aria-live','polite');box.appendChild(b);box.appendChild(msg);
  b.addEventListener('click',function(){b.disabled=true;msg.textContent='Gathering your stories and records…';
    try{window.gtag&&gtag('event','download_everything',{division:'tll'});}catch(e){}
    Promise.all([lib(),fetch(API,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tok()},body:'{}'}).then(function(r){return r.json();}),mapData()]).then(function(v){
      var Z=v[0],d=v[1],map=v[2];if(!d||!d.ok)throw new Error((d&&d.error)||'The download could not start.');
      var zip=new Z(),root=zip.folder('that-layover-life');
      root.file('README.txt','That Layover Life: your copy\nExported '+d.exportedAt+'\nProfile: '+d.profileLink+'\n\nInside:\n- profile.json: your profile as it is saved\n- stories/: each story as a page you can open in any browser, plus stories.json\n- collections.csv and stamps.csv: open in Excel, Numbers or Google Sheets (JSON copies too)\n- pets.json, companions.json\n- map/: my-map.json (your full map, every country and how you know it) and map-summary.json\n- photos/: every photo, in folders by story, collection, stamp and pet\n\nPrivate collections and stamps are included: this copy is only for you.\n');
      root.file('profile.json',JSON.stringify(d.profile,null,2));
      var st=root.folder('stories');st.file('stories.json',JSON.stringify(d.stories,null,2));d.stories.forEach(function(s){st.file(s.slug+'.html',storyPage(s));});
      root.file('collections.json',JSON.stringify(d.collections,null,2));root.file('collections.csv',csv(d.collections,['collection','country','city','year','caption','shownOnProfile','photos']));
      root.file('stamps.json',JSON.stringify(d.stamps,null,2));root.file('stamps.csv',csv(d.stamps,['pursuit','what','country','city','month','year','shownOnProfile','photo']));
      root.file('pets.json',JSON.stringify(d.pets,null,2));root.file('companions.json',JSON.stringify(d.companions,null,2));
      var mf=root.folder('map');mf.file('map-summary.json',JSON.stringify(d.mapSummary,null,2));if(map)mf.file('my-map.json',JSON.stringify(map,null,2));
      var ph=root.folder('photos'),missing=[],done=0,list=d.photos||[];
      var one=function(p){return fetch(p.url,{mode:'cors'}).then(function(r){if(!r.ok)throw 0;return r.blob();}).then(function(blob){ph.file(p.folder+'/'+p.name+'.'+ext(blob.type,p.url),blob);})
        .catch(function(){missing.push(p.folder+'/'+p.name+': '+p.url);}).then(function(){done++;msg.textContent='Photos '+done+' of '+list.length+'…';});};
      var queue=list.slice(),workers=[0,1,2,3].map(function(){return (function next(){var p=queue.shift();return p?one(p).then(next):Promise.resolve();})();});
      return Promise.all(workers).then(function(){if(missing.length)ph.file('not-downloaded.txt','These photos could not be downloaded, so here are their links:\n'+missing.join('\n')+'\n');
        msg.textContent='Packing the zip…';return zip.generateAsync({type:'blob'});}).then(function(blob){
        var a=el('a');a.href=URL.createObjectURL(blob);a.download='that-layover-life-'+((d.profile&&d.profile.slug)||'me')+'-'+d.exportedAt.slice(0,10)+'.zip';document.body.appendChild(a);a.click();
        setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},4000);b.disabled=false;
        msg.textContent='Done. '+d.stories.length+(d.stories.length===1?' story, ':' stories, ')+(list.length-missing.length)+((list.length-missing.length)===1?' photo':' photos')+(missing.length?' ('+missing.length+' listed as links)':'')+'.';});
    }).catch(function(e){b.disabled=false;msg.textContent=(e&&e.message)||'The download did not finish. Try again.';});
  });
  var main=document.querySelector('main')||document.body,h=main.querySelector('h1'),an=h&&(h.closest('section')||h.parentElement);
  var after=document.getElementById('tll-wn')||document.getElementById('tll-crew-inbox');
  if(after)after.insertAdjacentElement('afterend',box);else if(an&&an.parentNode)an.parentNode.insertBefore(box,an.nextSibling);else main.appendChild(box);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,1600);});else setTimeout(run,1600);
})();
