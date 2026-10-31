/* tll-submit-gallery-v1 (29 Oct 2026; captions and placement added 31 Oct 2026, see below; tester Roberta Bianchi on /submit: "I could only upload one hero image and 1 gallery image.
   I could not select several images for the gallery" and "I would make the autosave part more clear.").
   STAGED: not in the published bundle until Nancy says yes.

   Why it happened: the gallery field (name photo-gallery) already allows several photos, but every new pick replaces the last one,
   and the page never shows what is chosen. Picking photos one at a time left only the last photo.

   What this does on /submit only, story form (form[data-tll-form="submit-story"]):
   1. Gallery: each pick is added to the photos already chosen (same photo twice is skipped), up to the limit in the field's label
      (12 today). A row of small previews with a Remove button on each, a count ("3 of 12 photos chosen") and an "Add more photos"
      button sit under the field. The field itself keeps its name; the chosen photos are put back into it, so the existing photo script
      (tllphotocleanv11) strips location data and uploads all of them on Send exactly as before. No new upload code.
   2. Cover photo: a preview and the line "This is your cover photo. Add more photos in the gallery below."
   3. Autosave line (from the footer script tll-form-steps-js-v2): readable 13px text instead of 10px mono, and plain wording.
      Before the first save: "Your words save as a draft every 20 seconds. Photos are added when you send."
      After each save: "Draft saved · 2:41 PM" plus where it is kept (this device, and your account when signed in).
      When a draft was brought back on load: "Draft restored from your last visit."
      Reads the existing draft key only to know a draft was restored; writes nothing new.
   Nothing removed; field names unchanged; no data-ms-* element touched. */
