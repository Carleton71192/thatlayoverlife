<script id="tll-edit-dir-v1">
/* Directory editor (design board D1, 30 Sep 2026). Lives outside the Memberstack profile form and writes the directory custom fields through the Memberstack DOM API. Every link row is HIDDEN until its switch is on. Contact never exposes a number or an email. */
(function(){
  var root=document.querySelector('[data-tll-edit="dir-app"]'); if(!root) return;
  var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
  var TAGS=[].slice.call(document.querySelectorAll('[data-tll-tag]')).map(function(n){return {slug:n.dataset.slug||'',name:n.dataset.name||'',group:n.dataset.group||'',order:Number(n.dataset.order||0)}}).filter(function(t){return t.slug&&t.name});
  var GROUPS=[];TAGS.forEach(function(t){if(GROUPS.indexOf(t.group)<0)GROUPS.push(t.group)});
  var LINKS=[['website','Blog or website','https://'],['newsletter','Newsletter','https://'],['instagram','Instagram','https://www.instagram.com/'],['tiktok','TikTok','https://www.tiktok.com/@'],['youtube','YouTube','https://www.youtube.com/@'],['strava','Strava','https://www.strava.com/athletes/'],['other','Anything else','https://']];
  var MONET=[['','Not yet'],['affiliates','Earns from affiliates'],['hosted trips','Accepts hosted trips'],['sponsors','Works with sponsors']];
  function tagChips(){ if(!TAGS.length) return '<p class="tlled-note">Tags load from the Interest Tags collection. None published yet.</p>'; return GROUPS.map(function(g){return '<div class="tlled-tg"><div class="tlled-tgl">'+esc(g)+'</div><div class="tlled-chips">'+TAGS.filter(function(t){return t.group===g}).sort(function(a,b){return a.order-b.order}).map(function(t){return '<button type="button" class="tlled-chip" data-tag="'+esc(t.slug)+'" aria-pressed="false">'+esc(t.name)+'</button>'}).join('')+'</div></div>'}).join(''); }
  root.innerHTML=
   '<div class="tlled-row tlled-toggle"><label><input type="checkbox" data-f="is-expat"><span class="tlled-sw"></span><b>I\'m an expat</b><small>Adds you to /expats and to the country pages you know.</small></label></div>'+
   '<div class="tlled-panel" data-panel="is-expat">'+
     '<div class="tlled-grid"><label>Where I live now · country<input type="text" data-f="lives-country" placeholder="Denmark" autocomplete="off"></label><label>City (optional)<input type="text" data-f="lives-city" placeholder="Copenhagen, or leave it blank"></label><label>Abroad since · year<input type="number" data-f="lives-years" min="1950" max="2099" placeholder="2018"></label><label>Where else I know well<input type="text" data-f="knows" placeholder="Brazil, Vietnam"></label><label>Languages<input type="text" data-f="languages" placeholder="English, Danish, Portuguese"></label></div>'+
     '<div class="tlled-lbl">What I can speak to · pick up to 5 <span class="tlled-prov">(tags provisional)</span></div><div data-tags>'+tagChips()+'</div><input type="hidden" data-f="tags">'+
   '</div>'+
   '<div class="tlled-row tlled-toggle"><label><input type="checkbox" data-f="is-creator"><span class="tlled-sw"></span><b>I\'m a creator</b><small>Adds you to /creators. Every card says how you earn.</small></label></div>'+
   '<div class="tlled-panel" data-panel="is-creator"><div class="tlled-grid"><label>What I make<input type="text" data-f="roles" placeholder="Video creator, photographer"></label><label>Regions I cover<input type="text" data-f="regions" placeholder="The Balkans"></label><label>How I earn<select data-f="monetization">'+MONET.map(function(m){return '<option value="'+esc(m[0])+'">'+esc(m[1])+'</option>'}).join('')+'</select></label></div></div>'+
   '<div class="tlled-row tlled-toggle"><label><input type="checkbox" data-f="is-press"><span class="tlled-sw"></span><b>I\'m press</b><small>Adds you to /press. Verified is set by a human after seeing proof.</small></label></div>'+
   '<div class="tlled-panel" data-panel="is-press"><div class="tlled-grid"><label>Outlets or affiliation<input type="text" data-f="affiliation" placeholder="Freelance · Condé Nast Traveler, Politiken"></label><label>Beats<input type="text" data-f="roles-press" placeholder="Northern Europe, rail, food"></label></div></div>'+
   '<div class="tlled-lbl tlled-lbl--top">Find me elsewhere · every link is hidden until you switch it on</div>'+
   '<div class="tlled-links">'+LINKS.map(function(l){return '<div class="tlled-link"><label class="tlled-sw-wrap"><input type="checkbox" data-f="link-'+l[0]+'-on"><span class="tlled-sw"></span><span class="tlled-swt">Hidden</span></label><span class="tlled-lt">'+esc(l[1])+'</span><input type="url" data-f="link-'+l[0]+'" placeholder="'+esc(l[2])+'"></div>'}).join('')+'</div>'+
   '<div class="tlled-lbl tlled-lbl--top">Contact · without exposure</div>'+
   '<div class="tlled-contact"><label class="tlled-radio"><input type="radio" name="tll-cmode" value="none"><span>Not accepting contact right now</span></label><label class="tlled-radio"><input type="radio" name="tll-cmode" value="platforms"><span>Reach me on a platform I already use</span></label>'+
   '<div class="tlled-grid" data-panel="platforms"><label>Instagram handle<input type="text" data-f="contact-ig" placeholder="nancycarleton"></label><label>WhatsApp Business short link<input type="url" data-f="contact-wa" placeholder="https://wa.me/message/XXXXXXXXXX"><small class="tlled-err" data-err="wa" hidden>That is a phone number. Only a WhatsApp Business short link (wa.me/message/…) is allowed, and it is never shown as a number.</small></label><label class="tlled-sw-wrap tlled-sw-wrap--relay"><input type="checkbox" data-f="contact-relay-on"><span class="tlled-sw"></span><span>Relay form: readers write to you through TLL, your email stays hidden</span></label></div></div>'+
   '<div class="tlled-actions"><button type="button" class="tlled-save" data-save>Save directory settings</button><span class="tlled-status" data-status aria-live="polite"></span></div>';
  var F=function(k){return root.querySelector('[data-f="'+k+'"]')};
  function setPanel(){['is-expat','is-creator','is-press'].forEach(function(k){var p=root.querySelector('[data-panel="'+k+'"]');if(p)p.style.display=F(k).checked?'':'none';});var m=root.querySelector('input[name="tll-cmode"]:checked');var pp=root.querySelector('[data-panel="platforms"]');if(pp)pp.style.display=(m&&m.value==='platforms')?'':'none';}
  root.addEventListener('change',function(e){setPanel();if(e.target.matches('[data-f$="-on"]')){var w=e.target.closest('.tlled-link');if(w){var t=w.querySelector('.tlled-swt');if(t)t.textContent=e.target.checked?'Shown':'Hidden';}}});
  var picked=[];
  function paintTags(){root.querySelectorAll('[data-tag]').forEach(function(b){b.setAttribute('aria-pressed',picked.indexOf(b.dataset.tag)>-1?'true':'false');});F('tags').value=picked.join(', ');}
  root.addEventListener('click',function(e){var b=e.target.closest('[data-tag]');if(!b)return;var i=picked.indexOf(b.dataset.tag);if(i>-1)picked.splice(i,1);else if(picked.length<5)picked.push(b.dataset.tag);else{status('Five is the limit. Drop one to add another.');return;}paintTags();});
  function status(t){var s=root.querySelector('[data-status]');if(s)s.textContent=t;}
  var KEYS=['is-expat','is-creator','is-press','lives-country','lives-city','lives-years','knows','languages','tags','roles','regions','monetization','affiliation','contact-ig','contact-wa','contact-relay-on'].concat(LINKS.map(function(l){return 'link-'+l[0]}),LINKS.map(function(l){return 'link-'+l[0]+'-on'}));
  function fill(cf){cf=cf||{};KEYS.forEach(function(k){var el=F(k);if(!el)return;var v=cf[k];if(el.type==='checkbox')el.checked=String(v)==='true';else el.value=v==null?'':v;});
    var pr=F('roles-press');if(pr)pr.value=cf['roles-press']||'';
    picked=String(cf.tags||'').split(',').map(function(s){return s.trim()}).filter(Boolean);paintTags();
    var mode=cf['contact-mode']==='platforms'?'platforms':'none';var r=root.querySelector('input[name="tll-cmode"][value="'+mode+'"]');if(r)r.checked=true;setPanel();}
  function read(){var out={};KEYS.forEach(function(k){var el=F(k);if(!el)return;out[k]=el.type==='checkbox'?String(el.checked):String(el.value||'').trim();});var pr=F('roles-press');if(pr)out['roles-press']=pr.value.trim();var m=root.querySelector('input[name="tll-cmode"]:checked');out['contact-mode']=m?m.value:'none';return out;}
  function valid(d){var err=root.querySelector('[data-err="wa"]');var wa=d['contact-wa'];var bad=wa&&!/^https:\/\/wa\.me\/message\/[A-Za-z0-9]+\/?$/i.test(wa);if(err)err.hidden=!bad;if(bad){status('Fix the WhatsApp link before saving.');return false;}
    if(d['is-expat']==='true'&&!d['lives-country']){status('Add the country you live in, or switch the expat toggle off.');return false;}return true;}
  var ms=null;
  root.querySelector('[data-save]').addEventListener('click',function(){var d=read();if(!valid(d))return;if(!ms){status('Log in to save.');return;}status('Saving…');
    ms.updateMember({customFields:d}).then(function(){status('Saved. Directories update on the next sync.');}).catch(function(){status('Could not save. Try again.');});});
  fill({});
  var n=0,iv=setInterval(function(){if(window.$memberstackDom){clearInterval(iv);ms=window.$memberstackDom;ms.getCurrentMember().then(function(r){if(r&&r.data)fill(r.data.customFields||{});}).catch(function(){});}else if(++n>40)clearInterval(iv);},250);
})();
</script>
