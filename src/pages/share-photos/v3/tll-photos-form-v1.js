/* tll-photos-form-v1 · /share-photos (proposal approved by Nancy 13 Oct 2026, "go with defaults").
   One progressive script for the Lounge upload form. Every step below is its own try block and is numbered after the
   script order in section 8 of the proposal; the row numbers are the change log in section 3. Every structural change is a
   runtime reorder of existing nodes (appendChild, insertBefore): no input, label, id, name, data-ms-* attribute or form
   attribute is removed, renamed or re-bound. Selection is by input name, data attribute and the unique ids only; the
   duplicated "field", "radio" and "checkbox" ids are never used. Memberstack is read once with getCurrentMember and never
   written. Without the script the page is the full form in Designer order with native validation. */
(function(){
  if(window.__tllPhotosForm) return; window.__tllPhotosForm='v1';
  var d=document;
  function el(tag,attrs,txt){var e=d.createElement(tag); if(attrs){for(var k in attrs){e.setAttribute(k,attrs[k]);}} if(txt!=null) e.textContent=txt; return e;}
  function after(ref,node){ ref.parentNode.insertBefore(node,ref.nextSibling); }
  /* the child of container that holds node (the label around an input, the row around a radio) */
  function topIn(node,container){ var n=node; while(n&&n.parentNode!==container) n=n.parentNode; return n; }
  function addRef(inp,attr,id){ var v=(inp.getAttribute(attr)||'').split(/\s+/).filter(Boolean); if(v.indexOf(id)<0){ v.push(id); inp.setAttribute(attr,v.join(' ')); } }
  function dropRef(inp,attr,id){ var v=(inp.getAttribute(attr)||'').split(/\s+/).filter(function(x){return x&&x!==id;}); if(v.length) inp.setAttribute(attr,v.join(' ')); else inp.removeAttribute(attr); }
  function val(i){ return i&&i.value ? i.value.trim() : ''; }

  function run(){
    var form=d.querySelector('form[data-tll-form="share-photos"]'); if(!form) return;
    function byName(n){ return form.querySelector('[name="'+n+'"]'); }

    /* refs, all anchored on input names */
    var photos=byName('photos'), country=byName('country'), city=byName('city'), year=byName('year'), trip=byName('trip-type'),
        caption=byName('caption'), pets=byName('pets-along'), named=form.querySelector('input[name="credit-mode"][value="named"]'),
        social=byName('syndication-social'), rotation=byName('syndication-rotation'), press=byName('syndication-press'),
        rights=byName('agree-rights'), licence=byName('agree-licence'), people=byName('agree-people'),
        submit=form.querySelector('input[type="submit"]');
    var photosFs=photos&&photos.closest('fieldset'), storyFs=country&&country.closest('fieldset'), petFs=pets&&pets.closest('fieldset'),
        creditFs=named&&named.closest('fieldset');
    var dropZone=photos&&topIn(photos,photosFs);                                  /* …8688, the label around the file input */
    var grid=country&&topIn(country,storyFs);                                     /* …86b5 */
    var countryLabel=grid&&topIn(country,grid), cityLabel=grid&&topIn(city,grid), yearLabel=grid&&topIn(year,grid), tripLabel=grid&&topIn(trip,grid);
    var captionLabel=caption&&topIn(caption,storyFs);                             /* …86bb */
    var creditLabel=named&&topIn(named,creditFs), radiosRow=creditLabel&&topIn(named,creditLabel);      /* …86dd, …86dc */
    var shareLabel=social&&topIn(social,creditFs), checksRow=shareLabel&&topIn(social,shareLabel);     /* …86fd, …86fc */
    var rightsLabel=rights&&topIn(rights,creditFs), licenceLabel=licence&&topIn(licence,creditFs), peopleLabel=people&&topIn(people,creditFs);
    var promisesLabel=rightsLabel&&rightsLabel.previousElementSibling;           /* 455964ef-…2f04 */
    if(promisesLabel&&promisesLabel.tagName!=='DIV') promisesLabel=null;
    var status=submit&&submit.nextElementSibling; if(!status||status.tagName!=='SPAN') status=form.querySelector('.tll-pen-status');
    var foot=status?status.textContent:'';
    var detail, share, sum, errs={}, kept=[];

    /* 1 · row 18: placeholders go; the label and the help line carry the guidance */
    try{ [photos,country,city,year,caption,pets].forEach(function(i){ if(i) i.removeAttribute('placeholder'); }); }catch(e){}

    /* 2 · rows 12 and 17: the photo input is required and asks for JPG or WebP; the year is optional and numeric on phones */
    try{ photos.required=true; photos.setAttribute('accept','image/jpeg,image/webp'); if(year){ year.required=false; year.setAttribute('inputmode','numeric'); } }catch(e){}

    /* 3 · rows 19 and 20: a click on the heading text of the credit and syndication labels must not tick the first control */
    try{
      var guard=function(label,row){ label.addEventListener('click',function(ev){ if(!row.contains(ev.target)) ev.preventDefault(); }); };
      guard(creditLabel,radiosRow); guard(shareLabel,checksRow);
    }catch(e){}

    /* 4 · row 14: the caption block sits directly under "Where is this?" */
    try{ grid.insertBefore(captionLabel,countryLabel.nextSibling); }catch(e){}

    function disclosure(id,btnId,text){
      var btn=el('button',{type:'button',id:btnId,'class':'tll-pen-disclosure','aria-expanded':'false','aria-controls':id},text);
      var panel=el('div',{id:id,'class':'tll-pen-panel'}), inner=el('div',{'class':'tll-pen-panel-inner'}); panel.appendChild(inner);
      var o={btn:btn,panel:panel,inner:inner,on:false,open:function(v){ o.on=!!v; btn.setAttribute('aria-expanded',o.on?'true':'false'); panel.classList.toggle('is-open',o.on); }};
      btn.addEventListener('click',function(){ o.open(!o.on); remember(); });
      return o;
    }
    function remember(){ try{ sessionStorage.setItem('tllPhotosPanels',JSON.stringify({detail:!!(detail&&detail.on),share:!!(share&&share.on)})); }catch(e){} }

    /* 5 · rows 15 to 17: "More detail (optional)" holds city, year, trip type and the whole pet fieldset */
    try{
      detail=disclosure('tll-more-detail','tll-more-detail-btn','More detail (optional)');
      storyFs.appendChild(detail.btn);
      storyFs.appendChild(el('p',{'class':'tll-pen-disclosure-help'},'City, year, trip type and a pet in the shot. None of it is required.'));
      storyFs.appendChild(detail.panel);
      [cityLabel,yearLabel,tripLabel,petFs].forEach(function(n){ if(n) detail.inner.appendChild(n); });
    }catch(e){}

    /* 6 · row 20: "Where else it may appear (optional)" holds the syndication label with its three rows */
    try{
      share=disclosure('tll-more-share','tll-more-share-btn','Where else it may appear (optional)');
      after(creditLabel,share.btn); after(share.btn,share.panel);
      share.inner.appendChild(shareLabel);
    }catch(e){}

    /* 7 · row 21: the promises become a named group. The label and the three rows live inside the credit fieldset in the
       Designer tree, so the group is reordered to form level, right after that fieldset, where section 8 numbers it */
    try{
      promisesLabel.id='tll-promises-label';
      var wrap=el('div',{'class':'tll-pen-promises',role:'group','aria-labelledby':'tll-promises-label'});
      form.insertBefore(wrap,creditFs.nextSibling);
      [promisesLabel,rightsLabel,licenceLabel,peopleLabel].forEach(function(n){ wrap.appendChild(n); });
    }catch(e){}

    /* 8 · row 25: the footnote span is the live region for the validation count */
    try{ status.setAttribute('role','status'); status.setAttribute('aria-live','polite'); }catch(e){}

    /* 9 · row 19: credited-as line under the credit row, from one read-only getCurrentMember call; the fallback shows first */
    var credited;
    try{
      credited=el('p',{id:'tll-credited-as','class':'tll-credited-as'},'Credited with the name on your account.');
      after(creditLabel,credited);
      showCredited();
      var tries=0;
      (function tick(){
        var ms=window.$memberstackDom;
        if(ms&&typeof ms.getCurrentMember==='function'){
          try{ ms.getCurrentMember().then(function(r){
            var cf=(r&&r.data&&r.data.customFields)||{}, name=(String(cf['first-name']||'')+' '+String(cf['last-name']||'')).trim();
            if(name) credited.textContent='Credited as '+name+', from your account.';
          }).catch(function(){}); }catch(e){}
        } else if(++tries<40) setTimeout(tick,250);
      })();
    }catch(e){}
    function showCredited(){ if(credited) credited.hidden=!named.checked; }

    /* 10 · rows 11 to 13: drop zone state, count, size and type checks, the file list, the file error lines */
    var MAX=12, MAXB=25*1024*1024, OK={'image/jpeg':1,'image/webp':1};
    var fileErrs, list, count, canDT=false;
    try{ canDT=!!new DataTransfer().items; }catch(e){}
    try{
      fileErrs=el('div',{id:'tll-photos-file-errors','class':'tll-photos-file-errors','aria-live':'polite'});
      list=el('ul',{id:'tll-photos-list','class':'tll-photos-list',role:'list',hidden:''});
      count=el('p',{id:'tll-photos-count','class':'tll-photos-count',role:'status',hidden:''});
      after(dropZone,fileErrs); after(fileErrs,list); after(list,count);
      var depth=0;
      dropZone.addEventListener('dragenter',function(ev){ ev.preventDefault(); depth++; dropZone.classList.add('is-dragover'); });
      dropZone.addEventListener('dragover',function(ev){ ev.preventDefault(); });
      dropZone.addEventListener('dragleave',function(){ if(--depth<=0){ depth=0; dropZone.classList.remove('is-dragover'); } });
      dropZone.addEventListener('drop',function(ev){
        ev.preventDefault(); depth=0; dropZone.classList.remove('is-dragover');
        var fl=ev.dataTransfer&&ev.dataTransfer.files; if(!fl||!fl.length) return;
        if(canDT) addFiles(fl); else { try{ photos.files=fl; }catch(e){} addFiles(photos.files); }
      });
      photos.addEventListener('change',function(){ addFiles(photos.files); });
      if(photos.files&&photos.files.length) addFiles(photos.files);
    }catch(e){}
    function ext(n){ var m=/\.([a-z0-9]+)$/i.exec(n); return m?m[1].toUpperCase():''; }
    function mb(n){ return Math.max(0.1,Math.round(n/104857.6)/10)+' MB'; }
    function okType(f){ return !!OK[f.type]||(!f.type&&/\.(jpe?g|webp)$/i.test(f.name)); }
    function dup(f){ return kept.some(function(k){ var o=k.file; return o.name===f.name&&o.size===f.size&&o.lastModified===f.lastModified; }); }
    function sync(){ if(!canDT) return false; try{ var dt=new DataTransfer(); kept.forEach(function(k){ dt.items.add(k.file); }); photos.files=dt.files; return true; }catch(e){ return false; } }
    function row(k,i){
      var li=el('li',{'class':'tll-photos-row'}); li.style.setProperty('--tll-i',i);
      var th=el('div',{'class':'tll-photos-thumb'});
      if(window.URL&&URL.createObjectURL){
        k.url=URL.createObjectURL(k.file); var img=el('img',{alt:'',src:k.url,decoding:'async'});
        img.onerror=function(){ th.removeChild(img); th.classList.add('is-blank'); th.textContent=ext(k.file.name); }; th.appendChild(img);
      } else { th.classList.add('is-blank'); th.textContent=ext(k.file.name); }
      var meta=el('div',{'class':'tll-photos-meta'}); meta.appendChild(el('span',{'class':'tll-photos-name'},k.file.name)); meta.appendChild(el('span',{'class':'tll-photos-size'},mb(k.file.size)));
      var rm=el('button',{type:'button','class':'tll-photos-remove','aria-label':'Remove '+k.file.name},'Remove');
      rm.addEventListener('click',function(){ remove(k); });
      li.appendChild(th); li.appendChild(meta); li.appendChild(rm); k.li=li; return li;
    }
    function drop(k){ if(k.url) URL.revokeObjectURL(k.url); if(k.li&&k.li.parentNode) k.li.parentNode.removeChild(k.li); }
    function clearRows(){ kept.forEach(drop); kept=[]; }
    function setCount(msg){ var n=kept.length; count.textContent=msg||(n?n+' of '+MAX+' chosen.':''); count.hidden=!count.textContent; list.hidden=!n; }
    function addFiles(fl){
      var msgs=[], added=[], over=false;
      while(fileErrs.firstChild) fileErrs.removeChild(fileErrs.firstChild);
      if(!canDT) clearRows();                     /* no rebuild possible: the input holds the new pick alone, so the list mirrors it */
      for(var i=0;i<fl.length;i++){ var f=fl[i];
        if(!okType(f)){ msgs.push(f.name+' is not a JPG or WebP. Try the original from your Photos app.'); continue; }
        if(f.size>MAXB){ msgs.push(f.name+' is over 25MB. Export a smaller copy and try again.'); continue; }
        if(dup(f)) continue;
        if(kept.length+added.length>=MAX){ over=true; continue; }
        added.push({file:f});
      }
      if(over) msgs.push("That's more than 12. We kept the first 12 and left the rest for next time.");
      msgs.forEach(function(m){ fileErrs.appendChild(el('p',{'class':'tll-photos-file-error'},m)); });
      if(!canDT&&msgs.length){ photos.value=''; setCount('Choose your photos again.'); summary(); return; }
      added.forEach(function(k,i){ kept.push(k); list.appendChild(row(k,i)); });
      if(canDT&&!sync()) startOver(); else setCount();
      summary();
    }
    function startOver(){ clearRows(); photos.value=''; setCount('Choose your photos again.'); }   /* row 13 fallback: no FileList rebuild */
    function remove(k){
      var i=kept.indexOf(k); if(i<0) return; kept.splice(i,1); drop(k);
      if(sync()) setCount(); else startOver();
      summary();
    }

    /* 11 · row 22: the summary line at the top of the promises group, computed from the live inputs */
    try{
      sum=el('p',{id:'tll-photos-summary','class':'tll-photos-summary',hidden:''});
      after(promisesLabel,sum);
    }catch(e){}
    function summary(){
      if(!sum) return;
      var n=kept.length, w=val(country), c=val(city), y=val(year);
      if(!n||!w){ sum.hidden=true; sum.textContent=''; return; }
      sum.textContent=n+' '+(n===1?'photo':'photos')+' from '+(c?c+', '+w:w)+(/^\d{4}$/.test(y)?', '+y:'')+'.'; sum.hidden=false;
    }

    /* 12 · rows 17, 23 and 25: inline errors with stable ids, the check in the capture phase, focus to the first failure,
       the count in the live region, errors cleared on input. noValidate only once the check is installed */
    try{
      var mkErr=function(key,input,label){ if(!input||!label) return; var s=el('span',{id:'tll-err-'+key,'class':'tll-pen-error',hidden:''}); after(label,s); errs[key]={s:s,i:input,l:label}; };
      mkErr('photos',photos,dropZone); mkErr('country',country,countryLabel); mkErr('year',year,yearLabel);
      mkErr('rights',rights,rightsLabel); mkErr('license',licence,licenceLabel); mkErr('people',people,peopleLabel);
      form.addEventListener('submit',function(ev){
        var fails=check(); live();
        if(!fails.length) return;
        ev.preventDefault(); ev.stopImmediatePropagation();
        var k=fails[0]; if(k==='year'&&detail){ detail.open(true); remember(); }
        try{ errs[k].i.focus(); }catch(e){}
      },true);
      form.addEventListener('input',onEdit); form.addEventListener('change',onEdit);
      form.noValidate=true;
    }catch(e){}
    function setErr(k,msg){ var e=errs[k]; if(!e) return false; e.s.textContent=msg; e.s.hidden=false; e.i.setAttribute('aria-invalid','true'); addRef(e.i,'aria-describedby',e.s.id); e.l.classList.add('is-invalid'); return true; }
    function clearErr(k){ var e=errs[k]; if(!e||e.s.hidden) return false; e.s.hidden=true; e.s.textContent=''; e.i.removeAttribute('aria-invalid'); dropRef(e.i,'aria-describedby',e.s.id); e.l.classList.remove('is-invalid'); return true; }
    function check(){
      var fails=[];
      function test(k,bad,msg){ if(!errs[k]) return; if(bad()){ setErr(k,msg); fails.push(k); } else clearErr(k); }
      test('photos',function(){ return !(photos.files&&photos.files.length); },'Add at least one photo.');
      test('country',function(){ return !val(country); },'Tell us the country, at least.');
      test('year',function(){ var y=val(year), lo=+year.getAttribute('min')||1990, hi=+year.getAttribute('max')||2030;
        return !!(year.validity&&year.validity.badInput)||(y&&!(/^\d{4}$/.test(y)&&+y>=lo&&+y<=hi)); },'A four-digit year. Guessing is allowed.');
      var tick='Tick this one to send.';
      test('rights',function(){ return !rights.checked; },tick); test('license',function(){ return !licence.checked; },tick); test('people',function(){ return !people.checked; },tick);
      return fails;
    }
    function live(){ if(!status) return; var n=0; for(var k in errs){ if(!errs[k].s.hidden) n++; } status.textContent=n?(n===1?'One thing to fix above.':n+' things to fix above.'):foot; }
    function onEdit(ev){
      var t=ev.target, cleared=false;
      for(var k in errs){ if(errs[k].i===t&&clearErr(k)) cleared=true; }
      if(cleared) live();
      if(t&&t.name==='credit-mode') showCredited();
      summary();
    }

    /* 13 · row 26: focus lands on the success box when Webflow shows it */
    try{
      var done=form.parentNode.querySelector('.w-form-done');
      done.setAttribute('tabindex','-1');
      var mo=new MutationObserver(function(){ if(getComputedStyle(done).display!=='none'){ mo.disconnect(); try{ done.focus(); }catch(e){} } });
      mo.observe(done,{attributes:true,attributeFilter:['style']});
    }catch(e){}

    /* 14 · rows 15 and 20: panels remembered for the session, and opened when a field inside already holds a value */
    try{
      var saved={}; try{ saved=JSON.parse(sessionStorage.getItem('tllPhotosPanels')||'{}')||{}; }catch(e){}
      var hasDetail=[city,year,pets].some(val)||!!(trip&&trip.selectedIndex>0&&trip.value);
      var hasShare=[social,rotation,press].some(function(i){ return i&&i.checked; });
      if(detail) detail.open(saved.detail||hasDetail);
      if(share) share.open(saved.share||hasShare);
    }catch(e){}
  }

  if(d.readyState==='loading') d.addEventListener('DOMContentLoaded',run); else run();
})();
