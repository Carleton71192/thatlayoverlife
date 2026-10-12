/* tll-au3-auth-js-v1 · Sign-in 3.0 for /login, /signup and /forgot-password (approved by Nancy 12 Oct 2026, open point 1 default: yes, at run time only).
   Adds role="alert" to the Webflow error blocks, ties each visible label to its Memberstack input with aria-labelledby, adds autocomplete,
   a Show password button and the "8 characters or more." hint, and a text message for an invalid field (never color alone).
   It never changes or removes id, name, the Designer type, required, minlength or any data-ms-* attribute, and never submits anything itself. */
(function(){
  if(window.__tllAu3) return; window.__tllAu3=1;
  var d=document;
  var sec=d.querySelector('.tll-auth-section')||d.querySelector('.tll-forgot-section'); if(!sec) return;
  function el(tag,attrs,txt){var e=d.createElement(tag); if(attrs){for(var k in attrs){e.setAttribute(k,attrs[k]);}} if(txt!=null) e.textContent=txt; return e;}
  function after(ref,node){ ref.parentNode.insertBefore(node,ref.nextSibling); }
  function addRef(inp,attr,id){ var v=(inp.getAttribute(attr)||'').split(/\s+/).filter(Boolean); if(v.indexOf(id)<0){ v.push(id); inp.setAttribute(attr,v.join(' ')); } }
  function dropRef(inp,attr,id){ var v=(inp.getAttribute(attr)||'').split(/\s+/).filter(function(x){return x&&x!==id;}); if(v.length) inp.setAttribute(attr,v.join(' ')); else inp.removeAttribute(attr); }

  [].slice.call(sec.querySelectorAll('.w-form-fail')).forEach(function(e){ e.setAttribute('role','alert'); });

  var n=0;
  [].slice.call(sec.querySelectorAll('form')).forEach(function(form){
    var kind=(form.closest('[data-ms-form]')||form).getAttribute('data-ms-form')||'';
    [].slice.call(form.querySelectorAll('.tll-auth-field')).forEach(function(field){
      var lab=field.querySelector('label'), inp=field.querySelector('input');
      if(!lab||!inp) return; n++;
      var nm=inp.getAttribute('name')||('f'+n), key=nm.replace(/[^a-z0-9-]/gi,'').toLowerCase()||('f'+n);
      if(!lab.id) lab.id='au3-l-'+key;
      inp.setAttribute('aria-labelledby',lab.id);
      lab.addEventListener('click',function(){ inp.focus(); });
      var t=(inp.getAttribute('type')||'').toLowerCase();
      if(!inp.getAttribute('autocomplete')){
        if(t==='email'||nm==='email') inp.setAttribute('autocomplete','email');
        else if(t==='password') inp.setAttribute('autocomplete',kind==='signup'?'new-password':'current-password');
        else if(nm==='first-name') inp.setAttribute('autocomplete','given-name');
      }
      if(t==='password'){
        var row=el('div',{'class':'au3-pw-row'});
        var eye=el('button',{type:'button','class':'au3-eye','aria-pressed':'false'},'Show password');
        row.appendChild(eye);
        if(kind==='signup'&&inp.getAttribute('minlength')){
          var hint=el('span',{'class':'au3-hint',id:'au3-h-'+key},inp.getAttribute('minlength')+' characters or more.');
          row.appendChild(hint); addRef(inp,'aria-describedby',hint.id);
        }
        after(inp,row); inp.__au3row=row;
        eye.addEventListener('click',function(){
          var show=inp.getAttribute('type')==='password';
          inp.setAttribute('type',show?'text':'password');
          eye.setAttribute('aria-pressed',show?'true':'false');
          eye.textContent=show?'Hide password':'Show password';
        });
        form.addEventListener('submit',function(){ if(inp.getAttribute('type')!=='password'){ inp.setAttribute('type','password'); eye.setAttribute('aria-pressed','false'); eye.textContent='Show password'; } },true);
      }
    });
    /* Consent checkboxes: name them by their visible sentence. */
    [].slice.call(form.querySelectorAll('input[type=checkbox]')).forEach(function(cb,i){
      var host=cb.closest('.tll-auth-charter-check')||(cb.closest('.w-checkbox')&&cb.closest('.w-checkbox').parentNode);
      if(!host) return;
      var span=[].filter.call(host.children,function(c){ return c.tagName==='SPAN'&&c.textContent.trim(); })[0];
      if(span){ if(!span.id) span.id='au3-c-'+i; cb.setAttribute('aria-labelledby',span.id); }
    });
  });

  /* Invalid fields: a Rose border plus a sentence, tied with aria-describedby. */
  var MSG={email:{missing:'Enter your email address.',type:'That email address is missing something. Check it and try again.'},password:{missing:'Enter your password.',short:'Your password needs 8 characters or more.'},'first-name':{missing:'Enter your first name.'},Checkbox:{missing:'Tick this box to agree before you join.'},'age-16':{missing:'Tick this box to confirm you are 16 or older.'}};
  function msgFor(inp){
    var m=MSG[inp.name]||{}, v=inp.validity||{};
    if(v.valueMissing) return m.missing||inp.validationMessage;
    if(v.typeMismatch) return m.type||inp.validationMessage;
    if(v.tooShort) return (m.short||inp.validationMessage);
    return inp.validationMessage||'Check this field and try again.';
  }
  function hostOf(inp){ if(inp.type==='checkbox') return inp.closest('.tll-auth-charter-check')||inp.closest('label')||inp; return inp.__au3row||inp; }
  d.addEventListener('invalid',function(e){
    var inp=e.target; if(!inp||!sec.contains(inp)||inp.tagName!=='INPUT') return;
    var id='au3-e-'+(inp.name||'f').replace(/[^a-z0-9-]/gi,'').toLowerCase();
    var p=d.getElementById(id);
    if(!p){ p=el('p',{'class':'au3-err-msg',id:id}); after(hostOf(inp),p); }
    p.textContent=msgFor(inp);
    inp.setAttribute('aria-invalid','true'); addRef(inp,'aria-describedby',id);
  },true);
  function clear(e){
    var inp=e.target; if(!inp||inp.tagName!=='INPUT'||!sec.contains(inp)||inp.getAttribute('aria-invalid')!=='true') return;
    if(inp.validity&&!inp.validity.valid) return;
    var id='au3-e-'+(inp.name||'f').replace(/[^a-z0-9-]/gi,'').toLowerCase(), p=d.getElementById(id);
    if(p) p.parentNode.removeChild(p);
    inp.removeAttribute('aria-invalid'); dropRef(inp,'aria-describedby',id);
  }
  d.addEventListener('input',clear,true); d.addEventListener('change',clear,true);
})();