(function(){
if(!/^\/submit\/?$/.test(location.pathname))return;
var FORM='form[data-tll-form="submit-story"]';
var CSS=
".tll-sg{margin:10px 0 4px}"+
".tll-sg-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:10px;margin:0 0 10px;padding:0;list-style:none}"+
".tll-sg-row:empty{display:none}"+
".tll-sg-item{position:relative;margin:0;border:1px solid #E0DACE;border-radius:8px;overflow:hidden;background:#FBF7F0;aspect-ratio:1/1}"+
".tll-sg-item img{display:block;width:100%;height:100%;object-fit:cover}"+
".tll-sg-name{display:flex;align-items:center;justify-content:center;height:100%;padding:8px;box-sizing:border-box;font:400 12px/1.3 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#5F5A54;text-align:center;overflow-wrap:anywhere}"+
".tll-sg-rm{position:absolute;top:4px;right:4px;min-width:44px;min-height:32px;padding:0 10px;border:0;border-radius:999px;background:rgba(10,11,20,.82);color:#fff;font:600 12px/1 'IBM Plex Sans Condensed',system-ui,sans-serif;cursor:pointer}"+
".tll-sg-rm:focus-visible,.tll-sg-add:focus-visible{outline:3px solid #C8325B;outline-offset:2px}"+
".tll-sg-bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px}"+
".tll-sg-count{font:600 14px/1.4 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#0A0B14}"+
".tll-sg-add{min-height:44px;padding:0 18px;border:1.5px solid #0A0B14;border-radius:999px;background:#fff;color:#0A0B14;font:600 14px/1 'IBM Plex Sans Condensed',system-ui,sans-serif;cursor:pointer}"+
".tll-sg-add[hidden]{display:none}"+
".tll-sg-help{margin:6px 0 0;font:400 13px/1.45 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#5F5A54}"+
".tll-sg-note{margin:6px 0 0;font:400 13px/1.45 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#C8325B}"+
".tll-sg-note:empty{display:none}"+
".tll-sg-hero{display:flex;gap:12px;align-items:center;margin:10px 0 4px}"+
".tll-sg-hero[hidden]{display:none}"+
".tll-sg-hero .tll-sg-item{width:100%;aspect-ratio:16/9}"+
/* captions and placement (31 Oct 2026) */
".tll-cp{margin:12px 0 4px;padding:0;list-style:none;display:grid;gap:10px}.tll-cp:empty{display:none}"+
".tll-cp-h{margin:14px 0 4px;font:600 11px/1.4 'JetBrains Mono',ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase;color:#067A79}"+
".tll-cp li{display:grid;grid-template-columns:56px minmax(0,1fr);gap:6px 12px;align-items:start}"+
".tll-cp img,.tll-cp .tll-cp-x{grid-row:span 2;width:56px;height:56px;object-fit:cover;border-radius:6px;background:#FBF7F0;font:400 11px/1.2 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#5F5A54;overflow:hidden}"+
".tll-cp input,.tll-cp select,.tll-cap-cover{width:100%;min-height:44px;padding:8px 10px;border:1px solid #E0DACE;border-radius:4px;background:#FDF9F3;color:#0A0B14;font:400 15px/1.3 'IBM Plex Sans Condensed',system-ui,sans-serif;box-sizing:border-box}"+
".tll-cp label,.tll-cap-lab{display:block;font:600 13px/1.3 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#0A0B14}"+
".tll-cp small,.tll-cap-help{display:block;margin:2px 0 0;font:400 12px/1.4 'IBM Plex Sans Condensed',system-ui,sans-serif;color:#5F5A54}"+
/* autosave line */
"html body .tllst-save{font:400 13px/1.45 'IBM Plex Sans Condensed','Inter Tight',system-ui,sans-serif!important;letter-spacing:0!important;text-transform:none!important;color:#5F5A54!important;margin-top:10px!important}"+
"html body .tllst-save b{font-weight:600;color:#0A0B14}"+
"html body .tllst-save .tll-sg-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#067A79;margin-right:8px;vertical-align:1px}";

function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;}
function key(f){return [f.name,f.size].join('|');}   /* same name and size = same photo; pickers can give a fresh time on each pick */
var canSet=(function(){try{return typeof DataTransfer==='function'&&!!new DataTransfer().items;}catch(e){return false;}})();
function setFiles(inp,list){if(!canSet)return false;try{var dt=new DataTransfer();list.forEach(function(f){dt.items.add(f);});inp.files=dt.files;return true;}catch(e){return false;}}
function thumb(f,onRemove,label){
  var li=el('li','tll-sg-item');var url='';
  if(/^image\//.test(f.type)){url=URL.createObjectURL(f);var i=document.createElement('img');i.alt='';i.src=url;
    i.onerror=function(){i.remove();li.insertBefore(el('span','tll-sg-name',f.name),li.firstChild);};li.appendChild(i);}
  else li.appendChild(el('span','tll-sg-name',f.name));
  if(onRemove){var b=el('button','tll-sg-rm','Remove');b.type='button';b.setAttribute('aria-label','Remove '+(label||f.name));b.addEventListener('click',function(){if(url)URL.revokeObjectURL(url);onRemove();});li.appendChild(b);}
  li.__url=url;return li;
}
function clearRow(row){[].forEach.call(row.children,function(li){if(li.__url)URL.revokeObjectURL(li.__url);});row.textContent='';}

/* Captions and placement (31 Oct 2026, Roberta: "Could you add captions or choose where each photo sits?").
   Each gallery photo gets an optional caption (200 characters) and a "Where it goes" menu built from the headings the writer typed
   (a short line on its own with no closing punctuation), or "Gallery at the end". The choices travel in one hidden field,
   photo-plan, as JSON in gallery order: [{"n":1,"name":"IMG_2.jpg","caption":"...","after":"The Art of Arriving First"}].
   The cover photo gets a caption field, cover-caption. The builder copies them to the story's Photo placements row. */
var CAPMAX=200;
function headings(form){var b=form.querySelector('textarea[name="body"]');if(!b)return[];var seen={},out=[];
  String(b.value||'').split(/\n/).forEach(function(l){var t=l.trim();if(t.length<3||t.length>90||/[.!?…:;,"”')\]]$/.test(t)||t.split(/\s+/).length>14||seen[t])return;seen[t]=1;out.push(t);});return out;}
function planField(form){var h=form.querySelector('input[name="photo-plan"]');if(!h){h=document.createElement('input');h.type='hidden';h.name='photo-plan';h.setAttribute('data-name','photo-plan');form.appendChild(h);}return h;}
function gallery(form){
  var inp=form.querySelector('input[type="file"][name="photo-gallery"]');if(!inp||inp.__tllSg)return;inp.__tllSg=1;
  inp.multiple=true;
  var field=inp.closest('label')||inp;           /* the list sits outside the label so a tap on Remove never opens the picker */
  var lab=field.querySelector&&field.querySelector('.tll-pen-label');
  var m=lab&&/up to\s*(\d+)/i.exec(lab.textContent);var MAX=m?parseInt(m[1],10):12;
  var kept=[];
  var box=el('div','tll-sg');var row=el('ul','tll-sg-row');row.setAttribute('aria-label','Gallery photos chosen');
  var bar=el('div','tll-sg-bar');var count=el('span','tll-sg-count');count.setAttribute('aria-live','polite');
  var add=el('button','tll-sg-add','Add more photos');add.type='button';add.addEventListener('click',function(){inp.click();});
  bar.appendChild(count);bar.appendChild(add);
  var note=el('p','tll-sg-note');note.setAttribute('role','status');
  var help=el('p','tll-sg-help',canSet?'Pick several photos at once, or add more with another pick. They upload when you send.'
                                      :'Pick all your gallery photos at once: hold one photo, then tap the others. They upload when you send.');
  var capH=el('p','tll-cp-h','Captions and placement (optional)');capH.hidden=true;var plan=el('ul','tll-cp');var meta={};
  box.appendChild(row);box.appendChild(bar);box.appendChild(note);box.appendChild(help);box.appendChild(capH);box.appendChild(plan);
  field.parentNode.insertBefore(box,field.nextSibling);
  var hidden=planField(form);
  function save(){var out=[];kept.forEach(function(f,i){var m=meta[key(f)]||{};if((m.caption||'').trim()||(m.after&&m.after!=='gallery'))out.push({n:i+1,name:f.name,caption:(m.caption||'').trim().slice(0,CAPMAX),after:m.after&&m.after!=='gallery'?m.after:'gallery'});});hidden.value=out.length?JSON.stringify(out):'';}
  function fill(sel,cur){var hs=headings(form);sel.textContent='';var o=document.createElement('option');o.value='gallery';o.textContent='Gallery at the end';sel.appendChild(o);
    hs.forEach(function(h){var x=document.createElement('option');x.value=h;x.textContent='After: '+h;sel.appendChild(x);});
    if(cur&&cur!=='gallery'&&hs.indexOf(cur)<0){var y=document.createElement('option');y.value=cur;y.textContent='After: '+cur;sel.appendChild(y);}sel.value=cur||'gallery';}
  function renderPlan(){plan.textContent='';capH.hidden=!kept.length;
    kept.forEach(function(f,i){var k=key(f),m=meta[k]||(meta[k]={caption:'',after:'gallery'});var li=document.createElement('li');
      var th;if(/^image\//.test(f.type)){th=document.createElement('img');th.alt='';th.src=URL.createObjectURL(f);th.onload=function(){URL.revokeObjectURL(th.src);};}else th=el('span','tll-cp-x',f.name);li.appendChild(th);
      var id='tll-cp-'+i;var c=el('div');var lb=el('label',null,'Caption for photo '+(i+1));lb.setAttribute('for',id);var inp2=document.createElement('input');inp2.id=id;inp2.type='text';inp2.maxLength=CAPMAX;inp2.value=m.caption;inp2.placeholder='What are we looking at?';
      var cnt=el('small',null,'');function cc(){cnt.textContent=(inp2.value.length)+' of '+CAPMAX;}cc();inp2.addEventListener('input',function(){m.caption=inp2.value;cc();save();});c.appendChild(lb);c.appendChild(inp2);c.appendChild(cnt);li.appendChild(c);
      var d=el('div');var lb2=el('label',null,'Where it goes');lb2.setAttribute('for',id+'-w');var sel=document.createElement('select');sel.id=id+'-w';fill(sel,m.after);
      sel.addEventListener('focus',function(){fill(sel,m.after);});sel.addEventListener('change',function(){m.after=sel.value;save();});d.appendChild(lb2);d.appendChild(sel);li.appendChild(d);plan.appendChild(li);});
    save();}
  function render(){
    clearRow(row);
    kept.forEach(function(f,i){row.appendChild(thumb(f,function(){kept.splice(i,1);setFiles(inp,kept);note.textContent='';render();},'photo '+(i+1)+' of '+kept.length+', '+f.name));});
    count.textContent=kept.length?(kept.length+' of '+MAX+' photo'+(MAX===1?'':'s')+' chosen'):'No gallery photos yet';
    add.textContent=kept.length?'Add more photos':'Choose photos';
    add.hidden=!canSet||kept.length>=MAX;
    renderPlan();
  }
  inp.addEventListener('change',function(){
    var picked=[].slice.call(inp.files||[]);
    if(!canSet){kept=picked.slice(0,MAX);note.textContent=picked.length>MAX?'Only the first '+MAX+' photos are kept.':'';render();return;}
    if(!picked.length){setFiles(inp,kept);render();return;}   /* picker closed with nothing: keep what was chosen */
    var seen={};kept.forEach(function(f){seen[key(f)]=1;});
    var added=0,skipped=0,dropped=0;
    picked.forEach(function(f){if(seen[key(f)]){skipped++;return;}if(kept.length>=MAX){dropped++;return;}seen[key(f)]=1;kept.push(f);added++;});
    setFiles(inp,kept);
    note.textContent=dropped?('The gallery holds '+MAX+' photos. '+dropped+' photo'+(dropped===1?' was':'s were')+' not added.'):(skipped&&!added?'That photo is already in the gallery.':'');
    render();
  });
  render();
}

function hero(form){
  var inp=form.querySelector('input[type="file"][name="hero-image"]');if(!inp||inp.__tllSg)return;inp.__tllSg=1;
  var field=inp.closest('label')||inp;
  var box=el('div','tll-sg-hero');box.hidden=true;var row=el('ul','tll-sg-row');row.style.cssText='margin:0;display:block;flex:0 0 120px;width:120px';
  var txt=el('p','tll-sg-help','This is your cover photo. Add more photos in the gallery below.');txt.style.margin='0';
  var wrap=el('div');wrap.appendChild(txt);
  if(!form.querySelector('input[name="cover-caption"]')){var cl=el('label','tll-cap-lab','Cover caption (optional)');cl.setAttribute('for','tll-cap-cover');cl.style.marginTop='8px';
    var ci=document.createElement('input');ci.type='text';ci.id='tll-cap-cover';ci.name='cover-caption';ci.setAttribute('data-name','cover-caption');ci.className='tll-cap-cover';ci.maxLength=CAPMAX;ci.placeholder='What are we looking at?';
    var ch=el('small','tll-cap-help','0 of '+CAPMAX);ci.addEventListener('input',function(){ch.textContent=ci.value.length+' of '+CAPMAX;});wrap.appendChild(cl);wrap.appendChild(ci);wrap.appendChild(ch);}
  box.appendChild(row);box.appendChild(wrap);field.parentNode.insertBefore(box,field.nextSibling);
  inp.addEventListener('change',function(){clearRow(row);var f=inp.files&&inp.files[0];box.hidden=!f;if(f)row.appendChild(thumb(f,null));});
}

function autosaveLine(form){
  var s=form.querySelector('.tllst-save');if(!s||s.__tllSg)return;s.__tllSg=1;
  var member=false;
  try{var ms=window.$memberstackDom;if(ms&&ms.getCurrentMember)ms.getCurrentMember().then(function(r){member=!!(r&&r.data);}).catch(function(){});}catch(e){}
  var restored=false;try{restored=!!localStorage.getItem('tllStoryDraft');}catch(e){}
  function put(html){s.__tllBusy=1;s.innerHTML=html;s.__tllBusy=0;}
  var idle=(restored?'<span class="tll-sg-dot" aria-hidden="true"></span><b>Draft restored from your last visit.</b> ':'')+
           'Your words save as a draft every 20 seconds. Photos are added when you send.';
  function rewrite(){
    if(s.__tllBusy)return;
    var t=s.textContent||'';var m=/^Draft saved (\d{1,2}):(\d{2})/.exec(t);
    if(m){var h=parseInt(m[1],10),ap=h>=12?'PM':'AM';h=h%12||12;
      put('<span class="tll-sg-dot" aria-hidden="true"></span><b>Draft saved · '+h+':'+m[2]+' '+ap+'</b>. Kept on this device'+(member?' and in your account':'')+'. Photos are added when you send.');}
    else if(!t.trim())put(idle);
  }
  new MutationObserver(rewrite).observe(s,{childList:true,characterData:true,subtree:true});
  rewrite();
}

function run(){
  var form=document.querySelector(FORM);if(!form)return;
  if(!document.getElementById('tll-submit-gallery-v1')){var st=document.createElement('style');st.id='tll-submit-gallery-v1';st.textContent=CSS;(document.head||document.documentElement).appendChild(st);}
  gallery(form);hero(form);autosaveLine(form);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
setTimeout(run,1200);setTimeout(run,3000);
})();
