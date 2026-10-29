/* tll-photo-clean-v1 (24 Oct 2026). Nancy, 24 Oct: "Please fix the my pets page". Replaces the registered TLL Photo Upload v1,
   which sent original photos (location data included) to Cloudinary the moment they were chosen.
   For any Webflow form with photo fields (the /share-photos form has its own script and is skipped):
   1. on Send, before any other script on the form runs, the send is held;
   2. each chosen photo is redrawn on a canvas and saved as a fresh JPEG (long edge 3000px at most): no EXIF, so no GPS, camera or time;
   3. the clean copies go to Cloudinary (unsigned preset tll_photos, folder tll/<field name>), one at a time;
   4. the links go into hidden fields with the photo fields' names, and the form is sent once, so the page's own scripts run once.
   Nothing leaves the browser before Send. A failed upload sends nothing and says so. A form with no photos chosen is not touched.
   26 Oct 2026 (troubleshoot plan, step 1): Memberstack's own forms (data-ms-form) and file fields Memberstack owns (any data-ms-*
   attribute on the field) are never held. Note: the /submit story form carries data-ms-member-bound on the form itself and is still handled. */
(function(){
  if(window.__tllPhotoClean) return; window.__tllPhotoClean=1;
  var CLOUD='https://api.cloudinary.com/v1_1/idonvlow/image/upload', PRESET='tll_photos', EDGE=3000, SKIP='[data-tll-form="share-photos"]';
  var D=document, state=new WeakMap(), cache={};

  function msOwned(el){ return [].some.call(el.attributes,function(a){ return a.name.indexOf('data-ms-')===0; }); }
  function key(f){ return [f.name,f.size,f.lastModified].join('|'); }
  function viaImg(f){ return new Promise(function(res,rej){ var u=URL.createObjectURL(f), i=new Image(); i.onload=function(){ res(i); setTimeout(function(){ URL.revokeObjectURL(u); },0); }; i.onerror=function(){ URL.revokeObjectURL(u); rej('read'); }; i.src=u; }); }
  function decode(f){ if(window.createImageBitmap){ return createImageBitmap(f,{imageOrientation:'from-image'}).catch(function(){ return viaImg(f); }); } return viaImg(f); }
  function clean(f){
    return decode(f).then(function(img){
      var w=img.naturalWidth||img.width, h=img.naturalHeight||img.height; if(!w||!h) throw 'read';
      var s=Math.min(1,EDGE/Math.max(w,h)), c=D.createElement('canvas'); c.width=Math.round(w*s); c.height=Math.round(h*s);
      c.getContext('2d').drawImage(img,0,0,c.width,c.height); if(img.close) img.close();
      return new Promise(function(res,rej){ c.toBlob(function(b){ if(b) res(b); else rej('read'); },'image/jpeg',0.9); });
    },function(){ throw 'read'; });
  }
  function upload(blob,name,folder){
    var fd=new FormData(); fd.append('file',blob,String(name||'photo').replace(/\.[^.]*$/,'')+'.jpg'); fd.append('upload_preset',PRESET); fd.append('folder',folder);
    return fetch(CLOUD,{method:'POST',body:fd}).then(function(r){ if(!r.ok) throw 'send'; return r.json(); },function(){ throw 'send'; })
      .then(function(j){ if(!j||!j.secure_url) throw 'send'; return j.secure_url; });
  }
  function msgFor(form){
    var m=form.querySelector('.tll-up-msg'); if(m) return m;
    m=D.createElement('p'); m.className='tll-up-msg'; m.setAttribute('role','status'); m.setAttribute('aria-live','polite');
    m.style.cssText='margin:10px 0 0;font-size:14px;line-height:1.5;color:inherit';
    var btn=form.querySelector('[type="submit"]'); if(btn&&btn.parentNode) btn.parentNode.insertBefore(m,btn.nextSibling); else form.appendChild(m);
    return m;
  }
  function say(form,t,err){ var m=msgFor(form); m.textContent=t; m.setAttribute('role',err?'alert':'status'); m.style.color=err?'#C8325B':''; }

  /* Capture phase on the document: runs before every listener on the form, so nothing else acts on the held send. */
  D.addEventListener('submit',function(ev){
    var form=ev.target; if(!form||!form.matches||!form.matches('form')||form.matches(SKIP)||form.hasAttribute('data-ms-form')) return;
    var st=state.get(form)||{}; state.set(form,st);
    if(st.pass){ st.pass=false; return; }                        /* the links are in: let the form and its scripts run once */
    var inputs=[].filter.call(form.querySelectorAll('input[type="file"]'),function(i){ return i.files&&i.files.length&&(i.getAttribute('name')||i.getAttribute('data-tll-photo-name'))&&!msOwned(i); });
    if(!inputs.length) return;
    ev.preventDefault(); ev.stopImmediatePropagation();
    if(st.busy) return;
    st.busy=true;
    var submit=ev.submitter||form.querySelector('[type="submit"]'); if(submit) submit.disabled=true;
    var jobs=[]; inputs.forEach(function(inp){ [].forEach.call(inp.files,function(f){ jobs.push({inp:inp,f:f}); }); });
    var n=jobs.length, done=0, links=new Map();
    say(form,'Removing location data and sending '+(n===1?'your photo':n+' photos')+'. Keep this page open.');
    function fail(why,f){
      st.busy=false; if(submit) submit.disabled=false;
      say(form,why==='read'?(f.name||'One photo')+' could not be read. Try a JPG or WebP and send again. Nothing was sent.'
                           :'The upload did not go through. Check your connection and send again. Nothing was sent.',true);
    }
    (function next(i){
      if(i>=n){
        inputs.forEach(function(inp){
          var name=inp.getAttribute('data-tll-photo-name')||inp.getAttribute('name');
          inp.setAttribute('data-tll-photo-name',name); inp.removeAttribute('name'); inp.removeAttribute('data-name'); inp.required=false;
          var h=form.querySelector('input[type="hidden"][data-tll-photo-for="'+name+'"]');
          if(!h){ h=D.createElement('input'); h.type='hidden'; h.setAttribute('data-tll-photo-for',name); form.appendChild(h); }
          h.name=name; h.setAttribute('data-name',name); h.value=(links.get(inp)||[]).join('\n');
        });
        st.busy=false; st.pass=true; if(submit) submit.disabled=false;
        say(form,'Photos are up. Sending.');
        try{ if(form.requestSubmit) form.requestSubmit(submit&&submit.form===form?submit:undefined); else if(submit) submit.click(); else form.submit(); }
        catch(e){ st.pass=false; say(form,'That did not go through. Send again.',true); }
        return;
      }
      var j=jobs[i], k=key(j.f), folder='tll/'+(j.inp.getAttribute('data-tll-photo-name')||j.inp.getAttribute('name'));
      var got=function(u){ cache[k]=u; var a=links.get(j.inp)||[]; a.push(u); links.set(j.inp,a); done++; if(n>1&&done<n) say(form,'Sent '+done+' of '+n+'. Keep this page open.'); next(i+1); };
      if(cache[k]) return got(cache[k]);
      clean(j.f).then(function(b){ return upload(b,j.f.name,folder); }).then(got).catch(function(why){ fail(why,j.f); });
    })(0);
  },true);
})();
