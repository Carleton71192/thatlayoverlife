/* tll-acct-counts-v1 (20 Oct 2026): the one count function for /account, per handoff/claude-design-source/COUNT-RULES.md.
   One source: the member's saved map (member JSON tllStates), read once by the lists block below and handed to paint().
   tllCounts() is the only place a number is computed and paint() the only place a card is written. Nothing is typed,
   nothing polls, nothing writes member data. The hidden stat strip (.tll-account-stats, data-ms-member cells) is left
   alone: it is display:none and no script reads it any more. Written is the member's own story cards on /stories,
   counted once. Replaces the __tllAcctStats block (setStat, ataNote, the 350 ms poll) and cardCounts in the lists block. */
(function(){
  if(window.__tllAcctCounts) return; window.__tllAcctCounts=1;
  var C2K=__C2K__;
  var ATA='010';
  function best(row,allow){ var b=''; Object.keys(row||{}).forEach(function(id){ if(allow&&!allow[id]) return; var v=row[id]; if(v==='lived') b='lived'; else if(v==='visited'){ if(b!=='lived') b='visited'; } else if(v==='layover'&&!b) b='layover'; }); return b; }
  /* The count function. Human travelers make the member's numbers; pets count on their own. Lived and Stayed make
     places; Antarctica (010) is a place but not a country; layover-only places are counted apart and never added. */
  function tllCounts(d){
    var out={places:0,countries:0,ata:false,layovers:0,lived:0,stayed:0,continents:0,pets:[],travelers:0,ok:false};
    if(!d||d.v!==2||!d.states) return out;
    out.ok=true;
    var hum={},any=false,pets=[];
    (d.travelers||[]).forEach(function(t){ if(!t) return; out.travelers++; if(t.pet) pets.push({id:t.id,name:t.name||'Pet',stamps:0,ata:false}); else { hum[t.id]=1; any=true; } });
    var conts={};
    Object.keys(d.states).forEach(function(k){
      var row=d.states[k]||{};
      var b=best(row,any?hum:null);
      if(b==='lived'||b==='visited'){
        if(k===ATA) out.ata=true; else { out.countries++; if(b==='lived') out.lived++; else out.stayed++; }
        var c=C2K[k]; if(c) conts[c]=1;
      } else if(b==='layover') out.layovers++;
      pets.forEach(function(p){ if(row[p.id]){ if(k===ATA) p.ata=true; else p.stamps++; } });
    });
    out.places=out.countries+(out.ata?1:0);
    out.continents=Object.keys(conts).length;
    out.pets=pets;
    return out;
  }
  function $(s,r){ return (r||document).querySelector(s); }
  function countEl(lbl){ var n=lbl.parentNode.firstElementChild; while(n){ if(n!==lbl&&n.classList&&n.classList.contains('tll-mod-count')) return n; n=n.nextElementSibling; } return null; }
  /* put(): one number per card, as a sibling right after the label (the page CSS adds " of 249" to the Logged one).
     null removes the number: with no saved map the card shows nothing rather than a guess. */
  function put(sel,val){
    var lbl=$(sel); if(!lbl) return null;
    var c=countEl(lbl);
    if(val===null||val===undefined||val===''){ if(c) c.parentNode.removeChild(c); return null; }
    if(!c){ c=document.createElement('div'); c.className='tll-mod-count'; lbl.parentNode.insertBefore(c,lbl.nextSibling); }
    var s=String(val); if(c.textContent!==s) c.textContent=s;
    return c;
  }
  var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function fmtDate(t){ t=+t||0; if(!t) return ''; var d=new Date(t); return d.getDate()+' '+MON[d.getMonth()]+' '+d.getFullYear(); }
  /* Last saved: the stamp the map editor writes after a successful save (json.tllStatesAt). */
  function saved(t){
    var lbl=$('[data-tll-mod=countries]'); if(!lbl) return;
    var card=lbl.parentNode, el=card.querySelector('.tll-mod-saved'), txt=t?('Last saved '+fmtDate(t)):'';
    if(!txt){ if(el) el.parentNode.removeChild(el); return; }
    if(!el){ el=document.createElement('div'); el.className='tll-mod-saved'; el.style.cssText="margin:6px 16px 0;font:600 11px/1.3 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.06em;color:#b8b4ad"; var c=countEl(lbl); card.insertBefore(el,(c||lbl).nextSibling); }
    if(el.textContent!==txt) el.textContent=txt;
  }
  var cur=null;
  /* paint(): the only writer of the cards. Logged = places (Antarctica inside, "of 249" from the page CSS).
     Pawed = number of pets, plus the one-pet body line. Written is written by stories() below. */
  function paint(d,json){
    var c=tllCounts(d); cur=c;
    put('[data-tll-mod=countries]', c.ok?c.places:null);
    put('[data-tll-mod=pets]', c.ok?c.pets.length:null);
    if(c.pets.length===1){ var p=c.pets[0], pl=$('[data-tll-mod=pets]'), body=pl&&pl.parentNode.querySelector('.tll-pickin-card-body'); if(body) body.textContent=p.name+' · '+p.stamps+(p.stamps===1?' country':' countries')+(p.ata?' + AQ':'')+' and zero complaints.'; }
    saved(json&&json.tllStatesAt);
    return c;
  }
  /* stories(): Written = the member's own story cards on /stories (author slug rule, one per story URL), counted once. */
  var storiesDone=false;
  function slugOf(m){ var f=(m&&m.customFields)||{}; var s=f['custom-slug']||((f['first-name']||'')+' '+(f['last-name']||'')); return String(s||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
  function stories(member){
    if(storiesDone||!member) return; var slug=slugOf(member); if(!slug) return; storiesDone=true;
    fetch('/stories',{credentials:'same-origin'}).then(function(r){ return r.text(); }).then(function(h){
      var doc=new DOMParser().parseFromString(h,'text/html'), seen={}, n=0;
      [].forEach.call(doc.querySelectorAll('a[data-tll-card]'),function(a){ var au=a.querySelector('[data-tll-author]'), href=a.getAttribute('href')||''; if(!au||(au.textContent||'').trim()!==slug||seen[href]) return; seen[href]=1; n++; });
      put('[data-tll-mod=stories]', n);
    }).catch(function(){ storiesDone=false; });
  }
  window.tllAcctCounts={count:tllCounts,paint:paint,stories:stories,current:function(){ return cur; }};
  /* Kept for anything that still calls the old name. Same numbers, old field names. */
  window.tllOwn=function(d){ var c=tllCounts(d); return {n:c.countries,lived:c.lived,stayed:c.stayed,layover:c.layovers,ata:c.ata}; };
})();
