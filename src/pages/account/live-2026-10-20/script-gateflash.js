/* TLL gate flash fix v1 (2026-09-28). On gated pages the logged-out gate ([data-ms-content=anonymous]) showed for a moment
   before Memberstack confirmed a signed-in member and hid it. If this browser holds a Memberstack session token, hold the
   gate back until Memberstack answers. Read-only: nothing is written to Memberstack. Fails open after 4s. */
(function(){
  var has=false;try{has=!!(localStorage.getItem('_ms-mid')||localStorage.getItem('_ms-mem'));}catch(e){}
  if(!has)return;
  var d=document.documentElement;d.classList.add('tll-ms-pending');
  var s=document.createElement('style');s.id='tll-gate-flash';
  s.textContent='html.tll-ms-pending [data-ms-content="anonymous"]{visibility:hidden!important;display:none!important}';
  d.appendChild(s);
  var done=false;function release(){if(done)return;done=true;d.classList.remove('tll-ms-pending');}
  setTimeout(release,4000);
  var n=0,iv=setInterval(function(){
    var ms=window.$memberstackDom;
    if(ms&&ms.getCurrentMember){clearInterval(iv);
      ms.getCurrentMember().then(function(r){
        if(!r||!r.data){release();}
        else{setTimeout(release,300);}
      }).catch(release);
    }else if(++n>80){clearInterval(iv);release();}
  },50);
})();