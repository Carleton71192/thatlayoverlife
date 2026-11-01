/* tll-site-layers-v16 chunk misc: loaded by the core loader on paths matching /^\/(spotlight|gallery)$/, after the core and in this order. Built by src/site-layers/build-site-layers-v16.py; each layer keeps its own path guard. No data-ms-* element is touched. */
/* src/site-layers/tll-open-slots-v1.js */
(function(){
if((location.pathname.replace(/\/+$/,'')||'/')!=='/spotlight')return;
function run(){
  ['a.inline-a-1-1','a.inline-a-2-1'].forEach(function(s){var a=document.querySelector(s);if(!a||a.dataset.tllSa)return;a.dataset.tllSa='1';a.dataset.tllSp='1';a.style.setProperty('display','none','important');a.setAttribute('aria-hidden','true');a.tabIndex=-1;});
  var a=document.querySelector('a.inline-a-3');if(!a||a.dataset.tllSa)return;a.dataset.tllSa='1';a.dataset.tllSp='1';a.href='/submit';
  a.setAttribute('style','display:block;border:1px solid #E0DACE;border-radius:2px;padding:28px 24px;text-align:left;background:#FDF9F3;text-decoration:none;color:#1A1A1A');
  a.innerHTML='<div style="font-family:JetBrains Mono,monospace;font-size:12px;letter-spacing:.18em;font-weight:600;color:#C8325B;margin-bottom:10px;text-transform:uppercase">Write for TLL</div>'+
    '<div style="font-family:Playfair Display,Georgia,serif;font-weight:800;font-size:24px;margin-bottom:8px">Pitch your layover.</div>'+
    '<p style="margin:0 0 18px;color:#3a3a3a;font-size:16px;line-height:1.5">We edit lightly and keep your byline.</p>'+
    '<span style="display:inline-block;background:#D63859;color:#fff;border-radius:2px;padding:12px 18px;font-weight:700">Pitch a layover story →</span>';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
window.addEventListener('load',run);
})();
/* src/site-layers/tll-lounge-labels-v1.js */
(function(){
if(!/^\/gallery\/?$/.test(location.pathname))return;
var CSS="html body .tll-lounge-credit,html body .tll-lounge-open{position:absolute!important;left:10px!important;bottom:10px!important;right:auto!important;top:auto!important;"+
"max-width:calc(100% - 20px)!important;width:auto!important;box-sizing:border-box!important;margin:0!important;padding:4px 7px!important;"+
"font:600 10px/1.3 'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace!important;letter-spacing:.08em!important;text-transform:uppercase;"+
"white-space:normal!important;overflow-wrap:anywhere;"+
"background:rgba(10,11,20,.62)!important;color:#F7F1E8!important;border-radius:2px!important}"+
"@media (max-width:767px){html body .tll-lounge-credit,html body .tll-lounge-open{left:8px!important;bottom:8px!important;max-width:calc(100% - 16px)!important;font-size:9.5px!important;padding:3px 6px!important}}";
function add(){if(document.getElementById('tll-lounge-labels-v1'))return;var s=document.createElement('style');s.id='tll-lounge-labels-v1';s.textContent=CSS;(document.body||document.head).appendChild(s);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add);else add();
})();
/* src/site-layers/tll-lounge-members-v1.js */
(function(){
if(!/^\/gallery\/?$/.test(location.pathname))return;
var API='https://tll-travel-wire.thatlayoverlife.workers.dev/lounge';
function run(){
  var tiles=document.querySelectorAll('[data-tll-loc]');if(!tiles.length||document.querySelector('[data-tll-member-photo]'))return;
  var grid=tiles[0].parentElement,model=[].filter.call(tiles,function(t){return t.getAttribute('data-tll-has-img')==='1';})[0]||tiles[0];
  fetch(API).then(function(r){return r.ok?r.json():null;}).then(function(d){
    if(!d||!d.photos||!d.photos.length||document.querySelector('[data-tll-member-photo]'))return;
    d.photos.slice(0,12).reverse().forEach(function(p){
      var t=model.cloneNode(false);t.removeAttribute('id');t.setAttribute('data-tll-member-photo','');t.setAttribute('data-tll-photo-ready','true');t.setAttribute('data-tll-has-img','1');
      t.setAttribute('data-tll-loc',model.getAttribute('data-tll-loc')||'');t.style.backgroundImage="url('"+String(p.img).replace(/'/g,'%27')+"')";t.style.display='';
      t.setAttribute('role','img');t.setAttribute('aria-label',(p.caption||p.alt||'Member photo')+(p.place?', '+p.place:''));
      var c=document.createElement('span');c.className='tll-lounge-credit';c.textContent=(p.credit?p.credit+' · ':'')+String(p.place||'').toUpperCase();t.appendChild(c);
      grid.insertBefore(t,grid.firstChild);
    });
  }).catch(function(){});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,300);});else setTimeout(run,300);
})();
