/* TLL account pets v1 (2026-09-28). "My pets" was a fixed empty state while the Pawed counter (tllStates travelers with pet:true)
   said 1. Read the same data, list the pets, link each to its Paw Passport. Read-only. */
(function(){
  function slug(s){return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function pets(){try{var d=JSON.parse(localStorage.getItem('tllStates')||'null');return d&&d.v===2&&d.travelers?d.travelers.filter(function(t){return t&&t.pet&&t.name;}):[];}catch(e){return[];}}
  function box(){var h=[].slice.call(document.querySelectorAll('.tll-account-empty-title')).filter(function(e){return /no pets/i.test(e.textContent);})[0];return h&&h.closest('.tll-account-empty-state');}
  function run(slugs){
    var p=pets(),b=box();if(!p.length||!b||b.__tllPets)return;b.__tllPets=1;
    var rows=p.map(function(t){var s=slug(t.name),m=slugs.filter(function(x){return x===s||x.indexOf(s+'-')===0;})[0];
      return '<a href="'+(m?'/pets/'+m:'/my-pets')+'" style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #E0DACE;color:#1A1A1A;text-decoration:none"><span style="font-size:22px">🐾</span><strong style="font-family:\'Playfair Display\',serif;font-weight:800;font-size:18px">'+esc(t.name)+'</strong><span style="margin-left:auto;font-family:\'JetBrains Mono\',monospace;font-size:10px;letter-spacing:2px;color:#067A79">PAW PASSPORT →</span></a>';}).join('');
    b.innerHTML=rows+'<a href="/my-pets#add-pet" class="tll-btn tll-btn-primary tll-account-empty-cta" style="margin-top:18px">Add another pet</a>';
  }
  function go(){fetch('/sitemap.xml',{cache:'no-cache'}).then(function(r){return r.text();}).then(function(x){var s=(x.match(/\/pets\/[a-z0-9-]+(?=<)/g)||[]).map(function(u){return u.slice(6);});run(s);}).catch(function(){run([]);});}
  var n=0,iv=setInterval(function(){if(pets().length||++n>30){clearInterval(iv);go();}},300);
})();