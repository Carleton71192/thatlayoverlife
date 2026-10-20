/* tll-map-snapshot-v1 (20 October 2026, Packet C row C1.1). After every successful save of the member's map, the
   S94 count function runs once over the saved states and the result goes to the Worker route POST /map-snapshot
   as {"countries","antarctica","places","layovers","savedAt"}. The browser never holds a Webflow token: the Worker
   verifies the Memberstack token and writes the member's own Contributors item. The Worker base URL comes from the
   data-worker attribute on [data-tll-map-snapshot]; empty means the write is skipped and the map stays as it is.
   It wraps $memberstackDom.updateMemberJSON once (see the hook at the end), so the map's own scripts stay as they are. */
(function(){
  if(window.__tllSnap) return; window.__tllSnap=1;
  var ATA='010';
  function best(row,allow){ var b=''; Object.keys(row||{}).forEach(function(id){ if(allow&&!allow[id]) return; var v=row[id]; if(v==='lived') b='lived'; else if(v==='visited'){ if(b!=='lived') b='visited'; } else if(v==='layover'&&!b) b='layover'; }); return b; }
  /* Same rules as tll-acct-counts-v1: human travelers make the member's numbers, pets count on their own.
     Lived and Stayed make places; Antarctica (010) is a place but not a country; layover-only places are counted apart. */
  function counts(d){
    var out={places:0,countries:0,ata:false,layovers:0,ok:false};
    if(!d||d.v!==2||!d.states) return out;
    out.ok=true;
    var hum={},any=false;
    (d.travelers||[]).forEach(function(t){ if(t&&!t.pet){ hum[t.id]=1; any=true; } });
    Object.keys(d.states).forEach(function(k){
      var b=best(d.states[k]||{},any?hum:null);
      if(b==='lived'||b==='visited'){ if(k===ATA) out.ata=true; else out.countries++; }
      else if(b==='layover') out.layovers++;
    });
    out.places=out.countries+(out.ata?1:0);
    return out;
  }
  function bodyOf(states,t){ var c=counts(states); if(!c.ok) return null; return {countries:c.countries,antarctica:c.ata,places:c.places,layovers:c.layovers,savedAt:new Date(t||Date.now()).toISOString()}; }
  /* The member sync calls this before its updateMemberJSON so /edit-profile can read json.tllSnapshot (same numbers, same write). */
  window.__tllSnapBody=bodyOf;
  var pending=null, timer=null;
  function send(states,t){
    var h=document.querySelector('[data-tll-map-snapshot]');
    var W=h?(h.getAttribute('data-worker')||'').trim().replace(/\/+$/,''):'';
    if(!/^https:\/\//.test(W)) return;
    var ms=window.$memberstackDom; if(!ms||!ms.getMemberToken) return;
    var tok=null; try{ tok=ms.getMemberToken(); }catch(e){}
    if(!tok) return;
    var body=bodyOf(states,t); if(!body) return;
    try{
      fetch(W+'/map-snapshot',{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+tok},body:JSON.stringify(body),keepalive:true})
        .then(function(r){ if(r&&r.ok){ try{ window.dispatchEvent(new CustomEvent('tll:snapshot',{detail:body})); }catch(e){} } })
        .catch(function(){});
    }catch(e){}
  }
  /* One write per settled save: several quick saves inside 1.5 s collapse into the last one (the Worker allows 30 an hour). */
  window.__tllSnapshot=function(states,t){
    pending=[states,t]; clearTimeout(timer);
    timer=setTimeout(function(){ var p=pending; pending=null; if(p) send(p[0],p[1]); },1500);
  };

  /* Hook (no change to the map's own code): when the member sync saves tllStates through updateMemberJSON, the
     snapshot is added to the same JSON (so /edit-profile can read json.tllSnapshot), and after that save resolves
     the snapshot goes to the Worker. Saves that carry no tllStates pass through untouched. */
  var k=0, iv=setInterval(function(){
    var ms=window.$memberstackDom; if(!ms||!ms.updateMemberJSON){ if(++k>80) clearInterval(iv); return; }
    clearInterval(iv); if(ms.__tllSnapHooked) return; ms.__tllSnapHooked=1;
    var orig=ms.updateMemberJSON.bind(ms);
    ms.updateMemberJSON=function(arg){
      var j=arg&&arg.json, st=j&&j.tllStates, t=j&&+j.tllStatesAt||Date.now();
      if(st){ try{ var b=bodyOf(st,t); if(b) j.tllSnapshot=b; }catch(e){} }
      var p=orig(arg);
      if(st&&p&&p.then){ p.then(function(){ window.__tllSnapshot(st,t); },function(){}); }
      return p;
    };
  },150);
})();
