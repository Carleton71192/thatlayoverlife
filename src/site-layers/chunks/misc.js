/* tll-site-layers-v16 chunk misc: loaded by the core loader on paths matching /^\/(spotlight|gallery)$/, after the core and in this order. Built by src/site-layers/build-site-layers-v16.py; each layer keeps its own path guard. No data-ms-* element is touched. */
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
